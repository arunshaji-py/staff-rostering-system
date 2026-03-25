import { useEffect, useState } from "react";
import axios from "axios";

// ─── Design tokens ───────────────────────────────────────────────────────────
const styles = {
  // Layout
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f6fb",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    fontSize: "14px",
    color: "#1a1e2e",
  },

  // ── Sidebar ──────────────────────────────────────────────────────────────
  sidebar: {
    width: 220,
    minHeight: "100vh",
    background: "#ffffff",
    borderRight: "1px solid #e2e5ef",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  sidebarLogo: {
    padding: "20px 18px 16px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderBottom: "1px solid #e2e5ef",
  },
  logoIcon: {
    width: 28,
    height: 28,
    background: "#3b6ef8",
    borderRadius: 7,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: { fontSize: 14, fontWeight: 600, letterSpacing: -0.3, color: "#1a1e2e" },
  logoSub: {
    fontSize: 10,
    color: "#9299b0",
    fontFamily: "monospace",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sidebarNav: { padding: "14px 10px", flex: 1 },
  navSection: {
    fontSize: 10,
    fontWeight: 700,
    color: "#9299b0",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    padding: "0 8px",
    margin: "16px 0 6px",
  },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 10px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    color: active ? "#3b6ef8" : "#5a6380",
    background: active ? "#eef2ff" : "transparent",
    cursor: "pointer",
    marginBottom: 2,
    transition: "all .15s",
  }),
  navBadge: {
    marginLeft: "auto",
    background: "#e03535",
    color: "white",
    fontSize: 10,
    fontWeight: 700,
    padding: "1px 6px",
    borderRadius: 10,
  },
  sidebarFooter: { padding: "14px 10px", borderTop: "1px solid #e2e5ef" },
  userRow: { display: "flex", alignItems: "center", gap: 9, padding: 8 },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "#eef2ff",
    border: "1.5px solid #c0ccf8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    color: "#3b6ef8",
    flexShrink: 0,
  },
  userName: { fontSize: 12, fontWeight: 600, color: "#1a1e2e" },
  userRole: { fontSize: 10, color: "#9299b0" },

  // ── Topbar ────────────────────────────────────────────────────────────────
  topbar: {
    height: 56,
    background: "#ffffff",
    borderBottom: "1px solid #e2e5ef",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    gap: 16,
    flexShrink: 0,
  },
  topbarTitle: { fontSize: 15, fontWeight: 600, letterSpacing: -0.2, color: "#1a1e2e" },
  topbarSub: { fontSize: 12, color: "#9299b0", marginLeft: 4 },
  topbarActions: { marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" },

  // ── Buttons ───────────────────────────────────────────────────────────────
  btnPrimary: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    background: "#3b6ef8",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  btnGhost: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    background: "transparent",
    color: "#5a6380",
    border: "1px solid #d0d4e4",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnDanger: {
    padding: "4px 10px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    background: "transparent",
    border: "1px solid #fdd",
    color: "#e03535",
    cursor: "pointer",
    fontFamily: "inherit",
  },

  // ── Content ───────────────────────────────────────────────────────────────
  content: { padding: 24, flex: 1 },

  // ── Stat cards ────────────────────────────────────────────────────────────
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
    marginBottom: 20,
  },
  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e5ef",
    borderRadius: 10,
    padding: "18px 20px",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#9299b0",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  statDot: (color) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: color,
    flexShrink: 0,
  }),
  statValue: (color) => ({
    fontSize: 28,
    fontWeight: 600,
    letterSpacing: -1,
    lineHeight: 1,
    fontFamily: "monospace",
    color,
  }),
  statSub: { fontSize: 11, color: "#9299b0", marginTop: 6 },
  barTrack: {
    height: 3,
    background: "#e8eaf2",
    borderRadius: 2,
    marginTop: 10,
    overflow: "hidden",
  },
  barFill: (width, color) => ({
    height: "100%",
    width: `${width}%`,
    borderRadius: 2,
    background: color,
  }),

  // ── Form panel ────────────────────────────────────────────────────────────
  formPanel: {
    background: "#ffffff",
    border: "1px solid #e2e5ef",
    borderRadius: 10,
    padding: "16px 20px",
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#9299b0",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  formRow: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  inp: {
    background: "#f0f2f7",
    border: "1px solid #d0d4e4",
    borderRadius: 6,
    padding: "7px 11px",
    fontSize: 12,
    color: "#1a1e2e",
    fontFamily: "inherit",
    outline: "none",
  },

  // ── Panel row ─────────────────────────────────────────────────────────────
  panelRow: {
    display: "grid",
    gridTemplateColumns: "1fr 280px",
    gap: 16,
    marginBottom: 16,
  },
  panel: {
    background: "#ffffff",
    border: "1px solid #e2e5ef",
    borderRadius: 10,
    overflow: "hidden",
  },
  panelHeader: {
    padding: "13px 18px",
    borderBottom: "1px solid #e2e5ef",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#ffffff",
  },
  panelTitle: { fontSize: 13, fontWeight: 600, color: "#1a1e2e" },
  panelCount: (danger) => ({
    fontSize: 11,
    color: danger ? "#b02020" : "#9299b0",
    background: danger ? "#fff0f0" : "#f0f2f7",
    padding: "2px 8px",
    borderRadius: 10,
    border: `1px solid ${danger ? "#fdd" : "#e2e5ef"}`,
  }),

  // ── Table ─────────────────────────────────────────────────────────────────
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  th: {
    padding: "9px 18px",
    textAlign: "left",
    fontSize: 10,
    fontWeight: 700,
    color: "#9299b0",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    background: "#f0f2f7",
    borderBottom: "1px solid #e2e5ef",
  },
  td: {
    padding: "11px 18px",
    borderBottom: "1px solid #e2e5ef",
    color: "#5a6380",
    verticalAlign: "middle",
  },
  empChip: { display: "inline-flex", alignItems: "center", gap: 7 },
  empAvatar: {
    width: 23,
    height: 23,
    borderRadius: "50%",
    background: "#eef2ff",
    border: "1px solid #c0ccf8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 9,
    fontWeight: 700,
    color: "#3b6ef8",
    flexShrink: 0,
  },
  shiftTag: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#1a1e2e",
    background: "#f0f2f7",
    padding: "3px 8px",
    borderRadius: 4,
    border: "1px solid #d0d4e4",
    display: "inline-block",
  },

  // ── Ward pills ────────────────────────────────────────────────────────────
  wardPill: (variant) => {
    const map = {
      blue:  { background: "#eef2ff", color: "#2a4db0" },
      green: { background: "#edfaf3", color: "#0d7040" },
      amber: { background: "#fff8ec", color: "#9a5e08" },
    };
    return {
      fontSize: 11,
      fontWeight: 600,
      padding: "3px 9px",
      borderRadius: 10,
      display: "inline-block",
      ...map[variant],
    };
  },

  // ── Status badges ─────────────────────────────────────────────────────────
  badge: (variant) => {
    const map = {
      critical: { background: "#fff0f0", color: "#b02020", border: "1px solid #fdd" },
      upcoming: { background: "#fff8ec", color: "#9a5e08", border: "1px solid #ffe0b0" },
    };
    return {
      fontSize: 10,
      fontWeight: 700,
      padding: "2px 7px",
      borderRadius: 4,
      textTransform: "uppercase",
      letterSpacing: 0.3,
      ...map[variant],
    };
  },

  // ── Right column ──────────────────────────────────────────────────────────
  rightCol: { display: "flex", flexDirection: "column", gap: 14 },
  assignPanel: {
    background: "#ffffff",
    border: "1px solid #e2e5ef",
    borderRadius: 10,
    padding: "18px 20px",
  },
};

