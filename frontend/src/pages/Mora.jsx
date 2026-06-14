import { useEffect, useState } from "react";

const bandaConfig = {
  preventiva: { color: "#2e7d32", bg: "#e8f5e9", icon: "🟢", label: "Preventiva", dias: "1-30 días" },
  temprana:   { color: "#f57c00", bg: "#fff3e0", icon: "🟡", label: "Temprana",   dias: "31-60 días" },
  tardia:     { color: "#c62828", bg: "#ffebee", icon: "🔴", label: "Tardía",     dias: "61-120 días" },
  judicial:   { color: "#6a1b9a", bg: "#f3e5f5", icon: "⚖️", label: "Judicial",   dias: "121-180 días" },
  castigo:    { color: "#37474f", bg: "#eceff1", icon: "🚫", label: "Castigo",    dias: ">180 días" },
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
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Módulo de Recuperaciones</h1>
          <p style={styles.subtitle}>Gestión de cartera morosa — CMAC Maynas</p>
        </div>
        <button style={styles.btnVolver} onClick={() => window.location.href = "/dashboard"}>← Volver</button>
      </div>

      <div style={styles.kpiRow}>
        {Object.entries(bandaConfig).map(([banda, cfg]) => {
          const count = mora.filter(m => m.banda === banda).length;
          return (
            <div key={banda} style={{ ...styles.kpi, borderTop: `4px solid ${cfg.color}`, cursor: "pointer" }}
              onClick={() => setFiltro(filtro === banda ? "todos" : banda)}>
              <div style={styles.kpiIcon}>{cfg.icon}</div>
              <div style={styles.kpiCount}>{count}</div>
              <div style={styles.kpiLabel}>{cfg.label}</div>
              <div style={styles.kpiDias}>{cfg.dias}</div>
            </div>
          );
        })}
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <span style={styles.tableTitle}>
            {filtro === "todos" ? "Todos los créditos en mora" : `Banda: ${bandaConfig[filtro]?.label}`}
            <span style={styles.countBadge}>{moraFiltrada.length} registros</span>
          </span>
          {filtro !== "todos" && <button style={styles.btnLimpiar} onClick={() => setFiltro("todos")}>Ver todos</button>}
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Banda", "Días Mora", "Monto Deuda", "Estado Gestión", "Observaciones", "Acción"].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {moraFiltrada.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "#999" }}>Sin registros</td></tr>
            ) : moraFiltrada.map((m, i) => {
              const cfg = bandaConfig[m.banda] || bandaConfig.preventiva;
              return (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: cfg.bg, color: cfg.color }}>
                      {cfg.icon} {m.banda}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: 600, color: cfg.color }}>{m.dias_mora}</td>
                  <td style={styles.td}>S/ {Number(m.monto_deuda).toFixed(2)}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.estadoBadge, background: m.estado_gestion === "gestionado" ? "#e8f5e9" : "#fff3e0", color: m.estado_gestion === "gestionado" ? "#2e7d32" : "#f57c00" }}>
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
  );
}

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e8f0e8 100%)", padding: 32, fontFamily: "sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
  title: { margin: 0, fontSize: 28, color: "#1a3a1a", fontWeight: 700 },
  subtitle: { margin: "4px 0 0", color: "#666", fontSize: 14 },
  btnVolver: { background: "#1a3a1a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 14 },
  kpiRow: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 },
  kpi: { background: "#fff", borderRadius: 12, padding: 20, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "transform 0.1s" },
  kpiIcon: { fontSize: 24, marginBottom: 8 },
  kpiCount: { fontSize: 32, fontWeight: 700, color: "#1a3a1a" },
  kpiLabel: { fontSize: 13, fontWeight: 600, color: "#444", marginTop: 4 },
  kpiDias: { fontSize: 11, color: "#999", marginTop: 2 },
  tableCard: { background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #f0f0f0" },
  tableTitle: { fontSize: 16, fontWeight: 600, color: "#1a3a1a", display: "flex", alignItems: "center", gap: 12 },
  countBadge: { background: "#e8f5e9", color: "#2e7d32", padding: "2px 10px", borderRadius: 20, fontSize: 12 },
  btnLimpiar: { background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "#666" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 20px", textAlign: "left", background: "#f8f9fa", color: "#555", fontSize: 13, fontWeight: 600 },
  td: { padding: "14px 20px", fontSize: 14, borderBottom: "1px solid #f5f5f5" },
  badge: { padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  estadoBadge: { padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 },
  btnGestion: { background: "#1a3a1a", color: "#fff", border: "none", borderRadius: 6, padding: "7px 16px", cursor: "pointer", fontSize: 13 },
  loading: { padding: 32, color: "#666", fontFamily: "sans-serif" },
};
