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
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 6, fontSize: 13, fontWeight: 500, color: active ? C.blue : C.muted, background: active ? C.blueLight : "transparent", cursor: "pointer", marginBottom: 2, transition: "all .15s", userSelect: "none" }),
  navBadge: { marginLeft: "auto", background: C.red, color: "white", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10 },
  sidebarFooter: { padding: "14px 10px", borderTop: `1px solid ${C.border}` },
  userRow: { display: "flex", alignItems: "center", gap: 9, padding: 8 },
  userAvatar: { width: 30, height: 30, borderRadius: "50%", background: C.blueLight, border: `1.5px solid ${C.blueMid}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.blue, flexShrink: 0 },
  userName: { fontSize: 12, fontWeight: 600, color: C.text },
  userRole: { fontSize: 10, color: C.subtle },
  topbar: { height: 56, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 },
  topbarTitle: { fontSize: 15, fontWeight: 600, letterSpacing: -0.2, color: C.text },
  topbarSub: { fontSize: 12, color: C.subtle, marginLeft: 4 },
  topbarActions: { marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" },
  btnPrimary: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: C.blue, color: "white", border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
  btnGhost: { display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "transparent", color: C.muted, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "inherit" },
  btnDanger: { padding: "4px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "transparent", border: "1px solid #fdd", color: C.red, cursor: "pointer", fontFamily: "inherit" },
  content: { padding: 24, flex: 1, overflowY: "auto" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 },
  statCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px" },
  statLabel: { fontSize: 10, fontWeight: 700, color: C.subtle, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 },
  statDot: (color) => ({ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }),
  statValue: (color) => ({ fontSize: 28, fontWeight: 600, letterSpacing: -1, lineHeight: 1, fontFamily: "monospace", color }),
  statSub: { fontSize: 11, color: C.subtle, marginTop: 6 },
  barTrack: { height: 3, background: "#e8eaf2", borderRadius: 2, marginTop: 10, overflow: "hidden" },
  barFill: (w, color) => ({ height: "100%", width: `${w}%`, borderRadius: 2, background: color }),
  panel: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 16 },
  panelHeader: { padding: "13px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface },
  panelTitle: { fontSize: 13, fontWeight: 600, color: C.text },
  panelCount: (danger) => ({ fontSize: 11, color: danger ? "#b02020" : C.subtle, background: danger ? C.redLight : C.inputBg, padding: "2px 8px", borderRadius: 10, border: `1px solid ${danger ? "#fdd" : C.border}` }),
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  th: { padding: "9px 18px", textAlign: "left", fontSize: 10, fontWeight: 700, color: C.subtle, textTransform: "uppercase", letterSpacing: 0.6, background: C.inputBg, borderBottom: `1px solid ${C.border}` },
  td: { padding: "11px 18px", borderBottom: `1px solid ${C.border}`, color: C.muted, verticalAlign: "middle" },
  empChip: { display: "inline-flex", alignItems: "center", gap: 7 },
  empAvatar: { width: 23, height: 23, borderRadius: "50%", background: C.blueLight, border: `1px solid ${C.blueMid}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: C.blue, flexShrink: 0 },
  shiftTag: { fontFamily: "monospace", fontSize: 11, color: C.text, background: C.inputBg, padding: "3px 8px", borderRadius: 4, border: `1px solid ${C.border}`, display: "inline-block" },
  wardPill: (variant) => {
    const map = { blue: { background: C.blueLight, color: "#2a4db0" }, green: { background: C.greenLight, color: "#0d7040" }, amber: { background: C.amberLight, color: "#9a5e08" } };
    return { fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 10, display: "inline-block", ...map[variant] };
  },
  badge: (variant) => {
    const map = {
      critical: { background: C.redLight, color: "#b02020", border: "1px solid #fdd" },
      upcoming: { background: C.amberLight, color: "#9a5e08", border: "1px solid #ffe0b0" },
    };
    return { fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 0.3, ...map[variant] };
  },
  formPanel: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 },
  formLabel: { fontSize: 10, fontWeight: 700, color: C.subtle, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12 },
  formRow: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  inp: { background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 11px", fontSize: 12, color: C.text, fontFamily: "inherit", outline: "none" },
  emptyRow: { padding: "32px 18px", textAlign: "center", color: C.subtle, fontSize: 12 },
  skillPill: { fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 10, background: "#f0f4ff", color: C.blue, display: "inline-block" },
  genderPill: (g) => ({ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 10, display: "inline-block", ...(g === "female" ? { background: "#fff0f8", color: "#b02070" } : { background: "#f0f8ff", color: "#1060a0" }) }),
};