// ─── Ward color helper ────────────────────────────────────────────────────────
function wardVariant(name = "") {
  if (!name) return "blue";
  const n = name.toLowerCase();
  if (n.includes("lochlea") || n.includes("low green")) return "green";
  if (n.includes("gatehouse")) return "amber";
  return "blue";
}

// ─── Initials helper ──────────────────────────────────────────────────────────
function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Sidebar nav item ─────────────────────────────────────────────────────────
function NavItem({ label, active, badge, icon }) {
  return (
    <div style={styles.navItem(active)}>
      <span style={{ opacity: active ? 1 : 0.6, fontSize: 15 }}>{icon}</span>
      {label}
      {badge && <span style={styles.navBadge}>{badge}</span>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [uncovered, setUncovered]     = useState([]);
  const [wards, setWards]             = useState([]);
  const [employees, setEmployees]     = useState([]);

  const [date, setDate]                       = useState("");
  const [start, setStart]                     = useState("");
  const [end, setEnd]                         = useState("");
  const [selectedWardId, setSelectedWardId]   = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedShiftId, setSelectedShiftId] = useState("");

  const totalShifts = assignments.length + uncovered.length;
  const coverage    = totalShifts
    ? Math.round((assignments.length / totalShifts) * 100)
    : 0;

  const fetchAssignments = async () => {
    try { setAssignments((await axios.get("http://127.0.0.1:8000/assignments")).data); }
    catch (err) { console.error(err); }
  };
  const fetchUncovered = async () => {
    try { setUncovered((await axios.get("http://127.0.0.1:8000/uncovered-shifts")).data); }
    catch (err) { console.error(err); }
  };
  const fetchWards = async () => {
    try { setWards((await axios.get("http://127.0.0.1:8000/wards")).data); }
    catch (err) { console.error(err); }
  };
  const fetchEmployees = async () => {
    try { setEmployees((await axios.get("http://127.0.0.1:8000/employees")).data); }
    catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchAssignments();
    fetchUncovered();
    fetchWards();
    fetchEmployees();
  }, []);

  const generateSchedule = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/generate-schedule");
      alert("Schedule generated");
      fetchAssignments();
      fetchUncovered();
    } catch (err) { console.error(err); }
  };

  const addShift = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/shifts", {
        date,
        start_time: start,
        end_time: end,
        ward_id: parseInt(selectedWardId),
      });
      alert("Shift added");
    } catch (err) { console.error(err); }
  };

  const assignEmployee = async () => {
    if (!selectedEmployeeId || !selectedShiftId) {
      alert("Select employee and shift");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/assignments", {
        employee_id: parseInt(selectedEmployeeId),
        shift_id: parseInt(selectedShiftId),
      });
      alert("Assigned successfully");
      fetchAssignments();
      fetchUncovered();
    } catch (err) {
      console.error(err);
      alert("Assignment failed");
    }
  };

  const deleteAssignment = async (id) => {
    if (!window.confirm("Remove this assignment?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/assignments/${id}`);
      fetchAssignments();
      fetchUncovered();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // Filter employees by gender match for selected shift
  const filteredEmployees = employees.filter((e) => {
    const shift = uncovered.find((s) => s.shift_id == selectedShiftId);
    if (!shift) return true;
    return e.gender === shift.gender;
  });

  return (
    <div style={styles.wrapper}>
      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={styles.logoIcon}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M2 4h12v1.5H2zm0 3h12v1.5H2zm0 3h8v1.5H2z" />
            </svg>
          </div>
          <div>
            <div style={styles.logoText}>RosterOS</div>
            <div style={styles.logoSub}>Admin Panel</div>
          </div>
        </div>

        <nav style={styles.sidebarNav}>
          <div style={styles.navSection}>Overview</div>
          <NavItem label="Dashboard" active icon="⊞" />
          <NavItem label="Employees" icon="👤" />

          <div style={styles.navSection}>Scheduling</div>
          <NavItem label="Shifts" icon="📅" />
          <NavItem
            label="Assignments"
            icon="★"
            badge={uncovered.length || null}
          />

          <div style={styles.navSection}>Wards</div>
          <NavItem label="Ward Mgmt" icon="🏥" />
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userRow}>
            <div style={styles.userAvatar}>AD</div>
            <div>
              <div style={styles.userName}>Admin</div>
              <div style={styles.userRole}>Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <div>
            <span style={styles.topbarTitle}>Dashboard</span>
            <span style={styles.topbarSub}>/ Schedule Overview</span>
          </div>
          <div style={styles.topbarActions}>
            <button style={styles.btnGhost}>🔍 Search</button>
            <button style={styles.btnPrimary} onClick={generateSchedule}>
              + Generate Schedule
            </button>
          </div>
        </div>

        <div style={styles.content}>
          {/* ── Stat cards ── */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                <span style={styles.statDot("#3b6ef8")} />
                Total Shifts
              </div>
              <div style={styles.statValue("#1a1e2e")}>{totalShifts}</div>
              <div style={styles.statSub}>This scheduling period</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                <span style={styles.statDot("#16a05a")} />
                Covered
              </div>
              <div style={styles.statValue("#16a05a")}>{assignments.length}</div>
              <div style={styles.statSub}>Assigned to staff</div>
              <div style={styles.barTrack}>
                <div style={styles.barFill(coverage, "#16a05a")} />
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                <span style={styles.statDot("#e03535")} />
                Uncovered
              </div>
              <div style={styles.statValue("#e03535")}>{uncovered.length}</div>
              <div style={styles.statSub}>Needs assignment</div>
              <div style={styles.barTrack}>
                <div style={styles.barFill(100 - coverage, "#e03535")} />
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                <span style={styles.statDot("#c87d10")} />
                Coverage
              </div>
              <div style={styles.statValue("#c87d10")}>{coverage}%</div>
              <div style={styles.statSub}>Target: 95%</div>
              <div style={styles.barTrack}>
                <div style={styles.barFill(coverage, "#c87d10")} />
              </div>
            </div>
          </div>

          {/* ── Add Shift form ── */}
          <div style={styles.formPanel}>
            <div style={styles.formLabel}>Add New Shift</div>
            <div style={styles.formRow}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={styles.inp}
              />
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                style={styles.inp}
              />
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                style={styles.inp}
              />
              <select
                value={selectedWardId}
                onChange={(e) => setSelectedWardId(e.target.value)}
                style={styles.inp}
              >
                <option value="">Select Ward</option>
                {wards.map((w) => (
                  <option key={w.ward_id} value={w.ward_id}>
                    {w.name}
                  </option>
                ))}
              </select>
              <button style={styles.btnPrimary} onClick={addShift}>
                Add Shift
              </button>
            </div>
          </div>

          {/* ── Panel row ── */}
          <div style={styles.panelRow}>
            {/* Assignments table */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelTitle}>Assignments</span>
                <span style={styles.panelCount(false)}>{assignments.length} total</span>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {["Employee", "Ward", "Date", "Time", ""].map((h) => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a, i) => (
                    <tr key={i}>
                      <td style={styles.td}>
                        <div style={styles.empChip}>
                          <div style={styles.empAvatar}>{initials(a.employee_name)}</div>
                          {a.employee_name}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.wardPill(wardVariant(a.ward_name))}>
                          {a.ward_name}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 12 }}>
                        {a.date}
                      </td>
                      <td style={styles.td}>
                        <span style={styles.shiftTag}>
                          {a.start_time} – {a.end_time}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.btnDanger}
                          onClick={() => deleteAssignment(a.assignment_id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right column */}
            <div style={styles.rightCol}>
              {/* Manual Assignment */}
              <div style={styles.assignPanel}>
                <div style={styles.formLabel}>Manual Assignment</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    style={{ ...styles.inp, width: "100%" }}
                  >
                    <option value="">Select Employee</option>
                    {filteredEmployees.map((e) => (
                      <option key={e.employee_id} value={e.employee_id}>
                        {e.name} ({e.gender})
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedShiftId}
                    onChange={(e) => setSelectedShiftId(e.target.value)}
                    style={{ ...styles.inp, width: "100%" }}
                  >
                    <option value="">Select Uncovered Shift</option>
                    {uncovered.map((s) => (
                      <option key={s.shift_id} value={s.shift_id}>
                        {s.ward_name} → {s.date}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  style={{ ...styles.btnPrimary, width: "100%", justifyContent: "center" }}
                  onClick={assignEmployee}
                >
                  Assign Employee
                </button>
              </div>

              {/* Uncovered Shifts */}
              <div style={styles.panel}>
                <div style={styles.panelHeader}>
                  <span style={styles.panelTitle}>Uncovered Shifts</span>
                  <span style={styles.panelCount(true)}>{uncovered.length} open</span>
                </div>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {["ID", "Date", "Ward", "Status"].map((h) => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {uncovered.map((s, i) => {
                      const isCritical = new Date(s.date) <= new Date();
                      return (
                        <tr key={i}>
                          <td
                            style={{
                              ...styles.td,
                              fontFamily: "monospace",
                              color: "#9299b0",
                              borderLeft: isCritical ? "2px solid #e03535" : "none",
                            }}
                          >
                            #{s.shift_id}
                          </td>
                          <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 12 }}>
                            {s.date}
                          </td>
                          <td style={styles.td}>
                            <span style={styles.wardPill(wardVariant(s.ward_name))}>
                              {s.ward_name}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.badge(isCritical ? "critical" : "upcoming")}>
                              {isCritical ? "Critical" : "Upcoming"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}