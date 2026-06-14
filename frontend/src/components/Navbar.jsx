import { useState } from "react";

export default function Navbar({ onLogin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>CM</div>
        <div>
          <div style={styles.logoName}>CMAC Maynas</div>
          <div style={styles.logoSub}>Caja Municipal de Ahorro y Crédito</div>
        </div>
      </div>
      <div style={styles.links}>
        {["Inicio", "Créditos", "Ahorros", "Seguros", "Sucursales"].map(l => (
          <a key={l} style={styles.link}>{l}</a>
        ))}
      </div>
      <button style={styles.btnLogin} onClick={onLogin}>Banca por Internet</button>
    </nav>
  );
}

const styles = {
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 48px", background: "#fff", boxShadow: "0 1px 0 #e5e7eb", position: "sticky", top: 0, zIndex: 100 },
  logo: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", color: "#fff", fontWeight: 800, fontSize: 18, borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" },
  logoName: { fontWeight: 700, fontSize: 16, color: "#1e3a5f" },
  logoSub: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 },
  links: { display: "flex", gap: 32 },
  link: { color: "#374151", fontSize: 14, fontWeight: 500, cursor: "pointer", textDecoration: "none", transition: "color 0.2s" },
  btnLogin: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};
