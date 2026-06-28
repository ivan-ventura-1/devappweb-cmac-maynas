const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.obtenerMora = async () => {
  const { data, error } = await supabaseAdmin
    .from('mora_creditos')
    .select('*')
    .order('dias_mora', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

exports.registrarGestion = async (moraId, observaciones, userId) => {
  // 1) Actualizar mora_creditos
  const { data, error } = await supabaseAdmin
    .from('mora_creditos')
    .update({
      estado_gestion: 'gestionado',
      fecha_ultima_gestion: new Date().toISOString(),
      observaciones
    })
    .eq('id', moraId)
    .select();
  if (error) throw new Error(error.message);

  // 2) Insertar en historial acumulativo mora_gestiones
  const mora = data[0];
  await supabaseAdmin.from('mora_gestiones').insert([{
    mora_id: moraId,
    user_id: mora.user_id,
    observacion: observaciones,
    tipo_gestion: 'seguimiento'
  }]);

  return mora;
};

exports.derivarJudicial = async (moraId) => {
  const { data: mora } = await supabaseAdmin
    .from('mora_creditos')
    .select('dias_mora, user_id')
    .eq('id', moraId)
    .single();

  if (mora.dias_mora < 121)
    throw new Error('Solo creditos con mas de 120 dias de mora pueden derivarse a judicial');

  const { data, error } = await supabaseAdmin
    .from('mora_creditos')
    .update({ banda: 'judicial', estado_gestion: 'derivado_judicial' })
    .eq('id', moraId)
    .select();
  if (error) throw new Error(error.message);

  // Registrar en historial
  await supabaseAdmin.from('mora_gestiones').insert([{
    mora_id: moraId,
    user_id: mora.user_id,
    observacion: 'Credito derivado a cobranza judicial',
    tipo_gestion: 'judicial'
  }]);

  return data[0];
};

exports.castigar = async (moraId) => {
  const { data: mora } = await supabaseAdmin
    .from('mora_creditos')
    .select('dias_mora, user_id')
    .eq('id', moraId)
    .single();

  if (mora.dias_mora <= 180)
    throw new Error('Solo creditos con mas de 180 dias pueden ser castigados');

  const { data, error } = await supabaseAdmin
    .from('mora_creditos')
    .update({ banda: 'castigo', estado_gestion: 'castigado' })
    .eq('id', moraId)
    .select();
  if (error) throw new Error(error.message);

  // Registrar en historial
  await supabaseAdmin.from('mora_gestiones').insert([{
    mora_id: moraId,
    user_id: mora.user_id,
    observacion: 'Credito castigado — perdida contable registrada',
    tipo_gestion: 'castigo'
  }]);

  return data[0];
};

exports.obtenerHistorialGestiones = async (moraId) => {
  const { data, error } = await supabaseAdmin
    .from('mora_gestiones')
    .select('*')
    .eq('mora_id', moraId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};
