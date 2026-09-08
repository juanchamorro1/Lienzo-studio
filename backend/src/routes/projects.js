const express = require('express');
const prisma = require('../db');
const { readAuth, requireAdmin } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Prisma's "record to update/delete not found" error code.
const NOT_FOUND_CODE = 'P2025';

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
    res.json({ projects });
  })
);

router.post(
  '/',
  readAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { category, title, description, result, link, shot, order } = req.body || {};
    if (!title || !String(title).trim()) return res.status(400).json({ error: 'El título es obligatorio.' });

    const project = await prisma.project.create({
      data: {
        category: String(category || '').trim(),
        title: String(title).trim(),
        description: String(description || '').trim(),
        result: result ? String(result).trim() : null,
        link: link ? String(link).trim() : null,
        shot: shot ? String(shot).trim() : null,
        order: Number.isFinite(order) ? order : 0
      }
    });
    res.status(201).json({ project });
  })
);

router.put(
  '/:id',
  readAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { category, title, description, result, link, shot, order } = req.body || {};
    if (!title || !String(title).trim()) return res.status(400).json({ error: 'El título es obligatorio.' });

    try {
      const project = await prisma.project.update({
        where: { id: req.params.id },
        data: {
          category: String(category || '').trim(),
          title: String(title).trim(),
          description: String(description || '').trim(),
          result: result ? String(result).trim() : null,
          link: link ? String(link).trim() : null,
          shot: shot ? String(shot).trim() : null,
          order: Number.isFinite(order) ? order : 0
        }
      });
      res.json({ project });
    } catch (e) {
      if (e && e.code === NOT_FOUND_CODE) return res.status(404).json({ error: 'Proyecto no encontrado.' });
      throw e;
    }
  })
);

router.delete(
  '/:id',
  readAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      await prisma.project.delete({ where: { id: req.params.id } });
      res.json({ ok: true });
    } catch (e) {
      if (e && e.code === NOT_FOUND_CODE) return res.status(404).json({ error: 'Proyecto no encontrado.' });
      throw e;
    }
  })
);

module.exports = router;
