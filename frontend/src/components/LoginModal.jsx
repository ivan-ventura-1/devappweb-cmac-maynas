import { useState } from "react";

export default function LoginModal({ open, onClose }) {
  const [tab, setTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ dni: "", cuenta: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginData.email, password: loginData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al iniciar sesion");
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("usuario", JSON.stringify(data.data.usuario));
      localStorage.setItem("rol", data.data.usuario?.rol || "cliente");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Error al iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("Registro con:", registerData);
    } catch (err) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.leftPanel}>
          <div style={styles.brandIcon}>CM</div>
          <h2 style={styles.brandTitle}>CMAC Maynas</h2>
          <p style={styles.brandSub}>Banca por Internet</p>
          <div style={styles.features}>
            {["Conexion cifrada SSL","Supervisado por la SBS","Acceso 24/7","Desde la Amazonia"].map(f => (
              <div key={f} style={styles.feature}>{f}</div>
            ))}
          </div>
        </div>
        <div style={styles.rightPanel}>
          <button style={styles.closeBtn} onClick={onClose}>X</button>
          <h3 style={styles.formTitle}>{tab === "login" ? "Iniciar sesion" : "Crear cuenta"}</h3>
          <div style={styles.tabs}>
            <button style={{ ...styles.tab, ...(tab === "login" ? styles.tabActive : {}) }} onClick={() => { setTab("login"); setError(""); }}>Ingresar</button>
            <button style={{ ...styles.tab, ...(tab === "register" ? styles.tabActive : {}) }} onClick={() => { setTab("register"); setError(""); }}>Registrarme</button>
          </div>
          {error && <div style={styles.error}>{error}</div>}
          {tab === "login" && (
            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Correo electronico</label>
                <input type="email" required style={styles.input} placeholder="tu@correo.com" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Contrasena</label>
                <input type="password" required style={styles.input} placeholder="••••••••" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
              </div>
              <a style={styles.forgot}>Olvidaste tu contrasena?</a>
              <button type="submit" style={styles.btnSubmit} disabled={loading}>{loading ? "Ingresando..." : "Ingresar a mi cuenta"}</button>
            </form>
          )}
          {tab === "register" && (
            <form onSubmit={handleRegister} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>DNI</label>
                <input type="text" required style={styles.input} placeholder="12345678" value={registerData.dni} onChange={(e) => setRegisterData({ ...registerData, dni: e.target.value })} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>N de cuenta</label>
                <input type="text" required style={styles.input} placeholder="000-000000" value={registerData.cuenta} onChange={(e) => setRegisterData({ ...registerData, cuenta: e.target.value })} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Correo electronico</label>
                <input type="email" required style={styles.input} placeholder="tu@correo.com" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Contrasena</label>
                <input type="password" required style={styles.input} placeholder="••••••••" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
              </div>
              <button type="submit" style={styles.btnSubmit} disabled={loading}>{loading ? "Registrando..." : "Crear cuenta"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay:{position:"fixed",inset:0,background:"rgba(15,23,42,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(4px)"},
  modal:{display:"flex",borderRadius:24,overflow:"hidden",width:"100%",maxWidth:760,boxShadow:"0 25px 80px rgba(0,0,0,0.3)"},
  leftPanel:{background:"linear-gradient(135deg,#1e3a5f,#0ea5e9)",padding:40,width:260,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12},
  brandIcon:{background:"rgba(255,255,255,0.2)",color:"#fff",fontWeight:800,fontSize:24,borderRadius:16,width:64,height:64,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8},
  brandTitle:{color:"#fff",fontSize:22,fontWeight:700,margin:0},
  brandSub:{color:"rgba(255,255,255,0.8)",fontSize:13,margin:0},
  features:{marginTop:24,display:"flex",flexDirection:"column",gap:10,width:"100%"},
  feature:{color:"rgba(255,255,255,0.85)",fontSize:12,padding:"8px 12px",background:"rgba(255,255,255,0.1)",borderRadius:8},
  rightPanel:{background:"#fff",padding:40,flex:1,position:"relative"},
  closeBtn:{position:"absolute",top:16,right:16,background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#94a3b8"},
  formTitle:{fontSize:22,fontWeight:700,color:"#0f172a",margin:"0 0 20px"},
  tabs:{display:"flex",background:"#f1f5f9",borderRadius:10,padding:4,marginBottom:24},
  tab:{flex:1,padding:"8px 0",border:"none",borderRadius:8,background:"none",cursor:"pointer",fontWeight:500,color:"#64748b",fontSize:14},
  tabActive:{background:"#fff",color:"#0f172a",boxShadow:"0 1px 4px rgba(0,0,0,0.1)"},
  error:{background:"#fef2f2",color:"#dc2626",padding:"10px 14px",borderRadius:8,fontSize:13,marginBottom:16},
  form:{display:"flex",flexDirection:"column",gap:16},
  field:{display:"flex",flexDirection:"column",gap:6},
  label:{fontSize:13,fontWeight:500,color:"#374151"},
  input:{padding:"11px 14px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:14,outline:"none"},
  forgot:{color:"#0ea5e9",fontSize:12,cursor:"pointer",textAlign:"right",marginTop:-8},
  btnSubmit:{background:"linear-gradient(135deg,#1e3a5f,#0ea5e9)",color:"#fff",border:"none",borderRadius:10,padding:"13px 0",fontSize:15,fontWeight:600,cursor:"pointer",marginTop:8},
};
