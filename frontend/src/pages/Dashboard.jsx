import { useEffect, useState } from "react";

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("usuario");
    if (!u || u === "undefined") {
      setUsuario({ email: "cliente@cmac.com", nombre: "Cliente" });
      return;
    }
    try {
      setUsuario(JSON.parse(u));
    } catch(e) {
      setUsuario({ email: "cliente@cmac.com", nombre: "Cliente" });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/";
  };

  if (!usuario) return <div style={{color:"white",padding:32}}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>CM</div>
        <nav style={styles.nav}>
          <a style={styles.navItem}>Inicio</a>
          <a style={styles.navItem}>Mis Cuentas</a>
          <a style={styles.navItem}>Prestamos</a>
          <a style={styles.navItem}>Transferencias</a>
          <a style={styles.navItem}>Pagos</a>
        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>Cerrar sesion</button>
      </div>
      <div style={styles.main}>
        <div style={styles.topbar}>
          <h1 style={styles.welcome}>Bienvenido, {usuario.nombre || usuario.email}</h1>
        </div>
        <div style={styles.cards}>
          <div style={styles.card}>
            <div style={styles.cardLabel}>Cuenta de Ahorros</div>
            <div style={styles.cardAmount}>S/ 0.00</div>
            <div style={styles.cardSub}>Saldo disponible</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardLabel}>Creditos Activos</div>
            <div style={styles.cardAmount}>0</div>
            <div style={styles.cardSub}>Creditos vigentes</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardLabel}>Proxima Cuota</div>
            <div style={styles.cardAmount}>S/ 0.00</div>
            <div style={styles.cardSub}>Sin cuotas pendientes</div>
          </div>
        </div>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Solicitar Credito</h2>
          <p style={styles.sectionText}>Aqui podras solicitar un credito empresarial o de consumo.</p>
          <button style={styles.btnPrimary}>Nueva Solicitud</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", minHeight: "100vh", background: "#f5f5f5", fontFamily: "sans-serif" },
  sidebar: { width: 220, background: "#1a3a1a", display: "flex", flexDirection: "column", padding: "24px 0", gap: 4 },
  logo: { background: "#b8960c", color: "#fff", fontWeight: 700, fontSize: 22, borderRadius: 10, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" },
  nav: { display: "flex", flexDirection: "column", gap: 4, padding: "0 12px" },
  navItem: { color: "#ccc", padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontSize: 14, textDecoration: "none" },
  logoutBtn: { margin: "auto 12px 0", background: "#c0392b", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "pointer", fontSize: 14 },
  main: { flex: 1, padding: 32, display: "flex", flexDirection: "column", gap: 24 },
  topbar: { background: "#fff", borderRadius: 12, padding: "16px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  welcome: { margin: 0, fontSize: 20, color: "#1a1a1a" },
  cards: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
  card: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  cardLabel: { fontSize: 13, color: "#888", marginBottom: 8 },
  cardAmount: { fontSize: 28, fontWeight: 700, color: "#1a3a1a" },
  cardSub: { fontSize: 12, color: "#aaa", marginTop: 4 },
  section: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  sectionTitle: { margin: "0 0 8px", color: "#1a3a1a" },
  sectionText: { color: "#666", fontSize: 14, marginBottom: 16 },
  btnPrimary: { background: "#2d6a2d", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 15, cursor: "pointer" },
};
