import { useState, useEffect } from "react";

export default function Hero({ onLogin }) {
  const [hovered, setHovered] = useState(null);
  const [count, setCount] = useState({y:0,a:0,c:0});
  useEffect(() => {
    let step=0; const steps=40;
    const t = setInterval(()=>{ step++; const p=step/steps;
      setCount({y:Math.round(30*p),a:Math.round(18*p),c:Math.round(98*p)});
      if(step>=steps) clearInterval(t);
    }, 30);
    return ()=>clearInterval(t);
  },[]);
  return (
    <section style={styles.hero}>
      <div style={styles.bg}/>
      <div style={styles.inner}>
        <div style={styles.left}>
          <div style={styles.tag}>Desde la Amazonia para el Peru</div>
          <h1 style={styles.h1}>Tu dinero crece<br/><span style={styles.hl}>con nosotros</span></h1>
          <p style={styles.desc}>Mas de 30 anos impulsando el desarrollo financiero de Loreto y la Amazonia peruana. Ahorra, invierte y accede a creditos con las mejores tasas.</p>
          <div style={styles.btnRow}>
            <button style={{...styles.btnP,...(hovered==="l"?styles.btnPH:{})}} onMouseEnter={()=>setHovered("l")} onMouseLeave={()=>setHovered(null)} onClick={onLogin}>Ingresar a Banca Online</button>
            <button style={{...styles.btnS,...(hovered==="s"?styles.btnSH:{})}} onMouseEnter={()=>setHovered("s")} onMouseLeave={()=>setHovered(null)} onClick={()=>window.location.href="/calculadora.html"}>Simula tu credito</button>
          </div>
          <div style={styles.stats}>
            {[[`${count.y}+`,"Anos de experiencia"],[count.a,"Agencias en Loreto"],[`${count.c}k+`,"Clientes activos"]].map(([v,l],i)=>(
              <div key={i}><div style={styles.sv}>{v}</div><div style={styles.sl}>{l}</div></div>
            ))}
          </div>
        </div>
        <div style={styles.right}>
          <div style={{position:"relative",width:310}}>
            <div style={styles.card}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
                <span style={{fontSize:13,color:"#64748b"}}>Cuenta de Ahorros</span>
                <span style={{background:"#dcfce7",color:"#166534",fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:600}}>Activa</span>
              </div>
              <div style={{fontSize:34,fontWeight:800,color:"#0f172a"}}>S/ 12,450.00</div>
              <div style={{fontSize:12,color:"#94a3b8",marginBottom:18}}>Saldo disponible</div>
              <div style={{height:1,background:"#f1f5f9",marginBottom:14}}/>
              {[["TEA anual","4.5%","#059669"],["Proxima cuota","S/ 504.73","#0f172a"],["Proximo pago","03/07/2026","#0f172a"]].map(([l,v,c],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{fontSize:13,color:"#64748b"}}>{l}</span>
                  <span style={{fontSize:13,fontWeight:600,color:c}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#94a3b8",marginBottom:5}}><span>Meta de ahorro</span><span>S/ 20,000</span></div>
                <div style={{height:6,background:"#f1f5f9",borderRadius:10}}><div style={{height:"100%",width:"62%",background:"linear-gradient(90deg,#1e3a5f,#0ea5e9)",borderRadius:10}}/></div>
                <div style={{fontSize:11,color:"#0ea5e9",marginTop:3}}>62% completado</div>
              </div>
            </div>
            <div style={styles.float1}><span style={{fontSize:20}}>✅</span><div><div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>Credito aprobado</div><div style={{fontSize:11,color:"#64748b"}}>S/ 5,000 — 12 meses</div></div></div>
            <div style={styles.float2}><span style={{fontSize:20}}>📈</span><div><div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>Interes ganado</div><div style={{fontSize:11,color:"#64748b"}}>+S/ 46.25 este mes</div></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
const styles={
  hero:{position:"relative",width:"100%",minHeight:"90vh",display:"flex",alignItems:"center",overflow:"hidden"},
  bg:{position:"absolute",inset:0,background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#0369a1 70%,#0ea5e9 100%)",zIndex:0},
  inner:{position:"relative",zIndex:1,display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",maxWidth:1200,margin:"0 auto",padding:"80px 48px",gap:60,boxSizing:"border-box"},
  left:{flex:1,maxWidth:560},
  tag:{display:"inline-block",background:"rgba(255,255,255,0.15)",color:"#fff",padding:"7px 18px",borderRadius:20,fontSize:13,fontWeight:500,marginBottom:28,border:"1px solid rgba(255,255,255,0.2)"},
  h1:{fontSize:52,fontWeight:800,color:"#fff",lineHeight:1.1,margin:"0 0 20px",letterSpacing:-1},
  hl:{background:"linear-gradient(90deg,#38bdf8,#7dd3fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  desc:{color:"rgba(255,255,255,0.8)",fontSize:16,lineHeight:1.75,marginBottom:36},
  btnRow:{display:"flex",gap:14,marginBottom:52,flexWrap:"wrap"},
  btnP:{background:"#fff",color:"#1e3a5f",border:"none",borderRadius:12,padding:"14px 28px",fontSize:15,fontWeight:700,cursor:"pointer",transition:"all 0.2s",boxShadow:"0 4px 20px rgba(0,0,0,0.15)"},
  btnPH:{transform:"translateY(-2px)",boxShadow:"0 8px 30px rgba(0,0,0,0.2)"},
  btnS:{background:"rgba(255,255,255,0.12)",color:"#fff",border:"1.5px solid rgba(255,255,255,0.4)",borderRadius:12,padding:"14px 28px",fontSize:15,fontWeight:600,cursor:"pointer",transition:"all 0.2s"},
  btnSH:{background:"rgba(255,255,255,0.22)",transform:"translateY(-2px)"},
  stats:{display:"flex",gap:40},
  sv:{fontSize:32,fontWeight:800,color:"#fff"},
  sl:{fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:2},
  right:{flex:1,display:"flex",justifyContent:"center",alignItems:"center"},
  card:{background:"#fff",borderRadius:24,padding:28,boxShadow:"0 32px 80px rgba(0,0,0,0.3)"},
  float1:{position:"absolute",bottom:-20,left:-30,background:"#fff",borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 32px rgba(0,0,0,0.15)",zIndex:3,minWidth:200},
  float2:{position:"absolute",top:-16,right:-24,background:"#fff",borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 32px rgba(0,0,0,0.15)",zIndex:3,minWidth:190},
};
