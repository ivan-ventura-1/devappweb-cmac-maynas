import { useState } from "react";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>CM</div>
          <div style={styles.logoText}>
            <span style={styles.logoName}>CMAC Maynas</span>
            <span style={styles.logoSub}>Caja Municipal de Ahorro y Crédito</span>
          </div>
        </div>

        <ul style={styles.links}>
          {["Inicio", "Créditos", "Ahorros", "Seguros", "Sucursales"].map((item) => (
            <li key={item}>
              <a href="#" style={styles.link}>
                {item}
              </a>
            </li>
          ))}
          <li>
            <button style={styles.btnBanca} onClick={() => setModalOpen(true)}>
              💻 Banca por Internet
            </button>
          </li>
        </ul>
      </nav>

      <LoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

const styles = {
  nav: {
    background: "#0D3D21",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2rem",
    height: "64px",
    borderBottom: "3px solid #C8922A",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: { display: "flex", alignItems: "center", gap: "10px" },
  logoIcon: {
    width: "38px",
    height: "38px",
    background: "#C8922A",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display', serif",
    fontSize: "17px",
    fontWeight: "900",
    color: "#0D3D21",
  },
  logoText: { display: "flex", flexDirection: "column" },
  logoName: { color: "#fff", fontSize: "14px", fontWeight: "600" },
  logoSub: {
    color: "#E8B84B",
    fontSize: "10px",
    fontWeight: "300",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  links: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "rgba(255,255,255,0.75)",
    textDecoration: "none",
    fontSize: "13px",
  },
  btnBanca: {
    background: "#C8922A",
    color: "#0D3D21",
    fontWeight: "700",
    fontSize: "13px",
    padding: "8px 18px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
};
