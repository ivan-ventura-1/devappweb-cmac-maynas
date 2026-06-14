import { useState } from "react";

export default function ModalSolicitud({ onClose, userId, onExito }) {
  const [form, setForm] = useState({ monto: "", plazoMeses: "12", tipoCredito: "empresarial" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/credito/solicitar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          monto: parseFloat(form.monto),
          plazoMeses: parseInt(form.plazoMeses),
          tipoCredito: form.tipoCredito,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onExito(data.data);
    } catch (err) {
      setError(err.message || "Error al enviar solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.box}>
        <h2 style={styles.title}>Nueva Solicitud de Credito</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.group}>
            <label style={styles.label}>Tipo de Credito</label>
            <select style={styles.input} value={form.tipoCredito} onChange={(e) => setForm({ ...form, tipoCredito: e.target.value })}>
              <option value="empresarial">Empresarial (TEA 43.92%)</option>
              <option value="consumo">Consumo (TEA 40.92%)</option>
            </select>
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Monto solicitado (S/)</label>
            <input type="number" required min="1000" max="30000" style={styles.input} placeholder="Ej: 5000" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Plazo (meses)</label>
            <select style={styles.input} value={form.plazoMeses} onChange={(e) => setForm({ ...form, plazoMeses: e.target.value })}>
              <option value="6">6 meses</option>
              <option value="12">12 meses</option>
              <option value="18">18 meses</option>
              <option value="24">24 meses</option>
              <option value="36">36 meses</option>
            </select>
          </div>
          <div style={styles.btnRow}>
            <button type="button" style={styles.btnCancelar} onClick={onClose}>Cancelar</button>
            <button type="submit" style={styles.btnEnviar} disabled={loading}>{loading ? "Enviando..." : "Enviar Solicitud"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  box: { background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 440, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" },
  title: { margin: "0 0 24px", color: "#1a3a1a", fontSize: 20 },
  error: { background: "#ffeaea", color: "#c0392b", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 14 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  group: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 500, color: "#444" },
  input: { padding: "10px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 15 },
  btnRow: { display: "flex", gap: 12, marginTop: 8 },
  btnCancelar: { flex: 1, padding: "12px 0", borderRadius: 8, border: "1.5px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 15 },
  btnEnviar: { flex: 1, padding: "12px 0", borderRadius: 8, border: "none", background: "#2d6a2d", color: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 600 },
};
