'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('es-AR');
  } catch {
    return '';
  }
}

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ text: '', kind: '' });

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const data = await api.get('/api/comments/all');
        if (!ignore) setComments(data.comments);
      } catch (err) {
        if (!ignore) setStatus({ text: err.message, kind: 'error' });
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleDelete(id) {
    try {
      await api.del(`/api/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setStatus({ text: err.message, kind: 'error' });
    }
  }

  if (loading) return <p className="admin-loading">Cargando comentarios…</p>;

  return (
    <div>
      <h2 className="admin-section-title">Comentarios</h2>
      {status.text && <p className={`admin-status ${status.kind}`}>{status.text}</p>}
      {comments.length === 0 && <p className="admin-empty">Todavía no hay comentarios.</p>}
      {comments.map((c) => (
        <div className="admin-comment-row" key={c.id}>
          <div>
            <div className="admin-comment-meta">
              {c.user ? `${c.user.name} · ${c.user.email}` : 'Usuario eliminado'} — {formatDate(c.createdAt)}
            </div>
            <p className="comment-body">{c.body}</p>
          </div>
          <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
