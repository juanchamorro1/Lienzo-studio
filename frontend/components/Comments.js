'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function Comments({ initialComments }) {
  const { user, loading } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError('');
    try {
      const data = await api.post('/api/comments', { body: text.trim() });
      setComments((prev) => [data.comment, ...prev]);
      setText('');
    } catch (err) {
      setError(err.message || 'No se pudo publicar el comentario.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.del(`/api/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message || 'No se pudo borrar el comentario.');
    }
  }

  return (
    <section id="comentarios" className="wrap">
      <div className="sec-head">
        <span className="kicker">04</span>
        <h2>Comentarios</h2>
      </div>
      <p className="lede">Preguntas, casos parecidos al tuyo, o simplemente qué te pareció el trabajo.</p>

      <div className="comment-list">
        {comments.length === 0 && <p className="comment-empty">Todavía no hay comentarios. Sé el primero.</p>}
        {comments.map((c) => (
          <div className="comment" key={c.id}>
            <div className="comment-head">
              <span className="comment-author">{c.user ? c.user.name : 'Usuario'}</span>
              <span className="comment-date">{formatDate(c.createdAt)}</span>
            </div>
            <p className="comment-body">{c.body}</p>
            {user && (user.id === c.userId || user.role === 'admin') && (
              <button type="button" className="comment-del" onClick={() => handleDelete(c.id)}>
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>

      {!loading && user && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <label>
            <span>Tu comentario</span>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribí acá tu comentario"
              maxLength={2000}
            />
          </label>
          {error && <span className="form-error">{error}</span>}
          <button type="submit" className="btn btn-primary" disabled={busy || !text.trim()} style={{ alignSelf: 'flex-start' }}>
            {busy ? 'Publicando…' : 'Publicar comentario'}
          </button>
        </form>
      )}

      {!loading && !user && (
        <div className="comment-cta">
          <Link href="/login">Iniciá sesión</Link> para dejar un comentario.
        </div>
      )}
    </section>
  );
}
