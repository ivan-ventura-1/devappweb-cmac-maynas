import { useEffect, useState } from "react";

const bandaConfig = {
  preventiva: { color: "#059669", bg: "#ecfdf5", icon: "🟢", label: "Preventiva", dias: "1-30 días" },
  temprana:   { color: "#d97706", bg: "#fffbeb", icon: "🟡", label: "Temprana",   dias: "31-60 días" },
  tardia:     { color: "#dc2626", bg: "#fef2f2", icon: "🔴", label: "Tardía",     dias: "61-120 días" },
  judicial:   { color: "#7c3aed", bg: "#f5f3ff", icon: "⚖️", label: "Judicial",   dias: "121-180 días" },
  castigo:    { color: "#475569", bg: "#f8fafc", icon: "🚫", label: "Castigo",    dias: ">180 días" },
};

export default function Mora() {
  const [mora, setMora] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }
    fetch("http://localhost:3000/api/mora/", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { setMora(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleGestion = async (moraId) => {
    const obs = prompt("Ingrese observacion de gestion:");
    if (!obs) return;
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/mora/gestion", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ moraId, observaciones: obs })
    });
    const data = await res.json();
    if (data.success) setMora(prev => prev.map(m => m.id === moraId ? { ...m, estado_gestion: "gestionado", observaciones: obs } : m));
  };

  const moraFiltrada = filtro === "todos" ? mora : mora.filter(m => m.banda === filtro);

  if (loading) return <div style={styles.loading}>Cargando...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          <div style={styles.logo}>CM</div>
          <div>
            <div style={styles.logoName}>CMAC Maynas</div>
            <div style={styles.logoSub}>Módulo de Recuperaciones</div>
          </div>
        </div>
        <button style={styles.btnVolver} onClick={() => window.location.href = "/dashboard"}>← Volver al Dashboard</button>
      </div>

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Bandeja de Mora</h1>
        <p style={styles.heroSub}>Gestión de cartera morosa — {mora.length} créditos en seguimiento</p>
      </div>

      <div style={styles.content}>
        <div style={styles.kpiRow}>
          {Object.entries(bandaConfig).map(([banda, cfg]) => {
            const count = mora.filter(m => m.banda === banda).length;
            const active = filtro === banda;
            return (
              <div key={banda} style={{ ...styles.kpi, borderTop: `4px solid ${cfg.color}`, background: active ? cfg.bg : "#fff", cursor: "pointer" }}
                onClick={() => setFiltro(active ? "todos" : banda)}>
                <div style={styles.kpiIcon}>{cfg.icon}</div>
                <div style={{ ...styles.kpiCount, color: cfg.color }}>{count}</div>
                <div style={styles.kpiLabel}>{cfg.label}</div>
                <div style={styles.kpiDias}>{cfg.dias}</div>
              </div>
            );
          })}
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <span style={styles.tableTitle}>
                {filtro === "todos" ? "Todos los créditos en mora" : `Banda: ${bandaConfig[filtro]?.label}`}
              </span>
              <span style={styles.countBadge}>{moraFiltrada.length} registros</span>
            </div>
            {filtro !== "todos" && <button style={styles.btnLimpiar} onClick={() => setFiltro("todos")}>Ver todos</button>}
          </div>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                {["Banda", "Días Mora", "Monto Deuda", "Estado Gestión", "Observaciones", "Acción"].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {moraFiltrada.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "#94a3b8" }}>Sin registros</td></tr>
              ) : moraFiltrada.map((m, i) => {
                const cfg = bandaConfig[m.banda] || bandaConfig.preventiva;
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: cfg.bg, color: cfg.color }}>
                        {cfg.icon} {m.banda}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: 700, color: cfg.color }}>{m.dias_mora}</td>
                    <td style={styles.td}>S/ {Number(m.monto_deuda).toFixed(2)}</td>
                    <td style={styles.td}>
                      <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: m.estado_gestion === "gestionado" ? "#ecfdf5" : "#fffbeb", color: m.estado_gestion === "gestionado" ? "#059669" : "#d97706" }}>
                        {m.estado_gestion}
                      </span>
                    </td>
                    <td style={styles.td}>{m.observaciones || "—"}</td>
                    <td style={styles.td}>
                      <button style={styles.btnGestion} onClick={() => handleGestion(m.id)}>Gestionar</button>
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
  kpiRow: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 },
  kpi: { background: "#fff", borderRadius: 14, padding: 20, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.2s" },
  kpiIcon: { fontSize: 24, marginBottom: 8 },
  kpiCount: { fontSize: 32, fontWeight: 800 },
  kpiLabel: { fontSize: 13, fontWeight: 600, color: "#374151", marginTop: 4 },
  kpiDias: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  tableCard: { background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f1f5f9" },
  tableTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", marginRight: 12 },
  countBadge: { background: "#e0f2fe", color: "#0369a1", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  btnLimpiar: { background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "#64748b" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: { padding: "12px 20px", textAlign: "left", color: "#64748b", fontSize: 13, fontWeight: 600 },
  td: { padding: "14px 20px", fontSize: 14, borderBottom: "1px solid #f1f5f9", color: "#374151" },
  badge: { padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  btnGestion: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 },
  loading: { padding: 32, color: "#64748b", fontFamily: "sans-serif" },
};
