const { createClient } = require('@supabase/supabase-js');
const supabase = require('../config/supabase');
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ success: false, message: 'Token invalido' });
    const { data: rolData } = await supabaseAdmin
      .from('roles_usuario')
      .select('rol')
      .eq('user_id', data.user.id)
      .maybeSingle();
    req.user = { ...data.user, rol: rolData?.rol || 'cliente' };
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Error de autenticacion' });
  }
};

const soloRol = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.rol)) {
    return res.status(403).json({
      success: false,
      message: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}`,
      rol_actual: req.user?.rol
    });
  }
  next();
};

module.exports = { verificarToken, soloRol };
