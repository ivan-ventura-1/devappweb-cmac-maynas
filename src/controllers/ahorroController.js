const ahorroService = require('../services/ahorroService');

exports.obtenerCuenta = async (req, res) => {
  try {
    const { userId } = req.params;
    const cuenta = await ahorroService.obtenerCuenta(userId);
    res.json({ success: true, data: cuenta });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.crearCuenta = async (req, res) => {
  try {
    const { userId, metaAhorro } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId requerido' });
    const cuenta = await ahorroService.crearCuenta(userId, metaAhorro || 0);
    res.json({ success: true, data: cuenta });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.depositar = async (req, res) => {
  try {
    const { userId, monto } = req.body;
    if (!userId || !monto) return res.status(400).json({ success: false, message: 'userId y monto requeridos' });
    const cuenta = await ahorroService.depositar(userId, monto);
    res.json({ success: true, data: cuenta });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerTodasCuentas = async (req, res) => {
  try {
    const cuentas = await ahorroService.obtenerTodasCuentas();
    res.json({ success: true, data: cuentas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
