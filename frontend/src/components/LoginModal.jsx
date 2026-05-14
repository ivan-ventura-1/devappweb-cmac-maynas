import { useState } from "react";
// import { supabase } from "../lib/supabase"; // descomenta cuando tengas Supabase configurado

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

  // ── LOGIN ──────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // const { error } = await supabase.auth.signInWithPassword({
      //   email: loginData.email,
      //   password: loginData.password,
      // });
      // if (error) throw error;
      // window.location.href = "/dashboard";
      console.log("Login con:", loginData); // quitar en producción
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // ── REGISTRO ───────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // const { error } = await supabase.auth.signUp({
      //   email: registerData.email,
      //   password: registerData.password,
      //   options: {
      //     data: { dni: registerData.dni, cuenta: registerData.cuenta },
      //   },
      // });
      // if (error) throw error;
      // alert("Revisa tu correo para confirmar tu cuenta");
      console.log("Registro con:", registerData); // quitar en producción
    } catch (err) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.box}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoBox}>CM</div>
          <div>
            <div style={styles.h1}>Banca por Internet</div>
            <div style={styles.h2}>CMAC Maynas — Acceso seguro</div>
          </div>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {/* Tabs */}
          <div style={styles.tabRow}>
            <button
              style={{ ...styles.tab, ...(tab === "login" ? styles.tabActive : {}) }}
              onClick={() => { setTab("login"); setError(""); }}
            >
              Iniciar sesión
            </button>
            <button
              style={{ ...styles.tab, ...(tab === "register" ? styles.tabActive : {}) }}
              onClick={() => { setTab("register"); setError(""); }}
            >
              Registrarme
            </button>
          </div>

          {/* Error */}
          {error && <div style={styles.errorBox}>{error}</div>}

          {/* Panel Login */}
          {tab === "login" && (
            <form onSubmit={handleLogin}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Correo electrónico</label>
                <input
                  type="email"
                  required
                  style={styles.input}
                  placeholder="tu@correo.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Contraseña</label>
                <input
                  type="password"
                  required
                  style={styles.input}
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>
              <button type="submit" style={styles.btnLogin} disabled={loading}>
                {loading ? "Ingresando..." : "🔐 Ingresar a mi cuenta"}
              </button>
              <div style={styles.links}>
                <a href="#" style={styles.link}>¿Olvidaste tu contraseña?</a>
                <a href="#" style={styles.link}>Primer acceso</a>
              </div>
            </form>
          )}

          {/* Panel Registro */}
          {tab === "register" && (
            <form onSubmit={handleRegister}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Número de DNI</label>
                <input
                  type="text"
                  required
                  maxLength={8}
                  style={styles.input}
                  placeholder="8 dígitos"
                  value={registerData.dni}
                  onChange={(e) => setRegisterData({ ...registerData, dni: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Número de cuenta</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  placeholder="Número de tu cuenta CMAC Maynas"
                  value={registerData.cuenta}
                  onChange={(e) => setRegisterData({ ...registerData, cuenta: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Correo electrónico</label>
                <input
                  type="email"
                  required
                  style={styles.input}
                  placeholder="tu@correo.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Contraseña</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  style={styles.input}
                  placeholder="Mínimo 8 caracteres"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
              </div>
              <button type="submit" style={styles.btnLogin} disabled={loading}>
                {loading ? "Registrando..." : "✅ Crear acceso digital"}
              </button>
            </form>
          )}

          {/* Footer seguridad */}
          <div style={styles.security}>
            🔒 Conexión cifrada SSL · Supervisado por la SBS
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  box: {
    background: "#fff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "380px",
    overflow: "hidden",
  },
  header: {
    background: "#0D3D21",
    padding: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "3px solid #C8922A",
    position: "relative",
  },
  logoBox: {
    width: "40px",
    height: "40px",
    background: "#C8922A",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display', serif",
    fontWeight: "900",
    fontSize: "17px",
    color: "#0D3D21",
    flexShrink: 0,
  },
  h1: { color: "#fff", fontWeight: "600", fontSize: "15px" },
  h2: { color: "rgba(255,255,255,0.55)", fontSize: "11px", marginTop: "2px" },
  closeBtn: {
    position: "absolute",
    top: "14px",
    right: "14px",
    background: "rgba(255,255,255,0.12)",
    border: "none",
    color: "#fff",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: "2rem 1.5rem" },
  tabRow: {
    display: "flex",
    background: "#f3f5f2",
    borderRadius: "8px",
    padding: "4px",
    marginBottom: "1.5rem",
  },
  tab: {
    flex: 1,
    padding: "8px",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "500",
    color: "#888",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    background: "transparent",
    transition: "all 0.2s",
  },
  tabActive: {
    background: "#fff",
    color: "#0D3D21",
    fontWeight: "600",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  errorBox: {
    background: "#fde8e8",
    color: "#b91c1c",
    fontSize: "13px",
    padding: "10px 12px",
    borderRadius: "8px",
    marginBottom: "1rem",
  },
  formGroup: { marginBottom: "1rem" },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#555",
    marginBottom: "5px",
    display: "block",
    letterSpacing: "0.3px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #dde3db",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#1a1a1a",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  btnLogin: {
    width: "100%",
    background: "#1B6B3A",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
    padding: "13px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginTop: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  links: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
  },
  link: { color: "#1B6B3A", fontSize: "12px", textDecoration: "none" },
  security: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    justifyContent: "center",
    color: "#999",
    fontSize: "11px",
    marginTop: "1.2rem",
    paddingTop: "1.2rem",
    borderTop: "1px solid #eee",
  },
};
