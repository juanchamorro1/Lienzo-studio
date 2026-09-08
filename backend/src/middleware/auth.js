const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'lienzo_token';
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET env var is required');
}

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
}

function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd, // cross-site cookies require Secure in production (https)
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/'
  };
}

function setAuthCookie(res, user) {
  res.cookie(COOKIE_NAME, signToken(user), cookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
}

// Reads the token, verifies it, and attaches { id, role } to req.auth.
// Never rejects here — routes decide what to do with a missing/invalid
// req.auth via requireAuth/requireAdmin below.
function readAuth(req, _res, next) {
  const token = req.cookies && req.cookies[COOKIE_NAME];
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.auth = { id: payload.sub, role: payload.role };
    } catch (e) {
      req.auth = null;
    }
  } else {
    req.auth = null;
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.auth) return res.status(401).json({ error: 'No autenticado.' });
  next();
}

function requireAdmin(req, res, next) {
  if (!req.auth) return res.status(401).json({ error: 'No autenticado.' });
  if (req.auth.role !== 'admin') return res.status(403).json({ error: 'Requiere permisos de administrador.' });
  next();
}

module.exports = { COOKIE_NAME, signToken, setAuthCookie, clearAuthCookie, readAuth, requireAuth, requireAdmin };
