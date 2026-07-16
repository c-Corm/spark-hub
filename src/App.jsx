// ============================================================
// IGA NEPHROPATHY FOUNDATION — SPARK 2026 Ambassador Hub
// Requires a `messages` table for Group Chat. Run in Supabase:
//   CREATE TABLE messages (
//     id bigint primary key,
//     ambassador_name text,
//     text text,
//     mentions text[] default '{}',
//     created_at timestamptz default now()
//   );
//   ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
//   ALTER PUBLICATION supabase_realtime ADD TABLE messages;
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const C = {
  caveBlue:    "#004976",
  marigold:    "#f7a442",
  steelGray:   "#dde5ed",
  powderBlue:  "#9eb5cb",
  oliveGreen:  "#8aa346",
  pomegranate: "#f8485e",
  white:       "#ffffff",
  lightBg:     "#f0f4f8",
  textDark:    "#003557",
  textMid:     "#4a6a85",
  textLight:   "#7a9ab5",
};

const CATEGORIES = ["Before Event", "Friday 7/24", "Saturday 7/25", "Sunday 7/26", "After Event"];
const DAYS = ["Friday 7/24", "Saturday 7/25", "Sunday 7/26"];
const DAY_COLORS = { "Friday 7/24": C.powderBlue, "Saturday 7/25": C.oliveGreen, "Sunday 7/26": C.pomegranate };
const CAT_STYLE = {
  "Before Event":   { dot: C.marigold,    label: C.marigold },
  "Friday 7/24":    { dot: C.powderBlue,  label: C.powderBlue },
  "Saturday 7/25":  { dot: C.oliveGreen,  label: C.oliveGreen },
  "Sunday 7/26":    { dot: C.pomegranate, label: C.pomegranate },
  "After Event":    { dot: C.textLight,   label: C.textLight },
};

