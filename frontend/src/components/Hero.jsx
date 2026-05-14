import { useState } from "react";
import LoginModal from "./LoginModal";

export default function Hero() {
  const [modalOpen, setModalOpen] = useState(false);

  const stats = [
    { num: "30+", label: "Años de experiencia" },
    { num: "18", label: "Agencias en Loreto" },
    { num: "98k+", label: "Clientes activos" },
  ];

  return (
    <>
      <section style={styles.hero}>
        {/* Círculo decorativo fondo */}
        <div style={styles.circle1} />
        <div style={styles.circle2} />

        <div style={styles.content}>
          <div style={styles.eyebrow}>🌿 Desde la Amazonía para el Perú</div>
          <h1 style={styles.title}>
            Tu dinero crece<br />
            como la{" "}
            <span style={styles.titleAccent}>selva amazónica</span>
          </h1>
          <p style={styles.sub}>
            Más de 30 años impulsando el desarrollo financiero de Loreto y la
            Amazonía peruana. Ahorra, invierte y accede a créditos con las
            mejores tasas.
          </p>
          <div style={styles.actions}>
            <button style={styles.btnPrimary} onClick={() => setModalOpen(true)}>
              💻 Ingresar a Banca Online
            </button>
            <button style={styles.btnSecondary}>Simula tu crédito</button>
          </div>
        </div>

        <div style={styles.stats}>
          {stats.map((s) => (
            <div key={s.label} style={styles.statCard}>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick access bar */}
      <div style={styles.quickBar}>
        {[
          { icon: "💳", label: "Tarjetas" },
          { icon: "🏦", label: "Crédito Empresarial" },
          { icon: "🌾", label: "Crédito Agropecuario" },
          { icon: "🐷", label: "Ahorro Futuro" },
          { icon: "📍", label: "Cajeros / Agentes" },
        ].map((item) => (
          <div key={item.label} style={styles.quickItem}>
            <span>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      <LoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

const styles = {
  hero: {
    background: "linear-gradient(135deg, #0D3D21 0%, #1B6B3A 60%, #1a7a40 100%)",
    padding: "5rem 2rem 4rem",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    gap: "3rem",
    minHeight: "380px",
  },
  circle1: {
    position: "absolute",
    right: "-60px",
    top: "-60px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "rgba(200,146,42,0.12)",
    pointerEvents: "none",
  },
  circle2: {
    position: "absolute",
    left: "30%",
    bottom: "-100px",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    pointerEvents: "none",
  },
  content: { flex: 1, position: "relative", zIndex: 1 },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(200,146,42,0.2)",
    border: "1px solid #C8922A",
    color: "#E8B84B",
    fontSize: "11px",
    fontWeight: "500",
    letterSpacing: "2px",
    textTransform: "uppercase",
    padding: "5px 14px",
    borderRadius: "100px",
    marginBottom: "1.5rem",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(28px, 4vw, 46px)",
    fontWeight: "900",
    color: "#fff",
    lineHeight: "1.15",
    marginBottom: "1rem",
    margin: "0 0 1rem 0",
  },
  titleAccent: { color: "#E8B84B" },
  sub: {
    color: "rgba(255,255,255,0.72)",
    fontSize: "15px",
    fontWeight: "300",
    lineHeight: "1.6",
    maxWidth: "440px",
    marginBottom: "2rem",
  },
  actions: { display: "flex", gap: "12px", flexWrap: "wrap" },
  btnPrimary: {
    background: "#C8922A",
    color: "#0D3D21",
    fontWeight: "700",
    fontSize: "14px",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  btnSecondary: {
    background: "transparent",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "1.5px solid rgba(255,255,255,0.35)",
    cursor: "pointer",
  },
  stats: {
    flex: "0 0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    position: "relative",
    zIndex: 1,
  },
  statCard: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    padding: "1.1rem 1.4rem",
    minWidth: "160px",
    textAlign: "center",
  },
  statNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "28px",
    fontWeight: "900",
    color: "#E8B84B",
    lineHeight: "1",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  quickBar: {
    background: "#0D3D21",
    padding: "0 2rem",
    display: "flex",
    gap: "0",
    justifyContent: "center",
    borderBottom: "2px solid #C8922A",
    flexWrap: "wrap",
  },
  quickItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0.8rem 1.5rem",
    color: "rgba(255,255,255,0.65)",
    fontSize: "13px",
    cursor: "pointer",
    borderRight: "1px solid rgba(255,255,255,0.1)",
  },
};
