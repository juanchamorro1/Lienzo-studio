const express = require('express');
const prisma = require('../db');
const { readAuth, requireAuth, requireAdmin } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();
const NOT_FOUND_CODE = 'P2025';

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const comments = await prisma.comment.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, avatarUrl: true } } }
    });
    res.json({ comments });
  })
);

router.post(
  '/',
  readAuth,
  requireAuth,
  asyncHandler(async (req, res) => {
    const { body } = req.body || {};
    const text = String(body || '').trim();
    if (!text) return res.status(400).json({ error: 'El comentario no puede estar vacío.' });
    if (text.length > 2000) return res.status(400).json({ error: 'El comentario es demasiado largo.' });

    const comment = await prisma.comment.create({
      data: { body: text, userId: req.auth.id },
      include: { user: { select: { name: true, avatarUrl: true } } }
    });
    res.status(201).json({ comment });
  })
);

// Admins can delete any comment; a logged-in user can delete their own.
router.delete(
  '/:id',
  readAuth,
  requireAuth,
  asyncHandler(async (req, res) => {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } });
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado.' });
    if (comment.userId !== req.auth.id && req.auth.role !== 'admin') {
      return res.status(403).json({ error: 'No podés borrar el comentario de otra persona.' });
    }
    try {
      await prisma.comment.delete({ where: { id: req.params.id } });
      res.json({ ok: true });
    } catch (e) {
      if (e && e.code === NOT_FOUND_CODE) return res.status(404).json({ error: 'Comentario no encontrado.' });
      throw e;
    }
  })
);

// Admin-only moderation list (includes anything hidden too, if that
// feature is used later; today `approved` is always true on create).
router.get(
  '/all',
  readAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    });
    res.json({ comments });
  })
);

module.exports = router;
