export default function Footer() {
  return (
    <footer style={styles.footer}>
      {/* Main footer */}
      <div style={styles.main}>
        <div style={styles.brand}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>CM</div>
            <div>
              <div style={styles.logoName}>CMAC Maynas</div>
              <div style={styles.logoSub}>Caja Municipal de Ahorro y Credito</div>
            </div>
          </div>
          <p style={styles.brandDesc}>Mas de 30 anos impulsando el desarrollo financiero de Loreto y la Amazonia peruana.</p>
          <div style={styles.social}>
            {["f","in","tw","yt"].map((s,i)=>(
              <div key={i} style={styles.socialIcon}>{s==="f"?"F":s==="in"?"in":s==="tw"?"X":"▶"}</div>
            ))}
          </div>
        </div>

        <div style={styles.col}>
          <div style={styles.colTitle}>INSTITUCIONAL</div>
          {["Memoria institucional","CMAC en cifras","Noticias","Ley de proteccion de datos","Preguntas frecuentes","Canal de denuncias"].map((l,i)=>(
            <a key={i} style={styles.colLink}>{l}</a>
          ))}
        </div>

        <div style={styles.col}>
          <div style={styles.colTitle}>PRODUCTOS</div>
          {["Credito Empresarial","Credito Agropecuario","Cuenta de Ahorros","Depositos a Plazo","Seguros de Vida","Cajeros y Agentes"].map((l,i)=>(
            <a key={i} style={styles.colLink}>{l}</a>
          ))}
        </div>

        <div style={styles.col}>
          <div style={styles.colTitle}>CONTACTANOS</div>
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>Direccion</div>
            <div style={styles.contactVal}>Jr. Prospero 268, Iquitos, Loreto</div>
          </div>
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>Telefono</div>
            <div style={styles.contactVal}>(065) 234-5678</div>
          </div>
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>Atencion al cliente</div>
            <div style={styles.contactVal}>0800-00-123 (gratuito)</div>
          </div>
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>Email</div>
            <div style={{...styles.contactVal,color:"#38bdf8"}}>clientes@cmacmaynas.com.pe</div>
          </div>
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>Buzon de sugerencias</div>
            <div style={{...styles.contactVal,color:"#38bdf8"}}>sugerencias@cmacmaynas.com.pe</div>
          </div>
        </div>
      </div>

      {/* Aviso legal */}
      <div style={styles.legal}>
        <div style={styles.legalBox}>
          <div style={styles.legalTitle}>Informacion importante sobre nuestros productos:</div>
          <ul style={styles.legalList}>
            <li>Los depositos en CMAC Maynas estan protegidos por el Fondo de Seguro de Depositos (FSD) segun la normativa SBS.</li>
            <li>Las tasas de interes publicadas son referenciales y pueden variar segun evaluacion crediticia.</li>
            <li>CMAC Maynas esta supervisada por la Superintendencia de Banca, Seguros y AFP (SBS) del Peru.</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={styles.bottom}>
        <div style={styles.bottomLinks}>
          {["Privacidad y cookies","Terminos de uso","Politica de seguridad","Mapa del sitio","Trabaja con nosotros"].map((l,i)=>(
            <a key={i} style={styles.bottomLink}>{l}</a>
          ))}
        </div>
        <div style={styles.copy}>© 2026 CMAC Maynas. Todos los derechos reservados. Supervisado por la SBS.</div>
      </div>
    </footer>
  );
}

const styles = {
  footer:{background:"#0f172a",color:"#fff",fontFamily:"'Segoe UI',sans-serif"},
  main:{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1.5fr",gap:48,padding:"64px 48px 48px",maxWidth:1200,margin:"0 auto"},
  brand:{},
  logo:{display:"flex",alignItems:"center",gap:12,marginBottom:16},
  logoIcon:{background:"linear-gradient(135deg,#1e3a5f,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:18,borderRadius:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center"},
  logoName:{fontWeight:700,fontSize:16,color:"#fff"},
  logoSub:{fontSize:10,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:1},
  brandDesc:{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7,marginBottom:20},
  social:{display:"flex",gap:10},
  socialIcon:{width:36,height:36,borderRadius:8,background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,cursor:"pointer",color:"rgba(255,255,255,0.7)"},
  col:{},
  colTitle:{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:16},
  colLink:{display:"block",fontSize:13,color:"rgba(255,255,255,0.65)",marginBottom:10,cursor:"pointer",textDecoration:"none"},
  contactItem:{marginBottom:14},
  contactLabel:{fontSize:11,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:1,marginBottom:3},
  contactVal:{fontSize:13,color:"rgba(255,255,255,0.8)"},
  legal:{borderTop:"1px solid rgba(255,255,255,0.08)",padding:"24px 48px",maxWidth:1200,margin:"0 auto"},
  legalBox:{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"16px 20px",border:"1px solid rgba(255,255,255,0.08)"},
  legalTitle:{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.5)",marginBottom:8},
  legalList:{margin:0,paddingLeft:20,fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:2},
  bottom:{borderTop:"1px solid rgba(255,255,255,0.08)",padding:"20px 48px",maxWidth:1200,margin:"0 auto",display:"flex",flexDirection:"column",gap:10,alignItems:"center"},
  bottomLinks:{display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center"},
  bottomLink:{fontSize:12,color:"rgba(255,255,255,0.45)",cursor:"pointer",textDecoration:"none"},
  copy:{fontSize:12,color:"rgba(255,255,255,0.3)"},
};
