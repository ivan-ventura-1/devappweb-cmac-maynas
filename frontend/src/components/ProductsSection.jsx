const productos = [
  { icon: "💳", title: "Tarjetas", desc: "Tarjetas de débito y crédito con beneficios exclusivos para clientes CMAC Maynas." },
  { icon: "🏢", title: "Crédito Empresarial", desc: "Financia tu negocio con tasas competitivas y plazos flexibles hasta 36 meses." },
  { icon: "🌾", title: "Crédito Agropecuario", desc: "Apoyo financiero para agricultores y ganaderos de la región amazónica." },
  { icon: "🌱", title: "Ahorro Futuro", desc: "Construye tu patrimonio con nuestra cuenta de ahorro programado con alta rentabilidad." },
  { icon: "📍", title: "Cajeros / Agentes", desc: "Red de cajeros y agentes corresponsales en toda la región de Loreto." },
  { icon: "🛡️", title: "Seguros", desc: "Protege lo que más quieres con nuestros planes de seguro de vida y accidentes." },
];

export default function ProductsSection() {
  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.title}>Nuestros Productos</h2>
        <p style={styles.sub}>Todo lo que necesitas para tu vida financiera en un solo lugar</p>
      </div>
      <div style={styles.grid}>
        {productos.map((p, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.icon}>{p.icon}</div>
            <h3 style={styles.cardTitle}>{p.title}</h3>
            <p style={styles.cardDesc}>{p.desc}</p>
            <a style={styles.link}>Ver más →</a>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  section: { padding: "80px 48px", background: "#fff" },
  header: { textAlign: "center", marginBottom: 48 },
  title: { fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "0 0 12px" },
  sub: { color: "#64748b", fontSize: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1100, margin: "0 auto" },
  card: { background: "#f8f9ff", borderRadius: 16, padding: 28, border: "1px solid #e2e8f0", transition: "transform 0.2s" },
  icon: { fontSize: 36, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 10px" },
  cardDesc: { fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 16 },
  link: { color: "#0ea5e9", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};
