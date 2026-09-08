const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const prisma = require('../db');
const { setAuthCookie, clearAuthCookie, readAuth, requireAuth } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Probá de nuevo en unos minutos.' }
});

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, role: user.role };
}

router.post('/register', authLimiter, asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !String(name).trim()) return res.status(400).json({ error: 'El nombre es obligatorio.' });
  if (!email || !EMAIL_RE.test(String(email))) return res.status(400).json({ error: 'Email inválido.' });
  if (!password || String(password).length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) return res.status(409).json({ error: 'Ya existe una cuenta con ese email.' });

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = await prisma.user.create({
    data: { name: String(name).trim(), email: normalizedEmail, passwordHash }
  });

  setAuthCookie(res, user);
  res.status(201).json({ user: publicUser(user) });
}));

router.post('/login', authLimiter, asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) return res.status(401).json({ error: 'Email o contraseña incorrectos.' });

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Email o contraseña incorrectos.' });

  setAuthCookie(res, user);
  res.json({ user: publicUser(user) });
}));

router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get('/me', readAuth, asyncHandler(async (req, res) => {
  if (!req.auth) return res.json({ user: null });
  const user = await prisma.user.findUnique({ where: { id: req.auth.id } });
  if (!user) return res.json({ user: null });
  res.json({ user: publicUser(user) });
}));

module.exports = router;