function wardVariant(name = "") {
  const n = name.toLowerCase();
  if (n.includes("lochlea") || n.includes("low green")) return "green";
  if (n.includes("gatehouse")) return "amber";
  return "blue";
}
function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function Toast({ message, type, onClose }) {
  const colors = { success: C.green, error: C.red, info: C.blue };
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${colors[type] || C.blue}`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.text, boxShadow: "0 4px 16px rgba(0,0,0,.1)", zIndex: 9999, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ color: colors[type] }}>{type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
      {message}
      <button onClick={onClose} style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: C.subtle, fontSize: 14 }}>×</button>
    </div>
  );
}

function NavItem({ label, active, badge, icon, onClick }) {
  return (
    <div style={S.navItem(active)} onClick={onClick}>
      <span style={{ opacity: active ? 1 : 0.6, fontSize: 15 }}>{icon}</span>
      {label}
      {badge ? <span style={S.navBadge}>{badge}</span> : null}
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998 }}>
      <div style={{ background: C.surface, borderRadius: 10, padding: 24, width: 340, boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
        <div style={{ fontSize: 14, color: C.text, marginBottom: 20 }}>{message}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button style={S.btnGhost} onClick={onCancel}>Cancel</button>
          <button style={{ ...S.btnPrimary, background: C.red }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Page 1: Overview ─────────────────────────────────────────────────────────
function OverviewPage({ assignments, uncovered, generating, generateSchedule, onNavigate }) {
  const [confirm, setConfirm] = useState(null);
  const totalShifts = assignments.length + uncovered.length;
  const coverage = totalShifts ? Math.round((assignments.length / totalShifts) * 100) : 0;

  const deleteAssignment = async (id) => {
    try { await axios.delete(`${API}/assignments/${id}`); }
    catch { /* handled by parent refresh */ }
    setConfirm(null);
  };

  return (
    <>
      {/* Stats */}
      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <div style={S.statLabel}><span style={S.statDot(C.blue)} />Total Shifts</div>
          <div style={S.statValue(C.text)}>{totalShifts}</div>
          <div style={S.statSub}>This scheduling period</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}><span style={S.statDot(C.green)} />Covered</div>
          <div style={S.statValue(C.green)}>{assignments.length}</div>
          <div style={S.statSub}>Assigned to staff</div>
          <div style={S.barTrack}><div style={S.barFill(coverage, C.green)} /></div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}><span style={S.statDot(C.red)} />Uncovered</div>
          <div style={S.statValue(C.red)}>{uncovered.length}</div>
          <div style={S.statSub}>Needs assignment</div>
          <div style={S.barTrack}><div style={S.barFill(100 - coverage, C.red)} /></div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}><span style={S.statDot(C.amber)} />Coverage</div>
          <div style={S.statValue(C.amber)}>{coverage}%</div>
          <div style={S.statSub}>Target: 95%</div>
          <div style={S.barTrack}><div style={S.barFill(coverage, C.amber)} /></div>
        </div>
      </div>

      {/* Navigation cards to page 2 & 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div
          onClick={() => onNavigate("manual-assign")}
          style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "box-shadow .15s" }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(59,110,248,.12)"}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
        >
          <div style={{ width: 44, height: 44, borderRadius: 10, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>★</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>Manual Assignment</div>
            <div style={{ fontSize: 12, color: C.subtle }}>Assign employees to uncovered shifts manually</div>
          </div>
          <span style={{ marginLeft: "auto", color: C.subtle, fontSize: 16 }}>›</span>
        </div>

        <div
          onClick={() => onNavigate("uncovered")}
          style={{ background: C.surface, border: `1px solid ${uncovered.length > 0 ? "#fdd" : C.border}`, borderRadius: 10, padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "box-shadow .15s" }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(224,53,53,.1)"}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
        >
          <div style={{ width: 44, height: 44, borderRadius: 10, background: uncovered.length > 0 ? C.redLight : C.inputBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⚠</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>
              Uncovered Shifts
              {uncovered.length > 0 && <span style={{ marginLeft: 8, background: C.red, color: "white", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10 }}>{uncovered.length}</span>}
            </div>
            <div style={{ fontSize: 12, color: C.subtle }}>View and manage all unassigned shifts</div>
          </div>
          <span style={{ marginLeft: "auto", color: C.subtle, fontSize: 16 }}>›</span>
        </div>
      </div>

      {/* Assignments table */}
      <div style={S.panel}>
        <div style={S.panelHeader}>
          <span style={S.panelTitle}>All Assignments</span>
          <span style={S.panelCount(false)}>{assignments.length} total</span>
        </div>
        {assignments.length === 0 ? (
          <div style={S.emptyRow}>No assignments yet — generate a schedule or assign manually</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>{["Employee", "Ward", "Date", "Time", ""].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.assignment_id}>
                  <td style={S.td}>
                    <div style={S.empChip}>
                      <div style={S.empAvatar}>{initials(a.employee_name)}</div>
                      <span style={{ color: C.text, fontWeight: 500 }}>{a.employee_name}</span>
                    </div>
                  </td>
                  <td style={S.td}><span style={S.wardPill(wardVariant(a.ward_name))}>{a.ward_name}</span></td>
                  <td style={{ ...S.td, fontFamily: "monospace", fontSize: 12 }}>{a.date}</td>
                  <td style={S.td}><span style={S.shiftTag}>{a.start_time} – {a.end_time}</span></td>
                  <td style={S.td}>
                    <button style={S.btnDanger} onClick={() => setConfirm({ id: a.assignment_id, emp: a.employee_name })}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {confirm && (
        <ConfirmDialog
          message={`Remove assignment for "${confirm.emp}"?`}
          onConfirm={() => deleteAssignment(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}

// ─── Page 2: Manual Assignment ────────────────────────────────────────────────
function ManualAssignPage({ uncovered, employees, fetchAssignments, fetchUncovered, toast }) {
  const [empId, setEmpId] = useState("");
  const [shiftId, setShiftId] = useState("");

  const filteredEmployees = employees.filter((e) => {
    const shift = uncovered.find((s) => s.shift_id == shiftId);
    if (!shift) return true;
    return e.gender === shift.gender;
  });

  const selectedShift = uncovered.find((s) => s.shift_id == shiftId);

  const assign = async () => {
    if (!empId || !shiftId) { toast("Select both a shift and an employee", "error"); return; }
    try {
      await axios.post(`${API}/assignments`, { employee_id: parseInt(empId), shift_id: parseInt(shiftId) });
      toast("Assigned successfully", "success");
      setEmpId(""); setShiftId("");
      fetchAssignments(); fetchUncovered();
    } catch { toast("Assignment failed — check availability or conflicts", "error"); }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
      {/* Left: form */}
      <div>
        <div style={{ ...S.panel, overflow: "visible" }}>
          <div style={S.panelHeader}>
            <span style={S.panelTitle}>Assign an Employee</span>
          </div>
          <div style={{ padding: "20px 20px" }}>
            {/* Step 1: pick shift */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ ...S.formLabel, marginBottom: 8 }}>Step 1 — Select an uncovered shift</div>
              <select value={shiftId} onChange={(e) => { setShiftId(e.target.value); setEmpId(""); }} style={{ ...S.inp, width: "100%" }}>
                <option value="">Choose a shift…</option>
                {uncovered.map((s) => (
                  <option key={s.shift_id} value={s.shift_id}>
                    #{s.shift_id} · {s.ward_name} · {s.date} · {s.start_time}–{s.end_time}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected shift info */}
            {selectedShift && (
              <div style={{ background: C.blueLight, border: `1px solid ${C.blueMid}`, borderRadius: 8, padding: "12px 14px", marginBottom: 20, fontSize: 12 }}>
                <div style={{ fontWeight: 600, color: C.blue, marginBottom: 6 }}>Selected Shift Details</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, color: C.muted }}>
                  <span><b>Ward:</b> {selectedShift.ward_name}</span>
                  <span><b>Date:</b> {selectedShift.date}</span>
                  <span><b>Time:</b> {selectedShift.start_time} – {selectedShift.end_time}</span>
                  <span><b>Requires:</b> <span style={S.genderPill(selectedShift.gender)}>{selectedShift.gender}</span></span>
                </div>
              </div>
            )}

            {/* Step 2: pick employee */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ ...S.formLabel, marginBottom: 8 }}>
                Step 2 — Select an employee {shiftId ? `(${filteredEmployees.length} eligible)` : ""}
              </div>
              <select value={empId} onChange={(e) => setEmpId(e.target.value)} style={{ ...S.inp, width: "100%" }} disabled={!shiftId}>
                <option value="">{shiftId ? "Choose an employee…" : "Select a shift first"}</option>
                {filteredEmployees.map((e) => (
                  <option key={e.employee_id} value={e.employee_id}>
                    {e.name} · {e.skill} · {e.gender}
                  </option>
                ))}
              </select>
            </div>

            <button
              style={{ ...S.btnPrimary, width: "100%", justifyContent: "center", padding: "10px", fontSize: 13, opacity: (!empId || !shiftId) ? 0.5 : 1 }}
              onClick={assign}
              disabled={!empId || !shiftId}
            >
              Confirm Assignment
            </button>
          </div>
        </div>
      </div>

      {/* Right: uncovered list for reference */}
      <div style={S.panel}>
        <div style={S.panelHeader}>
          <span style={S.panelTitle}>Open Shifts</span>
          <span style={S.panelCount(uncovered.length > 0)}>{uncovered.length} open</span>
        </div>
        {uncovered.length === 0 ? (
          <div style={S.emptyRow}>All shifts covered ✓</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>{["ID", "Ward", "Date"].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {uncovered.map((s) => {
                const critical = new Date(s.date) <= new Date();
                return (
                  <tr
                    key={s.shift_id}
                    onClick={() => { setShiftId(String(s.shift_id)); setEmpId(""); }}
                    style={{ cursor: "pointer", background: shiftId == s.shift_id ? C.blueLight : "transparent" }}
                  >
                    <td style={{ ...S.td, fontFamily: "monospace", color: C.subtle, borderLeft: critical ? `2px solid ${C.red}` : "none" }}>#{s.shift_id}</td>
                    <td style={S.td}><span style={S.wardPill(wardVariant(s.ward_name))}>{s.ward_name}</span></td>
                    <td style={{ ...S.td, fontFamily: "monospace", fontSize: 12 }}>{s.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Page 3: Uncovered Shifts ─────────────────────────────────────────────────
function UncoveredPage({ uncovered, onNavigate }) {
  const critical = uncovered.filter((s) => new Date(s.date) <= new Date());
  const upcoming = uncovered.filter((s) => new Date(s.date) > new Date());

  return (
    <>
      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div style={S.statCard}>
          <div style={S.statLabel}><span style={S.statDot(C.red)} />Critical</div>
          <div style={S.statValue(C.red)}>{critical.length}</div>
          <div style={S.statSub}>Past due — needs immediate attention</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}><span style={S.statDot(C.amber)} />Upcoming</div>
          <div style={S.statValue(C.amber)}>{upcoming.length}</div>
          <div style={S.statSub}>Future shifts still unassigned</div>
        </div>
      </div>

      {/* Assign CTA */}
      {uncovered.length > 0 && (
        <div style={{ background: C.blueLight, border: `1px solid ${C.blueMid}`, borderRadius: 10, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#2a4db0" }}>
            {uncovered.length} shift{uncovered.length !== 1 ? "s" : ""} need assignment
          </span>
          <button style={S.btnPrimary} onClick={() => onNavigate("manual-assign")}>
            Go to Manual Assignment →
          </button>
        </div>
      )}

      {/* Full table */}
      <div style={S.panel}>
        <div style={S.panelHeader}>
          <span style={S.panelTitle}>All Uncovered Shifts</span>
          <span style={S.panelCount(uncovered.length > 0)}>{uncovered.length} open</span>
        </div>
        {uncovered.length === 0 ? (
          <div style={S.emptyRow}>All shifts are covered ✓</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>{["Shift ID", "Date", "Time", "Ward", "Gender Req.", "Status"].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {uncovered.map((s) => {
                const isCritical = new Date(s.date) <= new Date();
                return (
                  <tr key={s.shift_id}>
                    <td style={{ ...S.td, fontFamily: "monospace", color: C.subtle, borderLeft: isCritical ? `2px solid ${C.red}` : "none" }}>#{s.shift_id}</td>
                    <td style={{ ...S.td, fontFamily: "monospace", fontSize: 12 }}>{s.date}</td>
                    <td style={S.td}><span style={S.shiftTag}>{s.start_time} – {s.end_time}</span></td>
                    <td style={S.td}><span style={S.wardPill(wardVariant(s.ward_name))}>{s.ward_name}</span></td>
                    <td style={S.td}><span style={S.genderPill(s.gender)}>{s.gender}</span></td>
                    <td style={S.td}><span style={S.badge(isCritical ? "critical" : "upcoming")}>{isCritical ? "Critical" : "Upcoming"}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ─── Employees view (unchanged) ───────────────────────────────────────────────
function EmployeesView({ employees, fetchEmployees, toast }) {
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [maxHours, setMaxHours] = useState("");
  const [gender, setGender] = useState("male");
  const [confirm, setConfirm] = useState(null);

  const addEmployee = async () => {
    if (!name || !skill || !maxHours) { toast("Fill in all fields", "error"); return; }
    try {
      await axios.post(`${API}/employees`, { name, skill, max_hours: parseInt(maxHours), gender });
      toast("Employee added", "success");
      setName(""); setSkill(""); setMaxHours(""); setGender("male");
      fetchEmployees();
    } catch { toast("Failed to add employee", "error"); }
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`${API}/employees/${id}`); toast("Employee removed", "success"); fetchEmployees(); }
    catch { toast("Delete failed", "error"); }
    setConfirm(null);
  };

  return (
    <>
      <div style={S.formPanel}>
        <div style={S.formLabel}>Add New Employee</div>
        <div style={S.formRow}>
          <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} style={{ ...S.inp, width: 160 }} />
          <input placeholder="Skill (e.g. RN, HCA)" value={skill} onChange={(e) => setSkill(e.target.value)} style={{ ...S.inp, width: 130 }} />
          <input type="number" placeholder="Max hours/wk" value={maxHours} onChange={(e) => setMaxHours(e.target.value)} style={{ ...S.inp, width: 120 }} />
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={S.inp}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <button style={S.btnPrimary} onClick={addEmployee}>Add Employee</button>
        </div>
      </div>
      <div style={S.panel}>
        <div style={S.panelHeader}>
          <span style={S.panelTitle}>All Employees</span>
          <span style={S.panelCount(false)}>{employees.length} staff</span>
        </div>
        {employees.length === 0 ? <div style={S.emptyRow}>No employees found</div> : (
          <table style={S.table}>
            <thead><tr>{["Name", "Skill", "Max Hours", "Gender", ""].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.employee_id}>
                  <td style={S.td}><div style={S.empChip}><div style={S.empAvatar}>{initials(e.name)}</div><span style={{ color: C.text, fontWeight: 500 }}>{e.name}</span></div></td>
                  <td style={S.td}><span style={S.skillPill}>{e.skill}</span></td>
                  <td style={{ ...S.td, fontFamily: "monospace" }}>{e.max_hours}h</td>
                  <td style={S.td}><span style={S.genderPill(e.gender)}>{e.gender}</span></td>
                  <td style={S.td}><button style={S.btnDanger} onClick={() => setConfirm({ id: e.employee_id, name: e.name })}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {confirm && <ConfirmDialog message={`Remove "${confirm.name}"?`} onConfirm={() => handleDelete(confirm.id)} onCancel={() => setConfirm(null)} />}
    </>
  );
}

// ─── Shifts view ──────────────────────────────────────────────────────────────
const DAY_START   = "08:00";
const DAY_END     = "20:00";
const NIGHT_START = "20:00";
const NIGHT_END   = "08:00";

function StepButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${C.border}`, background: C.inputBg, color: C.muted, cursor: "pointer", fontSize: 13, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "inherit" }}
    >
      {children}
    </button>
  );
}

