require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const contentRoutes = require('./routes/content');
const commentRoutes = require('./routes/comments');

const app = express();
app.set('trust proxy', 1); // Render sits behind a proxy; needed for secure cookies

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.get('/', (_req, res) => res.json({ ok: true, service: 'estudio-lienzo-backend' }));
app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/comments', commentRoutes);

// Last-resort error handler so a thrown/rejected error in a route becomes
// a clean 500 instead of an unhandled crash.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend escuchando en el puerto ${port} (CORS origin: ${clientOrigin})`);
});
