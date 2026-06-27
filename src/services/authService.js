const authRepository = require('../repositories/authRepository');
const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.login = async (email, password) => {
  const data = await authRepository.signIn(email, password);

  // Obtener rol del usuario
  const { data: rolData } = await supabaseAdmin
    .from('roles_usuario')
    .select('rol')
    .eq('user_id', data.user.id)
    .maybeSingle();

  const rol = rolData?.rol || 'cliente';

  return {
    usuario: {
      id:     data.user.id,
      email:  data.user.email,
      nombre: data.user.user_metadata?.full_name || email.split('@')[0],
      rol:    rol
    },
    token: data.session.access_token
  };
};

exports.logout = async () => {
  await authRepository.signOut();
};

exports.getUsuarioActual = async (token) => {
  const data = await authRepository.getUser(token);
  return {
    id:     data.user.id,
    email:  data.user.email,
    nombre: data.user.user_metadata?.full_name || 'Cliente'
  };
};
