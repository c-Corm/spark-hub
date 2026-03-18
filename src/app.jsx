// ============================================================
// SPARK ATLANTA AMBASSADOR HUB — Supabase Edition
// Deploy to Vercel. Requires these environment variables:
//   VITE_SUPABASE_URL=https://your-project.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key
//
// Also install the Supabase client:
//   npm install @supabase/supabase-js
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ─────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ── Seed data (only used to pre-populate empty DB) ──────────
const SEED_TASKS = [
  { id: 1,  category: "Before Event", text: "Review the Spark event agenda and session schedule", done: false },
  { id: 2,  category: "Before Event", text: "Familiarize yourself with the venue layout and key locations", done: false },
  { id: 3,  category: "Before Event", text: "Pick up ambassador badge, lanyard, and welcome kit at check-in", done: false },
  { id: 4,  category: "Before Event", text: "Join the ambassador group chat or Slack channel", done: false },
  { id: 5,  category: "Before Event", text: "Review FAQs and talking points about Spark", done: false },
  { id: 6,  category: "During Event", text: "Greet attendees at entrance and direct them to registration", done: false },
  { id: 7,  category: "During Event", text: "Staff your assigned session or booth for the full duration", done: false },
  { id: 8,  category: "During Event", text: "Facilitate networking by introducing attendees to each other", done: false },
  { id: 9,  category: "During Event", text: "Assist speakers with AV setup and room logistics", done: false },
  { id: 10, category: "During Event", text: "Capture photos and share to official event hashtag", done: false },
  { id: 11, category: "During Event", text: "Monitor session rooms for capacity and comfort issues", done: false },
  { id: 12, category: "During Event", text: "Distribute swag, materials, or handouts at designated times", done: false },
  { id: 13, category: "During Event", text: "Answer attendee questions and escalate issues to event leads", done: false },
  { id: 14, category: "After Event",  text: "Help with breakdown and direct attendees to exits/parking", done: false },
  { id: 15, category: "After Event",  text: "Submit your ambassador feedback form within 24 hours", done: false },
  { id: 16, category: "After Event",  text: "Follow up with any connections you made on LinkedIn", done: false },
  { id: 17, category: "After Event",  text: "Share a recap post on social media tagging Spark Atlanta", done: false },
];

const SEED_SESSIONS = [
  { id: 1, title: "Opening Keynote",           time: "9:00 AM – 10:00 AM",  room: "Main Stage",   capacity: 4, description: "Welcome all attendees, set the tone for the day, and introduce speakers.", signups: ["Jordan M.", "Taylor R."] },
  { id: 2, title: "Breakout: Innovation Lab",  time: "10:15 AM – 11:15 AM", room: "Room A",        capacity: 3, description: "Hands-on workshop supporting participants with activities and Q&A.", signups: ["Sam K."] },
  { id: 3, title: "Networking Lunch",          time: "11:30 AM – 12:30 PM", room: "Atrium",        capacity: 6, description: "Circulate among tables, spark conversations, and keep energy high.", signups: ["Jordan M.", "Alex P.", "Casey W."] },
  { id: 4, title: "Panel: Future of Work",     time: "12:45 PM – 1:45 PM",  room: "Main Stage",   capacity: 3, description: "Seat panelists, manage audience Q&A microphone, and keep time.", signups: [] },
  { id: 5, title: "Workshop: Leadership",      time: "2:00 PM – 3:00 PM",   room: "Room B",        capacity: 3, description: "Assist facilitator with group activities and materials distribution.", signups: ["Taylor R.", "Morgan L."] },
  { id: 6, title: "Startup Showcase",          time: "3:15 PM – 4:15 PM",   room: "Exhibit Hall",  capacity: 5, description: "Roam the exhibit hall, connect attendees with presenters, keep booths stocked.", signups: ["Sam K.", "Alex P."] },
  { id: 7, title: "Closing Ceremony & Awards", time: "4:30 PM – 5:30 PM",   room: "Main Stage",   capacity: 4, description: "Coordinate seating, manage award props, lead applause cues.", signups: ["Casey W."] },
  { id: 8, title: "Post-Event Teardown",       time: "5:30 PM – 6:30 PM",   room: "All Areas",     capacity: 8, description: "Assist with breakdown, collect signage, guide attendees to exits.", signups: [] },
];

