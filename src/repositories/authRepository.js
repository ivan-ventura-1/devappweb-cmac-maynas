// CAPA 4 — REPOSITORY
// Responsabilidad: único punto de contacto con Supabase Auth.
// Si mañana se cambia Supabase por otro proveedor,
// solo se modifica este archivo; el resto de la app no cambia.
const supabase = require('../config/supabase');

exports.signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw new Error('Credenciales incorrectas. Inténtalo nuevamente.');
  return data;
};

exports.signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('Error al cerrar sesión.');
};

exports.getUser = async (token) => {
  const { data, error } = await supabase.auth.getUser(token);
  if (error) throw new Error('Token inválido o expirado.');
  return data;
};
