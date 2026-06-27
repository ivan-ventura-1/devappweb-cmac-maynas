import { useState } from "react";
const productos = [
  {icon:"💳",title:"Tarjetas",desc:"Tarjetas de debito y credito con beneficios exclusivos para clientes CMAC Maynas.",color:"#0ea5e9"},
  {icon:"🏢",title:"Credito Empresarial",desc:"Financia tu negocio con tasas competitivas y plazos flexibles hasta 36 meses.",color:"#7c3aed"},
  {icon:"🌾",title:"Credito Agropecuario",desc:"Apoyo financiero para agricultores y ganaderos de la region amazonica.",color:"#059669"},
  {icon:"🌱",title:"Ahorro Futuro",desc:"Construye tu patrimonio con nuestra cuenta de ahorro programado con alta rentabilidad.",color:"#d97706"},
  {icon:"📍",title:"Cajeros / Agentes",desc:"Red de cajeros y agentes corresponsales en toda la region de Loreto.",color:"#dc2626"},
  {icon:"🛡️",title:"Seguros",desc:"Protege lo que mas quieres con nuestros planes de seguro de vida y accidentes.",color:"#1e3a5f"},
];
export default function ProductsSection() {
  const [hovered,setHovered]=useState(null);
  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <div style={styles.eyebrow}>Nuestros Productos</div>
        <h2 style={styles.title}>Todo para tu vida financiera</h2>
        <p style={styles.sub}>Soluciones disenadas para el emprendedor amazonico</p>
      </div>
      <div style={styles.grid}>
        {productos.map((p,i)=>(
          <div key={i} style={{...styles.card,...(hovered===i?{transform:"translateY(-6px)",borderColor:p.color+"40",boxShadow:`0 20px 48px ${p.color}18`}:{})}} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}>
            <div style={{...styles.iconWrap,background:p.color+"12",color:p.color}}>{p.icon}</div>
            <h3 style={styles.cardTitle}>{p.title}</h3>
            <p style={styles.cardDesc}>{p.desc}</p>
            <div style={{...styles.link,color:p.color}}>Ver mas →</div>
          </div>
        ))}
      </div>
      <div style={styles.ctaBox}>
        <div><h3 style={styles.ctaTitle}>Listo para empezar?</h3><p style={styles.ctaDesc}>Abre tu cuenta en minutos y accede a todos nuestros productos.</p></div>
        <button style={styles.ctaBtn} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>Comenzar ahora</button>
      </div>
    </section>
  );
}
const styles={
  section:{padding:"80px 48px",background:"#f8f9ff",width:"100%",boxSizing:"border-box"},
  header:{textAlign:"center",marginBottom:52},
  eyebrow:{display:"inline-block",background:"#e0f2fe",color:"#0369a1",padding:"5px 16px",borderRadius:20,fontSize:12,fontWeight:600,marginBottom:14,textTransform:"uppercase",letterSpacing:1},
  title:{fontSize:36,fontWeight:800,color:"#0f172a",margin:"0 0 10px"},
  sub:{color:"#64748b",fontSize:16},
  grid:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22,maxWidth:1100,margin:"0 auto 56px"},
  card:{background:"#fff",borderRadius:18,padding:28,border:"1.5px solid #e2e8f0",cursor:"pointer",transition:"all 0.25s"},
  iconWrap:{width:52,height:52,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:18},
  cardTitle:{fontSize:17,fontWeight:700,color:"#0f172a",margin:"0 0 10px"},
  cardDesc:{fontSize:14,color:"#64748b",lineHeight:1.65,marginBottom:16},
  link:{fontSize:14,fontWeight:600,cursor:"pointer"},
  ctaBox:{background:"linear-gradient(135deg,#0f172a,#1e3a5f)",borderRadius:20,padding:"36px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,maxWidth:1100,margin:"0 auto"},
  ctaTitle:{fontSize:22,fontWeight:800,color:"#fff",margin:"0 0 6px"},
  ctaDesc:{fontSize:14,color:"rgba(255,255,255,0.7)",margin:0},
  ctaBtn:{background:"#fff",color:"#1e3a5f",border:"none",borderRadius:12,padding:"14px 32px",fontSize:15,fontWeight:700,cursor:"pointer"},
};
