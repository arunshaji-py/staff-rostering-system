import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

const C = {
  blue: "#3b6ef8", blueLight: "#eef2ff", blueMid: "#c0ccf8",
  red: "#e03535", redLight: "#fff0f0",
  green: "#16a05a", greenLight: "#edfaf3",
  amber: "#c87d10", amberLight: "#fff8ec",
  bg: "#f4f6fb", surface: "#ffffff", border: "#e2e5ef",
  text: "#1a1e2e", muted: "#5a6380", subtle: "#9299b0", inputBg: "#f0f2f7",
};

const S = {
  wrapper: { display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif", fontSize: 14, color: C.text },
  sidebar: { width: 220, minHeight: "100vh", background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 },
  sidebarLogo: { padding: "20px 18px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}` },
  logoIcon: { width: 28, height: 28, background: C.blue, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  logoText: { fontSize: 14, fontWeight: 600, letterSpacing: -0.3, color: C.text },
  logoSub: { fontSize: 10, color: C.subtle, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 0.5 },
  sidebarNav: { padding: "14px 10px", flex: 1 },
  navSection: { fontSize: 10, fontWeight: 700, color: C.subtle, textTransform: "uppercase", letterSpacing: 0.8, padding: "0 8px", margin: "16px 0 6px" },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 6, fontSize: 13, fontWeight: 500, color: active ? C.blue : C.muted, background: active ? C.blueLight : "transparent", cursor: "pointer", marginBottom: 2, userSelect: "none" }),
  navBadge: { marginLeft: "auto", background: C.blue, color: "white", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10 },
  sidebarFooter: { padding: "14px 10px", borderTop: `1px solid ${C.border}` },
  userRow: { display: "flex", alignItems: "center", gap: 9, padding: 8 },
  userAvatar: { width: 34, height: 34, borderRadius: "50%", background: C.blueLight, border: `1.5px solid ${C.blueMid}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.blue, flexShrink: 0 },
  userName: { fontSize: 12, fontWeight: 600, color: C.text },
  userRole: { fontSize: 10, color: C.subtle },
  logoutBtn: { marginTop: 6, width: "100%", padding: "7px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "transparent", border: `1px solid ${C.border}`, color: C.subtle, cursor: "pointer", fontFamily: "inherit" },
  topbar: { height: 56, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 },
  topbarTitle: { fontSize: 15, fontWeight: 600, letterSpacing: -0.2, color: C.text },
  topbarSub: { fontSize: 12, color: C.subtle, marginLeft: 4 },
  topbarActions: { marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" },
  content: { padding: 24, flex: 1, overflowY: "auto" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 },
  statCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px" },
  statLabel: { fontSize: 10, fontWeight: 700, color: C.subtle, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 },
  statDot: (color) => ({ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }),
  statValue: (color) => ({ fontSize: 28, fontWeight: 600, letterSpacing: -1, lineHeight: 1, fontFamily: "monospace", color }),
  statSub: { fontSize: 11, color: C.subtle, marginTop: 6 },
  panel: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 16 },
  panelHeader: { padding: "13px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" },
  panelTitle: { fontSize: 13, fontWeight: 600, color: C.text },
  panelCount: (hi) => ({ fontSize: 11, color: hi ? C.blue : C.subtle, background: hi ? C.blueLight : C.inputBg, padding: "2px 8px", borderRadius: 10, border: `1px solid ${hi ? C.blueMid : C.border}` }),
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  th: { padding: "9px 18px", textAlign: "left", fontSize: 10, fontWeight: 700, color: C.subtle, textTransform: "uppercase", letterSpacing: 0.6, background: C.inputBg, borderBottom: `1px solid ${C.border}` },
  td: { padding: "12px 18px", borderBottom: `1px solid ${C.border}`, color: C.muted, verticalAlign: "middle" },
  shiftTag: { fontFamily: "monospace", fontSize: 11, color: C.text, background: C.inputBg, padding: "3px 8px", borderRadius: 4, border: `1px solid ${C.border}`, display: "inline-block" },
  wardPill: (v) => {
    const m = { blue: { background: C.blueLight, color: "#2a4db0" }, green: { background: C.greenLight, color: "#0d7040" }, amber: { background: C.amberLight, color: "#9a5e08" } };
    return { fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 10, display: "inline-block", ...m[v] };
  },
  statusBadge: (v) => {
    const m = { upcoming: { background: C.blueLight, color: "#2a4db0", border: `1px solid ${C.blueMid}` }, today: { background: C.greenLight, color: "#0d7040", border: "1px solid #c0f0d8" }, past: { background: C.inputBg, color: C.subtle, border: `1px solid ${C.border}` } };
    return { fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 0.3, ...m[v] };
  },
  emptyRow: { padding: "40px 18px", textAlign: "center", color: C.subtle, fontSize: 13 },
  btnGhost: { display: "flex", alignItems: "center", gap: 4, padding: "7px 13px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "transparent", color: C.muted, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "inherit" },
  btnRemove: { padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "transparent", border: "1px solid #fdd", color: C.red, cursor: "pointer", fontFamily: "inherit" },
};

function wardVariant(n = "") {
  const s = n.toLowerCase();
  if (s.includes("lochlea") || s.includes("low green")) return "green";
  if (s.includes("gatehouse")) return "amber";
  return "blue";
}
function initials(n = "") { return n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2); }
function shiftStatus(d) {
  const today = new Date(); today.setHours(0,0,0,0);
  const dt = new Date(d);
  if (dt.getTime() === today.getTime()) return "today";
  return dt > today ? "upcoming" : "past";
}
function fmtDate(d) { return new Date(d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }
function fmtShort(d) { return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); }
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
function toStr(date) { return date.toISOString().split("T")[0]; }
function getMondayOfWeek(date) {
  const d = new Date(date); d.setHours(0,0,0,0);
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
  d.setDate(d.getDate() + diff);
  return d;
}

function NavItem({ label, active, icon, badge, onClick }) {
  return (
    <div style={S.navItem(active)} onClick={onClick}>
      <span style={{ opacity: active ? 1 : 0.6, fontSize: 15 }}>{icon}</span>
      {label}
      {badge ? <span style={S.navBadge}>{badge}</span> : null}
    </div>
  );
}

function Toast({ message, type, onClose }) {
  const cols = { success: C.green, error: C.red, info: C.blue };
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${cols[type]}`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.text, boxShadow: "0 4px 16px rgba(0,0,0,.1)", zIndex: 9999, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ color: cols[type] }}>{type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
      {message}
      <button onClick={onClose} style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: C.subtle, fontSize: 14 }}>×</button>
    </div>
  );
}

