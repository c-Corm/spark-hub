// ============================================================
// IGA NEPHROPATHY FOUNDATION — SPARK 2026 Ambassador Hub
// Supabase Edition · Deploy to Vercel
// Env vars needed:
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
// npm install @supabase/supabase-js
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ── IGAN Brand Colors ────────────────────────────────────────
const C = {
  caveBlue:      "#004976",
  marigold:      "#f7a442",
  steelGray:     "#dde5ed",
  powderBlue:    "#9eb5cb",
  oliveGreen:    "#8aa346",
  pomegranate:   "#f8485e",
  white:         "#ffffff",
  lightBg:       "#f0f4f8",
  cardBg:        "#ffffff",
  cardBorder:    "#dde5ed",
  textDark:      "#003557",
  textMid:       "#4a6a85",
  textLight:     "#7a9ab5",
};

// ── Seed Tasks ───────────────────────────────────────────────
const SEED_TASKS = [
  // Before Event
  { id: 1,  category: "Before Event", text: "Complete all pre-event Ambassador training materials", done: false },
  { id: 2,  category: "Before Event", text: "Attend NEW Ambassador Training (Friday 10AM–4PM, by invite)", done: false },
  { id: 3,  category: "Before Event", text: "Attend ALL Ambassador Meeting (Friday 3:45–4:45PM, by invite)", done: false },
  { id: 4,  category: "Before Event", text: "Review the full SPARK 2026 agenda for all three days", done: false },
  { id: 5,  category: "Before Event", text: "Familiarize yourself with the venue layout and room locations", done: false },
  { id: 6,  category: "Before Event", text: "Pick up your Ambassador badge, lanyard, and welcome kit at Check-In", done: false },
  { id: 7,  category: "Before Event", text: "Join the Ambassador group chat or communication channel", done: false },
  { id: 8,  category: "Before Event", text: "Review Ambassador talking points and FAQs about IgAN and SPARK", done: false },
  { id: 9,  category: "Before Event", text: "Know your assigned sessions and responsibilities for each day", done: false },
  // During Event — Friday
  { id: 10, category: "Friday 7/24",  text: "Welcome attendees at Check-In (12PM–8PM) and direct to registration", done: false },
  { id: 11, category: "Friday 7/24",  text: "Help set the tone at the First Time at SPARK Mixer (3:00–3:30PM)", done: false },
  { id: 12, category: "Friday 7/24",  text: "Staff the Exhibit Hall (5:00–8:30PM) and engage attendees at booths", done: false },
  { id: 13, category: "Friday 7/24",  text: "Encourage attendees to sign up for IgAN Hope Portraits (1PM–6PM)", done: false },
  { id: 14, category: "Friday 7/24",  text: "Assist with Cocktail Hour/Reception logistics (6:00–8:00PM)", done: false },
  { id: 15, category: "Friday 7/24",  text: "Introduce attendees to each other and foster connections all evening", done: false },
  // During Event — Saturday
  { id: 16, category: "Saturday 7/25", text: "Assist with SPARK Check-In (7:30–8:30AM) and direct attendees", done: false },
  { id: 17, category: "Saturday 7/25", text: "Help with Breakfast setup and flow (7:30–8:30AM)", done: false },
  { id: 18, category: "Saturday 7/25", text: "Staff the Exhibit Hall and support throughout the day (8AM–8PM)", done: false },
  { id: 19, category: "Saturday 7/25", text: "Support Opening Sessions — seating, AV needs, room logistics (8:30AM)", done: false },
  { id: 20, category: "Saturday 7/25", text: "Facilitate smooth transitions between sessions and stretch breaks", done: false },
  { id: 21, category: "Saturday 7/25", text: "Assist with Kids Activity during lunch (1:30–2:30PM)", done: false },
  { id: 22, category: "Saturday 7/25", text: "Staff Breakout Sessions 1a/1b, 2a/2b, 3a/3b — manage rooms and Q&A", done: false },
  { id: 23, category: "Saturday 7/25", text: "Help set up and run Saturday Night SPARK Awards Ceremony (6:30PM)", done: false },
  { id: 24, category: "Saturday 7/25", text: "Assist with Prize Drawing at end of evening (9:00PM)", done: false },
  { id: 25, category: "Saturday 7/25", text: "Capture photos and share to the official SPARK 2026 hashtag", done: false },
  // During Event — Sunday
  { id: 26, category: "Sunday 7/26",  text: "Help with Breakfast flow and direct attendees to sessions (8–9:15AM)", done: false },
  { id: 27, category: "Sunday 7/26",  text: "Staff Exhibit Hall for final morning (8AM–12PM)", done: false },
  { id: 28, category: "Sunday 7/26",  text: "Support Sunday Presentations — room management and attendee assistance", done: false },
  { id: 29, category: "Sunday 7/26",  text: "Assist with Empower & Engage interactive session (11:35AM–12:35PM)", done: false },
  { id: 30, category: "Sunday 7/26",  text: "Be present for Closing Remarks and help wrap up (12:35–12:45PM)", done: false },
  // After Event
  { id: 31, category: "After Event",  text: "Help with breakdown and direct attendees to exits and parking", done: false },
  { id: 32, category: "After Event",  text: "Submit Ambassador feedback form within 24 hours of event close", done: false },
  { id: 33, category: "After Event",  text: "Follow up with connections made at SPARK on LinkedIn or email", done: false },
  { id: 34, category: "After Event",  text: "Share a SPARK 2026 recap post tagging IGA Nephropathy Foundation", done: false },
  { id: 35, category: "After Event",  text: "Debrief with Ambassador team lead on wins and areas to improve", done: false },
];

