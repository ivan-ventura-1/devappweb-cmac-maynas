import { useEffect, useState } from "react";
import ModalSolicitud from "../components/ModalSolicitud";

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [userId, setUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [exito, setExito] = useState(null);
  const [cuentaAhorro, setCuentaAhorro] = useState(null);
  const [depositoModal, setDepositoModal] = useState(false);
  const [montoDeposito, setMontoDeposito] = useState("");
  const [movimientos, setMovimientos] = useState([]);
  const [cronogramaAbierto, setCronogramaAbierto] = useState(null); // id de solicitud

  useEffect(() => {
    const u = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (!u || u === "undefined") {
      setUsuario({ email: "cliente@cmac.com", nombre: "Cliente" });
      setUserId("a8e4b064-ca59-464e-9f69-baa40e1a529f");
      cargarSolicitudes("a8e4b064-ca59-464e-9f69-baa40e1a529f", token);
      cargarAhorro("a8e4b064-ca59-464e-9f69-baa40e1a529f", token);
      cargarMovimientos("a8e4b064-ca59-464e-9f69-baa40e1a529f", token);
      return;
    }
    try {
      const parsed = JSON.parse(u);
      setUsuario(parsed);
      setUserId(parsed.id);
      if (parsed.id && token) {
        cargarSolicitudes(parsed.id, token);
        cargarAhorro(parsed.id, token);
        cargarMovimientos(parsed.id, token);
      }
    } catch(e) {
      setUsuario({ email: "cliente@cmac.com", nombre: "Cliente" });
    }
  }, []);

  const cargarMovimientos = (uid, token) => {
    fetch(`http://localhost:3000/api/movimientos/${uid}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setMovimientos(d.data || []); })
      .catch(() => {});
  };

  const handleDeposito = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/ahorro/depositar", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, monto: parseFloat(montoDeposito) })
    });
    const data = await res.json();
    if (data.success) { setCuentaAhorro(data.data); setDepositoModal(false); setMontoDeposito(""); }
  };

  const cargarAhorro = (uid, token) => {
    fetch(`http://localhost:3000/api/ahorro/cuenta/${uid}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setCuentaAhorro(d.data); })
      .catch(() => {});
  };

  const cargarSolicitudes = (uid, token) => {
    fetch(`http://localhost:3000/api/credito/solicitudes/${uid}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setSolicitudes(d.data || []); })
      .catch(() => {});
  };

  const handleExito = (solicitud) => {
    setModalOpen(false);
    setExito(solicitud);
    setSolicitudes(prev => [solicitud, ...prev]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/";
  };

  // ── GENERAR CRONOGRAMA ────────────────────────────────────────────────────
  const generarCronograma = (monto, plazo, tea, cuota) => {
    const tem = Math.pow(1 + tea / 100, 1 / 12) - 1;
    const filas = [];
    let saldo = Number(monto);
    const cuotaFija = Number(cuota);
    const hoy = new Date();

    for (let n = 1; n <= plazo; n++) {
      const interes = saldo * tem;
      const capital = cuotaFija - interes;
      saldo = Math.max(0, saldo - capital);
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + n, hoy.getDate());
      filas.push({
        n,
        fecha: fecha.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" }),
        cuota: cuotaFija.toFixed(2),
        capital: capital.toFixed(2),
        interes: interes.toFixed(2),
        saldo: saldo.toFixed(2),
      });
    }
    return filas;
  };

  const estadoColor = { pendiente: "#d97706", aprobado: "#059669", rechazado: "#dc2626", desembolsado: "#1e3a5f", aprobado_scoring: "#7c3aed", en_comite: "#f59e0b" };
  const estadoBg = { pendiente: "#fffbeb", aprobado: "#ecfdf5", rechazado: "#fef2f2", desembolsado: "#e0f2fe", aprobado_scoring: "#f5f3ff", en_comite: "#fef3c7" };

  if (!usuario) return <div style={{padding:32,color:"#64748b"}}>Cargando...</div>;

  const ModalDeposito = () => (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={(e) => e.target === e.currentTarget && setDepositoModal(false)}>
      <div style={{background:"#fff",borderRadius:16,padding:28,width:360,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <h3 style={{margin:"0 0 4px",fontSize:18,color:"#0f172a"}}>Depositar a mi cuenta</h3>
        <p style={{color:"#64748b",fontSize:13,marginBottom:20}}>Saldo actual: S/ {Number(cuentaAhorro?.saldo || 0).toFixed(2)}</p>
        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:13,fontWeight:500,color:"#374151",marginBottom:6}}>Monto a depositar (S/)</label>
          <input type="number" style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1.5px solid #e2e8f0",fontSize:14}} value={montoDeposito} onChange={(e) => setMontoDeposito(e.target.value)} placeholder="Ej: 100" />
        </div>
        <div style={{display:"flex",gap:10}}>
          <button style={{flex:1,padding:"11px 0",borderRadius:8,border:"1.5px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:14}} onClick={() => setDepositoModal(false)}>Cancelar</button>
          <button style={{flex:1,padding:"11px 0",borderRadius:8,border:"none",background:"linear-gradient(135deg, #1e3a5f, #0ea5e9)",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:600}} onClick={handleDeposito} disabled={!montoDeposito}>Depositar</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      {depositoModal && <ModalDeposito />}
      {modalOpen && <ModalSolicitud onClose={() => setModalOpen(false)} userId={userId || "a8e4b064-ca59-464e-9f69-baa40e1a529f"} onExito={handleExito} />}

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.logo}>CM</div>
          <div>
            <div style={styles.logoName}>CMAC Maynas</div>
            <div style={styles.logoSub}>Banca por Internet</div>
          </div>
        </div>
        <div style={styles.navLinks}>
          {["Inicio", "Mis Cuentas", "Préstamos", "Transferencias", "Pagos"].map(l => (
            <a key={l} style={styles.navLink}>{l}</a>
          ))}
        </div>
        <div style={styles.navRight}>
          <div style={styles.userBadge}>{(usuario.nombre || usuario.email)?.[0]?.toUpperCase()}</div>
          <button style={styles.btnLogout} onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Bienvenido, {usuario.nombre || usuario.email} 👋</h1>
        <p style={styles.heroSub}>Aquí tienes un resumen de tu actividad financiera</p>
      </div>

      <div style={styles.content}>
        {exito && (
          <div style={styles.exitoBox}>
            ✅ Solicitud enviada — Cuota mensual: <strong>S/ {exito.cuota_mensual}</strong> — Estado: <strong>{exito.estado}</strong>
          </div>
        )}

        <div style={styles.cards}>
          {[
            { label: "Cuenta de Ahorros", value: `S/ ${Number(cuentaAhorro?.saldo || 0).toFixed(2)}`, sub: cuentaAhorro ? "Saldo disponible" : "Sin cuenta", icon: "🏦", color: "#0ea5e9" },
            { label: "Créditos Activos", value: solicitudes.filter(s => s.estado !== "rechazado").length.toString(), sub: "Solicitudes activas", icon: "📋", color: "#8b5cf6" },
            { label: "Próxima Cuota", value: `S/ ${solicitudes.find(s => s.estado === "desembolsado")?.cuota_mensual || solicitudes[0]?.cuota_mensual || "0.00"}`, sub: solicitudes.length ? "Ver detalle abajo" : "Sin cuotas", icon: "📅", color: "#059669" },
          ].map((c, i) => (
            <div key={i} style={styles.card}>
              <div style={{ ...styles.cardIcon, background: c.color + "15", color: c.color }}>{c.icon}</div>
              <div style={styles.cardLabel}>{c.label}</div>
              <div style={styles.cardValue}>{c.value}</div>
              <div style={styles.cardSub}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div style={styles.chartsRow}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Estado de Solicitudes</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8}}>
              {[
                {label:"Desembolsado",count:solicitudes.filter(s=>s.estado==="desembolsado").length,color:"#1e3a5f"},
                {label:"Aprobado",count:solicitudes.filter(s=>s.estado==="aprobado"||s.estado==="aprobado_scoring").length,color:"#059669"},
                {label:"Pendiente",count:solicitudes.filter(s=>s.estado==="pendiente").length,color:"#d97706"},
                {label:"Rechazado",count:solicitudes.filter(s=>s.estado==="rechazado").length,color:"#dc2626"},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:12,height:12,borderRadius:"50%",background:item.color,flexShrink:0}}></div>
                  <div style={{flex:1,fontSize:13,color:"#374151"}}>{item.label}</div>
                  <div style={{width:`${Math.min(item.count*40,160)}px`,height:18,background:item.color,borderRadius:4,opacity:0.7,minWidth:4}}></div>
                  <div style={{fontSize:13,fontWeight:700,color:item.color,minWidth:24}}>{item.count}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Resumen de Movimientos (S/)</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8}}>
              {[
                {label:"Depósitos",monto:movimientos.filter(m=>m.tipo==="deposito").reduce((a,m)=>a+Number(m.monto),0),color:"#059669"},
                {label:"Créditos",monto:movimientos.filter(m=>m.tipo==="credito").reduce((a,m)=>a+Number(m.monto),0),color:"#1e3a5f"},
                {label:"Pagos Cuota",monto:movimientos.filter(m=>m.tipo==="pago_cuota").reduce((a,m)=>a+Number(m.monto),0),color:"#d97706"},
                {label:"Retiros",monto:movimientos.filter(m=>m.tipo==="retiro").reduce((a,m)=>a+Number(m.monto),0),color:"#dc2626"},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:12,height:12,borderRadius:"50%",background:item.color,flexShrink:0}}></div>
                  <div style={{flex:1,fontSize:13,color:"#374151"}}>{item.label}</div>
                  <div style={{width:`${Math.min(item.monto/40,160)}px`,height:18,background:item.color,borderRadius:4,opacity:0.7,minWidth:4}}></div>
                  <div style={{fontSize:13,fontWeight:700,color:item.color,minWidth:80}}>S/ {item.monto.toFixed(0)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Acciones Rápidas</h2>
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={() => setModalOpen(true)}>+ Nueva Solicitud</button>
            <button style={{...styles.btnSecondary, borderColor:"#059669", color:"#059669"}} onClick={() => setDepositoModal(true)}>+ Depositar Ahorro</button>
            <button style={styles.btnSecondary} onClick={() => window.location.href="/mora"}>Ver Mora</button>
            <button style={{...styles.btnSecondary, borderColor:"#0ea5e9", color:"#0ea5e9"}} onClick={() => window.location.href="/calculadora.html"}>Calculadora</button>
            <button style={{...styles.btnSecondary, borderColor:"#1e3a5f", color:"#1e3a5f"}} onClick={() => window.location.href="/core"}>Panel Core</button>
            <button style={{...styles.btnSecondary, borderColor:"#8b5cf6", color:"#8b5cf6"}} onClick={() => window.location.href="/movimientos"}>Ver Movimientos</button>
          </div>
        </div>

        {solicitudes.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Mis Solicitudes</h2>
            {solicitudes.map((s, i) => {
              const abierto = cronogramaAbierto === s.id;
              const cronograma = abierto ? generarCronograma(s.monto, s.plazo_meses, s.tasa_anual, s.cuota_mensual) : [];
              return (
                <div key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {/* Fila principal */}
                  <div style={styles.solicitudRow}>
                    <div>
                      <div style={styles.solicitudMonto}>S/ {Number(s.monto).toFixed(2)}</div>
                      <div style={styles.solicitudDetalle}>{s.plazo_meses} meses — TEA {s.tasa_anual}% — Cuota S/ {Number(s.cuota_mensual).toFixed(2)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ padding:"5px 12px", borderRadius:20, fontSize:12, fontWeight:600, background: estadoBg[s.estado] || "#f1f5f9", color: estadoColor[s.estado] || "#64748b" }}>
                        {s.estado}
                      </span>
                      {s.estado === "desembolsado" && (
                        <button
                          style={{ background: abierto ? "#1e3a5f" : "#e0f2fe", color: abierto ? "#fff" : "#1e3a5f", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                          onClick={() => setCronogramaAbierto(abierto ? null : s.id)}
                        >
                          {abierto ? "▲ Ocultar" : "📅 Cronograma"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cronograma expandible */}
                  {abierto && (
                    <div style={{ padding: "16px 0 20px", overflowX: "auto" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f", marginBottom: 10 }}>
                        Cronograma de Pagos — {s.plazo_meses} cuotas de S/ {Number(s.cuota_mensual).toFixed(2)}
                      </div>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: "#f8fafc" }}>
                            {["N°", "Fecha de Pago", "Cuota", "Capital", "Interés", "Saldo"].map(h => (
                              <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#64748b", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {cronograma.map((fila, j) => (
                            <tr key={j} style={{ background: j % 2 === 0 ? "#fff" : "#f8fafc" }}>
                              <td style={{ padding: "7px 12px", color: "#64748b" }}>{fila.n}</td>
                              <td style={{ padding: "7px 12px", color: "#374151" }}>{fila.fecha}</td>
                              <td style={{ padding: "7px 12px", fontWeight: 700, color: "#0f172a" }}>S/ {fila.cuota}</td>
                              <td style={{ padding: "7px 12px", color: "#1e3a5f" }}>S/ {fila.capital}</td>
                              <td style={{ padding: "7px 12px", color: "#dc2626" }}>S/ {fila.interes}</td>
                              <td style={{ padding: "7px 12px", color: "#059669" }}>S/ {fila.saldo}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8f9ff", fontFamily: "'Segoe UI', sans-serif" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 48px", background: "#fff", boxShadow: "0 1px 0 #e5e7eb", position: "sticky", top: 0, zIndex: 100 },
  navLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", color: "#fff", fontWeight: 800, fontSize: 18, borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" },
  logoName: { fontWeight: 700, fontSize: 16, color: "#1e3a5f" },
  logoSub: { fontSize: 11, color: "#64748b" },
  navLinks: { display: "flex", gap: 28 },
  navLink: { color: "#374151", fontSize: 14, fontWeight: 500, cursor: "pointer", textDecoration: "none" },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  userBadge: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", color: "#fff", fontWeight: 700, fontSize: 16, borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" },
  btnLogout: { background: "none", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, color: "#64748b", fontWeight: 500 },
  hero: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", padding: "40px 48px", color: "#fff" },
  heroTitle: { margin: 0, fontSize: 28, fontWeight: 800 },
  heroSub: { margin: "8px 0 0", opacity: 0.85, fontSize: 15 },
  content: { padding: "32px 48px" },
  exitoBox: { background: "#ecfdf5", color: "#065f46", padding: "14px 20px", borderRadius: 12, marginBottom: 24, fontSize: 14, border: "1px solid #a7f3d0" },
  cards: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 },
  card: { background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  cardIcon: { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 },
  cardLabel: { fontSize: 13, color: "#64748b", marginBottom: 6 },
  cardValue: { fontSize: 30, fontWeight: 800, color: "#0f172a", marginBottom: 4 },
  cardSub: { fontSize: 12, color: "#94a3b8" },
  chartsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 },
  chartCard: { background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", minHeight: 280 },
  chartTitle: { margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a" },
  section: { background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 20 },
  sectionTitle: { margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0f172a" },
  btnRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  btnPrimary: { background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  btnSecondary: { background: "#fff", color: "#1e3a5f", border: "2px solid #1e3a5f", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  solicitudRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" },
  solicitudMonto: { fontSize: 16, fontWeight: 700, color: "#0f172a" },
  solicitudDetalle: { fontSize: 12, color: "#64748b", marginTop: 2 },
};
