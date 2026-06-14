import { useState } from "react";

export default function LoginModal({ open, onClose }) {
  const [tab, setTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    dni: "",
    cuenta: "",
    email: "",
    password: "",
  });
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
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al iniciar sesion");
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("usuario", JSON.stringify(data.data.usuario));
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
      <div style={styles.box}>
        <div style={styles.header}>
          <div style={styles.logoBox}>CM</div>
          <div>
            <div style={styles.h1}>Banca por Internet</div>
            <div style={styles.h2}>CMAC Maynas - Acceso seguro</div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>X</button>
        </div>
        <div style={styles.body}>
          <div style={styles.tabRow}>
            <button style={{ ...styles.tab, ...(tab === "login" ? styles.tabActive : {}) }} onClick={() => { setTab("login"); setError(""); }}>Iniciar sesion</button>
            <button style={{ ...styles.tab, ...(tab === "register" ? styles.tabActive : {}) }} onClick={() => { setTab("register"); setError(""); }}>Registrarme</button>
          </div>
          {error && <div style={styles.errorBox}>{error}</div>}
          {tab === "login" && (
            <form onSubmit={handleLogin}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Correo electronico</label>
                <input type="email" required style={styles.input} placeholder="tu@correo.com" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Contrasena</label>
                <input type="password" required style={styles.input} placeholder="********" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
              </div>
              <button type="submit" style={styles.btnLogin} disabled={loading}>{loading ? "Ingresando..." : "Ingresar a mi cuenta"}</button>
              <div style={styles.links}>
                <a href="#" style={styles.link}>Olvidaste tu contrasena?</a>
                <a href="#" style={styles.link}>Primer acceso</a>
              </div>
              <div style={styles.footer}>Conexion cifrada SSL - Supervisado por la SBS</div>
            </form>
          )}
          {tab === "register" && (
            <form onSubmit={handleRegister}>
              <div style={styles.formGroup}>
                <label style={styles.label}>DNI</label>
                <input type="text" required style={styles.input} placeholder="12345678" value={registerData.dni} onChange={(e) => setRegisterData({ ...registerData, dni: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>N. de cuenta</label>
                <input type="text" required style={styles.input} placeholder="000-000000" value={registerData.cuenta} onChange={(e) => setRegisterData({ ...registerData, cuenta: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Correo electronico</label>
                <input type="email" required style={styles.input} placeholder="tu@correo.com" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Contrasena</label>
                <input type="password" required style={styles.input} placeholder="********" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
              </div>
              <button type="submit" style={styles.btnLogin} disabled={loading}>{loading ? "Registrando..." : "Crear cuenta"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  box: { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480, padding: 32, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" },
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 24 },
  logoBox: { background: "#b8960c", color: "#fff", fontWeight: 700, fontSize: 18, borderRadius: 10, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" },
  h1: { fontWeight: 700, fontSize: 18, color: "#1a1a1a" },
  h2: { fontSize: 13, color: "#666" },
  closeBtn: { marginLeft: "auto", background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#999" },
  body: { display: "flex", flexDirection: "column", gap: 16 },
  tabRow: { display: "flex", gap: 8, background: "#f0f0f0", borderRadius: 10, padding: 4 },
  tab: { flex: 1, padding: "8px 0", border: "none", borderRadius: 8, background: "none", cursor: "pointer", fontWeight: 500, color: "#666" },
  tabActive: { background: "#fff", color: "#1a1a1a", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" },
  errorBox: { background: "#ffeaea", color: "#c0392b", padding: "10px 14px", borderRadius: 8, fontSize: 14 },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 500, color: "#444" },
  input: { padding: "10px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 15, outline: "none" },
  btnLogin: { background: "#2d6a2d", color: "#fff", border: "none", borderRadius: 10, padding: "14px 0", fontSize: 16, fontWeight: 600, cursor: "pointer", width: "100%" },
  links: { display: "flex", justifyContent: "space-between", marginTop: 4 },
  link: { color: "#2d6a2d", fontSize: 13, textDecoration: "none" },
  footer: { textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 8 },
};