// ── Seed Sessions ────────────────────────────────────────────
const SEED_SESSIONS = [
  // Friday
  { id: 1,  day: "Friday 7/24",   title: "Check-In / Registration",               time: "12:00 PM – 8:00 PM",  room: "TBD", capacity: 4, description: "Greet arriving attendees, hand out badges and materials, answer questions and direct to hotel/venue areas.", signups: [] },
  { id: 2,  day: "Friday 7/24",   title: "IgAN Hope Portrait Sign-Ups",            time: "1:00 PM – 6:05 PM",   room: "TBD", capacity: 2, description: "Encourage attendees to sign up for their portrait. Help manage the queue and keep energy upbeat.", signups: [] },
  { id: 3,  day: "Friday 7/24",   title: "First Time at SPARK Mixer",              time: "3:00 PM – 3:30 PM",   room: "TBD", capacity: 3, description: "Welcome first-timers, introduce them to the community, and make them feel at home.", signups: [] },
  { id: 4,  day: "Friday 7/24",   title: "Exhibit Hall",                           time: "5:00 PM – 8:30 PM",   room: "Exhibit Hall", capacity: 5, description: "Roam the hall, connect attendees with exhibitors, keep booths staffed and energy high.", signups: [] },
  { id: 5,  day: "Friday 7/24",   title: "Cocktail Hour / Reception",              time: "6:00 PM – 8:00 PM",   room: "TBD", capacity: 4, description: "Circulate, introduce attendees to each other, support event flow and hospitality.", signups: [] },
  // Saturday
  { id: 6,  day: "Saturday 7/25", title: "SPARK Check-In",                         time: "7:30 AM – 8:30 AM",   room: "TBD", capacity: 4, description: "Direct arriving attendees to check-in, distribute Saturday materials, answer questions.", signups: [] },
  { id: 7,  day: "Saturday 7/25", title: "Breakfast",                              time: "7:30 AM – 8:30 AM",   room: "TBD", capacity: 2, description: "Help manage breakfast flow, ensure seating is available, assist attendees with needs.", signups: [] },
  { id: 8,  day: "Saturday 7/25", title: "Exhibit Hall",                           time: "8:00 AM – 8:00 PM",   room: "Exhibit Hall", capacity: 5, description: "Staff the exhibit hall throughout the day. Engage attendees and support exhibitors.", signups: [] },
  { id: 9,  day: "Saturday 7/25", title: "Opening Sessions",                       time: "8:30 AM – 11:30 AM",  room: "Main Stage", capacity: 4, description: "Manage seating, support AV needs, keep transitions smooth between Foundation Welcome, Keynote, and IgAN update.", signups: [] },
  { id: 10, day: "Saturday 7/25", title: "Presentation: Kidney-Friendly Recipes",  time: "11:35 AM – 12:20 PM", room: "TBD", capacity: 2, description: "Assist presenter with materials, manage Q&A microphone, and monitor room capacity.", signups: [] },
  { id: 11, day: "Saturday 7/25", title: "Lunch",                                  time: "12:25 PM – 1:30 PM",  room: "TBD", capacity: 3, description: "Help with lunch flow, direct attendees, foster conversations and connections.", signups: [] },
  { id: 12, day: "Saturday 7/25", title: "Kids Activity",                          time: "1:30 PM – 2:30 PM",   room: "TBD", capacity: 3, description: "Assist with kids activities, keep children engaged, and support parents attending sessions.", signups: [] },
  { id: 13, day: "Saturday 7/25", title: "Breakout Sessions 1a & 1b",              time: "1:35 PM – 2:25 PM",   room: "Rooms TBD", capacity: 4, description: "Staff both breakout rooms — manage attendance, Q&A microphone, and timing.", signups: [] },
  { id: 14, day: "Saturday 7/25", title: "Breakout Sessions 2a & 2b",              time: "2:35 PM – 3:25 PM",   room: "Rooms TBD", capacity: 4, description: "Staff both breakout rooms — manage attendance, Q&A microphone, and timing.", signups: [] },
  { id: 15, day: "Saturday 7/25", title: "Breakout Sessions 3a & 3b",              time: "3:35 PM – 4:25 PM",   room: "Rooms TBD", capacity: 4, description: "Staff both breakout rooms — manage attendance, Q&A microphone, and timing.", signups: [] },
  { id: 16, day: "Saturday 7/25", title: "Saturday Night SPARK & Awards",          time: "6:30 PM – 9:15 PM",   room: "TBD", capacity: 5, description: "Coordinate seating, assist with awards setup, manage prize drawing, keep energy high all evening.", signups: [] },
  // Sunday
  { id: 17, day: "Sunday 7/26",   title: "Breakfast",                              time: "8:00 AM – 9:15 AM",   room: "TBD", capacity: 2, description: "Help manage breakfast flow and direct attendees toward morning sessions.", signups: [] },
  { id: 18, day: "Sunday 7/26",   title: "Exhibit Hall — Final Morning",           time: "8:00 AM – 12:00 PM",  room: "Exhibit Hall", capacity: 3, description: "Staff the exhibit hall for the final session. Help wrap up exhibitor needs.", signups: [] },
  { id: 19, day: "Sunday 7/26",   title: "Presentation 1",                         time: "9:15 AM – 10:30 AM",  room: "TBD", capacity: 2, description: "Manage room, Q&A microphone, and assist presenter with any logistics.", signups: [] },
  { id: 20, day: "Sunday 7/26",   title: "Presentation 2",                         time: "10:35 AM – 11:30 AM", room: "TBD", capacity: 2, description: "Manage room, Q&A microphone, and assist presenter with any logistics.", signups: [] },
  { id: 21, day: "Sunday 7/26",   title: "Empower & Engage: Interactive Session",  time: "11:35 AM – 12:35 PM", room: "TBD", capacity: 4, description: "Support Foundation leadership with group activities, help facilitate attendee participation.", signups: [] },
  { id: 22, day: "Sunday 7/26",   title: "Closing Remarks",                        time: "12:35 PM – 12:45 PM", room: "Main Stage", capacity: 3, description: "Assist with final setup, manage seating, and help direct attendees out after close.", signups: [] },
];

