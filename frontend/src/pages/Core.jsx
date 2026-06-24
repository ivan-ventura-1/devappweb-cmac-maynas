import { useEffect, useState } from "react";

const bandaConfig = {
  preventiva: { color: "#059669", bg: "#ecfdf5", icon: "🟢", label: "Preventiva" },
  temprana:   { color: "#d97706", bg: "#fffbeb", icon: "🟡", label: "Temprana" },
  tardia:     { color: "#dc2626", bg: "#fef2f2", icon: "🔴", label: "Tardia" },
  judicial:   { color: "#7c3aed", bg: "#f5f3ff", icon: "⚖️", label: "Judicial" },
  castigo:    { color: "#475569", bg: "#f8fafc", icon: "🚫", label: "Castigo" },
};
const estadoConfig = {
  pendiente:            { color: "#d97706", bg: "#fffbeb", label: "Pendiente" },
  en_evaluacion:        { color: "#0ea5e9", bg: "#e0f2fe", label: "En Evaluación" },
  rechazado_automatico: { color: "#dc2626", bg: "#fef2f2", label: "Rechazado (RDS)" },
  aprobado_scoring:     { color: "#7c3aed", bg: "#f5f3ff", label: "Aprobado por Scoring" },
  en_comite:            { color: "#f59e0b", bg: "#fef3c7", label: "En Comité" },
  aprobado:             { color: "#059669", bg: "#ecfdf5", label: "Aprobado" },
  rechazado:            { color: "#dc2626", bg: "#fef2f2", label: "Rechazado" },
  desembolsado:         { color: "#1e3a5f", bg: "#e0f2fe", label: "Desembolsado" },
};

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "bandeja", label: "Bandeja de Solicitudes", icon: "📋" },
  { key: "comite", label: "Propuesta y Comité", icon: "👥" },
  { key: "desembolso", label: "Aprobación y Desembolso", icon: "💰" },
  { key: "mora", label: "Mora y Recuperación", icon: "⚠️" },
  { key: "ahorros", label: "Captaciones / Ahorros", icon: "🏦" },
];

