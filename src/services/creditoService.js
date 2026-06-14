const supabase = require('../config/supabase');

exports.crearSolicitud = async (userId, monto, plazoMeses, tipoCredito) => {
  const tasaAnual = tipoCredito === 'empresarial' ? 43.92 : 40.92;
  const tasaMensual = Math.pow(1 + tasaAnual / 100, 1 / 12) - 1;
  const cuotaMensual = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses));

  const { data, error } = await supabase
    .from('solicitudes_prestamo')
    .insert([{
      user_id: userId,
      monto: monto,
      plazo_meses: plazoMeses,
      tasa_anual: tasaAnual,
      cuota_mensual: Math.round(cuotaMensual * 100) / 100,
      estado: 'pendiente'
    }])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};

exports.obtenerSolicitudes = async (userId) => {
  const { data, error } = await supabase
    .from('solicitudes_prestamo')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};
