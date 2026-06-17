const creditoService = require('../services/creditoService');

exports.crearSolicitud = async (req, res) => {
  try {
    const { userId, monto, plazoMeses, tipoCredito } = req.body;
    if (!userId || !monto || !plazoMeses || !tipoCredito) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }
    const solicitud = await creditoService.crearSolicitud(userId, monto, plazoMeses, tipoCredito);
    res.json({ success: true, data: solicitud });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerSolicitudes = async (req, res) => {
  try {
    const { userId } = req.params;
    const solicitudes = await creditoService.obtenerSolicitudes(userId);
    res.json({ success: true, data: solicitudes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerTodasSolicitudes = async (req, res) => {
  try {
    const solicitudes = await creditoService.obtenerTodasSolicitudes();
    res.json({ success: true, data: solicitudes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.actualizarEstado = async (req, res) => {
  try {
    const { solicitudId, estado, motivo } = req.body;
    if (!solicitudId || !estado) {
      return res.status(400).json({ success: false, message: 'solicitudId y estado son obligatorios' });
    }
    const solicitud = await creditoService.actualizarEstado(solicitudId, estado, motivo);
    res.json({ success: true, data: solicitud });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registrarEvaluacion = async (req, res) => {
  try {
    const { solicitudId, ingresoNeto, gastoFamiliar } = req.body;
    if (!solicitudId || ingresoNeto == null || gastoFamiliar == null) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }
    const solicitud = await creditoService.registrarEvaluacion(solicitudId, ingresoNeto, gastoFamiliar);
    res.json({ success: true, data: solicitud });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
