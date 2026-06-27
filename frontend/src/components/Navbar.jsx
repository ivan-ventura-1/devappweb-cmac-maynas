import { useState } from "react";

export default function Navbar({ onLogin }) {
  const [hovered, setHovered] = useState(null);
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>CM</div>
        <div>
          <div style={styles.logoName}>CMAC Maynas</div>
          <div style={styles.logoSub}>Caja Municipal de Ahorro y Credito</div>
        </div>
      </div>
      <div style={styles.links}>
        {["Inicio","Creditos","Ahorros","Seguros","Sucursales"].map(l => (
          <a key={l} style={{...styles.link,...(hovered===l?styles.linkHover:{})}} onMouseEnter={()=>setHovered(l)} onMouseLeave={()=>setHovered(null)}>{l}</a>
        ))}
      </div>
      <button style={{...styles.btnLogin,...(hovered==="btn"?styles.btnHover:{})}} onMouseEnter={()=>setHovered("btn")} onMouseLeave={()=>setHovered(null)} onClick={onLogin}>
        Banca por Internet
      </button>
    </nav>
  );
}
const styles = {
  nav:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 48px",background:"rgba(15,23,42,0.95)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:100,borderBottom:"1px solid rgba(255,255,255,0.08)"},
  logo:{display:"flex",alignItems:"center",gap:12},
  logoIcon:{background:"linear-gradient(135deg,#1e3a5f,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:18,borderRadius:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center"},
  logoName:{fontWeight:700,fontSize:16,color:"#fff"},
  logoSub:{fontSize:10,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:1},
  links:{display:"flex",gap:32},
  link:{color:"rgba(255,255,255,0.7)",fontSize:14,fontWeight:500,cursor:"pointer",textDecoration:"none",transition:"color 0.2s"},
  linkHover:{color:"#38bdf8"},
  btnLogin:{background:"linear-gradient(135deg,#1e3a5f,#0ea5e9)",color:"#fff",border:"none",borderRadius:10,padding:"10px 24px",fontSize:14,fontWeight:600,cursor:"pointer",transition:"all 0.2s"},
  btnHover:{transform:"translateY(-2px)",boxShadow:"0 6px 20px rgba(14,165,233,0.4)"},
};
