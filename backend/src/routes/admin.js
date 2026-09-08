const express = require('express');
const crypto = require('crypto');
const prisma = require('../db');
const { seedDatabase } = require('../seed-data');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// One-time setup route for hosts where a Shell isn't available (e.g. a
// free Render web service). Protected by SEED_TOKEN so it can't be
// triggered by a stranger who finds the URL — without that env var set,
// the route refuses every request. Safe to call more than once: it only
// upserts the admin user and default content, and only creates the
// starter projects if the table is still empty.
const seedHandler = asyncHandler(async (req, res) => {
  const expected = process.env.SEED_TOKEN;
  if (!expected) {
    return res.status(404).json({ error: 'No encontrado.' });
  }
  const provided = req.get('x-seed-token') || req.query.token || '';
  const expectedBuf = Buffer.from(String(expected));
  const providedBuf = Buffer.from(String(provided));
  const ok = expectedBuf.length === providedBuf.length && crypto.timingSafeEqual(expectedBuf, providedBuf);
  if (!ok) {
    return res.status(401).json({ error: 'Token inválido.' });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@console.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const log = await seedDatabase(prisma, { adminEmail, adminPassword });
  res.json({ ok: true, log });
});

// GET is included (alongside the more correct POST) so this can be
// triggered by just pasting a URL in a browser address bar — this route
// exists specifically for people without terminal/curl access.
router.get('/seed', seedHandler);
router.post('/seed', seedHandler);

module.exports = router;