export default function Core() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [evalModal, setEvalModal] = useState(null);
  const [ingresoNeto, setIngresoNeto] = useState("");
  const [gastoFamiliar, setGastoFamiliar] = useState("");
  const [vista, setVista] = useState("dashboard");
  const [mora, setMora] = useState([]);
  const [cuentas, setCuentas] = useState([]);

  // Modales bandeja
  const [historialModal, setHistorialModal] = useState(null);
  const [informeModal, setInformeModal] = useState(null);

  // Modal gestión mora
  const [gestionModal, setGestionModal] = useState(null); // registro de mora
  const [obsGestion, setObsGestion] = useState("");
  const [guardandoGestion, setGuardandoGestion] = useState(false);

  // Historial mora expandido
  const [moraExpandida, setMoraExpandida] = useState(null); // id mora

  useEffect(() => { cargar(); }, []);

  const cargar = () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }
    fetch("http://localhost:3000/api/credito/todas", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setSolicitudes(d.data || []); setLoading(false); }).catch(() => setLoading(false));
    fetch("http://localhost:3000/api/ahorro/todas", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setCuentas(d.data || [])).catch(() => {});
    fetch("http://localhost:3000/api/mora/", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setMora(d.data || [])).catch(() => {});
  };

  const handleEstado = async (solicitudId, estado) => {
    const motivo = estado === "rechazado" ? prompt("Motivo de rechazo:") : null;
    const token = localStorage.getItem("token");
    await fetch("http://localhost:3000/api/credito/estado", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ solicitudId, estado, motivo })
    });
    cargar();
  };

  const handleEvaluar = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/credito/evaluacion", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ solicitudId: evalModal.id, ingresoNeto: parseFloat(ingresoNeto), gastoFamiliar: parseFloat(gastoFamiliar) })
    });
    const data = await res.json();
    if (data.success) { setEvalModal(null); setIngresoNeto(""); setGastoFamiliar(""); cargar(); }
  };

  // Registrar gestión de mora
  const handleGestion = async () => {
    if (!obsGestion.trim()) return;
    setGuardandoGestion(true);
    const token = localStorage.getItem("token");
    try {
      await fetch("http://localhost:3000/api/mora/gestion", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ moraId: gestionModal.id, observacion: obsGestion })
      });
      setGestionModal(null);
      setObsGestion("");
      cargar();
    } catch (e) {
      alert("Error al registrar gestión");
    }
    setGuardandoGestion(false);
  };

  const handleHistorial = (s) => {
    const solsCliente = solicitudes.filter(x => x.user_id === s.user_id);
    const cuentaCliente = cuentas.find(c => c.user_id === s.user_id);
    setHistorialModal({ userId: s.user_id, solicitudes: solsCliente, cuenta: cuentaCliente });
  };

  const handleInforme = (s) => setInformeModal(s);

  const solicitudesFiltradas = filtro === "todos" ? solicitudes : solicitudes.filter(s => s.estado === filtro);
  const pendientes   = solicitudes.filter(s => s.estado === "pendiente");
  const enComite     = solicitudes.filter(s => s.estado === "en_comite" || s.estado === "aprobado_scoring");
  const aprobadas    = solicitudes.filter(s => s.estado === "aprobado");
  const desembolsadas = solicitudes.filter(s => s.estado === "desembolsado");

  if (loading) return <div style={styles.loading}>Cargando...</div>;

  const renderTabla = (lista) => (
    <table style={styles.table}>
      <thead>
        <tr style={styles.thead}>
          {["Cliente ID","Monto","Cuota","RDS","Score","Estado","Acciones"].map(h => (
            <th key={h} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {lista.length === 0 ? (
          <tr><td colSpan={7} style={{textAlign:"center",padding:32,color:"#94a3b8"}}>Sin solicitudes</td></tr>
        ) : lista.map((s, i) => {
          const cfg = estadoConfig[s.estado] || estadoConfig.pendiente;
          return (
            <tr key={i} style={{background: i%2===0?"#fff":"#f8fafc"}}>
              <td style={styles.td}>{s.user_id?.slice(0,8)}...</td>
              <td style={{...styles.td,fontWeight:700}}>S/ {Number(s.monto).toFixed(2)}</td>
              <td style={{...styles.td,color:"#059669"}}>S/ {Number(s.cuota_mensual).toFixed(2)}</td>
              <td style={styles.td}>{s.rds!=null?`${s.rds}%`:"—"}</td>
              <td style={styles.td}>{s.score!=null?s.score:"—"}</td>
              <td style={styles.td}><span style={{...styles.badge,background:cfg.bg,color:cfg.color}}>{cfg.label}</span></td>
              <td style={styles.td}>
                <div style={styles.acciones}>
                  {s.estado==="pendiente" && <button style={styles.btnEvaluarTbl} onClick={()=>setEvalModal(s)}>Evaluar</button>}
                  {(s.estado==="aprobado_scoring"||s.estado==="en_comite") && (
                    <>
                      <button style={styles.btnAprobar} onClick={()=>handleEstado(s.id,"aprobado")}>✓ Aprobar</button>
                      <button style={styles.btnRechazar} onClick={()=>handleEstado(s.id,"rechazado")}>✗ Rechazar</button>
                    </>
                  )}
                  {s.estado==="aprobado" && <button style={styles.btnDesembolsar} onClick={()=>handleEstado(s.id,"desembolsado")}>💰 Desembolsar</button>}
                  {["rechazado","rechazado_automatico","desembolsado"].includes(s.estado) && <span style={{color:"#94a3b8",fontSize:12}}>—</span>}
                  <button style={styles.btnHistorial} onClick={()=>handleHistorial(s)}>📂 Historial</button>
                  <button style={styles.btnInforme} onClick={()=>handleInforme(s)}>📄 Informe REC</button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderContenido = () => {
    if (vista==="dashboard") {
      return (
        <>
          <div style={styles.kpiRow}>
            {[
              {label:"Total Solicitudes",value:solicitudes.length,color:"#1e3a5f",icon:"📋"},
              {label:"Pendientes",value:pendientes.length,color:"#d97706",icon:"⏳"},
              {label:"En Comité",value:enComite.length,color:"#7c3aed",icon:"👥"},
              {label:"Desembolsadas",value:desembolsadas.length,color:"#059669",icon:"💰"},
            ].map((k,i)=>(
              <div key={i} style={styles.kpiCard}>
                <div style={{...styles.kpiIcon,background:k.color+"15",color:k.color}}>{k.icon}</div>
                <div style={styles.kpiValue}>{k.value}</div>
                <div style={styles.kpiLabel}>{k.label}</div>
              </div>
            ))}
          </div>
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}><span style={styles.tableTitle}>Últimas solicitudes</span></div>
            {renderTabla(solicitudes.slice(0,5))}
          </div>
        </>
      );
    }
    if (vista==="bandeja") {
      return (
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}><span style={styles.tableTitle}>Bandeja de Solicitudes</span></div>
          <div style={{padding:"16px 20px 0"}}>
            <div style={styles.filtros}>
              {["todos","pendiente","en_evaluacion","rechazado_automatico","aprobado_scoring","en_comite","aprobado","desembolsado"].map(f=>(
                <button key={f} style={{...styles.filtroBtn,...(filtro===f?styles.filtroActivo:{})}} onClick={()=>setFiltro(f)}>
                  {f==="todos"?"Todos":estadoConfig[f]?.label} ({f==="todos"?solicitudes.length:solicitudes.filter(s=>s.estado===f).length})
                </button>
              ))}
            </div>
          </div>
          {renderTabla(solicitudesFiltradas)}
        </div>
      );
    }
    if (vista==="comite") {
      return (
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}><span style={styles.tableTitle}>Propuesta y Comité</span></div>
          {renderTabla(enComite)}
        </div>
      );
    }
    if (vista==="desembolso") {
      return (
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}><span style={styles.tableTitle}>Aprobación y Desembolso</span></div>
          {renderTabla(aprobadas)}
        </div>
      );
    }

    // ── MORA CON HISTORIAL ──────────────────────────────────────────────────
    if (vista==="mora") {
      return (
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <span style={styles.tableTitle}>Bandeja de Mora — {mora.length} créditos</span>
          </div>
          {/* KPIs por banda */}
          <div style={{padding:"16px 20px 0",display:"flex",gap:10,flexWrap:"wrap"}}>
            {Object.entries(bandaConfig).map(([b,cfg])=>(
              <div key={b} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,background:cfg.bg,color:cfg.color}}>
                {cfg.icon} {cfg.label}: {mora.filter(m=>m.banda===b).length}
              </div>
            ))}
          </div>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                {["Banda","Días Mora","Monto Deuda","Estado","Última Gestión","Observaciones","Acciones"].map(h=>(
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mora.length===0 ? (
                <tr><td colSpan={7} style={{textAlign:"center",padding:32,color:"#94a3b8"}}>Sin registros de mora</td></tr>
              ) : mora.map((m,i)=>{
                const cfg = bandaConfig[m.banda]||bandaConfig.preventiva;
                const expandido = moraExpandida===m.id;
                return (
                  <>
                    <tr key={i} style={{background:i%2===0?"#fff":"#f8fafc"}}>
                      <td style={styles.td}><span style={{...styles.badge,background:cfg.bg,color:cfg.color}}>{cfg.icon} {m.banda}</span></td>
                      <td style={{...styles.td,fontWeight:700,color:cfg.color}}>{m.dias_mora}</td>
                      <td style={styles.td}>S/ {Number(m.monto_deuda).toFixed(2)}</td>
                      <td style={styles.td}>
                        <span style={{...styles.badge,
                          background: m.estado_gestion==="gestionado"?"#ecfdf5":m.estado_gestion==="castigado"?"#f8fafc":"#fffbeb",
                          color: m.estado_gestion==="gestionado"?"#059669":m.estado_gestion==="castigado"?"#475569":"#d97706"
                        }}>
                          {m.estado_gestion}
                        </span>
                      </td>
                      <td style={{...styles.td,fontSize:11,color:"#94a3b8"}}>
                        {m.fecha_ultima_gestion ? new Date(m.fecha_ultima_gestion).toLocaleDateString("es-PE") : "Sin gestión"}
                      </td>
                      <td style={{...styles.td,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {m.observaciones||"—"}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.acciones}>
                          {/* Registrar nueva gestión */}
                          {!["castigado","judicial"].includes(m.estado_gestion) && (
                            <button style={styles.btnGestionar} onClick={()=>{setGestionModal(m);setObsGestion("");}}>
                              ✏️ Gestionar
                            </button>
                          )}
                          {/* Ver historial expandible */}
                          <button style={{...styles.btnHistorial,fontSize:11}} onClick={()=>setMoraExpandida(expandido?null:m.id)}>
                            {expandido?"▲ Ocultar":"📋 Historial"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Fila expandida con historial */}
                    {expandido && (
                      <tr key={`h-${i}`} style={{background:"#f0f9ff"}}>
                        <td colSpan={7} style={{padding:"16px 24px"}}>
                          <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f",marginBottom:10}}>
                            📋 Historial de Gestiones — {m.banda} ({m.dias_mora} días mora)
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
                            {[
                              {label:"Monto Deuda",value:`S/ ${Number(m.monto_deuda).toFixed(2)}`,color:"#dc2626"},
                              {label:"Días en Mora",value:`${m.dias_mora} días`,color:cfg.color},
                              {label:"Estado Gestión",value:m.estado_gestion,color:"#0ea5e9"},
                            ].map((item,j)=>(
                              <div key={j} style={{background:"#fff",borderRadius:8,padding:"10px 14px",border:"1px solid #e0f2fe"}}>
                                <div style={{fontSize:11,color:"#64748b"}}>{item.label}</div>
                                <div style={{fontSize:14,fontWeight:700,color:item.color}}>{item.value}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{background:"#fff",borderRadius:8,padding:"12px 16px",border:"1px solid #e0f2fe"}}>
                            <div style={{fontSize:12,fontWeight:600,color:"#64748b",marginBottom:6}}>ÚLTIMA OBSERVACIÓN REGISTRADA</div>
                            <div style={{fontSize:13,color:"#374151"}}>{m.observaciones||"Sin observaciones registradas"}</div>
                            {m.fecha_ultima_gestion && (
                              <div style={{fontSize:11,color:"#94a3b8",marginTop:6}}>
                                Registrado: {new Date(m.fecha_ultima_gestion).toLocaleString("es-PE")}
                              </div>
                            )}
                          </div>
                          {/* Reglas de transición */}
                          <div style={{marginTop:10,padding:"10px 14px",background:"#fef3c7",borderRadius:8,fontSize:12,color:"#92400e"}}>
                            ⚠️ Regla: {m.dias_mora>=181?"Castigo obligatorio (>180 días)":m.dias_mora>=121?"Derivar a Judicial (≥121 días)":m.dias_mora>=61?"Banda Tardía — requiere gestión intensiva":m.dias_mora>=31?"Banda Temprana — contacto preventivo":"Banda Preventiva — alerta temprana"}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    if (vista==="ahorros") {
      return (
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}><span style={styles.tableTitle}>Captaciones — Cuentas de Ahorro ({cuentas.length})</span></div>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                {["Cliente ID","Saldo","Meta Ahorro","Tasa Interes","Fecha Apertura"].map(h=>(
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cuentas.length===0 ? (
                <tr><td colSpan={5} style={{textAlign:"center",padding:32,color:"#94a3b8"}}>Sin cuentas registradas</td></tr>
              ) : cuentas.map((c,i)=>(
                <tr key={i} style={{background:i%2===0?"#fff":"#f8fafc"}}>
                  <td style={styles.td}>{c.user_id?.slice(0,8)}...</td>
                  <td style={{...styles.td,fontWeight:700,color:"#059669"}}>S/ {Number(c.saldo).toFixed(2)}</td>
                  <td style={styles.td}>S/ {Number(c.meta_ahorro).toFixed(2)}</td>
                  <td style={styles.td}>{c.tasa_interes}%</td>
                  <td style={{...styles.td,color:"#94a3b8",fontSize:12}}>{new Date(c.fecha_apertura).toLocaleDateString("es-PE")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  };

  // ── MODAL HISTORIAL CLIENTE ────────────────────────────────────────────────
  const renderHistorialModal = () => {
    if (!historialModal) return null;
    const {userId, solicitudes:sols, cuenta} = historialModal;
    return (
      <div style={styles.overlay} onClick={e=>e.target===e.currentTarget&&setHistorialModal(null)}>
        <div style={{...styles.modal,width:620,maxHeight:"80vh",overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{margin:0,fontSize:17,color:"#0f172a"}}>📂 Historial del Cliente</h3>
            <button onClick={()=>setHistorialModal(null)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#64748b"}}>✕</button>
          </div>
          <div style={{fontSize:12,color:"#64748b",marginBottom:16,padding:"8px 12px",background:"#f8fafc",borderRadius:8}}>ID: {userId}</div>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f",marginBottom:8}}>🏦 Cuenta de Ahorro</div>
            {cuenta ? (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                {[
                  {label:"Saldo",value:`S/ ${Number(cuenta.saldo).toFixed(2)}`,color:"#059669"},
                  {label:"Meta",value:`S/ ${Number(cuenta.meta_ahorro).toFixed(2)}`,color:"#0ea5e9"},
                  {label:"Tasa",value:`${cuenta.tasa_interes}% TEA`,color:"#7c3aed"},
                ].map((item,i)=>(
                  <div key={i} style={{background:"#f8fafc",borderRadius:10,padding:"10px 14px"}}>
                    <div style={{fontSize:11,color:"#64748b"}}>{item.label}</div>
                    <div style={{fontSize:15,fontWeight:700,color:item.color}}>{item.value}</div>
                  </div>
                ))}
              </div>
            ) : <div style={{color:"#94a3b8",fontSize:13}}>Sin cuenta de ahorro registrada</div>}
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f",marginBottom:8}}>📋 Solicitudes ({sols.length})</div>
            {sols.map((s,i)=>{
              const cfg = estadoConfig[s.estado]||estadoConfig.pendiente;
              return (
                <div key={i} style={{border:"1px solid #f1f5f9",borderRadius:10,padding:"12px 14px",marginBottom:8,background:"#fff"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <span style={{fontWeight:700,color:"#0f172a"}}>S/ {Number(s.monto).toFixed(2)}</span>
                      <span style={{color:"#64748b",fontSize:12,marginLeft:8}}>{s.plazo_meses} meses — TEA {s.tasa_anual}%</span>
                    </div>
                    <span style={{...styles.badge,background:cfg.bg,color:cfg.color}}>{cfg.label}</span>
                  </div>
                  <div style={{display:"flex",gap:16,marginTop:8,fontSize:12,color:"#64748b"}}>
                    <span>Cuota: <b style={{color:"#059669"}}>S/ {Number(s.cuota_mensual).toFixed(2)}</b></span>
                    {s.rds!=null&&<span>RDS: <b>{s.rds}%</b></span>}
                    {s.score!=null&&<span>Score: <b>{s.score}</b></span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ── MODAL INFORME REC ──────────────────────────────────────────────────────
  const renderInformeModal = () => {
    if (!informeModal) return null;
    const s = informeModal;
    const disponible = s.ingreso_neto&&s.gasto_familiar ? s.ingreso_neto-s.gasto_familiar : null;
    const capacidadOK = s.rds!=null ? s.rds<=40 : null;
    const scoreOK = s.score!=null ? s.score>=60 : null;
    const nivelLabel = {asesor:"Asesor de Negocios",comite:"Comité de Créditos",jefe_regional:"Jefe Regional"};
    const fechaHoy = new Date().toLocaleDateString("es-PE",{day:"2-digit",month:"long",year:"numeric"});
    return (
      <div style={styles.overlay} onClick={e=>e.target===e.currentTarget&&setInformeModal(null)}>
        <div style={{...styles.modal,width:560,maxHeight:"85vh",overflowY:"auto"}}>
          <div style={{background:"linear-gradient(135deg, #1e3a5f, #0ea5e9)",borderRadius:10,padding:"16px 20px",marginBottom:20,color:"#fff"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontWeight:800,fontSize:16}}>CMAC MAYNAS</div>
                <div style={{fontSize:12,opacity:0.85}}>Informe de Evaluación Crediticia (REC)</div>
              </div>
              <button onClick={()=>setInformeModal(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",cursor:"pointer",padding:"4px 10px",fontSize:13}}>✕</button>
            </div>
            <div style={{marginTop:12,fontSize:12,opacity:0.8}}>Fecha: {fechaHoy}</div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#64748b",textTransform:"uppercase",marginBottom:8}}>Datos del Crédito</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {label:"Monto Solicitado",value:`S/ ${Number(s.monto).toFixed(2)}`},
                {label:"Plazo",value:`${s.plazo_meses} meses`},
                {label:"TEA",value:`${s.tasa_anual}%`},
                {label:"Cuota Mensual",value:`S/ ${Number(s.cuota_mensual).toFixed(2)}`},
                {label:"Tipo",value:s.proposito||"Capital de trabajo"},
                {label:"Nivel Aprobación",value:nivelLabel[s.nivel_aprobacion]||s.nivel_aprobacion||"—"},
              ].map((item,i)=>(
                <div key={i} style={{background:"#f8fafc",borderRadius:8,padding:"10px 14px"}}>
                  <div style={{fontSize:11,color:"#94a3b8"}}>{item.label}</div>
                  <div style={{fontSize:14,fontWeight:600,color:"#0f172a"}}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#64748b",textTransform:"uppercase",marginBottom:8}}>Evaluación Financiera</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {label:"Ingreso Neto",value:s.ingreso_neto?`S/ ${Number(s.ingreso_neto).toFixed(2)}`:"—"},
                {label:"Gasto Familiar",value:s.gasto_familiar?`S/ ${Number(s.gasto_familiar).toFixed(2)}`:"—"},
                {label:"Ingreso Disponible",value:disponible?`S/ ${Number(disponible).toFixed(2)}`:"—"},
                {label:"RDS",value:s.rds!=null?`${s.rds}%`:"—"},
              ].map((item,i)=>(
                <div key={i} style={{background:"#f8fafc",borderRadius:8,padding:"10px 14px"}}>
                  <div style={{fontSize:11,color:"#94a3b8"}}>{item.label}</div>
                  <div style={{fontSize:14,fontWeight:600,color:"#0f172a"}}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#64748b",textTransform:"uppercase",marginBottom:8}}>Resultado del Scoring</div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1,borderRadius:10,padding:"14px 16px",background:capacidadOK===null?"#f8fafc":capacidadOK?"#ecfdf5":"#fef2f2",border:`1.5px solid ${capacidadOK===null?"#e2e8f0":capacidadOK?"#a7f3d0":"#fecaca"}`}}>
                <div style={{fontSize:11,color:"#64748b"}}>Capacidad de Pago (RDS ≤ 40%)</div>
                <div style={{fontSize:20,fontWeight:800,color:capacidadOK===null?"#94a3b8":capacidadOK?"#059669":"#dc2626"}}>
                  {capacidadOK===null?"—":capacidadOK?"✓ APTO":"✗ NO APTO"}
                </div>
                <div style={{fontSize:12,color:"#64748b"}}>RDS: {s.rds!=null?`${s.rds}%`:"Sin evaluar"}</div>
              </div>
              <div style={{flex:1,borderRadius:10,padding:"14px 16px",background:scoreOK===null?"#f8fafc":scoreOK?"#ecfdf5":"#fef3c7",border:`1.5px solid ${scoreOK===null?"#e2e8f0":scoreOK?"#a7f3d0":"#fde68a"}`}}>
                <div style={{fontSize:11,color:"#64748b"}}>Score Crediticio (≥ 60)</div>
                <div style={{fontSize:20,fontWeight:800,color:scoreOK===null?"#94a3b8":scoreOK?"#059669":"#d97706"}}>
                  {s.score!=null?s.score:"—"} pts
                </div>
                <div style={{fontSize:12,color:"#64748b"}}>{scoreOK===null?"Sin evaluar":scoreOK?"Aprobado por scoring":"Requiere comité"}</div>
              </div>
            </div>
          </div>
          <div style={{borderRadius:10,padding:"14px 16px",background:(estadoConfig[s.estado]||estadoConfig.pendiente).bg,border:`1.5px solid ${(estadoConfig[s.estado]||estadoConfig.pendiente).color}30`}}>
            <div style={{fontSize:12,color:"#64748b",marginBottom:4}}>Resolución actual</div>
            <div style={{fontSize:16,fontWeight:800,color:(estadoConfig[s.estado]||estadoConfig.pendiente).color}}>
              {(estadoConfig[s.estado]||estadoConfig.pendiente).label}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── MODAL GESTIÓN MORA ────────────────────────────────────────────────────
  const renderGestionModal = () => {
    if (!gestionModal) return null;
    const cfg = bandaConfig[gestionModal.banda]||bandaConfig.preventiva;
    return (
      <div style={styles.overlay} onClick={e=>e.target===e.currentTarget&&setGestionModal(null)}>
        <div style={{...styles.modal,width:460}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{margin:0,fontSize:17,color:"#0f172a"}}>✏️ Registrar Gestión de Cobranza</h3>
            <button onClick={()=>setGestionModal(null)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#64748b"}}>✕</button>
          </div>

          {/* Info del crédito */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
            <div style={{background:cfg.bg,borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:11,color:"#64748b"}}>Banda</div>
              <div style={{fontSize:13,fontWeight:700,color:cfg.color}}>{cfg.icon} {gestionModal.banda}</div>
            </div>
            <div style={{background:"#fef2f2",borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:11,color:"#64748b"}}>Días mora</div>
              <div style={{fontSize:13,fontWeight:700,color:"#dc2626"}}>{gestionModal.dias_mora} días</div>
            </div>
            <div style={{background:"#f8fafc",borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:11,color:"#64748b"}}>Deuda</div>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>S/ {Number(gestionModal.monto_deuda).toFixed(2)}</div>
            </div>
          </div>

          {/* Última gestión */}
          {gestionModal.observaciones && (
            <div style={{background:"#f8fafc",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:12}}>
              <div style={{color:"#64748b",marginBottom:4}}>Última observación:</div>
              <div style={{color:"#374151"}}>{gestionModal.observaciones}</div>
              {gestionModal.fecha_ultima_gestion && (
                <div style={{color:"#94a3b8",marginTop:4,fontSize:11}}>
                  {new Date(gestionModal.fecha_ultima_gestion).toLocaleString("es-PE")}
                </div>
              )}
            </div>
          )}

          {/* Nueva gestión */}
          <div style={styles.field}>
            <label style={styles.label}>Nueva observación de gestión</label>
            <textarea
              rows={4}
              style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1.5px solid #e2e8f0",fontSize:13,resize:"vertical",fontFamily:"inherit"}}
              value={obsGestion}
              onChange={e=>setObsGestion(e.target.value)}
              placeholder="Ej: Se contactó al cliente vía telefónica, comprometió pago para el 30/06/2026..."
            />
          </div>

          <div style={styles.modalBtns}>
            <button style={styles.btnCancel} onClick={()=>setGestionModal(null)}>Cancelar</button>
            <button
              style={{...styles.btnEval,opacity:(!obsGestion.trim()||guardandoGestion)?0.6:1}}
              onClick={handleGestion}
              disabled={!obsGestion.trim()||guardandoGestion}
            >
              {guardandoGestion?"Guardando...":"✓ Registrar Gestión"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      {evalModal && (
        <div style={styles.overlay} onClick={e=>e.target===e.currentTarget&&setEvalModal(null)}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Registrar Evaluación — S/ {Number(evalModal.monto).toFixed(2)}</h3>
            <p style={styles.modalSub}>Cuota mensual: S/ {Number(evalModal.cuota_mensual).toFixed(2)}</p>
            <div style={styles.field}>
              <label style={styles.label}>Ingreso Neto Mensual (S/)</label>
              <input type="number" style={styles.input} value={ingresoNeto} onChange={e=>setIngresoNeto(e.target.value)} placeholder="Ej: 2500" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Gasto Familiar Mensual (S/)</label>
              <input type="number" style={styles.input} value={gastoFamiliar} onChange={e=>setGastoFamiliar(e.target.value)} placeholder="Ej: 800" />
            </div>
            <div style={styles.modalBtns}>
              <button style={styles.btnCancel} onClick={()=>setEvalModal(null)}>Cancelar</button>
              <button style={styles.btnEval} onClick={handleEvaluar} disabled={!ingresoNeto||!gastoFamiliar}>Calcular RDS y Score</button>
            </div>
          </div>
        </div>
      )}

      {renderHistorialModal()}
      {renderInformeModal()}
      {renderGestionModal()}

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.logo}>CM</div>
          <div>
            <div style={styles.logoName}>CMAC Maynas</div>
            <div style={styles.logoSub}>Core Bancario — Panel del Asesor</div>
          </div>
        </div>
        <button style={styles.btnVolver} onClick={()=>window.location.href="/dashboard"}>← Dashboard</button>
      </nav>

      <div style={styles.tabsBar}>
        {TABS.map(t=>(
          <button key={t.key} style={{...styles.tabBtn,...(vista===t.key?styles.tabBtnActive:{})}} onClick={()=>setVista(t.key)}>
            <span style={{marginRight:6}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>{renderContenido()}</div>
    </div>
  );
}

const styles = {
  page:{minHeight:"100vh",background:"#f8f9ff",fontFamily:"'Segoe UI', sans-serif"},
  nav:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 48px",background:"#fff",boxShadow:"0 1px 0 #e5e7eb"},
  navLeft:{display:"flex",alignItems:"center",gap:12},
  logo:{background:"linear-gradient(135deg, #1e3a5f, #0ea5e9)",color:"#fff",fontWeight:800,fontSize:18,borderRadius:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center"},
  logoName:{fontWeight:700,fontSize:16,color:"#1e3a5f"},
  logoSub:{fontSize:11,color:"#64748b"},
  btnVolver:{background:"linear-gradient(135deg, #1e3a5f, #0ea5e9)",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontSize:14,fontWeight:600},
  tabsBar:{display:"flex",gap:8,padding:"16px 48px",background:"#fff",borderBottom:"1px solid #f1f5f9",flexWrap:"wrap"},
  tabBtn:{padding:"10px 18px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"#f8fafc",cursor:"pointer",fontSize:13,fontWeight:600,color:"#64748b"},
  tabBtnActive:{background:"linear-gradient(135deg, #1e3a5f, #0ea5e9)",color:"#fff",borderColor:"transparent"},
  content:{padding:"28px 48px"},
  kpiRow:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:16,marginBottom:24},
  kpiCard:{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"},
  kpiIcon:{width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:12},
  kpiValue:{fontSize:26,fontWeight:800,color:"#0f172a"},
  kpiLabel:{fontSize:12,color:"#64748b",marginTop:2},
  filtros:{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"},
  filtroBtn:{padding:"6px 14px",borderRadius:20,border:"1.5px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:12,fontWeight:500,color:"#64748b"},
  filtroActivo:{background:"linear-gradient(135deg, #1e3a5f, #0ea5e9)",color:"#fff",borderColor:"transparent"},
  tableCard:{background:"#fff",borderRadius:16,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",overflow:"hidden"},
  tableHeader:{padding:"16px 20px 0"},
  tableTitle:{fontSize:15,fontWeight:700,color:"#0f172a"},
  table:{width:"100%",borderCollapse:"collapse",marginTop:12},
  thead:{background:"#f8fafc"},
  th:{padding:"12px 16px",textAlign:"left",color:"#64748b",fontSize:12,fontWeight:600,borderBottom:"1px solid #f1f5f9"},
  td:{padding:"14px 16px",fontSize:13,borderBottom:"1px solid #f1f5f9",color:"#374151"},
  badge:{padding:"4px 10px",borderRadius:20,fontSize:12,fontWeight:600},
  acciones:{display:"flex",gap:6,flexWrap:"wrap"},
  btnEvaluarTbl:{background:"#e0f2fe",color:"#0369a1",border:"1px solid #bae6fd",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:12,fontWeight:600},
  btnAprobar:{background:"#ecfdf5",color:"#059669",border:"1px solid #a7f3d0",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:12,fontWeight:600},
  btnRechazar:{background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:12,fontWeight:600},
  btnDesembolsar:{background:"#e0f2fe",color:"#1e3a5f",border:"1px solid #bae6fd",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:12,fontWeight:600},
  btnHistorial:{background:"#fef3c7",color:"#92400e",border:"1px solid #fde68a",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:12,fontWeight:600},
  btnInforme:{background:"#f5f3ff",color:"#5b21b6",border:"1px solid #ddd6fe",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:12,fontWeight:600},
  btnGestionar:{background:"#ecfdf5",color:"#065f46",border:"1px solid #a7f3d0",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:12,fontWeight:600},
  loading:{padding:32,color:"#64748b",fontFamily:"sans-serif"},
  overlay:{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000},
  modal:{background:"#fff",borderRadius:16,padding:28,width:400,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"},
  modalTitle:{margin:"0 0 4px",fontSize:18,color:"#0f172a"},
  modalSub:{color:"#64748b",fontSize:13,marginBottom:20},
  field:{marginBottom:16},
  label:{display:"block",fontSize:13,fontWeight:500,color:"#374151",marginBottom:6},
  input:{width:"100%",padding:"10px 14px",borderRadius:8,border:"1.5px solid #e2e8f0",fontSize:14},
  modalBtns:{display:"flex",gap:10,marginTop:8},
  btnCancel:{flex:1,padding:"11px 0",borderRadius:8,border:"1.5px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:14},
  btnEval:{flex:1,padding:"11px 0",borderRadius:8,border:"none",background:"linear-gradient(135deg, #1e3a5f, #0ea5e9)",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:600},
};
