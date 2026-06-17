import { useEffect, useState } from "react";

const estadoConfig = {
  pendiente:           { color: "#d97706", bg: "#fffbeb", label: "Pendiente" },
  en_evaluacion:        { color: "#0ea5e9", bg: "#e0f2fe", label: "En Evaluación" },
  rechazado_automatico: { color: "#dc2626", bg: "#fef2f2", label: "Rechazado (RDS)" },
  aprobado_scoring:     { color: "#7c3aed", bg: "#f5f3ff", label: "Aprobado por Scoring" },
  en_comite:            { color: "#f59e0b", bg: "#fef3c7", label: "En Comité" },
  aprobado:             { color: "#059669", bg: "#ecfdf5", label: "Aprobado" },
  rechazado:            { color: "#dc2626", bg: "#fef2f2", label: "Rechazado" },
  desembolsado:         { color: "#1e3a5f", bg: "#e0f2fe", label: "Desembolsado" },
};

export default function Core() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [evalModal, setEvalModal] = useState(null);
  const [ingresoNeto, setIngresoNeto] = useState("");
  const [gastoFamiliar, setGastoFamiliar] = useState("");

  useEffect(() => {
    cargar();
  }, []);

  const cargar = () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }
    fetch("http://localhost:3000/api/credito/todas", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { setSolicitudes(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const handleEstado = async (solicitudId, estado) => {
    const motivo = estado === "rechazado" ? prompt("Motivo de rechazo:") : null;
    const token = localStorage.getItem("token");
    await fetch("http://localhost:3000/api/credito/estado", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ solicitudId, estado, motivo })
    });
    cargar();
  };

  const handleEvaluar = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/credito/evaluacion", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        solicitudId: evalModal.id,
        ingresoNeto: parseFloat(ingresoNeto),
        gastoFamiliar: parseFloat(gastoFamiliar)
      })
    });
    const data = await res.json();
    if (data.success) {
      setEvalModal(null);
      setIngresoNeto("");
      setGastoFamiliar("");
      cargar();
    }
  };

  const solicitudesFiltradas = filtro === "todos" ? solicitudes : solicitudes.filter(s => s.estado === filtro);

  if (loading) return <div style={styles.loading}>Cargando...</div>;

  return (
    <div style={styles.page}>
      {evalModal && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setEvalModal(null)}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Registrar Evaluación — S/ {Number(evalModal.monto).toFixed(2)}</h3>
            <p style={styles.modalSub}>Cuota mensual: S/ {Number(evalModal.cuota_mensual).toFixed(2)}</p>
            <div style={styles.field}>
              <label style={styles.label}>Ingreso Neto Mensual (S/)</label>
              <input type="number" style={styles.input} value={ingresoNeto} onChange={(e) => setIngresoNeto(e.target.value)} placeholder="Ej: 2500" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Gasto Familiar Mensual (S/)</label>
              <input type="number" style={styles.input} value={gastoFamiliar} onChange={(e) => setGastoFamiliar(e.target.value)} placeholder="Ej: 800" />
            </div>
            <div style={styles.modalBtns}>
              <button style={styles.btnCancel} onClick={() => setEvalModal(null)}>Cancelar</button>
              <button style={styles.btnEval} onClick={handleEvaluar} disabled={!ingresoNeto || !gastoFamiliar}>Calcular RDS y Score</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          <div style={styles.logo}>CM</div>
          <div>
            <div style={styles.logoName}>CMAC Maynas</div>
            <div style={styles.logoSub}>Core Bancario — Panel del Asesor</div>
          </div>
        </div>
        <button style={styles.btnVolver} onClick={() => window.location.href="/dashboard"}>← Dashboard</button>
      </div>

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Bandeja de Solicitudes</h1>
        <p style={styles.heroSub}>{solicitudes.length} solicitudes en el sistema</p>
      </div>

      <div style={styles.content}>
        <div style={styles.filtros}>
          {["todos", "pendiente", "en_evaluacion", "rechazado_automatico", "aprobado_scoring", "en_comite", "aprobado", "desembolsado"].map(f => (
            <button key={f} style={{ ...styles.filtroBtn, ...(filtro === f ? styles.filtroActivo : {}) }} onClick={() => setFiltro(f)}>
              {f === "todos" ? "Todos" : estadoConfig[f]?.label} ({f === "todos" ? solicitudes.length : solicitudes.filter(s => s.estado === f).length})
            </button>
          ))}
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                {["Cliente ID", "Monto", "Cuota", "RDS", "Score", "Estado", "Acciones"].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {solicitudesFiltradas.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "#94a3b8" }}>Sin solicitudes</td></tr>
              ) : solicitudesFiltradas.map((s, i) => {
                const cfg = estadoConfig[s.estado] || estadoConfig.pendiente;
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                    <td style={styles.td}>{s.user_id?.slice(0, 8)}...</td>
                    <td style={{ ...styles.td, fontWeight: 700 }}>S/ {Number(s.monto).toFixed(2)}</td>
                    <td style={{ ...styles.td, color: "#059669" }}>S/ {Number(s.cuota_mensual).toFixed(2)}</td>
                    <td style={styles.td}>{s.rds != null ? `${s.rds}%` : "—"}</td>
                    <td style={styles.td}>{s.score != null ? s.score : "—"}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.acciones}>
                        {s.estado === "pendiente" && (
                          <button style={styles.btnEvaluarTbl} onClick={() => setEvalModal(s)}>Evaluar</button>
                        )}
                        {(s.estado === "aprobado_scoring" || s.estado === "en_comite") && (
                          <>
                            <button style={styles.btnAprobar} onClick={() => handleEstado(s.id, "aprobado")}>✓ Aprobar</button>
                            <button style={styles.btnRechazar} onClick={() => handleEstado(s.id, "rechazado")}>✗ Rechazar</button>
                          </>
                        )}
                        {s.estado === "aprobado" && (
                          <button style={styles.btnDesembolsar} onClick={() => handleEstado(s.id, "desembolsado")}>💰 Desembolsar</button>
                        )}
                        {["rechazado", "rechazado_automatico", "desembolsado"].includes(s.estado) && (
                          <span style={{ color: "#94a3b8", fontSize: 12 }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8f9ff", fontFamily: "'Segoe UI', sans-serif" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 48px", background: "#fff", boxShadow: "0 1px 0 #e5e7eb" },
  topLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", color: "#fff", fontWeight: 800, fontSize: 18, borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" },
  logoName: { fontWeight: 700, fontSize: 16, color: "#1e3a5f" },
  logoSub: { fontSize: 11, color: "#64748b" },
  btnVolver: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600 },
  hero: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", padding: "40px 48px", color: "#fff" },
  heroTitle: { margin: 0, fontSize: 32, fontWeight: 800 },
  heroSub: { margin: "8px 0 0", opacity: 0.85, fontSize: 15 },
  content: { padding: "32px 48px" },
  filtros: { display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" },
  filtroBtn: { padding: "8px 16px", borderRadius: 20, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#64748b" },
  filtroActivo: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", color: "#fff", borderColor: "transparent" },
  tableCard: { background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: { padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: 12, fontWeight: 600, borderBottom: "1px solid #f1f5f9" },
  td: { padding: "14px 16px", fontSize: 13, borderBottom: "1px solid #f1f5f9", color: "#374151" },
  badge: { padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  acciones: { display: "flex", gap: 6, flexWrap: "wrap" },
  btnEvaluarTbl: { background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 },
  btnAprobar: { background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 },
  btnRechazar: { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 },
  btnDesembolsar: { background: "#e0f2fe", color: "#1e3a5f", border: "1px solid #bae6fd", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 },
  loading: { padding: 32, color: "#64748b", fontFamily: "sans-serif" },
  overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", borderRadius: 16, padding: 28, width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  modalTitle: { margin: "0 0 4px", fontSize: 18, color: "#0f172a" },
  modalSub: { color: "#64748b", fontSize: 13, marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14 },
  modalBtns: { display: "flex", gap: 10, marginTop: 8 },
  btnCancel: { flex: 1, padding: "11px 0", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14 },
  btnEval: { flex: 1, padding: "11px 0", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 },
};
