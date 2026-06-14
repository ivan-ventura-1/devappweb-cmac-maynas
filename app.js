const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const creditoRoutes = require('./src/routes/creditoRoutes');
const moraRoutes = require('./src/routes/moraRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/credito', creditoRoutes);
app.use('/api/mora', moraRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Portal Mi Banco funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

