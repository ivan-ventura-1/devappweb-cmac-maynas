import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductsSection from "../components/ProductsSection";

export default function Home() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FDF8F0", minHeight: "100vh" }}>
      {/* Fuentes de Google */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FDF8F0; }
        a:hover { opacity: 0.8; }
      `}</style>

      <Navbar />
      <Hero />
      <ProductsSection />
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.left}>
        <strong style={{ color: "#E8B84B" }}>CMAC Maynas</strong> — Caja Municipal de Ahorro y Crédito de Maynas
        <br />
        Iquitos, Loreto, Perú &nbsp;·&nbsp; 065-231234
      </div>
      <div style={styles.sbs}>
        🛡️ Supervisado por la SBS
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#0D3D21",
    padding: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "1rem",
  },
  left: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "12px",
    lineHeight: "1.6",
  },
  sbs: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
    padding: "8px 14px",
    color: "rgba(255,255,255,0.55)",
    fontSize: "11px",
  },
};