const CATEGORIES = ["Before Event", "Friday 7/24", "Saturday 7/25", "Sunday 7/26", "After Event"];
const DAYS = ["Friday 7/24", "Saturday 7/25", "Sunday 7/26"];

const CAT_STYLE = {
  "Before Event":   { dot: C.marigold,    label: C.marigold },
  "Friday 7/24":    { dot: C.powderBlue,  label: C.powderBlue },
  "Saturday 7/25":  { dot: C.oliveGreen,  label: C.oliveGreen },
  "Sunday 7/26":    { dot: C.pomegranate, label: C.pomegranate },
  "After Event":    { dot: C.textLight,   label: C.textLight },
};

function useRealtimeTable(table, setter) {
  useEffect(() => {
    const channel = supabase
      .channel(`rt-${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        supabase.from(table).select("*").order("id").then(({ data }) => data && setter(data));
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [table, setter]);
}

// ════════════════════════════════════════════════════════════
export default function SparkHub() {
  const [view, setView]         = useState("tasks");
  const [tasks, setTasks]       = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [syncMsg, setSyncMsg]   = useState("");

  const flash = (msg = "Saved ✓") => { setSyncMsg(msg); setTimeout(() => setSyncMsg(""), 2200); };

  useEffect(() => {
    async function init() {
      const [{ data: t }, { data: s }] = await Promise.all([
        supabase.from("tasks").select("*").order("id"),
        supabase.from("sessions").select("*").order("id"),
      ]);
      if (!t?.length) { await supabase.from("tasks").insert(SEED_TASKS); setTasks(SEED_TASKS); }
      else setTasks(t);
      if (!s?.length) { await supabase.from("sessions").insert(SEED_SESSIONS); setSessions(SEED_SESSIONS); }
      else setSessions(s);
      setLoading(false);
    }
    init();
  }, []);

  useRealtimeTable("tasks",    useCallback(setTasks, []));
  useRealtimeTable("sessions", useCallback(setSessions, []));

  const toggleTask     = async (id, done) => { setTasks(t => t.map(x => x.id===id ? {...x,done:!done} : x)); await supabase.from("tasks").update({done:!done}).eq("id",id); flash(); };
  const deleteTask     = async (id)       => { setTasks(t => t.filter(x => x.id!==id)); await supabase.from("tasks").delete().eq("id",id); flash("Deleted"); };
  const updateTaskText = async (id, text) => { setTasks(t => t.map(x => x.id===id ? {...x,text} : x)); await supabase.from("tasks").update({text}).eq("id",id); flash(); };
  const addTask        = async (category, text) => { const row={id:Date.now(),category,text,done:false}; setTasks(t=>[...t,row]); await supabase.from("tasks").insert(row); flash("Added ✓"); };
  const signupToSession = async (sid, name) => { const s=sessions.find(x=>x.id===sid); if(!s||s.signups.length>=s.capacity) return; const signups=[...s.signups,name]; setSessions(p=>p.map(x=>x.id===sid?{...x,signups}:x)); await supabase.from("sessions").update({signups}).eq("id",sid); flash(); };
  const removeSignup   = async (sid, name) => { const s=sessions.find(x=>x.id===sid); const signups=s.signups.filter(n=>n!==name); setSessions(p=>p.map(x=>x.id===sid?{...x,signups}:x)); await supabase.from("sessions").update({signups}).eq("id",sid); flash("Removed"); };
  const addSession     = async (session)   => { const row={...session,id:Date.now(),signups:[]}; setSessions(p=>[...p,row]); await supabase.from("sessions").insert(row); flash("Session added ✓"); };
  const deleteSession  = async (id)        => { setSessions(p=>p.filter(x=>x.id!==id)); await supabase.from("sessions").delete().eq("id",id); flash("Deleted"); };

  const completedCount = tasks.filter(t => t.done).length;

  if (loading) return (
    <div style={{minHeight:"100vh",background:C.caveBlue,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,fontFamily:"'Avenir','Gill Sans',sans-serif"}}>
      <div style={{fontSize:32}}>💙</div>
      <div style={{color:C.marigold,fontSize:18,fontWeight:700,letterSpacing:2}}>Loading SPARK 2026...</div>
    </div>
  );

  return (
    <div style={{fontFamily:"'Avenir','Gill Sans','Century Gothic',sans-serif",minHeight:"100vh",background:C.lightBg,color:C.textDark}}>

      {/* Sync toast */}
      {syncMsg && (
        <div style={{position:"fixed",top:16,right:16,background:C.oliveGreen,color:"#fff",borderRadius:8,padding:"10px 18px",fontSize:13,fontWeight:700,zIndex:999,boxShadow:"0 4px 20px #0003",letterSpacing:1}}>
          {syncMsg}
        </div>
      )}

      {/* Header */}
      <div style={{background:C.caveBlue,position:"relative",overflow:"hidden"}}>
        {/* Subtle dot pattern */}
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle, rgba(158,181,203,0.15) 1px, transparent 1px)",backgroundSize:"24px 24px"}} />
        <div style={{position:"relative",maxWidth:960,margin:"0 auto",padding:"28px 24px 24px"}}>
          <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
            {/* Logo area */}
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:56,height:56,borderRadius:12,background:C.marigold,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>
                💙
              </div>
              <div>
                <div style={{fontSize:10,color:C.powderBlue,letterSpacing:4,textTransform:"uppercase",fontWeight:600,marginBottom:3}}>IGA Nephropathy Foundation</div>
                <div style={{fontSize:28,fontWeight:900,color:C.white,letterSpacing:-0.5,lineHeight:1,fontFamily:"'Georgia','Times New Roman',serif"}}>SPARK 2026</div>
                <div style={{fontSize:12,color:C.marigold,fontWeight:700,letterSpacing:2,marginTop:3}}>AMBASSADOR HUB · ATLANTA</div>
              </div>
            </div>

            <div style={{marginLeft:"auto",display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:24,fontWeight:900,color:C.marigold}}>{completedCount}/{tasks.length}</div>
                <div style={{fontSize:10,color:C.powderBlue,letterSpacing:2,textTransform:"uppercase"}}>Tasks Done</div>
              </div>
              <div style={{background:"rgba(247,164,66,0.15)",border:"1px solid rgba(247,164,66,0.3)",borderRadius:20,padding:"6px 14px",fontSize:11,color:C.marigold,fontWeight:700,letterSpacing:1}}>
                🔴 LIVE SYNC
              </div>
            </div>
          </div>

          {/* Date strip */}
          <div style={{display:"flex",gap:8,marginTop:20,flexWrap:"wrap"}}>
            {[["Fri","Jul 24"],["Sat","Jul 25"],["Sun","Jul 26"]].map(([d,date]) => (
              <div key={d} style={{background:"rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 14px",fontSize:12,color:C.steelGray,fontWeight:600}}>
                {d} <span style={{color:C.marigold}}>{date}</span>
              </div>
            ))}
            <div style={{background:"rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 14px",fontSize:12,color:C.steelGray,fontWeight:600}}>
              📍 Atlanta, GA
            </div>
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <div style={{background:C.white,borderBottom:`3px solid ${C.steelGray}`,boxShadow:"0 2px 8px rgba(0,73,118,0.08)"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px",display:"flex"}}>
          {[{key:"tasks",label:"📋 Ambassador Tasks"},{key:"sessions",label:"📅 Session Sign-Ups"}].map(tab => (
            <button key={tab.key} onClick={() => setView(tab.key)} style={{
              background:"none",border:"none",cursor:"pointer",padding:"16px 24px",fontSize:14,
              fontFamily:"inherit",fontWeight:view===tab.key ? 800 : 500,
              color:view===tab.key ? C.caveBlue : C.textMid,
              borderBottom:view===tab.key ? `3px solid ${C.marigold}` : "3px solid transparent",
              marginBottom:-3,transition:"all .2s",letterSpacing:0.3,
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"28px 24px"}}>
        {view==="tasks"
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
  const [newTask, setNewTask]     = useState({ text:"", category:"Saturday 7/25" });
  const [showAdd, setShowAdd]     = useState(false);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{margin:0,fontSize:22,fontWeight:900,color:C.caveBlue}}>Ambassador To-Do List</h2>
          <p style={{margin:"6px 0 0",fontSize:13,color:C.textMid}}>Check off tasks as you go. All changes save instantly and sync to everyone.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{background:C.marigold,color:C.white,border:"none",borderRadius:8,padding:"11px 20px",fontWeight:800,cursor:"pointer",fontSize:13,fontFamily:"inherit",letterSpacing:0.5,boxShadow:"0 2px 8px rgba(247,164,66,0.3)"}}>
          + Add Task
        </button>
      </div>

      {showAdd && (
        <div style={{background:C.white,borderRadius:12,padding:20,marginBottom:24,border:`1px solid ${C.steelGray}`,boxShadow:"0 2px 12px rgba(0,73,118,0.08)"}}>
          <h3 style={{margin:"0 0 14px",fontSize:14,color:C.caveBlue,fontWeight:800,letterSpacing:1,textTransform:"uppercase"}}>New Task</h3>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <select value={newTask.category} onChange={e => setNewTask({...newTask,category:e.target.value})}
              style={{background:C.lightBg,color:C.textDark,border:`1px solid ${C.steelGray}`,borderRadius:8,padding:"10px 14px",fontSize:13,fontFamily:"inherit",fontWeight:600}}>
              {["Before Event","Friday 7/24","Saturday 7/25","Sunday 7/26","After Event"].map(c=><option key={c}>{c}</option>)}
            </select>
            <input value={newTask.text} onChange={e => setNewTask({...newTask,text:e.target.value})}
              onKeyDown={e => e.key==="Enter" && newTask.text.trim() && (onAdd(newTask.category,newTask.text), setNewTask({text:"",category:"Saturday 7/25"}), setShowAdd(false))}
              placeholder="Describe the task..." style={{flex:1,minWidth:200,background:C.lightBg,color:C.textDark,border:`1px solid ${C.steelGray}`,borderRadius:8,padding:"10px 14px",fontSize:13,fontFamily:"inherit"}} />
            <button onClick={() => { if(newTask.text.trim()){onAdd(newTask.category,newTask.text);setNewTask({text:"",category:"Saturday 7/25"});setShowAdd(false);}}}
              style={{background:C.caveBlue,color:C.white,border:"none",borderRadius:8,padding:"10px 20px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Add</button>
            <button onClick={()=>setShowAdd(false)} style={{background:C.steelGray,color:C.textMid,border:"none",borderRadius:8,padding:"10px 14px",cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          </div>
        </div>
      )}

      {CATEGORIES.map(cat => {
        const catTasks = tasks.filter(t => t.category===cat);
        if (!catTasks.length) return null;
        const cs = CAT_STYLE[cat];
        const done = catTasks.filter(t=>t.done).length;
        const pct = Math.round((done/catTasks.length)*100);
        return (
          <div key={cat} style={{marginBottom:32}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:cs.dot,flexShrink:0}} />
              <h3 style={{margin:0,fontSize:12,letterSpacing:3,textTransform:"uppercase",color:cs.label,fontWeight:800}}>{cat}</h3>
              <div style={{flex:1,height:3,background:C.steelGray,borderRadius:99,marginLeft:8}}>
                <div style={{height:3,borderRadius:99,width:`${pct}%`,background:cs.dot,transition:"width .4s"}} />
              </div>
              <span style={{fontSize:12,color:C.textMid,fontWeight:600,flexShrink:0}}>{done}/{catTasks.length}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {catTasks.map(task => (
                <div key={task.id} style={{
                  background:task.done ? C.lightBg : C.white,
                  borderRadius:10,padding:"14px 16px",
                  display:"flex",alignItems:"center",gap:12,
                  border:`1px solid ${task.done ? C.steelGray : C.cardBorder}`,
                  opacity:task.done ? 0.65 : 1,transition:"all .2s",
                  boxShadow:task.done ? "none" : "0 1px 4px rgba(0,73,118,0.06)",
                }}>
                  <div onClick={()=>onToggle(task.id,task.done)} style={{
                    width:22,height:22,borderRadius:6,flexShrink:0,cursor:"pointer",
                    border:`2px solid ${task.done ? cs.dot : C.steelGray}`,
                    background:task.done ? cs.dot : "transparent",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:13,color:C.white,fontWeight:900,transition:"all .2s",
                  }}>{task.done ? "✓" : ""}</div>

                  {editingId===task.id
                    ? <input defaultValue={task.text} autoFocus
                        onBlur={e=>{onEdit(task.id,e.target.value);setEditingId(null);}}
                        onKeyDown={e=>e.key==="Enter"&&(onEdit(task.id,e.target.value),setEditingId(null))}
                        style={{flex:1,background:C.lightBg,color:C.textDark,border:`1.5px solid ${C.marigold}`,borderRadius:6,padding:"4px 10px",fontSize:14,fontFamily:"inherit"}} />
                    : <span style={{flex:1,fontSize:14,textDecoration:task.done?"line-through":"none",color:task.done?C.textLight:C.textDark,lineHeight:1.4}}>{task.text}</span>
                  }
                  <button onClick={()=>setEditingId(editingId===task.id?null:task.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.textLight,fontSize:13,padding:"2px 5px",flexShrink:0}}>✏️</button>
                  <button onClick={()=>onDelete(task.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.textLight,fontSize:13,padding:"2px 5px",flexShrink:0}}>🗑️</button>
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
  const [activeDay, setActiveDay]       = useState("Friday 7/24");
  const [newS, setNewS]                 = useState({title:"",time:"",room:"",capacity:3,description:"",day:"Friday 7/24"});

  const daySessions = sessions.filter(s => s.day===activeDay);
  const DAY_COLORS = { "Friday 7/24": C.powderBlue, "Saturday 7/25": C.oliveGreen, "Sunday 7/26": C.pomegranate };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{margin:0,fontSize:22,fontWeight:900,color:C.caveBlue}}>Session Sign-Ups</h2>
          <p style={{margin:"6px 0 0",fontSize:13,color:C.textMid}}>Sign ambassadors up for sessions. Changes sync live across all devices.</p>
        </div>
        <button onClick={()=>setShowAdd(!showAdd)} style={{background:C.marigold,color:C.white,border:"none",borderRadius:8,padding:"11px 20px",fontWeight:800,cursor:"pointer",fontSize:13,fontFamily:"inherit",letterSpacing:0.5,boxShadow:"0 2px 8px rgba(247,164,66,0.3)"}}>
          + Add Session
        </button>
      </div>

      {/* Day tabs */}
      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
        {DAYS.map(day => {
          const daySess = sessions.filter(s=>s.day===day);
          const filled  = daySess.reduce((a,s)=>a+s.signups.length,0);
          const total   = daySess.reduce((a,s)=>a+s.capacity,0);
          return (
            <button key={day} onClick={()=>setActiveDay(day)} style={{
              background:activeDay===day ? C.caveBlue : C.white,
              color:activeDay===day ? C.white : C.textMid,
              border:`2px solid ${activeDay===day ? C.caveBlue : C.steelGray}`,
              borderRadius:10,padding:"10px 18px",cursor:"pointer",fontFamily:"inherit",
              fontWeight:700,fontSize:13,transition:"all .2s",
            }}>
              {day}
              <span style={{marginLeft:8,background:activeDay===day ? "rgba(255,255,255,0.2)" : C.steelGray,borderRadius:20,padding:"2px 8px",fontSize:11,color:activeDay===day?C.white:C.textMid}}>
                {filled}/{total}
              </span>
            </button>
          );
        })}
      </div>

      {showAdd && (
        <div style={{background:C.white,borderRadius:12,padding:20,marginBottom:24,border:`1px solid ${C.steelGray}`,boxShadow:"0 2px 12px rgba(0,73,118,0.08)"}}>
          <h3 style={{margin:"0 0 14px",fontSize:14,color:C.caveBlue,fontWeight:800,letterSpacing:1,textTransform:"uppercase"}}>New Session</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <select value={newS.day} onChange={e=>setNewS({...newS,day:e.target.value})}
              style={{background:C.lightBg,color:C.textDark,border:`1px solid ${C.steelGray}`,borderRadius:8,padding:"10px 14px",fontSize:13,fontFamily:"inherit",gridColumn:"1/-1"}}>
              {DAYS.map(d=><option key={d}>{d}</option>)}
            </select>
            {[["title","Session Title *"],["time","Time (e.g. 9:00 AM – 10:00 AM) *"],["room","Room / Location"],["description","Ambassador role description"]].map(([f,ph])=>(
              <input key={f} value={newS[f]} onChange={e=>setNewS({...newS,[f]:e.target.value})} placeholder={ph}
                style={{background:C.lightBg,color:C.textDark,border:`1px solid ${C.steelGray}`,borderRadius:8,padding:"10px 14px",fontSize:13,fontFamily:"inherit",gridColumn:f==="description"?"1/-1":"auto"}} />
            ))}
            <input type="number" min={1} value={newS.capacity} onChange={e=>setNewS({...newS,capacity:Number(e.target.value)})}
              placeholder="Spots needed" style={{background:C.lightBg,color:C.textDark,border:`1px solid ${C.steelGray}`,borderRadius:8,padding:"10px 14px",fontSize:13,fontFamily:"inherit"}} />
          </div>
          <div style={{display:"flex",gap:10,marginTop:14}}>
            <button onClick={()=>{if(newS.title.trim()){onAdd(newS);setNewS({title:"",time:"",room:"",capacity:3,description:"",day:"Friday 7/24"});setShowAdd(false);}}}
              style={{background:C.caveBlue,color:C.white,border:"none",borderRadius:8,padding:"10px 20px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Add Session</button>
            <button onClick={()=>setShowAdd(false)} style={{background:C.steelGray,color:C.textMid,border:"none",borderRadius:8,padding:"10px 14px",cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:16}}>
        {daySessions.map(s => {
          const full = s.signups.length >= s.capacity;
          const pct  = Math.min(100, Math.round((s.signups.length/s.capacity)*100));
          const dc   = DAY_COLORS[s.day] || C.powderBlue;
          return (
            <div key={s.id} style={{background:C.white,borderRadius:14,padding:20,border:`1px solid ${full ? C.marigold : C.cardBorder}`,position:"relative",boxShadow:"0 2px 12px rgba(0,73,118,0.07)",transition:"box-shadow .2s"}}>
              {full && <div style={{position:"absolute",top:14,right:14,background:C.marigold,color:C.white,fontSize:10,fontWeight:800,borderRadius:20,padding:"3px 10px",letterSpacing:1}}>FULL</div>}

              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:4,height:36,borderRadius:99,background:dc,flexShrink:0}} />
                <div>
                  <div style={{fontSize:11,color:dc,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>{s.time}</div>
                  <h3 style={{margin:0,fontSize:15,fontWeight:800,color:C.caveBlue,paddingRight:full?50:0,lineHeight:1.2}}>{s.title}</h3>
                </div>
              </div>

              {s.room && <div style={{fontSize:12,color:C.textMid,marginBottom:10,marginLeft:12}}>📍 {s.room}</div>}
              <p style={{margin:"0 0 14px",fontSize:13,color:C.textMid,lineHeight:1.55,marginLeft:12}}>{s.description}</p>

              {/* Capacity bar */}
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.textMid,marginBottom:6,fontWeight:600}}>
                  <span>Ambassadors Needed</span>
                  <span style={{color:full?C.marigold:C.caveBlue,fontWeight:800}}>{s.signups.length} / {s.capacity}</span>
                </div>
                <div style={{height:6,background:C.steelGray,borderRadius:99}}>
                  <div style={{height:6,borderRadius:99,width:`${pct}%`,background:full?C.marigold:dc,transition:"width .3s"}} />
                </div>
              </div>

              {/* Signup chips */}
              {s.signups.length > 0 && (
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
                  {s.signups.map(name => (
                    <div key={name} style={{background:C.lightBg,borderRadius:20,padding:"4px 10px",fontSize:12,color:C.textDark,display:"flex",alignItems:"center",gap:6,border:`1px solid ${C.steelGray}`,fontWeight:600}}>
                      {name}
                      <span onClick={()=>onRemove(s.id,name)} style={{cursor:"pointer",color:C.textLight,fontSize:11,lineHeight:1,fontWeight:900}}>✕</span>
                    </div>
                  ))}
                </div>
              )}

              {!full && (
                signupTarget===s.id
                  ? <div style={{display:"flex",gap:8}}>
                      <input value={signupName} onChange={e=>setSignupName(e.target.value)}
                        onKeyDown={e=>e.key==="Enter"&&signupName.trim()&&(onSignup(s.id,signupName),setSignupName(""),setSignupTarget(null))}
                        autoFocus placeholder="Ambassador name..." style={{flex:1,background:C.lightBg,color:C.textDark,border:`1.5px solid ${C.marigold}`,borderRadius:8,padding:"8px 12px",fontSize:13,fontFamily:"inherit"}} />
                      <button onClick={()=>{if(signupName.trim()){onSignup(s.id,signupName);setSignupName("");setSignupTarget(null);}}}
                        style={{background:C.caveBlue,color:C.white,border:"none",borderRadius:8,padding:"8px 14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Add</button>
                      <button onClick={()=>{setSignupTarget(null);setSignupName("");}} style={{background:C.steelGray,color:C.textMid,border:"none",borderRadius:8,padding:"8px 10px",cursor:"pointer"}}>✕</button>
                    </div>
                  : <button onClick={()=>setSignupTarget(s.id)} style={{background:"none",border:`1.5px dashed ${C.steelGray}`,borderRadius:8,color:C.textMid,padding:"8px 16px",cursor:"pointer",fontSize:13,fontFamily:"inherit",width:"100%",fontWeight:600,transition:"border-color .2s"}}>
                      + Sign Up Ambassador
                    </button>
              )}

              <button onClick={()=>onDelete(s.id)} style={{position:"absolute",bottom:14,right:14,background:"none",border:"none",cursor:"pointer",color:C.steelGray,fontSize:13,padding:4}}>🗑️</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
