const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const calcularCuota = (monto, plazoMeses, tasaAnual) => {
  const tasaMensual = Math.pow(1 + tasaAnual / 100, 1 / 12) - 1;
  return (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses));
};

const calcularNivelAprobacion = (monto) => {
  if (monto <= 10000) return 'asesor';
  if (monto <= 50000) return 'comite';
  return 'jefe_regional';
};

exports.crearSolicitud = async (userId, monto, plazoMeses, tipoCredito) => {
  const tasaAnual = tipoCredito === 'empresarial' ? 43.92 : 40.92;
  const cuotaMensual = calcularCuota(monto, plazoMeses, tasaAnual);
  const nivel = calcularNivelAprobacion(monto);

  const { data, error } = await supabaseAdmin
    .from('solicitudes_prestamo')
    .insert([{
      user_id: userId,
      monto: monto,
      plazo_meses: plazoMeses,
      tasa_anual: tasaAnual,
      cuota_mensual: Math.round(cuotaMensual * 100) / 100,
      estado: 'pendiente',
      nivel_aprobacion: nivel
    }])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};

exports.obtenerSolicitudes = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from('solicitudes_prestamo')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

exports.obtenerTodasSolicitudes = async () => {
  const { data, error } = await supabaseAdmin
    .from('solicitudes_prestamo')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

exports.actualizarEstado = async (solicitudId, estado, motivo) => {
  const update = { estado };
  if (motivo) update.motivo_abandono = motivo;
  const { data, error } = await supabaseAdmin
    .from('solicitudes_prestamo')
    .update(update)
    .eq('id', solicitudId)
    .select();
  if (error) throw new Error(error.message);
  return data[0];
};

// Registrar ingresos y evaluación -> calcula RDS y Score
exports.registrarEvaluacion = async (solicitudId, ingresoNeto, gastoFamiliar) => {
  const { data: sol } = await supabaseAdmin
    .from('solicitudes_prestamo')
    .select('cuota_mensual, monto')
    .eq('id', solicitudId)
    .single();

  if (!sol) throw new Error('Solicitud no encontrada');

  const ingresoDisponible = ingresoNeto - gastoFamiliar;
  const rds = ingresoDisponible > 0 ? (sol.cuota_mensual / ingresoDisponible) * 100 : 999;

  // Score: 100 - RDS ponderado, capado entre 0-100
  let score = Math.max(0, Math.min(100, 100 - rds));
  score = Math.round(score);

  // Capacidad de pago: cuota no debe superar 40% del ingreso disponible
  const capacidadOk = sol.cuota_mensual <= (ingresoDisponible * 0.4);

  let nuevoEstado = 'en_evaluacion';
  if (!capacidadOk || rds > 40) {
    nuevoEstado = 'rechazado_automatico';
  } else if (score >= 60) {
    nuevoEstado = 'aprobado_scoring';
  } else {
    nuevoEstado = 'en_comite';
  }

  const { data, error } = await supabaseAdmin
    .from('solicitudes_prestamo')
    .update({
      ingreso_neto: ingresoNeto,
      gasto_familiar: gastoFamiliar,
      rds: Math.round(rds * 100) / 100,
      score: score,
      estado: nuevoEstado
    })
    .eq('id', solicitudId)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};