function CountStepper({ value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
      <StepButton onClick={() => onChange(Math.max(0, value - 1))}>−</StepButton>
      <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 600, color: value > 0 ? C.text : C.subtle, minWidth: 18, textAlign: "center" }}>{value}</span>
      <StepButton onClick={() => onChange(value + 1)}>+</StepButton>
    </div>
  );
}

function getDatesInRange(from, to) {
  const dates = [];
  const cur = new Date(from + "T00:00:00");
  const end = new Date(to   + "T00:00:00");
  while (cur <= end) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function ShiftsView({ wards, fetchUncovered, toast }) {
  const [shifts, setShifts]     = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate]     = useState("");
  const [confirm, setConfirm]   = useState(null);
  const [generating, setGenerating] = useState(false);

  // requirements[ward_id] = { day: N, night: N }
  const [req, setReq] = useState({});

  const fetchShifts = useCallback(async () => {
    try { setShifts((await axios.get(`${API}/shifts`)).data); } catch {}
  }, []);

  useEffect(() => { fetchShifts(); }, [fetchShifts]);

  // Initialise req when wards load
  useEffect(() => {
    if (wards.length && Object.keys(req).length === 0) {
      const init = {};
      wards.forEach((w) => { init[w.ward_id] = { day: 0, night: 0 }; });
      setReq(init);
    }
  }, [wards]);

  const setCount = (wardId, type, val) => {
    setReq((prev) => ({ ...prev, [wardId]: { ...prev[wardId], [type]: Math.max(0, val) } }));
  };

  // Preview calculation
  const dates    = fromDate && toDate && toDate >= fromDate ? getDatesInRange(fromDate, toDate) : fromDate ? [fromDate] : [];
  const totalDay   = wards.reduce((s, w) => s + (req[w.ward_id]?.day   || 0), 0);
  const totalNight = wards.reduce((s, w) => s + (req[w.ward_id]?.night || 0), 0);
  const totalShifts = (totalDay + totalNight) * dates.length;

  const generateShifts = async () => {
    if (dates.length === 0) { toast("Select at least a start date", "error"); return; }
    if (totalShifts === 0)  { toast("Set at least one staff requirement", "error"); return; }

    setGenerating(true);
    let created = 0;
    try {
      for (const date of dates) {
        for (const ward of wards) {
          const dayCount   = req[ward.ward_id]?.day   || 0;
          const nightCount = req[ward.ward_id]?.night || 0;
          const promises = [];
          for (let i = 0; i < dayCount;   i++) promises.push(axios.post(`${API}/shifts`, { date, start_time: DAY_START,   end_time: DAY_END,   ward_id: ward.ward_id }));
          for (let i = 0; i < nightCount; i++) promises.push(axios.post(`${API}/shifts`, { date, start_time: NIGHT_START, end_time: NIGHT_END, ward_id: ward.ward_id }));
          const results = await Promise.allSettled(promises);
          created += results.filter((r) => r.status === "fulfilled").length;
        }
      }
      toast(`${created} shift${created !== 1 ? "s" : ""} created successfully`, "success");
      fetchShifts();
      fetchUncovered();
    } catch {
      toast("Some shifts failed to create", "error");
    }
    setGenerating(false);
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`${API}/shifts/${id}`); toast("Shift deleted", "success"); fetchShifts(); fetchUncovered(); }
    catch { toast("Delete failed", "error"); }
    setConfirm(null);
  };

  const wardMap = Object.fromEntries(wards.map((w) => [w.ward_id, w]));
  const canGenerate = dates.length > 0 && totalShifts > 0;

  return (
    <>
      {/* ── Bulk Generator ── */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, background: C.inputBg, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Shift Requirements Generator</div>
            <div style={{ fontSize: 11, color: C.subtle, marginTop: 2 }}>Set the number of staff needed per ward for each shift type, then generate all at once</div>
          </div>
          {totalShifts > 0 && (
            <div style={{ fontSize: 12, color: C.blue, fontWeight: 600, background: C.blueLight, padding: "4px 12px", borderRadius: 8, border: `1px solid ${C.blueMid}` }}>
              {totalShifts} slot{totalShifts !== 1 ? "s" : ""} × {dates.length} day{dates.length !== 1 ? "s" : ""} = {totalShifts} shifts
            </div>
          )}
        </div>

        <div style={{ padding: 20 }}>
          {/* Date range row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.subtle, textTransform: "uppercase", letterSpacing: 0.6, width: 60 }}>From</div>
            <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); if (!toDate) setToDate(e.target.value); }} style={{ ...S.inp }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: C.subtle, textTransform: "uppercase", letterSpacing: 0.6 }}>To</div>
            <input type="date" value={toDate} min={fromDate} onChange={(e) => setToDate(e.target.value)} style={{ ...S.inp }} />
            {dates.length > 0 && (
              <span style={{ fontSize: 12, color: C.muted, background: C.inputBg, padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.border}` }}>
                {dates.length} day{dates.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Ward requirements grid */}
          {wards.length === 0 ? (
            <div style={{ padding: "20px 0", textAlign: "center", color: C.subtle, fontSize: 12 }}>
              No wards configured — add wards under Ward Management first
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ ...S.th, width: "30%", textAlign: "left" }}>Ward</th>
                  <th style={{ ...S.th, textAlign: "center" }}>
                    <div>☀ Day Shift</div>
                    <div style={{ fontSize: 9, fontWeight: 400, color: C.subtle, marginTop: 2 }}>08:00 – 20:00</div>
                  </th>
                  <th style={{ ...S.th, textAlign: "center" }}>
                    <div>🌙 Night Shift</div>
                    <div style={{ fontSize: 9, fontWeight: 400, color: C.subtle, marginTop: 2 }}>20:00 – 08:00</div>
                  </th>
                  <th style={{ ...S.th, textAlign: "center" }}>Staff/Day</th>
                  <th style={{ ...S.th, textAlign: "center" }}>Total Slots</th>
                </tr>
              </thead>
              <tbody>
                {wards.map((ward) => {
                  const d = req[ward.ward_id]?.day   || 0;
                  const n = req[ward.ward_id]?.night || 0;
                  const perDay = d + n;
                  const total  = perDay * dates.length;
                  return (
                    <tr key={ward.ward_id} style={{ background: perDay > 0 ? "#fafbff" : "transparent" }}>
                      <td style={{ ...S.td, borderLeft: perDay > 0 ? `3px solid ${C.blue}` : "3px solid transparent" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={S.wardPill(wardVariant(ward.name))}>{ward.name}</span>
                          <span style={S.genderPill(ward.gender)}>{ward.gender}</span>
                        </div>
                      </td>
                      <td style={{ ...S.td, textAlign: "center" }}>
                        <CountStepper value={d} onChange={(v) => setCount(ward.ward_id, "day", v)} />
                      </td>
                      <td style={{ ...S.td, textAlign: "center" }}>
                        <CountStepper value={n} onChange={(v) => setCount(ward.ward_id, "night", v)} />
                      </td>
                      <td style={{ ...S.td, textAlign: "center", fontFamily: "monospace", fontWeight: 600, color: perDay > 0 ? C.blue : C.subtle }}>
                        {perDay > 0 ? perDay : "—"}
                      </td>
                      <td style={{ ...S.td, textAlign: "center", fontFamily: "monospace", color: total > 0 ? C.text : C.subtle }}>
                        {total > 0 ? total : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Totals footer */}
              <tfoot>
                <tr style={{ background: C.inputBg }}>
                  <td style={{ ...S.td, fontWeight: 600, color: C.muted }}>Total</td>
                  <td style={{ ...S.td, textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: totalDay > 0 ? C.text : C.subtle }}>{totalDay > 0 ? totalDay : "—"}</td>
                  <td style={{ ...S.td, textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: totalNight > 0 ? C.text : C.subtle }}>{totalNight > 0 ? totalNight : "—"}</td>
                  <td style={{ ...S.td, textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: C.text }}>{totalDay + totalNight > 0 ? totalDay + totalNight : "—"}</td>
                  <td style={{ ...S.td, textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: totalShifts > 0 ? C.blue : C.subtle }}>{totalShifts > 0 ? totalShifts : "—"}</td>
                </tr>
              </tfoot>
            </table>
          )}

          {/* Generate button */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14 }}>
            <button
              style={{ ...S.btnPrimary, padding: "10px 24px", fontSize: 13, opacity: canGenerate && !generating ? 1 : 0.5 }}
              onClick={generateShifts}
              disabled={!canGenerate || generating}
            >
              {generating ? "Creating shifts…" : `Generate ${totalShifts > 0 ? totalShifts : ""} Shift${totalShifts !== 1 ? "s" : ""}`}
            </button>
            {canGenerate && (
              <span style={{ fontSize: 12, color: C.subtle }}>
                Will create {totalShifts} shift record{totalShifts !== 1 ? "s" : ""} across {dates.length} day{dates.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Existing shifts table ── */}
      <div style={S.panel}>
        <div style={S.panelHeader}>
          <span style={S.panelTitle}>All Shifts</span>
          <span style={S.panelCount(false)}>{shifts.length} shifts</span>
        </div>
        {shifts.length === 0 ? <div style={S.emptyRow}>No shifts created yet</div> : (
          <table style={S.table}>
            <thead>
              <tr>{["ID", "Date", "Type", "Time", "Ward", "Gender", ""].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {shifts.map((s) => {
                const ward = wardMap[s.ward_id];
                const isDay = s.start_time === "08:00:00";
                return (
                  <tr key={s.shift_id}>
                    <td style={{ ...S.td, fontFamily: "monospace", color: C.subtle }}>#{s.shift_id}</td>
                    <td style={{ ...S.td, fontFamily: "monospace", fontSize: 12 }}>{s.date}</td>
                    <td style={S.td}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: isDay ? "#fffbea" : "#f0f0ff", color: isDay ? "#8a6000" : "#3040a0" }}>
                        {isDay ? "☀ Day" : "🌙 Night"}
                      </span>
                    </td>
                    <td style={S.td}><span style={S.shiftTag}>{s.start_time.slice(0,5)} – {s.end_time.slice(0,5)}</span></td>
                    <td style={S.td}>{ward ? <span style={S.wardPill(wardVariant(ward.name))}>{ward.name}</span> : `Ward ${s.ward_id}`}</td>
                    <td style={S.td}>{ward ? <span style={S.genderPill(ward.gender)}>{ward.gender}</span> : "—"}</td>
                    <td style={S.td}><button style={S.btnDanger} onClick={() => setConfirm({ id: s.shift_id })}>Delete</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {confirm && <ConfirmDialog message={`Delete shift #${confirm.id}?`} onConfirm={() => handleDelete(confirm.id)} onCancel={() => setConfirm(null)} />}
    </>
  );
}

function WardsView({ wards, fetchWards, toast }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");
  const [confirm, setConfirm] = useState(null);

  const addWard = async () => {
    if (!name.trim()) { toast("Enter a ward name", "error"); return; }
    try {
      await axios.post(`${API}/wards`, { name: name.trim(), gender });
      toast(`Ward "${name.trim()}" added`, "success");
      setName("");
      setGender("Male");
      fetchWards();
    } catch (e) {
      toast(e.response?.data?.detail || "Failed to add ward", "error");
    }
  };

  const handleDelete = async (wardId, wardName) => {
    try {
      await axios.delete(`${API}/wards/${wardId}`);
      toast(`Ward "${wardName}" removed`, "success");
      fetchWards();
    } catch (e) {
      toast(e.response?.data?.detail || "Delete failed", "error");
    }
    setConfirm(null);
  };

  const femaleWards = wards.filter((w) => w.gender === "Female");
  const maleWards   = wards.filter((w) => w.gender === "Male");

  return (
    <>
      {/* Add ward form */}
      <div style={S.formPanel}>
        <div style={S.formLabel}>Add New Ward</div>
        <div style={S.formRow}>
          <input
            placeholder="Ward name (e.g. Ailsa)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addWard()}
            style={{ ...S.inp, width: 220 }}
          />
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={S.inp}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <button style={S.btnPrimary} onClick={addWard}>Add Ward</button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <div style={S.statCard}>
          <div style={S.statLabel}><span style={S.statDot("#b02070")} />Female Wards</div>
          <div style={S.statValue("#b02070")}>{femaleWards.length}</div>
          <div style={S.statSub}>{femaleWards.map((w) => w.name).join(", ") || "None"}</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}><span style={S.statDot("#1060a0")} />Male Wards</div>
          <div style={S.statValue("#1060a0")}>{maleWards.length}</div>
          <div style={S.statSub}>{maleWards.map((w) => w.name).join(", ") || "None"}</div>
        </div>
      </div>

      {/* Wards table */}
      <div style={S.panel}>
        <div style={S.panelHeader}>
          <span style={S.panelTitle}>All Wards</span>
          <span style={S.panelCount(false)}>{wards.length} wards</span>
        </div>
        {wards.length === 0 ? (
          <div style={S.emptyRow}>No wards added yet</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>{["ID", "Ward Name", "Gender Requirement", ""].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {wards.map((w) => (
                <tr key={w.ward_id}>
                  <td style={{ ...S.td, fontFamily: "monospace", color: C.subtle }}>#{w.ward_id}</td>
                  <td style={S.td}><span style={S.wardPill(wardVariant(w.name))}>{w.name}</span></td>
                  <td style={S.td}><span style={S.genderPill(w.gender)}>{w.gender}</span></td>
                  <td style={S.td}>
                    <button style={S.btnDanger} onClick={() => setConfirm({ id: w.ward_id, name: w.name })}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {confirm && (
        <ConfirmDialog
          message={`Remove ward "${confirm.name}"? This cannot be undone.`}
          onConfirm={() => handleDelete(confirm.id, confirm.name)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}

// ─── Page 4: Availability Monitor ────────────────────────────────────────────
function AvailabilityMonitorView({ employees, availability, fetchAvailability }) {
  const [selected, setSelected] = useState(null); // employee_id expanded

  // Group availability by employee
  const byEmployee = {};
  availability.forEach((a) => {
    if (!byEmployee[a.employee_id]) byEmployee[a.employee_id] = [];
    byEmployee[a.employee_id].push(a);
  });

  const submitted = employees.filter((e) => byEmployee[e.employee_id]?.length > 0);
  const notSubmitted = employees.filter((e) => !byEmployee[e.employee_id]?.length);

  const pct = employees.length ? Math.round((submitted.length / employees.length) * 100) : 0;

  return (
    <>
      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        <div style={S.statCard}>
          <div style={S.statLabel}><span style={S.statDot(C.green)} />Submitted</div>
          <div style={S.statValue(C.green)}>{submitted.length}</div>
          <div style={S.statSub}>Employees with availability</div>
          <div style={S.barTrack}><div style={S.barFill(pct, C.green)} /></div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}><span style={S.statDot(C.red)} />Pending</div>
          <div style={S.statValue(C.red)}>{notSubmitted.length}</div>
          <div style={S.statSub}>Haven't submitted yet</div>
          <div style={S.barTrack}><div style={S.barFill(100 - pct, C.red)} /></div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}><span style={S.statDot(C.blue)} />Total Slots</div>
          <div style={S.statValue(C.blue)}>{availability.length}</div>
          <div style={S.statSub}>Across all employees</div>
        </div>
      </div>

      {/* Pending employees alert */}
      {notSubmitted.length > 0 && (
        <div style={{ background: C.amberLight, border: "1px solid #ffe0b0", borderRadius: 10, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16 }}>⚠</span>
          <span style={{ fontSize: 13, color: "#7a4e00" }}>
            <b>{notSubmitted.length} employee{notSubmitted.length !== 1 ? "s" : ""}</b> haven't submitted availability yet:{" "}
            {notSubmitted.map((e) => e.name).join(", ")}
          </span>
        </div>
      )}

      {/* Per-employee table */}
      <div style={S.panel}>
        <div style={S.panelHeader}>
          <span style={S.panelTitle}>Availability by Employee</span>
          <button style={S.btnGhost} onClick={fetchAvailability}>↻ Refresh</button>
        </div>
        {employees.length === 0 ? (
          <div style={S.emptyRow}>No employees found</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>{["Employee", "Gender", "Slots Submitted", "Dates", "Status", ""].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const slots = byEmployee[emp.employee_id] || [];
                const isExpanded = selected === emp.employee_id;
                const hasSubmitted = slots.length > 0;
                const uniqueDates = [...new Set(slots.map((s) => s.date))].sort();

                return (
                  <>
                    <tr
                      key={emp.employee_id}
                      style={{ cursor: hasSubmitted ? "pointer" : "default", background: isExpanded ? C.blueLight : "transparent" }}
                      onClick={() => hasSubmitted && setSelected(isExpanded ? null : emp.employee_id)}
                    >
                      <td style={S.td}>
                        <div style={S.empChip}>
                          <div style={{ ...S.empAvatar, background: hasSubmitted ? C.greenLight : C.inputBg, color: hasSubmitted ? C.green : C.subtle, border: `1px solid ${hasSubmitted ? C.green : C.border}` }}>
                            {initials(emp.name)}
                          </div>
                          <span style={{ color: C.text, fontWeight: 500 }}>{emp.name}</span>
                        </div>
                      </td>
                      <td style={S.td}><span style={S.genderPill(emp.gender)}>{emp.gender}</span></td>
                      <td style={{ ...S.td, fontFamily: "monospace", fontWeight: 600, color: hasSubmitted ? C.green : C.subtle }}>
                        {hasSubmitted ? slots.length : "—"}
                      </td>
                      <td style={{ ...S.td, fontSize: 11, color: C.subtle }}>
                        {uniqueDates.length > 0
                          ? uniqueDates.length <= 3
                            ? uniqueDates.join(", ")
                            : `${uniqueDates.slice(0, 2).join(", ")} +${uniqueDates.length - 2} more`
                          : "—"}
                      </td>
                      <td style={S.td}>
                        {hasSubmitted
                          ? <span style={{ fontSize: 11, fontWeight: 700, color: C.green, background: C.greenLight, padding: "2px 8px", borderRadius: 10, border: `1px solid #a0e0c0` }}>✓ Submitted</span>
                          : <span style={{ fontSize: 11, fontWeight: 700, color: C.amber, background: C.amberLight, padding: "2px 8px", borderRadius: 10, border: "1px solid #ffe0b0" }}>Pending</span>
                        }
                      </td>
                      <td style={{ ...S.td, color: C.subtle, textAlign: "right" }}>
                        {hasSubmitted && <span style={{ fontSize: 12 }}>{isExpanded ? "▲" : "▼"}</span>}
                      </td>
                    </tr>

                    {/* Expanded rows */}
                    {isExpanded && slots.sort((a, b) => a.date.localeCompare(b.date)).map((slot) => (
                      <tr key={slot.availability_id} style={{ background: "#f5f8ff" }}>
                        <td style={{ ...S.td, paddingLeft: 40, color: C.subtle }} colSpan={2}>
                          <span style={{ fontSize: 10, color: C.blue }}>↳</span> {new Date(slot.date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                        </td>
                        <td style={S.td} colSpan={2}>
                          <span style={S.shiftTag}>{slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}</span>
                        </td>
                        <td style={S.td} colSpan={2}>
                          <span style={{ fontSize: 11, color: C.subtle }}>Ward {slot.ward_id}</span>
                        </td>
                      </tr>
                    ))}
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ─── View config ──────────────────────────────────────────────────────────────
const VIEW_LABELS = {
  overview: "Overview",
  "manual-assign": "Manual Assignment",
  uncovered: "Uncovered Shifts",
  employees: "Employees",
  shifts: "Shifts",
  wards: "Ward Management",
  availability: "Availability Monitor",
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [view, setView] = useState("overview");
  const [assignments, setAssignments] = useState([]);
  const [uncovered, setUncovered] = useState([]);
  const [wards, setWards] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const toast = useCallback((message, type = "info") => setToastMsg({ message, type }), []);

  const fetchAssignments  = useCallback(async () => { try { setAssignments((await axios.get(`${API}/assignments`)).data); } catch {} }, []);
  const fetchUncovered    = useCallback(async () => { try { setUncovered((await axios.get(`${API}/uncovered-shifts`)).data); } catch {} }, []);
  const fetchWards        = useCallback(async () => { try { setWards((await axios.get(`${API}/wards`)).data); } catch {} }, []);
  const fetchEmployees    = useCallback(async () => { try { setEmployees((await axios.get(`${API}/employees`)).data); } catch {} }, []);
  const fetchAvailability = useCallback(async () => { try { setAvailability((await axios.get(`${API}/availability`)).data); } catch {} }, []);

  useEffect(() => { fetchAssignments(); fetchUncovered(); fetchWards(); fetchEmployees(); fetchAvailability(); }, [fetchAssignments, fetchUncovered, fetchWards, fetchEmployees, fetchAvailability]);

  const generateSchedule = async () => {
    setGenerating(true);
    try { await axios.post(`${API}/generate-schedule`); toast("Schedule generated", "success"); fetchAssignments(); fetchUncovered(); }
    catch { toast("Schedule generation failed", "error"); }
    setGenerating(false);
  };

  const adminName = localStorage.getItem("username") || "Admin";

  return (
    <div style={S.wrapper}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={S.sidebarLogo}>
          <div style={S.logoIcon}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M2 4h12v1.5H2zm0 3h12v1.5H2zm0 3h8v1.5H2z" /></svg>
          </div>
          <div><div style={S.logoText}>RosterOS</div><div style={S.logoSub}>Admin Panel</div></div>
        </div>

        <nav style={S.sidebarNav}>
          <div style={S.navSection}>Overview</div>
          <NavItem label="Dashboard" active={view === "overview"} icon="⊞" onClick={() => setView("overview")} />
          <NavItem label="Employees" active={view === "employees"} icon="👤" onClick={() => setView("employees")} />

          <div style={S.navSection}>Scheduling</div>
          <NavItem label="Manual Assignment"    active={view === "manual-assign"} icon="★"  onClick={() => setView("manual-assign")} />
          <NavItem label="Uncovered Shifts"     active={view === "uncovered"}     icon="⚠"  badge={uncovered.length || null} onClick={() => setView("uncovered")} />
          <NavItem label="Shifts"               active={view === "shifts"}        icon="📅" onClick={() => setView("shifts")} />
          <NavItem label="Availability Monitor" active={view === "availability"}  icon="📋" badge={availability.length || null} onClick={() => setView("availability")} />

          <div style={S.navSection}>Wards</div>
          <NavItem label="Ward Mgmt" active={view === "wards"} icon="🏥" onClick={() => setView("wards")} />
        </nav>

        <div style={S.sidebarFooter}>
          <div style={S.userRow}>
            <div style={S.userAvatar}>{initials(adminName)}</div>
            <div><div style={S.userName}>{adminName}</div><div style={S.userRole}>Super Admin</div></div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={S.topbar}>
          <div>
            {view !== "overview" && (
              <button style={{ ...S.btnGhost, marginRight: 12, padding: "5px 10px" }} onClick={() => setView("overview")}>← Back</button>
            )}
            <span style={S.topbarTitle}>{VIEW_LABELS[view]}</span>
            <span style={S.topbarSub}>/ Admin</span>
          </div>
          <div style={S.topbarActions}>
            {view === "overview" && (
              <button style={S.btnPrimary} onClick={generateSchedule} disabled={generating}>
                {generating ? "Generating…" : "+ Generate Schedule"}
              </button>
            )}
          </div>
        </div>

        <div style={S.content}>
          {view === "overview"      && <OverviewPage assignments={assignments} uncovered={uncovered} generating={generating} generateSchedule={generateSchedule} onNavigate={setView} />}
          {view === "manual-assign" && <ManualAssignPage uncovered={uncovered} employees={employees} fetchAssignments={fetchAssignments} fetchUncovered={fetchUncovered} toast={toast} />}
          {view === "uncovered"     && <UncoveredPage uncovered={uncovered} onNavigate={setView} />}
          {view === "employees"     && <EmployeesView employees={employees} fetchEmployees={fetchEmployees} toast={toast} />}
          {view === "shifts"        && <ShiftsView wards={wards} fetchUncovered={fetchUncovered} toast={toast} />}
          {view === "wards"         && <WardsView wards={wards} fetchWards={fetchWards} toast={toast} />}
          {view === "availability"  && <AvailabilityMonitorView employees={employees} availability={availability} fetchAvailability={fetchAvailability} />}
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg.message} type={toastMsg.type} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
