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
      monto,
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

  const solicitud = data[0];

  // C1 FIX: Al desembolsar, registrar movimiento automatico y actualizar saldo ahorro
  if (estado === 'desembolsado' && solicitud) {
    // 1) Registrar movimiento tipo credito
    await supabaseAdmin.from('movimientos').insert([{
      user_id: solicitud.user_id,
      tipo: 'credito',
      monto: solicitud.monto,
      descripcion: `Desembolso de credito aprobado — S/ ${solicitud.monto} a ${solicitud.plazo_meses} meses`
    }]);

    // 2) Actualizar saldo de cuenta de ahorro (sumar el monto desembolsado)
    const { data: cuenta } = await supabaseAdmin
      .from('cuentas_ahorro')
      .select('id, saldo')
      .eq('user_id', solicitud.user_id)
      .maybeSingle();

    if (cuenta) {
      await supabaseAdmin
        .from('cuentas_ahorro')
        .update({ saldo: Number(cuenta.saldo) + Number(solicitud.monto) })
        .eq('id', cuenta.id);
    }
  }

  return solicitud;
};

exports.registrarEvaluacion = async (solicitudId, ingresoNeto, gastoFamiliar) => {
  const { data: sol } = await supabaseAdmin
    .from('solicitudes_prestamo')
    .select('cuota_mensual, monto')
    .eq('id', solicitudId)
    .single();
  if (!sol) throw new Error('Solicitud no encontrada');

  const ingresoDisponible = ingresoNeto - gastoFamiliar;
  const rds = ingresoDisponible > 0 ? (sol.cuota_mensual / ingresoDisponible) * 100 : 999;
  let score = Math.max(0, Math.min(100, 100 - rds));
  score = Math.round(score);

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
      score,
      estado: nuevoEstado
    })
    .eq('id', solicitudId)
    .select();
  if (error) throw new Error(error.message);
  return data[0];
};
