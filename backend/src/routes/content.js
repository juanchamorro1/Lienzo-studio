const express = require('express');
const prisma = require('../db');
const { readAuth, requireAdmin } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Content keys an admin is allowed to edit through this endpoint. Keeping
// an explicit allowlist means a bad request body can never write an
// arbitrary key into the table.
const EDITABLE_KEYS = new Set([
  'brand_name',
  'hero_kicker',
  'hero_title',
  'hero_subtitle',
  'about_p1',
  'about_p2',
  'contact_title',
  'contact_subtitle',
  'whatsapp_number',
  'contact_email'
]);

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = await prisma.siteContent.findMany();
    const content = {};
    for (const row of rows) content[row.key] = row.value;
    res.json({ content });
  })
);

router.put('/', readAuth, requireAdmin, asyncHandler(async (req, res) => {
  const updates = req.body && typeof req.body === 'object' ? req.body : {};
  const entries = Object.entries(updates).filter(([key]) => EDITABLE_KEYS.has(key));
  if (entries.length === 0) return res.status(400).json({ error: 'No se recibieron campos válidos para actualizar.' });

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteContent.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    )
  );

  const rows = await prisma.siteContent.findMany();
  const content = {};
  for (const row of rows) content[row.key] = row.value;
  res.json({ content });
}));

module.exports = router;