const CATEGORIES = ["Before Event", "During Event", "After Event"];
const CAT_STYLE = {
  "Before Event": { dot: "#FFC107", label: "#FFC107" },
  "During Event": { dot: "#17A2B8", label: "#17A2B8" },
  "After Event":  { dot: "#28A745", label: "#28A745" },
};

// ── Tiny hook: live Supabase subscribe ──────────────────────
function useRealtimeTable(table, setter) {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        supabase.from(table).select("*").then(({ data }) => data && setter(data));
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [table, setter]);
}

// ════════════════════════════════════════════════════════════
export default function SparkHub() {
  const [view, setView]       = useState("tasks");
  const [tasks, setTasks]     = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncMsg, setSyncMsg] = useState("");

  // ── flash a save indicator ─────────────────────────────
  const flash = (msg = "Saved ✓") => {
    setSyncMsg(msg);
    setTimeout(() => setSyncMsg(""), 2000);
  };

  // ── Load or seed data on mount ─────────────────────────
  useEffect(() => {
    async function init() {
      const [{ data: t }, { data: s }] = await Promise.all([
        supabase.from("tasks").select("*").order("id"),
        supabase.from("sessions").select("*").order("id"),
      ]);

      if (!t?.length) {
        await supabase.from("tasks").insert(SEED_TASKS);
        setTasks(SEED_TASKS);
      } else {
        setTasks(t);
      }

      if (!s?.length) {
        await supabase.from("sessions").insert(SEED_SESSIONS);
        setSessions(SEED_SESSIONS);
      } else {
        setSessions(s);
      }

      setLoading(false);
    }
    init();
  }, []);

  // ── Real-time listeners ────────────────────────────────
  useRealtimeTable("tasks",    useCallback(setTasks, []));
  useRealtimeTable("sessions", useCallback(setSessions, []));

  // ── Task actions ───────────────────────────────────────
  const toggleTask = async (id, done) => {
    setTasks(t => t.map(x => x.id === id ? { ...x, done: !done } : x));
    await supabase.from("tasks").update({ done: !done }).eq("id", id);
    flash();
  };

  const deleteTask = async (id) => {
    setTasks(t => t.filter(x => x.id !== id));
    await supabase.from("tasks").delete().eq("id", id);
    flash("Deleted");
  };

  const updateTaskText = async (id, text) => {
    setTasks(t => t.map(x => x.id === id ? { ...x, text } : x));
    await supabase.from("tasks").update({ text }).eq("id", id);
    flash();
  };

  const addTask = async (category, text) => {
    const id = Date.now();
    const row = { id, category, text, done: false };
    setTasks(t => [...t, row]);
    await supabase.from("tasks").insert(row);
    flash("Added ✓");
  };

  // ── Session actions ────────────────────────────────────
  const signupToSession = async (sessionId, name) => {
    const s = sessions.find(x => x.id === sessionId);
    if (!s || s.signups.length >= s.capacity) return;
    const signups = [...s.signups, name];
    setSessions(prev => prev.map(x => x.id === sessionId ? { ...x, signups } : x));
    await supabase.from("sessions").update({ signups }).eq("id", sessionId);
    flash();
  };

  const removeSignup = async (sessionId, name) => {
    const s = sessions.find(x => x.id === sessionId);
    const signups = s.signups.filter(n => n !== name);
    setSessions(prev => prev.map(x => x.id === sessionId ? { ...x, signups } : x));
    await supabase.from("sessions").update({ signups }).eq("id", sessionId);
    flash("Removed");
  };

  const addSession = async (session) => {
    const id = Date.now();
    const row = { ...session, id, signups: [] };
    setSessions(prev => [...prev, row]);
    await supabase.from("sessions").insert(row);
    flash("Session added ✓");
  };

  const deleteSession = async (id) => {
    setSessions(prev => prev.filter(x => x.id !== id));
    await supabase.from("sessions").delete().eq("id", id);
    flash("Deleted");
  };

  const completedCount = tasks.filter(t => t.done).length;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8b84b", fontFamily: "Georgia, serif", fontSize: 18 }}>
      ⚡ Loading Spark Hub...
    </div>
  );

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", minHeight: "100vh", background: "linear-gradient(135deg,#0d1b2a 0%,#1a2d4a 50%,#0d1b2a 100%)", color: "#e8e0d4" }}>

      {/* Sync badge */}
      {syncMsg && (
        <div style={{ position: "fixed", top: 16, right: 16, background: "#28A745", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, zIndex: 999, boxShadow: "0 4px 16px #0006" }}>
          {syncMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(90deg,#c8973a 0%,#e8b84b 40%,#c8973a 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(0,0,0,.04) 10px,rgba(0,0,0,.04) 20px)" }} />
        <div style={{ position: "relative", maxWidth: 920, margin: "0 auto", padding: "28px 24px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#0d1b2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "3px solid #fff4" }}>⚡</div>
          <div>
            <div style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: 4, textTransform: "uppercase", color: "#0d1b2aCC", marginBottom: 2 }}>Atlanta · Ambassador Hub</div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, color: "#0d1b2a", letterSpacing: -1, lineHeight: 1 }}>SPARK 2025</h1>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#0d1b2a99", fontFamily: "monospace", letterSpacing: 2 }}>PROGRESS</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#0d1b2a" }}>{completedCount}/{tasks.length}</div>
            <div style={{ fontSize: 10, color: "#0d1b2a88" }}>tasks done</div>
          </div>
          <div style={{ fontSize: 11, color: "#0d1b2a88", textAlign: "right", minWidth: 80 }}>
            <span style={{ background: "#0d1b2a22", borderRadius: 20, padding: "4px 10px" }}>🔴 Live Sync</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #ffffff20" }}>
          {[{ key: "tasks", label: "📋 Ambassador Tasks" }, { key: "sessions", label: "📅 Session Sign-Ups" }].map(tab => (
            <button key={tab.key} onClick={() => setView(tab.key)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "16px 24px",
              fontSize: 14, fontFamily: "inherit", color: view === tab.key ? "#e8b84b" : "#aaa",
              borderBottom: view === tab.key ? "3px solid #e8b84b" : "3px solid transparent",
              fontWeight: view === tab.key ? 700 : 400, transition: "all .2s",
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px" }}>
        {view === "tasks"
          ? <TasksView tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onEdit={updateTaskText} onAdd={addTask} />
          : <SessionsView sessions={sessions} onSignup={signupToSession} onRemove={removeSignup} onAdd={addSession} onDelete={deleteSession} />
        }
      </div>
    </div>
  );
}

// ── Tasks View ───────────────────────────────────────────────
function TasksView({ tasks, onToggle, onDelete, onEdit, onAdd }) {
  const [editingId, setEditingId] = useState(null);
  const [newTask, setNewTask]     = useState({ text: "", category: "During Event" });
  const [showAdd, setShowAdd]     = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, color: "#e8e0d4" }}>Ambassador To-Do List</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#aaa" }}>Changes save instantly and sync across all devices.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{ background: "#e8b84b", color: "#0d1b2a", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>+ Add Task</button>
      </div>

      {showAdd && (
        <div style={{ background: "#1e3050", borderRadius: 12, padding: 20, marginBottom: 24, border: "1px solid #ffffff20" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, color: "#e8b84b" }}>New Task</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select value={newTask.category} onChange={e => setNewTask({ ...newTask, category: e.target.value })}
              style={{ background: "#0d1b2a", color: "#e8e0d4", border: "1px solid #ffffff30", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontFamily: "inherit" }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input value={newTask.text} onChange={e => setNewTask({ ...newTask, text: e.target.value })}
              onKeyDown={e => e.key === "Enter" && (onAdd(newTask.category, newTask.text), setNewTask({ text: "", category: "During Event" }), setShowAdd(false))}
              placeholder="Task description..." style={{ flex: 1, minWidth: 200, background: "#0d1b2a", color: "#e8e0d4", border: "1px solid #ffffff30", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontFamily: "inherit" }} />
            <button onClick={() => { onAdd(newTask.category, newTask.text); setNewTask({ text: "", category: "During Event" }); setShowAdd(false); }}
              style={{ background: "#e8b84b", color: "#0d1b2a", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add</button>
            <button onClick={() => setShowAdd(false)} style={{ background: "#ffffff15", color: "#aaa", border: "none", borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      {CATEGORIES.map(cat => {
        const catTasks = tasks.filter(t => t.category === cat);
        if (!catTasks.length) return null;
        const c = CAT_STYLE[cat];
        const done = catTasks.filter(t => t.done).length;
        return (
          <div key={cat} style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.dot }} />
              <h3 style={{ margin: 0, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: c.label }}>{cat}</h3>
              <span style={{ fontSize: 12, color: "#aaa", marginLeft: "auto" }}>{done}/{catTasks.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {catTasks.map(task => (
                <div key={task.id} style={{ background: task.done ? "#ffffff08" : "#1e3050", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, border: `1px solid ${task.done ? "#ffffff10" : "#ffffff20"}`, opacity: task.done ? 0.6 : 1, transition: "all .2s" }}>
                  <div onClick={() => onToggle(task.id, task.done)} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${task.done ? c.dot : "#ffffff30"}`, background: task.done ? c.dot : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, transition: "all .2s" }}>{task.done ? "✓" : ""}</div>
                  {editingId === task.id
                    ? <input defaultValue={task.text} autoFocus onBlur={e => { onEdit(task.id, e.target.value); setEditingId(null); }} onKeyDown={e => e.key === "Enter" && (onEdit(task.id, e.target.value), setEditingId(null))} style={{ flex: 1, background: "#0d1b2a", color: "#e8e0d4", border: "1px solid #e8b84b", borderRadius: 6, padding: "4px 10px", fontSize: 14, fontFamily: "inherit" }} />
                    : <span style={{ flex: 1, fontSize: 14, textDecoration: task.done ? "line-through" : "none", color: task.done ? "#888" : "#e8e0d4" }}>{task.text}</span>
                  }
                  <button onClick={() => setEditingId(editingId === task.id ? null : task.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 14, padding: "2px 6px" }}>✏️</button>
                  <button onClick={() => onDelete(task.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 14, padding: "2px 6px" }}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Sessions View ────────────────────────────────────────────
function SessionsView({ sessions, onSignup, onRemove, onAdd, onDelete }) {
  const [signupTarget, setSignupTarget] = useState(null);
  const [signupName, setSignupName]     = useState("");
  const [showAdd, setShowAdd]           = useState(false);
  const [newS, setNewS]                 = useState({ title: "", time: "", room: "", capacity: 3, description: "" });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, color: "#e8e0d4" }}>Session Sign-Ups</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#aaa" }}>Sign-ups sync live — everyone sees changes instantly.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{ background: "#e8b84b", color: "#0d1b2a", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>+ Add Session</button>
      </div>

      {showAdd && (
        <div style={{ background: "#1e3050", borderRadius: 12, padding: 20, marginBottom: 24, border: "1px solid #ffffff20" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, color: "#e8b84b" }}>New Session</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["title","Session Title *"],["time","Time (e.g. 10:00 AM – 11:00 AM) *"],["room","Room / Location"],["description","Ambassador role description"]].map(([f,ph]) => (
              <input key={f} value={newS[f]} onChange={e => setNewS({ ...newS, [f]: e.target.value })} placeholder={ph}
                style={{ background: "#0d1b2a", color: "#e8e0d4", border: "1px solid #ffffff30", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontFamily: "inherit", gridColumn: f === "description" ? "1/-1" : "auto" }} />
            ))}
            <input type="number" min={1} value={newS.capacity} onChange={e => setNewS({ ...newS, capacity: Number(e.target.value) })}
              placeholder="Spots needed" style={{ background: "#0d1b2a", color: "#e8e0d4", border: "1px solid #ffffff30", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button onClick={() => { onAdd(newS); setNewS({ title: "", time: "", room: "", capacity: 3, description: "" }); setShowAdd(false); }}
              style={{ background: "#e8b84b", color: "#0d1b2a", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add Session</button>
            <button onClick={() => setShowAdd(false)} style={{ background: "#ffffff15", color: "#aaa", border: "none", borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(370px,1fr))", gap: 16 }}>
        {sessions.map(s => {
          const full = s.signups.length >= s.capacity;
          const pct  = Math.round((s.signups.length / s.capacity) * 100);
          return (
            <div key={s.id} style={{ background: "#1e3050", borderRadius: 14, padding: 20, border: `1px solid ${full ? "#e8b84b55" : "#ffffff15"}`, position: "relative" }}>
              {full && <div style={{ position: "absolute", top: 14, right: 14, background: "#e8b84b", color: "#0d1b2a", fontSize: 10, fontWeight: 800, borderRadius: 20, padding: "3px 10px", letterSpacing: 1 }}>FULL</div>}
              <div style={{ fontSize: 11, color: "#e8b84b", fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>{s.time}</div>
              <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#e8e0d4", paddingRight: 50 }}>{s.title}</h3>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 10 }}>📍 {s.room || "TBD"}</div>
              <p style={{ margin: "0 0 14px", fontSize: 13, color: "#c8bfb4", lineHeight: 1.5 }}>{s.description}</p>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#aaa", marginBottom: 6 }}>
                  <span>Ambassadors</span>
                  <span style={{ color: full ? "#e8b84b" : "#e8e0d4", fontWeight: 700 }}>{s.signups.length} / {s.capacity}</span>
                </div>
                <div style={{ height: 5, background: "#ffffff15", borderRadius: 99 }}>
                  <div style={{ height: 5, borderRadius: 99, width: `${pct}%`, background: full ? "#e8b84b" : "#17A2B8", transition: "width .3s" }} />
                </div>
              </div>

              {s.signups.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {s.signups.map(name => (
                    <div key={name} style={{ background: "#0d1b2a", borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#e8e0d4", display: "flex", alignItems: "center", gap: 6, border: "1px solid #ffffff15" }}>
                      {name}
                      <span onClick={() => onRemove(s.id, name)} style={{ cursor: "pointer", color: "#aaa", fontSize: 11 }}>✕</span>
                    </div>
                  ))}
                </div>
              )}

              {!full && (
                signupTarget === s.id
                  ? <div style={{ display: "flex", gap: 8 }}>
                      <input value={signupName} onChange={e => setSignupName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && (onSignup(s.id, signupName), setSignupName(""), setSignupTarget(null))}
                        autoFocus placeholder="Ambassador name..." style={{ flex: 1, background: "#0d1b2a", color: "#e8e0d4", border: "1px solid #e8b84b", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontFamily: "inherit" }} />
                      <button onClick={() => { onSignup(s.id, signupName); setSignupName(""); setSignupTarget(null); }}
                        style={{ background: "#e8b84b", color: "#0d1b2a", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add</button>
                      <button onClick={() => { setSignupTarget(null); setSignupName(""); }} style={{ background: "#ffffff10", color: "#aaa", border: "none", borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}>✕</button>
                    </div>
                  : <button onClick={() => setSignupTarget(s.id)} style={{ background: "none", border: "1px dashed #ffffff30", borderRadius: 8, color: "#aaa", padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", width: "100%" }}>+ Sign Up Ambassador</button>
              )}

              <button onClick={() => onDelete(s.id)} style={{ position: "absolute", bottom: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#ffffff25", fontSize: 13 }}>🗑️</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
