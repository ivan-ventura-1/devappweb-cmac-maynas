import { useEffect, useState } from "react";
import ModalSolicitud from "../components/ModalSolicitud";

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [userId, setUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [exito, setExito] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("usuario");
    if (!u || u === "undefined") {
      setUsuario({ email: "cliente@cmac.com", nombre: "Cliente" });
      setUserId("a8e4b064-ca59-464e-9f69-baa40e1a529f");
      return;
    }
    try {
      const parsed = JSON.parse(u);
      setUsuario(parsed);
      setUserId(parsed.id);
    } catch(e) {
      setUsuario({ email: "cliente@cmac.com", nombre: "Cliente" });
    }
  }, []);

  const handleExito = (solicitud) => {
    setModalOpen(false);
    setExito(solicitud);
    setSolicitudes(prev => [solicitud, ...prev]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/";
  };

  if (!usuario) return <div style={{padding:32,color:"#64748b"}}>Cargando...</div>;

  return (
    <div style={styles.page}>
      {modalOpen && <ModalSolicitud onClose={() => setModalOpen(false)} userId={userId || "a8e4b064-ca59-464e-9f69-baa40e1a529f"} onExito={handleExito} />}

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.logo}>CM</div>
          <div>
            <div style={styles.logoName}>CMAC Maynas</div>
            <div style={styles.logoSub}>Banca por Internet</div>
          </div>
        </div>
        <div style={styles.navLinks}>
          {["Inicio", "Mis Cuentas", "Préstamos", "Transferencias", "Pagos"].map(l => (
            <a key={l} style={styles.navLink}>{l}</a>
          ))}
        </div>
        <div style={styles.navRight}>
          <div style={styles.userBadge}>{(usuario.nombre || usuario.email)?.[0]?.toUpperCase()}</div>
          <button style={styles.btnLogout} onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      <div style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>Bienvenido, {usuario.nombre || usuario.email} 👋</h1>
          <p style={styles.heroSub}>Aquí tienes un resumen de tu actividad financiera</p>
        </div>
      </div>

      <div style={styles.content}>
        {exito && (
          <div style={styles.exitoBox}>
            ✅ Solicitud enviada exitosamente — Cuota mensual: <strong>S/ {exito.cuota_mensual}</strong> — Estado: <strong>{exito.estado}</strong>
          </div>
        )}

        <div style={styles.cards}>
          {[
            { label: "Cuenta de Ahorros", value: "S/ 0.00", sub: "Saldo disponible", icon: "🏦", color: "#0ea5e9" },
            { label: "Créditos Activos", value: solicitudes.length.toString(), sub: "Solicitudes enviadas", icon: "📋", color: "#8b5cf6" },
            { label: "Próxima Cuota", value: `S/ ${solicitudes[0]?.cuota_mensual || "0.00"}`, sub: solicitudes.length ? "Pendiente de aprobación" : "Sin cuotas pendientes", icon: "📅", color: "#059669" },
          ].map((c, i) => (
            <div key={i} style={styles.card}>
              <div style={{ ...styles.cardIcon, background: c.color + "15", color: c.color }}>{c.icon}</div>
              <div style={styles.cardLabel}>{c.label}</div>
              <div style={styles.cardValue}>{c.value}</div>
              <div style={styles.cardSub}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div style={styles.grid}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Solicitar Crédito</h2>
            <p style={styles.sectionDesc}>Accede a créditos empresariales o de consumo con las mejores tasas de la Amazonía.</p>
            <div style={styles.btnRow}>
              <button style={styles.btnPrimary} onClick={() => setModalOpen(true)}>+ Nueva Solicitud</button>
              <button style={styles.btnSecondary} onClick={() => window.location.href = "/mora"}>Ver Bandeja de Mora</button>
            </div>
          </div>

          {solicitudes.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Mis Solicitudes</h2>
              {solicitudes.map((s, i) => (
                <div key={i} style={styles.solicitudRow}>
                  <div>
                    <div style={styles.solicitudMonto}>S/ {s.monto}</div>
                    <div style={styles.solicitudDetalle}>{s.plazo_meses} meses — TEA {s.tasa_anual}% — Cuota S/ {s.cuota_mensual}</div>
                  </div>
                  <span style={styles.estadoBadge}>{s.estado}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8f9ff", fontFamily: "'Segoe UI', sans-serif" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 48px", background: "#fff", boxShadow: "0 1px 0 #e5e7eb", position: "sticky", top: 0, zIndex: 100 },
  navLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", color: "#fff", fontWeight: 800, fontSize: 18, borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" },
  logoName: { fontWeight: 700, fontSize: 16, color: "#1e3a5f" },
  logoSub: { fontSize: 11, color: "#64748b" },
  navLinks: { display: "flex", gap: 28 },
  navLink: { color: "#374151", fontSize: 14, fontWeight: 500, cursor: "pointer", textDecoration: "none" },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  userBadge: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", color: "#fff", fontWeight: 700, fontSize: 16, borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" },
  btnLogout: { background: "none", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, color: "#64748b", fontWeight: 500 },
  hero: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", padding: "40px 48px", color: "#fff" },
  heroTitle: { margin: 0, fontSize: 28, fontWeight: 800 },
  heroSub: { margin: "8px 0 0", opacity: 0.85, fontSize: 15 },
  content: { padding: "32px 48px" },
  exitoBox: { background: "#ecfdf5", color: "#065f46", padding: "14px 20px", borderRadius: 12, marginBottom: 24, fontSize: 14, border: "1px solid #a7f3d0" },
  cards: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 },
  card: { background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  cardIcon: { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 },
  cardLabel: { fontSize: 13, color: "#64748b", marginBottom: 6 },
  cardValue: { fontSize: 30, fontWeight: 800, color: "#0f172a", marginBottom: 4 },
  cardSub: { fontSize: 12, color: "#94a3b8" },
  grid: { display: "flex", flexDirection: "column", gap: 20 },
  section: { background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  sectionTitle: { margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0f172a" },
  sectionDesc: { color: "#64748b", fontSize: 14, marginBottom: 20 },
  btnRow: { display: "flex", gap: 12 },
  btnPrimary: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  btnSecondary: { background: "#fff", color: "#1e3a5f", border: "2px solid #1e3a5f", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  solicitudRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f1f5f9" },
  solicitudMonto: { fontSize: 16, fontWeight: 700, color: "#0f172a" },
  solicitudDetalle: { fontSize: 12, color: "#64748b", marginTop: 2 },
  estadoBadge: { background: "#fef9c3", color: "#854d0e", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
};