// ── Availability Calendar ─────────────────────────────────────────────────────
function AvailabilityCalendar({ employeeId, employeeGender, toast }) {
  const [shifts, setShifts] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [weekStart, setWeekStart] = useState(() => getMondayOfWeek(new Date()));
  const [busy, setBusy] = useState(false);

  const fetchShifts = useCallback(async () => {
    try { setShifts((await axios.get(`${API}/shifts/upcoming`)).data); } catch {}
  }, []);

  const fetchAvail = useCallback(async () => {
    try { setAvailability((await axios.get(`${API}/availability`, { params: { employee_id: employeeId } })).data); } catch {}
  }, [employeeId]);

  useEffect(() => { fetchShifts(); fetchAvail(); }, [fetchShifts, fetchAvail]);

  const today = new Date(); today.setHours(0,0,0,0);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Deduplicate: one card per unique (date, ward, shift-type) — employee picks a slot, not a headcount record
  const shiftsByDate = {};
  shifts.forEach(s => {
    if (!shiftsByDate[s.date]) shiftsByDate[s.date] = [];
    const alreadyShown = shiftsByDate[s.date].some(
      x => x.ward_id === s.ward_id && x.start_time === s.start_time && x.end_time === s.end_time
    );
    if (!alreadyShown) shiftsByDate[s.date].push(s);
  });
  // Sort each day: Day shift (08:xx) before Night shift (20:xx), then by ward name
  Object.values(shiftsByDate).forEach(arr =>
    arr.sort((a, b) => a.start_time.localeCompare(b.start_time) || a.ward_name.localeCompare(b.ward_name))
  );

  function getEntry(shift) {
    return availability.find(a => a.date === shift.date && a.start_time === shift.start_time && a.end_time === shift.end_time && a.ward_id === shift.ward_id) || null;
  }

  // Returns true if the employee already has ANY availability submitted for this date
  function dateIsTaken(dateStr) {
    return availability.some(a => a.date === dateStr);
  }

  async function toggle(shift) {
    if (busy) return;
    setBusy(true);
    const entry = getEntry(shift);
    try {
      if (entry) {
        await axios.delete(`${API}/availability/${entry.availability_id}`);
        toast("Availability removed", "info");
      } else {
        await axios.post(`${API}/availability`, { employee_id: employeeId, date: shift.date, start_time: shift.start_time, end_time: shift.end_time, ward_id: shift.ward_id });
        toast("Availability saved ✓", "success");
      }
      await fetchAvail();
    } catch (e) { toast(e.response?.data?.detail || "Failed", "error"); }
    setBusy(false);
  }

  const isPrevDisabled = weekStart <= getMondayOfWeek(new Date());

  return (
    <div>
      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 20 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: C.greenLight, border: `1.5px solid ${C.green}`, display: "inline-block" }} />
            Available — click to remove
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: C.surface, border: `1.5px dashed ${C.border}`, display: "inline-block" }} />
            Click to mark available
          </span>
          {employeeGender && (
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: C.redLight, border: "1px solid #fcc", display: "inline-block" }} />
              Not eligible
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {availability.length > 0 && (
            <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>{availability.length} slot{availability.length !== 1 ? "s" : ""} submitted</span>
          )}
          <button style={{ ...S.btnGhost, opacity: isPrevDisabled ? 0.4 : 1, cursor: isPrevDisabled ? "default" : "pointer" }} onClick={() => !isPrevDisabled && setWeekStart(d => addDays(d, -7))}>‹ Prev</button>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.text, minWidth: 190, textAlign: "center" }}>
            {fmtShort(toStr(weekStart))} – {fmtShort(toStr(addDays(weekStart, 6)))}
          </span>
          <button style={S.btnGhost} onClick={() => setWeekStart(d => addDays(d, 7))}>Next ›</button>
        </div>
      </div>

      {/* 7-column calendar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 24 }}>
        {weekDays.map(day => {
          const dateStr = toStr(day);
          const isPast = day < today;
          const isToday = day.getTime() === today.getTime();
          const dayShifts = shiftsByDate[dateStr] || [];

          return (
            <div key={dateStr} style={{ background: isToday ? "#f8f9ff" : C.surface, border: `1px solid ${isToday ? C.blueMid : C.border}`, borderRadius: 10, overflow: "hidden", opacity: isPast ? 0.45 : 1 }}>
              {/* Day header */}
              <div style={{ padding: "10px 8px 8px", borderBottom: `1px solid ${C.border}`, background: isToday ? C.blueLight : C.inputBg, textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: isToday ? C.blue : C.subtle, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {day.toLocaleDateString("en-GB", { weekday: "short" })}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: isToday ? C.blue : C.text, lineHeight: 1.2, marginTop: 2 }}>{day.getDate()}</div>
                <div style={{ fontSize: 10, color: C.subtle }}>{day.toLocaleDateString("en-GB", { month: "short" })}</div>
              </div>

              {/* Shift cards */}
              <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 5, minHeight: 90 }}>
                {dayShifts.length === 0
                  ? <div style={{ fontSize: 10, color: C.subtle, textAlign: "center", paddingTop: 14 }}>—</div>
                  : dayShifts.map(shift => {
                      const isAvail   = getEntry(shift) !== null;
                      const eligible  = !employeeGender || shift.ward_gender === employeeGender;
                      const dayTaken  = dateIsTaken(dateStr);
                      // Locked = another shift on this day is already picked (and this one isn't it)
                      const locked    = !isAvail && dayTaken;
                      const clickable = !isPast && eligible && !locked;

                      let borderColor = eligible ? C.border : "#fcc";
                      if (isAvail) borderColor = C.green;
                      if (locked)  borderColor = C.border;

                      let bgColor = eligible ? C.surface : C.redLight;
                      if (isAvail) bgColor = C.greenLight;
                      if (locked)  bgColor = C.inputBg;

                      let titleText = isAvail ? "Click to remove" : `Mark available for ${shift.ward_name}`;
                      if (!eligible) titleText = `Ward requires ${shift.ward_gender} staff`;
                      if (locked)    titleText = "Already picked a shift for this day";

                      return (
                        <div
                          key={shift.shift_id}
                          onClick={() => clickable && toggle(shift)}
                          title={titleText}
                          style={{
                            padding: "6px 7px", borderRadius: 6,
                            border: isAvail ? `1.5px solid ${borderColor}` : `1.5px dashed ${borderColor}`,
                            background: bgColor,
                            cursor: clickable ? "pointer" : "default",
                            opacity: locked ? 0.4 : 1,
                            transition: "background .1s, opacity .1s",
                          }}
                        >
                          <div style={{ fontSize: 9, color: isAvail ? "#0d7040" : C.subtle, marginBottom: 2 }}>
                            {shift.start_time.startsWith("08") ? "☀ Day" : "🌙 Night"}
                          </div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: isAvail ? C.green : eligible ? C.muted : C.red, marginBottom: 1 }}>
                            {isAvail ? "✓ " : ""}{shift.ward_name}
                          </div>
                          <div style={{ fontSize: 9, fontFamily: "monospace", color: isAvail ? "#0d7040" : C.subtle }}>
                            {shift.start_time.slice(0,5)}–{shift.end_time.slice(0,5)}
                          </div>
                          {!eligible && !locked && <div style={{ fontSize: 8, color: C.red, marginTop: 1 }}>not eligible</div>}
                        </div>
                      );
                    })
                }
              </div>
            </div>
          );
        })}
      </div>

      {/* Submitted list */}
      {availability.length > 0 ? (
        <div style={S.panel}>
          <div style={S.panelHeader}>
            <span style={S.panelTitle}>Submitted Availability</span>
            <span style={S.panelCount(true)}>{availability.length} slots</span>
          </div>
          <table style={S.table}>
            <thead><tr>{["Date","Ward","Time",""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {[...availability].sort((a,b) => a.date.localeCompare(b.date)).map(a => {
                const s = shifts.find(s => s.date === a.date && s.start_time === a.start_time && s.ward_id === a.ward_id);
                return (
                  <tr key={a.availability_id}>
                    <td style={{ ...S.td, fontWeight: 500, color: C.text }}>{fmtShort(a.date)}</td>
                    <td style={S.td}>{s ? <span style={S.wardPill(wardVariant(s.ward_name))}>{s.ward_name}</span> : `Ward ${a.ward_id}`}</td>
                    <td style={S.td}><span style={S.shiftTag}>{a.start_time.slice(0,5)} – {a.end_time.slice(0,5)}</span></td>
                    <td style={S.td}><button style={S.btnRemove} onClick={() => toggle({ date: a.date, start_time: a.start_time, end_time: a.end_time, ward_id: a.ward_id })}>Remove</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={S.panel}><div style={S.emptyRow}>No availability submitted yet — click a shift above to get started</div></div>
      )}
    </div>
  );
}

// ── Schedule View ─────────────────────────────────────────────────────────────
function ScheduleView({ assignments }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const upcoming = assignments.filter(a => new Date(a.date) >= today).sort((a,b) => new Date(a.date)-new Date(b.date));
  const wkStart = new Date(today); wkStart.setDate(today.getDate()-today.getDay());
  const wkEnd = addDays(wkStart, 6);
  const thisWeek = assignments.filter(a => { const d=new Date(a.date); return d>=wkStart&&d<=wkEnd; });
  const next = upcoming[0] || null;

  return (
    <>
      {next ? (
        <div style={S.nextShiftCard}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, opacity: 0.75, marginBottom: 10 }}>
            {shiftStatus(next.date) === "today" ? "🟢 Shift Today" : "Next Upcoming Shift"}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, marginBottom: 4 }}>{fmtDate(next.date)}</div>
          <div style={{ fontSize: 14, opacity: 0.85, fontFamily: "monospace" }}>{next.start_time} – {next.end_time}</div>
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>🏥 {next.ward_name}</div>
        </div>
      ) : (
        <div style={{ ...S.panel, marginBottom: 16 }}><div style={S.emptyRow}>No upcoming shifts scheduled</div></div>
      )}

      <div style={S.statsGrid}>
        {[
          { dot: C.blue, label: "Upcoming", val: upcoming.length, sub: "Scheduled shifts", color: C.blue },
          { dot: C.green, label: "This Week", val: thisWeek.length, sub: "Shifts this week", color: C.green },
          { dot: C.subtle, label: "Total", val: assignments.length, sub: "All time", color: C.muted },
        ].map(({ dot, label, val, sub, color }) => (
          <div key={label} style={S.statCard}>
            <div style={S.statLabel}><span style={S.statDot(dot)} />{label}</div>
            <div style={S.statValue(color)}>{val}</div>
            <div style={S.statSub}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={S.panel}>
        <div style={S.panelHeader}>
          <span style={S.panelTitle}>Upcoming Shifts</span>
          <span style={S.panelCount(upcoming.length > 0)}>{upcoming.length} scheduled</span>
        </div>
        {upcoming.length === 0 ? <div style={S.emptyRow}>No upcoming shifts — check back later</div> : (
          <table style={S.table}>
            <thead><tr>{["Date","Ward","Time","Status"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {upcoming.map(a => (
                <tr key={a.assignment_id}>
                  <td style={{ ...S.td, fontWeight: 500, color: C.text }}>{fmtDate(a.date)}</td>
                  <td style={S.td}><span style={S.wardPill(wardVariant(a.ward_name))}>{a.ward_name}</span></td>
                  <td style={S.td}><span style={S.shiftTag}>{a.start_time} – {a.end_time}</span></td>
                  <td style={S.td}><span style={S.statusBadge(shiftStatus(a.date))}>{shiftStatus(a.date)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ── History View ──────────────────────────────────────────────────────────────
function HistoryView({ assignments }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const past = assignments.filter(a => new Date(a.date) < today).sort((a,b) => new Date(b.date)-new Date(a.date));
  return (
    <div style={S.panel}>
      <div style={S.panelHeader}>
        <span style={S.panelTitle}>Past Shifts</span>
        <span style={S.panelCount(false)}>{past.length} completed</span>
      </div>
      {past.length === 0 ? <div style={S.emptyRow}>No shift history yet</div> : (
        <table style={S.table}>
          <thead><tr>{["Date","Ward","Time","Status"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>
            {past.map(a => (
              <tr key={a.assignment_id}>
                <td style={{ ...S.td, color: C.muted }}>{fmtDate(a.date)}</td>
                <td style={S.td}><span style={S.wardPill(wardVariant(a.ward_name))}>{a.ward_name}</span></td>
                <td style={S.td}><span style={S.shiftTag}>{a.start_time} – {a.end_time}</span></td>
                <td style={S.td}><span style={S.statusBadge("past")}>Completed</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const [view, setView] = useState("schedule");
  const [assignments, setAssignments] = useState([]);
  const [availCount, setAvailCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);

  const name   = localStorage.getItem("username") || "Employee";
  const userId = localStorage.getItem("user_id");
  const gender = localStorage.getItem("gender") || "";

  const toast = useCallback((msg, type = "info") => setToastMsg({ message: msg, type }), []);

  const fetchAssignments = useCallback(async () => {
    try { setAssignments((await axios.get(`${API}/assignments`, { params: { employee_id: userId } })).data); }
    catch {}
    setLoading(false);
  }, [userId]);

  const refreshAvailCount = useCallback(async () => {
    try { setAvailCount((await axios.get(`${API}/availability`, { params: { employee_id: userId } })).data.length); }
    catch {}
  }, [userId]);

  useEffect(() => { fetchAssignments(); refreshAvailCount(); }, [fetchAssignments, refreshAvailCount]);

  const TITLES = { schedule: "My Schedule", availability: "Set Availability", history: "Shift History" };

  return (
    <div style={S.wrapper}>
      <aside style={S.sidebar}>
        <div style={S.sidebarLogo}>
          <div style={S.logoIcon}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M2 4h12v1.5H2zm0 3h12v1.5H2zm0 3h8v1.5H2z"/></svg>
          </div>
          <div><div style={S.logoText}>RosterOS</div><div style={S.logoSub}>My Portal</div></div>
        </div>

        <nav style={S.sidebarNav}>
          <div style={S.navSection}>My Work</div>
          <NavItem label="My Schedule"      active={view==="schedule"}     icon="📅" onClick={() => setView("schedule")} />
          <NavItem label="Set Availability" active={view==="availability"} icon="✅" badge={availCount||null} onClick={() => setView("availability")} />
          <NavItem label="Shift History"    active={view==="history"}      icon="🕐" onClick={() => setView("history")} />
        </nav>

        <div style={S.sidebarFooter}>
          <div style={S.userRow}>
            <div style={S.userAvatar}>{initials(name)}</div>
            <div><div style={S.userName}>{name}</div><div style={S.userRole}>Staff Member</div></div>
          </div>
          <button style={S.logoutBtn} onClick={() => { localStorage.clear(); window.location.href = "/"; }}>Sign Out</button>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={S.topbar}>
          <div>
            <span style={S.topbarTitle}>{TITLES[view]}</span>
            <span style={S.topbarSub}>/ {name}</span>
          </div>
          {view === "availability" && (
            <div style={S.topbarActions}>
              <span style={{ fontSize: 12, color: C.subtle }}>Click a shift card to toggle your availability</span>
            </div>
          )}
        </div>

        <div style={S.content}>
          {loading
            ? <div style={{ padding: 40, textAlign: "center", color: C.subtle }}>Loading…</div>
            : <>
                {view === "schedule"     && <ScheduleView assignments={assignments} />}
                {view === "availability" && <AvailabilityCalendar employeeId={parseInt(userId)} employeeGender={gender} toast={toast} />}
                {view === "history"      && <HistoryView assignments={assignments} />}
              </>
          }
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg.message} type={toastMsg.type} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
