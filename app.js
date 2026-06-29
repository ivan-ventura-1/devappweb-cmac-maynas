const express = require('express');
const cors    = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes       = require('./src/routes/authRoutes');
const creditoRoutes    = require('./src/routes/creditoRoutes');
const moraRoutes       = require('./src/routes/moraRoutes');
const ahorroRoutes     = require('./src/routes/ahorroRoutes');
const movimientoRoutes = require('./src/routes/movimientoRoutes');

const app = express();

// Lab 5 FIX: CORS restringido a origenes propios
const corsOptions = {
  origin: function (origin, callback) {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://devappweb-cmac-maynas.vercel.app',
    ];
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Authorization','Content-Type'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Lab 4 FIX: Rate limiting global — max 100 req/15min por IP
const limiterGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Demasiadas solicitudes, intente mas tarde' },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting estricto para login — max 5 intentos/15min
const limiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Demasiados intentos de login. Espere 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Cabeceras de seguridad (Lab 5)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(limiterGeneral);
app.use('/api/auth/login', limiterLogin);

app.use('/api/auth',        authRoutes);
app.use('/api/credito',     creditoRoutes);
app.use('/api/mora',        moraRoutes);
app.use('/api/ahorro',      ahorroRoutes);
app.use('/api/movimientos', movimientoRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API CMAC Maynas funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
