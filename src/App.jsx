// ============================================================
// IGA NEPHROPATHY FOUNDATION — SPARK 2026 Ambassador Hub
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

const SEED_TASKS = [
  { id: 1,  category: "Before Event",   text: "Complete all pre-event Ambassador training materials", done: false },
  { id: 2,  category: "Before Event",   text: "Attend NEW Ambassador Training (Friday 10AM–4PM, by invite)", done: false },
  { id: 3,  category: "Before Event",   text: "Attend ALL Ambassador Meeting (Friday 3:45–4:45PM, by invite)", done: false },
  { id: 4,  category: "Before Event",   text: "Review the full SPARK 2026 agenda for all three days", done: false },
  { id: 5,  category: "Before Event",   text: "Familiarize yourself with the venue layout and room locations", done: false },
  { id: 6,  category: "Before Event",   text: "Pick up your Ambassador badge, lanyard, and welcome kit at Check-In", done: false },
  { id: 7,  category: "Before Event",   text: "Join the Ambassador group chat or communication channel", done: false },
  { id: 8,  category: "Before Event",   text: "Review Ambassador talking points and FAQs about IgAN and SPARK", done: false },
  { id: 9,  category: "Before Event",   text: "Know your assigned sessions and responsibilities for each day", done: false },
  { id: 10, category: "Friday 7/24",    text: "Welcome attendees at Check-In (12PM–8PM) and direct to registration", done: false },
  { id: 11, category: "Friday 7/24",    text: "Help set the tone at the First Time at SPARK Mixer (3:00–3:45PM)", done: false },
  { id: 12, category: "Friday 7/24",    text: "Support Start Strong session — seat attendees, assist speaker (3:45–5:15PM)", done: false },
  { id: 13, category: "Friday 7/24",    text: "Staff the Exhibit Hall (5:00–8:30PM) and engage attendees at booths", done: false },
  { id: 14, category: "Friday 7/24",    text: "Assist with Foundation Welcome & Update session (5:30–6:00PM)", done: false },
  { id: 15, category: "Friday 7/24",    text: "Assist with Cocktail Hour/Reception logistics (6:00–8:00PM)", done: false },
  { id: 16, category: "Friday 7/24",    text: "Introduce attendees to each other and foster connections all evening", done: false },
  { id: 17, category: "Saturday 7/25",  text: "Assist with SPARK Check-In (7:30–8:30AM) and direct attendees", done: false },
  { id: 18, category: "Saturday 7/25",  text: "Help with Breakfast setup and flow (7:30–8:30AM)", done: false },
  { id: 19, category: "Saturday 7/25",  text: "Staff the Exhibit Hall throughout the day (8AM–8PM)", done: false },
  { id: 20, category: "Saturday 7/25",  text: "Support Foundation Opening Remarks — seating, AV, logistics (8:30AM)", done: false },
  { id: 21, category: "Saturday 7/25",  text: "Facilitate smooth transitions between sessions and stretch breaks", done: false },
  { id: 22, category: "Saturday 7/25",  text: "Assist with Kids Activity during lunch (1:30–2:30PM)", done: false },
  { id: 23, category: "Saturday 7/25",  text: "Staff Breakout Sessions — manage rooms, Q&A microphone, and timing", done: false },
  { id: 24, category: "Saturday 7/25",  text: "Help set up and run Saturday Night SPARK Mystery Dinner & Awards (6PM)", done: false },
  { id: 25, category: "Saturday 7/25",  text: "Assist with Prize Drawing at end of evening (9:00PM)", done: false },
  { id: 26, category: "Saturday 7/25",  text: "Capture photos and share to the official SPARK 2026 hashtag", done: false },
  { id: 27, category: "Sunday 7/26",    text: "Help with Breakfast flow and direct attendees to sessions (8–9:15AM)", done: false },
  { id: 28, category: "Sunday 7/26",    text: "Staff Exhibit Hall for final morning (8AM–12PM)", done: false },
  { id: 29, category: "Sunday 7/26",    text: "Support Sunday Presentations — room management and attendee assistance", done: false },
  { id: 30, category: "Sunday 7/26",    text: "Assist with Empower & Engage interactive session (12:05–12:45PM)", done: false },
  { id: 31, category: "Sunday 7/26",    text: "Be present for Closing Remarks and help wrap up (12:45–12:50PM)", done: false },
  { id: 32, category: "After Event",    text: "Help with breakdown and direct attendees to exits and parking", done: false },
  { id: 33, category: "After Event",    text: "Submit Ambassador feedback form within 24 hours of event close", done: false },
  { id: 34, category: "After Event",    text: "Follow up with connections made at SPARK on LinkedIn or email", done: false },
  { id: 35, category: "After Event",    text: "Share a SPARK 2026 recap post tagging IGA Nephropathy Foundation", done: false },
  { id: 36, category: "After Event",    text: "Debrief with Ambassador team lead on wins and areas to improve", done: false },
];