function useRealtimeTable(table, setter) {
  useEffect(() => {
    const ch = supabase.channel(`rt-${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        supabase.from(table).select("*").order("id").then(({ data }) => data && setter(data));
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }, [table, setter]);
}

export default function App() {
  const [ambassador, setAmbassador] = useState(() => localStorage.getItem("spark_ambassador") || "");
  const [nameInput, setNameInput]   = useState("");

  const handleLogin = () => {
    const name = nameInput.trim();
    if (!name) return;
    localStorage.setItem("spark_ambassador", name);
    setAmbassador(name);
  };

  const handleLogout = () => {
    localStorage.removeItem("spark_ambassador");
    setAmbassador("");
    setNameInput("");
  };

  if (!ambassador) return <LoginScreen nameInput={nameInput} setNameInput={setNameInput} onLogin={handleLogin} />;
  return <Hub ambassador={ambassador} onLogout={handleLogout} />;
}

function LoginScreen({ nameInput, setNameInput, onLogin }) {
  return (
    <div style={{ minHeight: "100vh", background: C.caveBlue, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Avenir','Gill Sans','Century Gothic',sans-serif", padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(158,181,203,0.12) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div style={{ position: "relative", background: C.white, borderRadius: 20, padding: "48px 40px", maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", textAlign: "center" }}>
        <img src="/spark.png" alt="SPARK 2026" style={{ width: 180, margin: "0 auto 24px", display: "block" }} />
        <div style={{ fontSize: 11, color: C.textLight, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>IGA Nephropathy Foundation</div>
        <h1 style={{ margin: "0 0 4px", fontSize: 30, fontWeight: 900, color: C.caveBlue, fontFamily: "'Georgia','Times New Roman',serif", letterSpacing: -0.5 }}>SPARK 2026</h1>
        <div style={{ fontSize: 13, color: C.marigold, fontWeight: 800, letterSpacing: 2, marginBottom: 32 }}>AMBASSADOR HUB · ATLANTA</div>
        <div style={{ textAlign: "left", marginBottom: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 800, color: C.textMid, letterSpacing: 1, textTransform: "uppercase" }}>Your Name</label>
        </div>
        <input value={nameInput} onChange={e => setNameInput(e.target.value)} onKeyDown={e => e.key === "Enter" && onLogin()}
          placeholder="Enter your full name..." autoFocus
          style={{ width: "100%", boxSizing: "border-box", background: C.lightBg, color: C.textDark, border: `2px solid ${C.steelGray}`, borderRadius: 10, padding: "14px 16px", fontSize: 15, fontFamily: "inherit", marginBottom: 16, outline: "none" }} />
        <button onClick={onLogin} style={{ width: "100%", background: C.marigold, color: C.white, border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}>
          Enter Hub →
        </button>
        <p style={{ margin: "20px 0 0", fontSize: 12, color: C.textLight }}>Your name is saved in this browser so you won't need to re-enter it.</p>
      </div>
    </div>
  );
}

function Hub({ ambassador, onLogout }) {
  const [view, setView]             = useState("dashboard");
  const [tasks, setTasks]           = useState([]);
  const [sessions, setSessions]     = useState([]);
  const [myProgress, setMyProgress] = useState({});
  const [messages, setMessages]     = useState([]);
  const [lastRead, setLastRead]     = useState(() => localStorage.getItem(`spark_chat_lastread_${ambassador}`) || new Date(0).toISOString());
  const [loading, setLoading]       = useState(true);
  const [syncMsg, setSyncMsg]       = useState("");

  const flash = (msg = "Saved ✓") => { setSyncMsg(msg); setTimeout(() => setSyncMsg(""), 2200); };

  useEffect(() => {
    async function init() {
      const [{ data: t }, { data: s }, { data: p }, { data: m }] = await Promise.all([
        supabase.from("tasks").select("*").order("id"),
        supabase.from("sessions").select("*").order("id"),
        supabase.from("task_progress").select("*").eq("ambassador_name", ambassador),
        supabase.from("messages").select("*").order("created_at"),
      ]);
      setTasks(t || []);
      setSessions(s || []);
      setMessages(m || []);
      const prog = {};
      (p || []).forEach(r => { prog[r.task_id] = r.done; });
      setMyProgress(prog);
      setLoading(false);
    }
    init();
  }, [ambassador]);

  useRealtimeTable("tasks",    useCallback(setTasks, []));
  useRealtimeTable("sessions", useCallback(setSessions, []));
  useEffect(() => {
    const ch = supabase.channel("rt-messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        supabase.from("messages").select("*").order("created_at").then(({ data }) => data && setMessages(data));
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const sendMessage = async (text, mentions) => {
    const row = { id: Date.now(), ambassador_name: ambassador, text, mentions, created_at: new Date().toISOString() };
    setMessages(m => [...m, row]);
    await supabase.from("messages").insert(row);
  };

  const markChatRead = () => {
    const now = new Date().toISOString();
    setLastRead(now);
    localStorage.setItem(`spark_chat_lastread_${ambassador}`, now);
  };

  const toggleMyTask = async (taskId) => {
    const next = !(myProgress[taskId] || false);
    setMyProgress(p => ({ ...p, [taskId]: next }));
    await supabase.from("task_progress").upsert(
      { id: Date.now(), ambassador_name: ambassador, task_id: taskId, done: next },
      { onConflict: "ambassador_name,task_id" }
    );
    flash();
  };

  const signupToSession = async (sid, name) => {
    const s = sessions.find(x => x.id === sid);
    if (!s || s.signups.length >= s.capacity) return;
    // Uses an atomic Postgres function to prevent race-condition overwrites.
    // Realtime listener will push the updated row back to all clients.
    await supabase.rpc("add_signup", { session_id: sid, ambassador_name: name });
    flash();
  };
  const removeSignup = async (sid, name) => {
    await supabase.rpc("remove_signup", { session_id: sid, ambassador_name: name });
    flash("Removed");
  };
  const addSession    = async (session) => {
    const row = { ...session, id: Date.now(), signups: [] };
    setSessions(p => [...p, row]);
    await supabase.from("sessions").insert(row);
    flash("Session added ✓");
  };
  const deleteSession = async (id) => {
    setSessions(p => p.filter(x => x.id !== id));
    await supabase.from("sessions").delete().eq("id", id);
    flash("Deleted");
  };
  const addTask       = async (category, text) => {
    const row = { id: Date.now(), category, text, done: false };
    setTasks(t => [...t, row]);
    await supabase.from("tasks").insert(row);
    flash("Added ✓");
  };
  const deleteTask    = async (id) => {
    setTasks(t => t.filter(x => x.id !== id));
    await supabase.from("tasks").delete().eq("id", id);
    flash("Deleted");
  };
  const updateTaskText = async (id, text) => {
    setTasks(t => t.map(x => x.id === id ? { ...x, text } : x));
    await supabase.from("tasks").update({ text }).eq("id", id);
    flash();
  };

  const mySessions = sessions.filter(s => s.signups.includes(ambassador));
  const myDone     = tasks.filter(t => myProgress[t.id]).length;

  const unreadCount   = messages.filter(m => new Date(m.created_at) > new Date(lastRead) && m.ambassador_name !== ambassador).length;
  const mentionCount  = messages.filter(m => new Date(m.created_at) > new Date(lastRead) && (m.mentions || []).includes(ambassador)).length;

  const TABS = [
    { key: "dashboard", label: "🏠 My Dashboard" },
    { key: "tasks",     label: "📋 Tasks" },
    { key: "sessions",  label: "📅 Sessions" },
    { key: "chat",       label: "💬 Group Chat" },
    { key: "roster",    label: "👥 All Ambassadors" },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.caveBlue, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, fontFamily: "'Avenir',sans-serif" }}>
      <img src="/spark.png" alt="SPARK" style={{ width: 140, marginBottom: 8 }} />
      <div style={{ color: C.marigold, fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>Loading SPARK 2026...</div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Avenir','Gill Sans','Century Gothic',sans-serif", minHeight: "100vh", background: C.lightBg, color: C.textDark }}>
      {syncMsg && (
        <div style={{ position: "fixed", top: 16, right: 16, background: C.oliveGreen, color: "#fff", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 700, zIndex: 999, boxShadow: "0 4px 20px #0003", letterSpacing: 1 }}>
          {syncMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: C.caveBlue, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(158,181,203,0.12) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div style={{ position: "relative", maxWidth: 980, margin: "0 auto", padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <img src="/spark.png" alt="SPARK" style={{ height: 48, width: "auto", borderRadius: 8 }} />
            <div>
              <div style={{ fontSize: 10, color: C.powderBlue, letterSpacing: 4, textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>IGA Nephropathy Foundation</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: C.white, letterSpacing: -0.5, fontFamily: "'Georgia',serif" }}>SPARK 2026 <span style={{ color: C.marigold, fontSize: 13, letterSpacing: 2 }}>AMBASSADOR HUB</span></div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: C.marigold, fontWeight: 800 }}>👋 {ambassador}</div>
                <div style={{ fontSize: 11, color: C.powderBlue }}>{myDone}/{tasks.length} tasks · {mySessions.length} sessions</div>
              </div>
              <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.12)", color: C.steelGray, border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600 }}>
                Switch User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: C.white, borderBottom: `3px solid ${C.steelGray}`, boxShadow: "0 2px 8px rgba(0,73,118,0.07)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px", display: "flex", overflowX: "auto" }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => { setView(tab.key); if (tab.key === "chat") markChatRead(); }} style={{
              background: "none", border: "none", cursor: "pointer", padding: "15px 20px", fontSize: 13,
              fontFamily: "inherit", fontWeight: view === tab.key ? 800 : 500, whiteSpace: "nowrap",
              color: view === tab.key ? C.caveBlue : C.textMid,
              borderBottom: view === tab.key ? `3px solid ${C.marigold}` : "3px solid transparent",
              marginBottom: -3, transition: "all .2s", position: "relative",
            }}>
              {tab.label}
              {tab.key === "chat" && (mentionCount > 0
                ? <span style={{ position: "absolute", top: 8, right: 4, background: C.marigold, color: C.white, borderRadius: 20, padding: "1px 6px", fontSize: 10, fontWeight: 900 }}>@{mentionCount}</span>
                : unreadCount > 0
                  ? <span style={{ position: "absolute", top: 8, right: 4, background: C.pomegranate, color: C.white, borderRadius: 20, padding: "1px 6px", fontSize: 10, fontWeight: 900 }}>{unreadCount}</span>
                  : null
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 24px" }}>
        {view === "dashboard" && <Dashboard ambassador={ambassador} sessions={sessions} tasks={tasks} myProgress={myProgress} mySessions={mySessions} onToggleTask={toggleMyTask} onGoSessions={() => setView("sessions")} />}
        {view === "tasks"     && <TasksView tasks={tasks} myProgress={myProgress} onToggle={toggleMyTask} onEdit={updateTaskText} onAdd={addTask} />}
        {view === "sessions"  && <SessionsView sessions={sessions} ambassador={ambassador} onSignup={signupToSession} onRemove={removeSignup} onAdd={addSession} />}
        {view === "chat"      && <ChatView ambassador={ambassador} messages={messages} sessions={sessions} onSend={sendMessage} />}
        {view === "roster"    && <RosterView sessions={sessions} />}
      </div>
    </div>
  );
}

function Dashboard({ ambassador, tasks, myProgress, mySessions, onToggleTask, onGoSessions }) {
  const myDone = tasks.filter(t => myProgress[t.id]).length;
  const pct    = tasks.length ? Math.round((myDone / tasks.length) * 100) : 0;
  const upcomingByDay = DAYS.map(day => ({ day, sessions: mySessions.filter(s => s.day === day) })).filter(d => d.sessions.length > 0);
  const urgentTasks   = tasks.filter(t => !myProgress[t.id]).slice(0, 5);

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.caveBlue} 0%, #00618f 100%)`, borderRadius: 16, padding: "28px 32px", marginBottom: 24, color: C.white, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(247,164,66,0.15)" }} />
        <div style={{ position: "absolute", right: 30, bottom: -40, width: 100, height: 100, borderRadius: "50%", background: "rgba(158,181,203,0.1)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 13, color: C.marigold, fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>WELCOME BACK</div>
          <h2 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 900, fontFamily: "'Georgia',serif" }}>{ambassador}</h2>
          <p style={{ margin: "0 0 20px", color: C.powderBlue, fontSize: 14 }}>SPARK 2026 · Atlanta, GA · July 24–26</p>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {[[mySessions.length, "Sessions Assigned"], [`${myDone}/${tasks.length}`, "Tasks Complete"], [`${pct}%`, "Overall Progress"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.marigold }}>{val}</div>
                <div style={{ fontSize: 11, color: C.powderBlue, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))", gap: 20 }}>
        <div style={{ background: C.white, borderRadius: 14, padding: 24, border: `1px solid ${C.steelGray}`, boxShadow: "0 2px 12px rgba(0,73,118,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 800, color: C.caveBlue, letterSpacing: 1, textTransform: "uppercase" }}>📅 My Sessions</h3>
          {mySessions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: C.textLight }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
              <p style={{ margin: "0 0 12px", fontSize: 13 }}>No sessions signed up yet.</p>
              <button onClick={onGoSessions} style={{ background: C.marigold, color: C.white, border: "none", borderRadius: 8, padding: "9px 18px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>Browse Sessions →</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {upcomingByDay.map(({ day, sessions: ds }) => (
                <div key={day}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: DAY_COLORS[day], letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{day}</div>
                  {ds.map(s => (
                    <div key={s.id} style={{ background: C.lightBg, borderRadius: 10, padding: "12px 14px", marginBottom: 6, borderLeft: `3px solid ${DAY_COLORS[s.day]}` }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.textDark, marginBottom: 2 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: C.textMid }}>{s.time}{s.room && s.room !== "TBD" ? ` · ${s.room}` : ""}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: C.white, borderRadius: 14, padding: 24, border: `1px solid ${C.steelGray}`, boxShadow: "0 2px 12px rgba(0,73,118,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 800, color: C.caveBlue, letterSpacing: 1, textTransform: "uppercase" }}>✅ Next Up</h3>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textMid, marginBottom: 6, fontWeight: 600 }}>
              <span>My Progress</span><span style={{ color: C.caveBlue, fontWeight: 800 }}>{pct}%</span>
            </div>
            <div style={{ height: 8, background: C.steelGray, borderRadius: 99 }}>
              <div style={{ height: 8, borderRadius: 99, width: `${pct}%`, background: C.marigold, transition: "width .4s" }} />
            </div>
          </div>
          {urgentTasks.length === 0
            ? <div style={{ textAlign: "center", padding: "20px 0", color: C.oliveGreen, fontWeight: 800, fontSize: 15 }}>🎉 All tasks complete!</div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {urgentTasks.map(task => (
                  <div key={task.id} onClick={() => onToggleTask(task.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: C.lightBg, borderRadius: 8, cursor: "pointer" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${C.steelGray}`, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: C.textDark, lineHeight: 1.3 }}>{task.text}</span>
                  </div>
                ))}
                {tasks.filter(t => !myProgress[t.id]).length > 5 && (
                  <div style={{ fontSize: 12, color: C.textLight, textAlign: "center", marginTop: 4 }}>+{tasks.filter(t => !myProgress[t.id]).length - 5} more in Tasks tab</div>
                )}
              </div>
          }
        </div>
      </div>
    </div>
  );
}

function TasksView({ tasks, myProgress, onToggle, onEdit, onAdd }) {
  const [editingId, setEditingId] = useState(null);
  const [newTask, setNewTask]     = useState({ text: "", category: "Saturday 7/25" });
  const [showAdd, setShowAdd]     = useState(false);
  const myDone = tasks.filter(t => myProgress[t.id]).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.caveBlue }}>Ambassador Tasks</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: C.textMid }}>Shared task list — your checkmarks are personal and only visible to you.</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ fontSize: 13, color: C.textMid, fontWeight: 700 }}>{myDone}/{tasks.length} done</div>
          <button onClick={() => setShowAdd(!showAdd)} style={{ background: C.marigold, color: C.white, border: "none", borderRadius: 8, padding: "11px 20px", fontWeight: 800, cursor: "pointer", fontSize: 13, fontFamily: "inherit", boxShadow: "0 2px 8px rgba(247,164,66,0.3)" }}>+ Add Task</button>
        </div>
      </div>

      {showAdd && (
        <div style={{ background: C.white, borderRadius: 12, padding: 20, marginBottom: 24, border: `1px solid ${C.steelGray}`, boxShadow: "0 2px 12px rgba(0,73,118,0.08)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, color: C.caveBlue, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>New Task</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select value={newTask.category} onChange={e => setNewTask({ ...newTask, category: e.target.value })}
              style={{ background: C.lightBg, color: C.textDark, border: `1px solid ${C.steelGray}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input value={newTask.text} onChange={e => setNewTask({ ...newTask, text: e.target.value })}
              onKeyDown={e => e.key === "Enter" && newTask.text.trim() && (onAdd(newTask.category, newTask.text), setNewTask({ text: "", category: "Saturday 7/25" }), setShowAdd(false))}
              placeholder="Describe the task..." style={{ flex: 1, minWidth: 200, background: C.lightBg, color: C.textDark, border: `1px solid ${C.steelGray}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, fontFamily: "inherit" }} />
            <button onClick={() => { if (newTask.text.trim()) { onAdd(newTask.category, newTask.text); setNewTask({ text: "", category: "Saturday 7/25" }); setShowAdd(false); } }}
              style={{ background: C.caveBlue, color: C.white, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add</button>
            <button onClick={() => setShowAdd(false)} style={{ background: C.steelGray, color: C.textMid, border: "none", borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      {CATEGORIES.map(cat => {
        const catTasks = tasks.filter(t => t.category === cat);
        if (!catTasks.length) return null;
        const cs   = CAT_STYLE[cat];
        const done = catTasks.filter(t => myProgress[t.id]).length;
        const pct  = Math.round((done / catTasks.length) * 100);
        return (
          <div key={cat} style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: cs.dot, flexShrink: 0 }} />
              <h3 style={{ margin: 0, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: cs.label, fontWeight: 800 }}>{cat}</h3>
              <div style={{ flex: 1, height: 3, background: C.steelGray, borderRadius: 99, marginLeft: 8 }}>
                <div style={{ height: 3, borderRadius: 99, width: `${pct}%`, background: cs.dot, transition: "width .4s" }} />
              </div>
              <span style={{ fontSize: 12, color: C.textMid, fontWeight: 600, flexShrink: 0 }}>{done}/{catTasks.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {catTasks.map(task => {
                const isDone = myProgress[task.id] || false;
                return (
                  <div key={task.id} style={{ background: isDone ? C.lightBg : C.white, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, border: `1px solid ${C.steelGray}`, opacity: isDone ? 0.65 : 1, transition: "all .2s", boxShadow: isDone ? "none" : "0 1px 4px rgba(0,73,118,0.06)" }}>
                    <div onClick={() => onToggle(task.id)} style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, cursor: "pointer", border: `2px solid ${isDone ? cs.dot : C.steelGray}`, background: isDone ? cs.dot : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: C.white, fontWeight: 900, transition: "all .2s" }}>{isDone ? "✓" : ""}</div>
                    {editingId === task.id
                      ? <input defaultValue={task.text} autoFocus onBlur={e => { onEdit(task.id, e.target.value); setEditingId(null); }} onKeyDown={e => e.key === "Enter" && (onEdit(task.id, e.target.value), setEditingId(null))} style={{ flex: 1, background: C.lightBg, color: C.textDark, border: `1.5px solid ${C.marigold}`, borderRadius: 6, padding: "4px 10px", fontSize: 14, fontFamily: "inherit" }} />
                      : <span style={{ flex: 1, fontSize: 14, textDecoration: isDone ? "line-through" : "none", color: isDone ? C.textLight : C.textDark, lineHeight: 1.4 }}>{task.text}</span>
                    }
                    <button onClick={() => setEditingId(editingId === task.id ? null : task.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, fontSize: 13, padding: "2px 5px", flexShrink: 0 }}>✏️</button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SessionsView({ sessions, ambassador, onSignup, onRemove, onAdd }) {
  const [signupTarget, setSignupTarget] = useState(null);
  const [signupName, setSignupName]     = useState("");
  const [showAdd, setShowAdd]           = useState(false);
  const [activeDay, setActiveDay]       = useState("Friday 7/24");
  const [filterMine, setFilterMine]     = useState(false);
  const [newS, setNewS] = useState({ title: "", time: "", room: "", capacity: 3, description: "", day: "Friday 7/24" });

  const daySessions = sessions.filter(s => s.day === activeDay && (!filterMine || s.signups.includes(ambassador)));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.caveBlue }}>Session Sign-Ups</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: C.textMid }}>Sign up for sessions. Changes sync live across all devices.</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setFilterMine(!filterMine)} style={{ background: filterMine ? C.caveBlue : C.white, color: filterMine ? C.white : C.textMid, border: `2px solid ${filterMine ? C.caveBlue : C.steelGray}`, borderRadius: 8, padding: "10px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
            {filterMine ? "✓ My Sessions" : "My Sessions"}
          </button>
          <button onClick={() => setShowAdd(!showAdd)} style={{ background: C.marigold, color: C.white, border: "none", borderRadius: 8, padding: "11px 20px", fontWeight: 800, cursor: "pointer", fontSize: 13, fontFamily: "inherit", boxShadow: "0 2px 8px rgba(247,164,66,0.3)" }}>+ Add Session</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {DAYS.map(day => {
          const ds     = sessions.filter(s => s.day === day);
          const filled = ds.reduce((a, s) => a + s.signups.length, 0);
          const total  = ds.reduce((a, s) => a + s.capacity, 0);
          const mine   = ds.filter(s => s.signups.includes(ambassador)).length;
          return (
            <button key={day} onClick={() => setActiveDay(day)} style={{ background: activeDay === day ? C.caveBlue : C.white, color: activeDay === day ? C.white : C.textMid, border: `2px solid ${activeDay === day ? C.caveBlue : C.steelGray}`, borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13, transition: "all .2s" }}>
              {day}
              <span style={{ marginLeft: 8, background: activeDay === day ? "rgba(255,255,255,0.2)" : C.steelGray, borderRadius: 20, padding: "2px 8px", fontSize: 11, color: activeDay === day ? C.white : C.textMid }}>{filled}/{total}</span>
              {mine > 0 && <span style={{ marginLeft: 4, background: C.marigold, borderRadius: 20, padding: "2px 7px", fontSize: 10, color: C.white, fontWeight: 800 }}>★{mine}</span>}
            </button>
          );
        })}
      </div>

      {showAdd && (
        <div style={{ background: C.white, borderRadius: 12, padding: 20, marginBottom: 24, border: `1px solid ${C.steelGray}`, boxShadow: "0 2px 12px rgba(0,73,118,0.08)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, color: C.caveBlue, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>New Session</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <select value={newS.day} onChange={e => setNewS({ ...newS, day: e.target.value })}
              style={{ background: C.lightBg, color: C.textDark, border: `1px solid ${C.steelGray}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, fontFamily: "inherit", gridColumn: "1/-1" }}>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
            {[["title","Session Title *"],["time","Time *"],["room","Room / Location"],["description","Ambassador role description"]].map(([f,ph]) => (
              <input key={f} value={newS[f]} onChange={e => setNewS({ ...newS, [f]: e.target.value })} placeholder={ph}
                style={{ background: C.lightBg, color: C.textDark, border: `1px solid ${C.steelGray}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, fontFamily: "inherit", gridColumn: f === "description" ? "1/-1" : "auto" }} />
            ))}
            <input type="number" min={1} value={newS.capacity} onChange={e => setNewS({ ...newS, capacity: Number(e.target.value) })}
              placeholder="Spots needed" style={{ background: C.lightBg, color: C.textDark, border: `1px solid ${C.steelGray}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button onClick={() => { if (newS.title.trim()) { onAdd(newS); setNewS({ title: "", time: "", room: "", capacity: 3, description: "", day: "Friday 7/24" }); setShowAdd(false); } }}
              style={{ background: C.caveBlue, color: C.white, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add Session</button>
            <button onClick={() => setShowAdd(false)} style={{ background: C.steelGray, color: C.textMid, border: "none", borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
        {daySessions.map(s => {
          const full   = s.signups.length >= s.capacity;
          const pct    = Math.min(100, Math.round((s.signups.length / s.capacity) * 100));
          const dc     = DAY_COLORS[s.day] || C.powderBlue;
          const isMine = s.signups.includes(ambassador);
          return (
            <div key={s.id} style={{ background: C.white, borderRadius: 14, padding: 20, border: `2px solid ${isMine ? C.marigold : C.steelGray}`, position: "relative", boxShadow: isMine ? "0 4px 16px rgba(247,164,66,0.15)" : "0 2px 12px rgba(0,73,118,0.07)" }}>
              {isMine && <div style={{ position: "absolute", top: 14, right: full ? 76 : 14, background: C.marigold, color: C.white, fontSize: 10, fontWeight: 800, borderRadius: 20, padding: "3px 10px", letterSpacing: 1 }}>MY SESSION</div>}
              {full && !isMine && <div style={{ position: "absolute", top: 14, right: 14, background: C.textLight, color: C.white, fontSize: 10, fontWeight: 800, borderRadius: 20, padding: "3px 10px", letterSpacing: 1 }}>FULL</div>}

              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 4, height: 36, borderRadius: 99, background: dc, flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: dc, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{s.time}</div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.caveBlue, lineHeight: 1.3 }}>{s.title}</h3>
                </div>
              </div>

              {s.room && <div style={{ fontSize: 12, color: C.textMid, marginBottom: 8, marginLeft: 12 }}>📍 {s.room}</div>}
              <p style={{ margin: "0 0 14px", fontSize: 13, color: C.textMid, lineHeight: 1.55, marginLeft: 12 }}>{s.description}</p>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textMid, marginBottom: 6, fontWeight: 600 }}>
                  <span>Ambassadors</span>
                  <span style={{ color: full ? C.textLight : C.caveBlue, fontWeight: 800 }}>{s.signups.length} / {s.capacity}</span>
                </div>
                <div style={{ height: 6, background: C.steelGray, borderRadius: 99 }}>
                  <div style={{ height: 6, borderRadius: 99, width: `${pct}%`, background: isMine ? C.marigold : dc, transition: "width .3s" }} />
                </div>
              </div>

              {s.signups.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {s.signups.map(name => (
                    <div key={name} style={{ background: name === ambassador ? "rgba(247,164,66,0.15)" : C.lightBg, borderRadius: 20, padding: "4px 10px", fontSize: 12, color: C.textDark, display: "flex", alignItems: "center", gap: 6, border: `1px solid ${name === ambassador ? C.marigold : C.steelGray}`, fontWeight: name === ambassador ? 800 : 500 }}>
                      {name === ambassador ? "★ " : ""}{name}
                      <span onClick={() => onRemove(s.id, name)} style={{ cursor: "pointer", color: C.textLight, fontSize: 11, lineHeight: 1, fontWeight: 900 }}>✕</span>
                    </div>
                  ))}
                </div>
              )}

              {!isMine && !full && (
                <button onClick={() => onSignup(s.id, ambassador)} style={{ background: C.caveBlue, color: C.white, border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 700, width: "100%", marginBottom: 8 }}>
                  + Sign Me Up
                </button>
              )}
              {isMine && (
                <button onClick={() => onRemove(s.id, ambassador)} style={{ background: "rgba(247,164,66,0.1)", color: C.marigold, border: `1.5px solid ${C.marigold}`, borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 700, width: "100%", marginBottom: 8 }}>
                  ✕ Remove Me
                </button>
              )}

              {!full && (signupTarget === s.id
                ? <div style={{ display: "flex", gap: 8 }}>
                    <input value={signupName} onChange={e => setSignupName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && signupName.trim() && (onSignup(s.id, signupName), setSignupName(""), setSignupTarget(null))}
                      autoFocus placeholder="Another ambassador's name..." style={{ flex: 1, background: C.lightBg, color: C.textDark, border: `1.5px solid ${C.marigold}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, fontFamily: "inherit" }} />
                    <button onClick={() => { if (signupName.trim()) { onSignup(s.id, signupName); setSignupName(""); setSignupTarget(null); } }} style={{ background: C.caveBlue, color: C.white, border: "none", borderRadius: 8, padding: "8px 12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>Add</button>
                    <button onClick={() => { setSignupTarget(null); setSignupName(""); }} style={{ background: C.steelGray, color: C.textMid, border: "none", borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}>✕</button>
                  </div>
                : <button onClick={() => setSignupTarget(s.id)} style={{ background: "none", border: `1.5px dashed ${C.steelGray}`, borderRadius: 8, color: C.textMid, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", width: "100%", fontWeight: 600 }}>+ Add Another Ambassador</button>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Chat View ────────────────────────────────────────────────
function renderMessageParts(text, knownNames) {
  if (!knownNames.length) return [text];
  const escaped = [...knownNames].sort((a, b) => b.length - a.length).map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`@(${escaped.join("|")})`, "g");
  const parts = [];
  let lastIndex = 0, match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push({ mention: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString();
}

function ChatView({ ambassador, messages, sessions, onSend }) {
  const [text, setText]               = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");

  const knownNames = [...new Set([ambassador, ...sessions.flatMap(s => s.signups)])].sort();
  const filteredMentions = knownNames.filter(n => n.toLowerCase().includes(mentionQuery.toLowerCase()) && n !== ambassador).slice(0, 5);

  const handleChange = (val) => {
    setText(val);
    const m = val.match(/@([a-zA-Z ]*)$/);
    if (m) { setMentionQuery(m[1]); setShowMentions(true); }
    else setShowMentions(false);
  };

  const selectMention = (name) => {
    setText(prev => prev.replace(/@([a-zA-Z ]*)$/, `@${name} `));
    setShowMentions(false);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const mentions = knownNames.filter(n => trimmed.includes(`@${n}`));
    onSend(trimmed, mentions);
    setText("");
    setShowMentions(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.caveBlue }}>Group Chat</h2>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: C.textMid }}>One shared chat for all ambassadors. Type @ to mention someone.</p>
      </div>

      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.steelGray}`, boxShadow: "0 2px 12px rgba(0,73,118,0.06)", display: "flex", flexDirection: "column", height: 520 }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", color: C.textLight, margin: "auto" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
              <p style={{ fontSize: 13 }}>No messages yet. Say hi to the team!</p>
            </div>
          ) : messages.map(m => {
            const isMe = m.ambassador_name === ambassador;
            const isMentioned = (m.mentions || []).includes(ambassador);
            return (
              <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                <div style={{ fontSize: 11, color: C.textLight, marginBottom: 4, fontWeight: 600 }}>
                  {isMe ? "You" : m.ambassador_name} · {timeAgo(m.created_at)}
                </div>
                <div style={{
                  background: isMe ? C.caveBlue : isMentioned ? "rgba(247,164,66,0.12)" : C.lightBg,
                  color: isMe ? C.white : C.textDark,
                  border: isMentioned && !isMe ? `1.5px solid ${C.marigold}` : "none",
                  borderRadius: 14, padding: "10px 14px", maxWidth: "75%", fontSize: 14, lineHeight: 1.45,
                }}>
                  {renderMessageParts(m.text, knownNames).map((p, i) =>
                    typeof p === "string"
                      ? <span key={i}>{p}</span>
                      : <span key={i} style={{ color: isMe ? C.marigold : C.caveBlue, fontWeight: 800 }}>{p.mention}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div style={{ borderTop: `1px solid ${C.steelGray}`, padding: 14, position: "relative" }}>
          {showMentions && filteredMentions.length > 0 && (
            <div style={{ position: "absolute", bottom: "100%", left: 14, right: 14, background: C.white, border: `1px solid ${C.steelGray}`, borderRadius: 10, boxShadow: "0 -4px 16px rgba(0,73,118,0.12)", marginBottom: 6, overflow: "hidden" }}>
              {filteredMentions.map(name => (
                <div key={name} onClick={() => selectMention(name)} style={{ padding: "10px 14px", cursor: "pointer", fontSize: 13, color: C.textDark, fontWeight: 600 }}
                  onMouseEnter={e => e.currentTarget.style.background = C.lightBg} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  @{name}
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <input value={text} onChange={e => handleChange(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !showMentions && handleSend()}
              placeholder="Type a message... use @ to mention someone"
              style={{ flex: 1, background: C.lightBg, color: C.textDark, border: `1px solid ${C.steelGray}`, borderRadius: 10, padding: "12px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            <button onClick={handleSend} style={{ background: C.marigold, color: C.white, border: "none", borderRadius: 10, padding: "12px 22px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RosterView({ sessions }) {
  const allNames = [...new Set(sessions.flatMap(s => s.signups))].sort();

  if (allNames.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 0", color: C.textLight }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
      <p style={{ fontSize: 16, fontWeight: 700 }}>No ambassadors have signed up for sessions yet.</p>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.caveBlue }}>All Ambassadors</h2>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: C.textMid }}>{allNames.length} ambassadors · {sessions.filter(s => s.signups.length > 0).length} sessions staffed</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
        {allNames.map(name => {
          const theirSessions = sessions.filter(s => s.signups.includes(name));
          return (
            <div key={name} style={{ background: C.white, borderRadius: 14, padding: 20, border: `1px solid ${C.steelGray}`, boxShadow: "0 2px 12px rgba(0,73,118,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.caveBlue, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 900, fontSize: 16, flexShrink: 0 }}>
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.textDark }}>{name}</div>
                  <div style={{ fontSize: 12, color: C.textMid }}>{theirSessions.length} session{theirSessions.length !== 1 ? "s" : ""} assigned</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {theirSessions.map(s => (
                  <div key={s.id} style={{ background: C.lightBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${DAY_COLORS[s.day] || C.powderBlue}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.textDark }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: C.textMid }}>{s.day} · {s.time}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
