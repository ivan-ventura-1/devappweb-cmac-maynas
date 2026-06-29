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
  // C2 FIX: Verificacion de sujeto de credito
  // 1) Verificar si tiene creditos en mora
  const { data: enMora } = await supabaseAdmin
    .from('mora_creditos')
    .select('id, banda')
    .eq('user_id', userId)
    .in('banda', ['judicial', 'castigo']);

  if (enMora && enMora.length > 0)
    throw new Error('Cliente no elegible: tiene creditos en banda judicial o castigo');

  // 2) Verificar si ya tiene una solicitud pendiente o en evaluacion
  const { data: pendientes } = await supabaseAdmin
    .from('solicitudes_prestamo')
    .select('id, estado')
    .eq('user_id', userId)
    .in('estado', ['pendiente', 'en_evaluacion', 'aprobado_scoring', 'en_comite', 'aprobado']);

  if (pendientes && pendientes.length > 0)
    throw new Error('Cliente ya tiene una solicitud activa en proceso');

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
      nivel_aprobacion: nivel,
      tipo_credito: tipoCredito
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

  // C1 FIX: Al desembolsar registrar movimiento y actualizar saldo ahorro
  if (estado === 'desembolsado' && solicitud) {
    await supabaseAdmin.from('movimientos').insert([{
      user_id: solicitud.user_id,
      tipo: 'credito',
      monto: solicitud.monto,
      descripcion: `Desembolso de credito — S/ ${solicitud.monto} a ${solicitud.plazo_meses} meses`
    }]);

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
  let nuevoEstado;
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

// C2 FIX: Verificar elegibilidad del sujeto de credito
exports.verificarElegibilidad = async (userId) => {
  const { data: enMora } = await supabaseAdmin
    .from('mora_creditos')
    .select('id, banda, dias_mora')
    .eq('user_id', userId);

  const { data: historial } = await supabaseAdmin
    .from('solicitudes_prestamo')
    .select('id, estado, monto')
    .eq('user_id', userId);

  const creditosActivos = historial?.filter(s =>
    ['desembolsado','aprobado','en_comite','aprobado_scoring'].includes(s.estado)
  ) || [];

  const enMoraGrave = enMora?.filter(m =>
    ['judicial','castigo'].includes(m.banda)
  ) || [];

  return {
    elegible: enMoraGrave.length === 0,
    creditosActivos: creditosActivos.length,
    enMora: enMora?.length || 0,
    enMoraGrave: enMoraGrave.length,
    historialSolicitudes: historial?.length || 0,
    observacion: enMoraGrave.length > 0
      ? 'No elegible: creditos en banda judicial o castigo'
      : creditosActivos.length > 0
        ? 'Tiene creditos activos vigentes'
        : 'Cliente elegible para nuevo credito'
  };
};
