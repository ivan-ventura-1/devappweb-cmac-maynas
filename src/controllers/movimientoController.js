const movimientoService = require('../services/movimientoService');

exports.obtenerMovimientos = async (req, res) => {
  try {
    const { userId } = req.params;
    const movimientos = await movimientoService.obtenerMovimientos(userId);
    res.json({ success: true, data: movimientos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
