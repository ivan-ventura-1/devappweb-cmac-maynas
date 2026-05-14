const products = [
  {
    icon: "🏠",
    name: "Crédito Hipotecario",
    desc: "Financia la casa de tus sueños con cuotas accesibles.",
    tag: "Desde 8.5% TEA",
  },
  {
    icon: "💼",
    name: "Crédito MYPE",
    desc: "Capital de trabajo para impulsar tu negocio local.",
    tag: "Hasta S/ 150,000",
  },
  {
    icon: "🐷",
    name: "Cuenta Ahorro",
    desc: "Genera rentabilidad con disponibilidad inmediata.",
    tag: "Hasta 5.5% TNA",
  },
  {
    icon: "📜",
    name: "Depósito a Plazo",
    desc: "Mayor rendimiento fijando tu dinero por un período.",
    tag: "Hasta 8% TEA",
  },
  {
    icon: "🌱",
    name: "Crédito Agropecuario",
    desc: "Financia tus cultivos y actividades del campo.",
    tag: "Especial Loreto",
  },
];

export default function ProductsSection() {
  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <div style={styles.label}>Nuestros productos</div>
        <h2 style={styles.title}>Servicios para cada necesidad</h2>
        <p style={styles.sub}>
          Créditos, ahorros y más — diseñados para el emprendedor amazónico.
        </p>
      </div>

      <div style={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.name} {...p} />
        ))}
      </div>

      {/* Divider */}
      <div style={styles.divider} />
    </section>
  );
}

function ProductCard({ icon, name, desc, tag }) {
  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#2E9E5A";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e2e8e0";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={styles.iconBox}>{icon}</div>
      <div style={styles.cardName}>{name}</div>
      <div style={styles.cardDesc}>{desc}</div>
      <div style={styles.cardTag}>{tag}</div>
    </div>
  );
}

const styles = {
  section: {
    padding: "3.5rem 2rem",
    maxWidth: "960px",
    margin: "0 auto",
  },
  header: { marginBottom: "2.5rem" },
  label: {
    fontSize: "11px",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    color: "#2E9E5A",
    fontWeight: "600",
    marginBottom: "0.4rem",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "30px",
    fontWeight: "700",
    color: "#0D3D21",
    marginBottom: "0.75rem",
    lineHeight: "1.2",
    margin: "0 0 0.75rem 0",
  },
  sub: {
    color: "#5a5a5a",
    fontSize: "14px",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "#fff",
    border: "1px solid #e2e8e0",
    borderRadius: "14px",
    padding: "1.5rem 1.2rem",
    cursor: "pointer",
    transition: "border-color 0.2s, transform 0.2s",
  },
  iconBox: {
    width: "44px",
    height: "44px",
    background: "#e8f5ee",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1rem",
    fontSize: "22px",
  },
  cardName: {
    fontWeight: "600",
    fontSize: "15px",
    color: "#0D3D21",
    marginBottom: "6px",
  },
  cardDesc: {
    fontSize: "12px",
    color: "#777",
    lineHeight: "1.5",
  },
  cardTag: {
    display: "inline-block",
    marginTop: "12px",
    background: "#e8f5ee",
    color: "#1B6B3A",
    fontSize: "11px",
    fontWeight: "600",
    padding: "3px 10px",
    borderRadius: "100px",
  },
  divider: {
    height: "4px",
    background: "linear-gradient(90deg, #0D3D21, #C8922A, #2E9E5A)",
    marginTop: "3rem",
    borderRadius: "2px",
  },
};
