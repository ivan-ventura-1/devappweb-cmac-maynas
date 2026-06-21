const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.obtenerMovimientos = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from('movimientos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

exports.registrarMovimiento = async (userId, tipo, monto, descripcion) => {
  const { data, error } = await supabaseAdmin
    .from('movimientos')
    .insert([{ user_id: userId, tipo, monto, descripcion }])
    .select();
  if (error) throw new Error(error.message);
  return data[0];
};
