import { useEffect, useState } from "react";

const tipoConfig = {
  deposito:    { color: "#059669", bg: "#ecfdf5", icon: "↑", label: "Deposito" },
  retiro:      { color: "#dc2626", bg: "#fef2f2", icon: "↓", label: "Retiro" },
  credito:     { color: "#1e3a5f", bg: "#e0f2fe", icon: "B", label: "Credito" },
  pago_cuota:  { color: "#d97706", bg: "#fffbeb", icon: "P", label: "Pago Cuota" },
};

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const u = localStorage.getItem("usuario");
    if (!token || !u) { window.location.href = "/"; return; }
    let userId;
    try { userId = JSON.parse(u).id || "a8e4b064-ca59-464e-9f69-baa40e1a529f"; } catch(e) { userId = "a8e4b064-ca59-464e-9f69-baa40e1a529f"; }
    fetch("http://localhost:3000/api/movimientos/" + userId, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(r => r.json())
      .then(d => { setMovimientos(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtrados = filtro === "todos" ? movimientos : movimientos.filter(m => m.tipo === filtro);
  const totalEntradas = movimientos.filter(m => m.tipo === "deposito" || m.tipo === "credito").reduce((a, m) => a + Number(m.monto), 0);
  const totalSalidas = movimientos.filter(m => m.tipo === "retiro" || m.tipo === "pago_cuota").reduce((a, m) => a + Number(m.monto), 0);

  if (loading) return <div style={{padding:32,color:"#64748b"}}>Cargando movimientos...</div>;

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.logo}>CM</div>
          <div><div style={styles.logoName}>CMAC Maynas</div><div style={styles.logoSub}>Historial de Movimientos</div></div>
        </div>
        <button style={styles.btnVolver} onClick={() => window.location.href="/dashboard"}>Volver</button>
      </nav>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Mis Movimientos</h1>
        <p style={styles.heroSub}>{movimientos.length} transacciones registradas</p>
      </div>
      <div style={styles.content}>
        <div style={styles.kpiRow}>
          {[
            { label: "Total Movimientos", value: movimientos.length, color: "#1e3a5f" },
            { label: "Total Entradas", value: "S/ " + totalEntradas.toFixed(2), color: "#059669" },
            { label: "Total Salidas", value: "S/ " + totalSalidas.toFixed(2), color: "#dc2626" },
            { label: "Balance Neto", value: "S/ " + (totalEntradas - totalSalidas).toFixed(2), color: "#0ea5e9" },
          ].map((k, i) => (
            <div key={i} style={styles.kpiCard}>
              <div style={styles.kpiValue}>{k.value}</div>
              <div style={styles.kpiLabel}>{k.label}</div>
            </div>
          ))}
        </div>
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <span style={styles.tableTitle}>Historial de Transacciones</span>
            <div style={styles.filtros}>
              {["todos","deposito","retiro","credito","pago_cuota"].map(f => (
                <button key={f} style={{...styles.filtroBtn,...(filtro===f?styles.filtroActivo:{})}} onClick={() => setFiltro(f)}>
                  {f==="todos"?"Todos":tipoConfig[f]?.label}
                </button>
              ))}
            </div>
          </div>
          <table style={styles.table}>
            <thead><tr style={styles.thead}>{["Tipo","Monto","Descripcion","Fecha"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
            <tbody>
              {filtrados.length===0 ? (
                <tr><td colSpan={4} style={{textAlign:"center",padding:32,color:"#94a3b8"}}>Sin movimientos</td></tr>
              ) : filtrados.map((m,i) => {
                const cfg = tipoConfig[m.tipo] || tipoConfig.deposito;
                const esEntrada = m.tipo==="deposito" || m.tipo==="credito";
                return (
                  <tr key={i} style={{background: i%2===0?"#fff":"#f8fafc"}}>
                    <td style={styles.td}><span style={{...styles.badge,background:cfg.bg,color:cfg.color}}>{cfg.label}</span></td>
                    <td style={{...styles.td,fontWeight:700,color:esEntrada?"#059669":"#dc2626"}}>{esEntrada?"+":"-"}S/ {Number(m.monto).toFixed(2)}</td>
                    <td style={styles.td}>{m.descripcion||"—"}</td>
                    <td style={{...styles.td,color:"#94a3b8",fontSize:12}}>{new Date(m.created_at).toLocaleDateString("es-PE")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:{minHeight:"100vh",background:"#f8f9ff",fontFamily:"Segoe UI, sans-serif"},
  nav:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 48px",background:"#fff",boxShadow:"0 1px 0 #e5e7eb"},
  navLeft:{display:"flex",alignItems:"center",gap:12},
  logo:{background:"linear-gradient(135deg, #1e3a5f, #0ea5e9)",color:"#fff",fontWeight:800,fontSize:18,borderRadius:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center"},
  logoName:{fontWeight:700,fontSize:16,color:"#1e3a5f"},
  logoSub:{fontSize:11,color:"#64748b"},
  btnVolver:{background:"linear-gradient(135deg, #1e3a5f, #0ea5e9)",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontSize:14,fontWeight:600},
  hero:{background:"linear-gradient(135deg, #1e3a5f, #0ea5e9)",padding:"40px 48px",color:"#fff"},
  heroTitle:{margin:0,fontSize:32,fontWeight:800},
  heroSub:{margin:"8px 0 0",opacity:0.85,fontSize:15},
  content:{padding:"32px 48px"},
  kpiRow:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:16,marginBottom:24},
  kpiCard:{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"},
  kpiValue:{fontSize:22,fontWeight:800,color:"#0f172a",marginBottom:4},
  kpiLabel:{fontSize:12,color:"#64748b"},
  tableCard:{background:"#fff",borderRadius:16,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",overflow:"hidden"},
  tableHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:"1px solid #f1f5f9",flexWrap:"wrap",gap:12},
  tableTitle:{fontSize:15,fontWeight:700,color:"#0f172a"},
  filtros:{display:"flex",gap:8,flexWrap:"wrap"},
  filtroBtn:{padding:"6px 14px",borderRadius:20,border:"1.5px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:12,fontWeight:500,color:"#64748b"},
  filtroActivo:{background:"linear-gradient(135deg, #1e3a5f, #0ea5e9)",color:"#fff",borderColor:"transparent"},
  table:{width:"100%",borderCollapse:"collapse"},
  thead:{background:"#f8fafc"},
  th:{padding:"12px 20px",textAlign:"left",color:"#64748b",fontSize:12,fontWeight:600,borderBottom:"1px solid #f1f5f9"},
  td:{padding:"14px 20px",fontSize:13,borderBottom:"1px solid #f1f5f9",color:"#374151"},
  badge:{padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:600},
};

