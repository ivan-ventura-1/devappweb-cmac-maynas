const moraService = require('../services/moraService');

exports.obtenerMora = async (req, res) => {
  try {
    const data = await moraService.obtenerMora();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registrarGestion = async (req, res) => {
  try {
    const { moraId, observacion, observaciones } = req.body;
    const obs = observacion || observaciones;
    if (!moraId || !obs) return res.status(400).json({ success: false, message: 'moraId y observacion son requeridos' });
    const data = await moraService.registrarGestion(moraId, obs, req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.derivarJudicial = async (req, res) => {
  try {
    const { moraId } = req.body;
    if (!moraId) return res.status(400).json({ success: false, message: 'moraId es requerido' });
    const data = await moraService.derivarJudicial(moraId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.castigar = async (req, res) => {
  try {
    const { moraId } = req.body;
    if (!moraId) return res.status(400).json({ success: false, message: 'moraId es requerido' });
    const data = await moraService.castigar(moraId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.obtenerHistorialGestiones = async (req, res) => {
  try {
    const { moraId } = req.params;
    const data = await moraService.obtenerHistorialGestiones(moraId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