const SEED_SESSIONS = [
  // ── FRIDAY 7/24 ──────────────────────────────────────────
  {
    id: 1, day: "Friday 7/24",
    title: "Check-In / Registration",
    time: "12:00 PM – 8:00 PM", room: "Park Lane Hallway", capacity: 4,
    description: "Greet arriving attendees, hand out badges and materials, answer questions, and direct guests to hotel areas.",
    signups: [],
  },
  {
    id: 2, day: "Friday 7/24",
    title: "First Time at SPARK Mixer",
    time: "3:00 PM – 3:45 PM", room: "Hope 3", capacity: 3,
    description: "Welcome first-timers, help break the ice, introduce attendees to each other and get them excited for the weekend. High energy and casual.",
    signups: [],
  },
  {
    id: 3, day: "Friday 7/24",
    title: "Start Strong: Understanding IgAN & the SPARK Experience",
    time: "3:45 PM – 5:15 PM", room: "Trippe", capacity: 3,
    description: "Seat attendees, assist speaker James Chevalier M.D., manage Q&A microphone, and monitor room capacity.",
    signups: [],
  },
  {
    id: 4, day: "Friday 7/24",
    title: "Exhibit Hall",
    time: "5:00 PM – 8:30 PM", room: "Windsor Pre-Function", capacity: 5,
    description: "Roam the hall, connect attendees with exhibitors, keep booths staffed and energy high throughout the evening.",
    signups: [],
  },
  {
    id: 5, day: "Friday 7/24",
    title: "Foundation Welcome and Update",
    time: "5:30 PM – 6:00 PM", room: "Windsor Ballroom", capacity: 3,
    description: "Manage seating, assist speakers Bonnie Schneider & Stuart Miller, ensure AV is ready, and keep transitions smooth.",
    signups: [],
  },
  {
    id: 6, day: "Friday 7/24",
    title: "Cocktail Hour / Reception",
    time: "6:00 PM – 8:00 PM", room: "Windsor Ballroom / Garden", capacity: 4,
    description: "Circulate, introduce attendees to one another, support hospitality flow, and keep the energy warm and welcoming.",
    signups: [],
  },

  // ── SATURDAY 7/25 ─────────────────────────────────────────
  {
    id: 7, day: "Saturday 7/25",
    title: "SPARK Check-In",
    time: "7:30 AM – 8:30 AM", room: "Park Lane Hallway", capacity: 4,
    description: "Direct arriving attendees to check-in, distribute Saturday materials, and answer any questions.",
    signups: [],
  },
  {
    id: 8, day: "Saturday 7/25",
    title: "Breakfast",
    time: "7:30 AM – 8:30 AM", room: "Windsor Ballroom", capacity: 2,
    description: "Help manage breakfast flow, ensure seating is available, and assist attendees with any needs.",
    signups: [],
  },
  {
    id: 9, day: "Saturday 7/25",
    title: "Exhibit Hall",
    time: "8:00 AM – 8:00 PM", room: "Windsor Pre-Function", capacity: 5,
    description: "Staff the exhibit hall throughout the full day. Engage attendees, support exhibitors, and maintain energy.",
    signups: [],
  },
  {
    id: 10, day: "Saturday 7/25",
    title: "Foundation Opening Remarks",
    time: "8:30 AM – 9:05 AM", room: "Windsor Ballroom", capacity: 3,
    description: "Manage seating, ensure AV is ready, support speaker Brian Parlato, and keep the room energized for the kickoff.",
    signups: [],
  },
  {
    id: 11, day: "Saturday 7/25",
    title: "Keynote Speaker – Taylor Coffman",
    time: "9:10 AM – 10:15 AM", room: "Windsor Ballroom", capacity: 3,
    description: "Seat attendees, manage Q&A microphone, support speaker logistics, and be ready with tissues — this one is powerful!",
    signups: [],
  },
  {
    id: 12, day: "Saturday 7/25",
    title: "The Latest in IgAN – Dr. Jonathan Barratt",
    time: "10:20 AM – 11:30 AM", room: "Windsor Ballroom", capacity: 2,
    description: "Manage room, Q&A microphone and timing. Assist attendees with questions after the session.",
    signups: [],
  },
  {
    id: 13, day: "Saturday 7/25",
    title: "Reviewing FDA-Approved Treatments – Dr. Sayna Norouzi",
    time: "11:35 AM – 12:20 PM", room: "Windsor Ballroom", capacity: 2,
    description: "Manage room capacity, Q&A microphone, and assist presenter with any logistics.",
    signups: [],
  },
  {
    id: 14, day: "Saturday 7/25",
    title: "Lunch",
    time: "12:25 PM – 1:30 PM", room: "Windsor Ballroom / Garden", capacity: 3,
    description: "Help with lunch flow, direct attendees, foster conversations, and maintain a welcoming atmosphere.",
    signups: [],
  },
  {
    id: 15, day: "Saturday 7/25",
    title: "Kids Activity",
    time: "1:30 PM – 2:30 PM", room: "Hope 3", capacity: 3,
    description: "Assist with kids activities, keep children engaged and safe, support parents who are attending sessions.",
    signups: [],
  },
  {
    id: 16, day: "Saturday 7/25",
    title: "Breakout 1a: Understanding Your Kidney Biopsy",
    time: "1:35 PM – 2:25 PM", room: "Hope 1 & 2", capacity: 2,
    description: "Manage room, assist speakers Jared Hassler MD & Tushar Patel MD, handle Q&A microphone and timing.",
    signups: [],
  },
  {
    id: 17, day: "Saturday 7/25",
    title: "Breakout 1b: Caregiver Stories of IgAN",
    time: "1:35 PM – 2:25 PM", room: "Trippe", capacity: 2,
    description: "Manage room, support speaker Alena Riddick, ensure a safe and supportive atmosphere for this emotional session.",
    signups: [],
  },
  {
    id: 18, day: "Saturday 7/25",
    title: "Breakout 2a: Understanding Your IgAN Labs",
    time: "2:35 PM – 3:25 PM", room: "Hope", capacity: 2,
    description: "Manage room, assist speaker Brad Rovin MD, handle Q&A microphone and timing.",
    signups: [],
  },
  {
    id: 19, day: "Saturday 7/25",
    title: "Breakout 2b: Women and IgAN – Hormones & Family Planning",
    time: "2:35 PM – 3:25 PM", room: "Trippe", capacity: 2,
    description: "Manage room, support speaker Lina Wong DO. Ensure a comfortable, supportive environment for this personal session.",
    signups: [],
  },
  {
    id: 20, day: "Saturday 7/25",
    title: "Breakout 3a: Nutrition and IgAN",
    time: "3:35 PM – 4:25 PM", room: "Hope", capacity: 2,
    description: "Manage room, assist speaker Lauren Budd Levy MS RDN, handle Q&A and distribute any materials.",
    signups: [],
  },
  {
    id: 21, day: "Saturday 7/25",
    title: "Breakout 3b: Life After Kidney Transplant",
    time: "3:35 PM – 4:25 PM", room: "Trippe", capacity: 2,
    description: "Manage room, support speaker James Chevalier MD, handle Q&A microphone and timing.",
    signups: [],
  },
  {
    id: 22, day: "Saturday 7/25",
    title: "Saturday Night SPARK: Mystery Dinner & Awards",
    time: "6:00 PM – 9:00 PM", room: "Windsor Garden", capacity: 6,
    description: "Coordinate seating for the mystery dinner experience, assist with awards setup, keep energy high, and help manage the interactive evening program.",
    signups: [],
  },
  {
    id: 23, day: "Saturday 7/25",
    title: "Prize Drawing",
    time: "9:00 PM – 9:15 PM", room: "Windsor Garden", capacity: 2,
    description: "Assist with prize drawing logistics — manage crowd, hand out prizes, and wrap up the evening on a high note.",
    signups: [],
  },

  // ── SUNDAY 7/26 ───────────────────────────────────────────
  {
    id: 24, day: "Sunday 7/26",
    title: "Breakfast",
    time: "8:00 AM – 9:15 AM", room: "Windsor Ballroom / Garden", capacity: 2,
    description: "Help manage breakfast flow and direct attendees toward morning sessions.",
    signups: [],
  },
  {
    id: 25, day: "Sunday 7/26",
    title: "Exhibit Hall – Final Morning",
    time: "8:00 AM – 12:00 PM", room: "Windsor Pre-Function", capacity: 3,
    description: "Staff the exhibit hall for the final session of the conference. Help wrap up exhibitor needs.",
    signups: [],
  },
  {
    id: 26, day: "Sunday 7/26",
    title: "Where Hope Meets Discovery: IgAN Research Funding",
    time: "9:00 AM – 10:00 AM", room: "Windsor Ballroom", capacity: 2,
    description: "Manage room seating, Q&A microphone, and assist presenter with any logistics.",
    signups: [],
  },
  {
    id: 27, day: "Sunday 7/26",
    title: "Breakout: Turning Science Into Solutions – Clinical Trials",
    time: "10:05 AM – 11:00 AM", room: "Hope", capacity: 2,
    description: "Manage room, assist speaker Brad Rovin MD, handle Q&A microphone and timing.",
    signups: [],
  },
  {
    id: 28, day: "Sunday 7/26",
    title: "Breakout: Your Treatment, Your Rights – Coverage Barriers",
    time: "10:05 AM – 11:00 AM", room: "Trippe", capacity: 2,
    description: "Manage room, Q&A microphone, and ensure attendees can access materials and resources shared during the session.",
    signups: [],
  },
  {
    id: 29, day: "Sunday 7/26",
    title: "Beyond the Diagnosis: Stories of Life with IgAN",
    time: "11:05 AM – 12:00 PM", room: "Windsor Ballroom", capacity: 2,
    description: "Manage room, support speaker Gisela Delgado, create a welcoming atmosphere for this personal storytelling session.",
    signups: [],
  },
  {
    id: 30, day: "Sunday 7/26",
    title: "Empower & Engage: Interactive Session with Foundation & Ambassadors",
    time: "12:05 PM – 12:45 PM", room: "Windsor Ballroom", capacity: 5,
    description: "Key ambassador session! Support Foundation leadership, help facilitate attendee participation, manage audience interaction and microphone.",
    signups: [],
  },
  {
    id: 31, day: "Sunday 7/26",
    title: "Closing Remarks",
    time: "12:45 PM – 12:50 PM", room: "Windsor Ballroom", capacity: 3,
    description: "Assist with final setup, manage seating, and help direct attendees out warmly after the conference closes.",
    signups: [],
  },
];

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
  const [loading, setLoading]       = useState(true);
  const [syncMsg, setSyncMsg]       = useState("");

  const flash = (msg = "Saved ✓") => { setSyncMsg(msg); setTimeout(() => setSyncMsg(""), 2200); };

  useEffect(() => {
    async function init() {
      const [{ data: t }, { data: s }, { data: p }] = await Promise.all([
        supabase.from("tasks").select("*").order("id"),
        supabase.from("sessions").select("*").order("id"),
        supabase.from("task_progress").select("*").eq("ambassador_name", ambassador),
      ]);
      if (!t?.length) { await supabase.from("tasks").insert(SEED_TASKS); setTasks(SEED_TASKS); }
      else setTasks(t);
      if (!s?.length) { await supabase.from("sessions").insert(SEED_SESSIONS); setSessions(SEED_SESSIONS); }
      else setSessions(s);
      const prog = {};
      (p || []).forEach(r => { prog[r.task_id] = r.done; });
      setMyProgress(prog);
      setLoading(false);
    }
    init();
  }, [ambassador]);

  useRealtimeTable("tasks",    useCallback(setTasks, []));
  useRealtimeTable("sessions", useCallback(setSessions, []));

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
    const signups = [...s.signups, name];
    setSessions(p => p.map(x => x.id === sid ? { ...x, signups } : x));
    await supabase.from("sessions").update({ signups }).eq("id", sid);
    flash();
  };
  const removeSignup  = async (sid, name) => {
    const s = sessions.find(x => x.id === sid);
    const signups = s.signups.filter(n => n !== name);
    setSessions(p => p.map(x => x.id === sid ? { ...x, signups } : x));
    await supabase.from("sessions").update({ signups }).eq("id", sid);
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

  const TABS = [
    { key: "dashboard", label: "🏠 My Dashboard" },
    { key: "tasks",     label: "📋 Tasks" },
    { key: "sessions",  label: "📅 Sessions" },
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
            <button key={tab.key} onClick={() => setView(tab.key)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "15px 20px", fontSize: 13,
              fontFamily: "inherit", fontWeight: view === tab.key ? 800 : 500, whiteSpace: "nowrap",
              color: view === tab.key ? C.caveBlue : C.textMid,
              borderBottom: view === tab.key ? `3px solid ${C.marigold}` : "3px solid transparent",
              marginBottom: -3, transition: "all .2s",
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 24px" }}>
        {view === "dashboard" && <Dashboard ambassador={ambassador} sessions={sessions} tasks={tasks} myProgress={myProgress} mySessions={mySessions} onToggleTask={toggleMyTask} onGoSessions={() => setView("sessions")} />}
        {view === "tasks"     && <TasksView tasks={tasks} myProgress={myProgress} onToggle={toggleMyTask} onDelete={deleteTask} onEdit={updateTaskText} onAdd={addTask} />}
        {view === "sessions"  && <SessionsView sessions={sessions} ambassador={ambassador} onSignup={signupToSession} onRemove={removeSignup} onAdd={addSession} onDelete={deleteSession} />}
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

function TasksView({ tasks, myProgress, onToggle, onDelete, onEdit, onAdd }) {
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
                    <button onClick={() => onDelete(task.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, fontSize: 13, padding: "2px 5px", flexShrink: 0 }}>🗑️</button>
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

function SessionsView({ sessions, ambassador, onSignup, onRemove, onAdd, onDelete }) {
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
              <button onClick={() => onDelete(s.id)} style={{ position: "absolute", bottom: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: C.steelGray, fontSize: 12, padding: 4 }}>🗑️</button>
            </div>
          );
        })}
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
