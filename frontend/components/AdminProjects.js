'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const BLANK = { category: '', title: '', description: '', result: '', link: '', shot: '' };

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState({});
  const [newProject, setNewProject] = useState(BLANK);
  const [status, setStatus] = useState({ text: '', kind: '' });

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const data = await api.get('/api/projects');
        if (ignore) return;
        setProjects(data.projects);
        const nextDrafts = {};
        data.projects.forEach((p) => {
          nextDrafts[p.id] = { category: p.category, title: p.title, description: p.description, result: p.result || '', link: p.link || '', shot: p.shot || '' };
        });
        setDrafts(nextDrafts);
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

  function updateDraft(id, field, value) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  async function saveProject(id) {
    try {
      const data = await api.put(`/api/projects/${id}`, drafts[id]);
      setProjects((prev) => prev.map((p) => (p.id === id ? data.project : p)));
      setStatus({ text: 'Proyecto guardado.', kind: 'ok' });
    } catch (err) {
      setStatus({ text: err.message, kind: 'error' });
    }
  }

  async function deleteProject(id) {
    try {
      await api.del(`/api/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setStatus({ text: 'Proyecto eliminado.', kind: 'ok' });
    } catch (err) {
      setStatus({ text: err.message, kind: 'error' });
    }
  }

  async function addProject(e) {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    try {
      const data = await api.post('/api/projects', newProject);
      setProjects((prev) => [...prev, data.project]);
      setDrafts((prev) => ({
        ...prev,
        [data.project.id]: { category: data.project.category, title: data.project.title, description: data.project.description, result: data.project.result || '', link: data.project.link || '', shot: data.project.shot || '' }
      }));
      setNewProject(BLANK);
      setStatus({ text: 'Proyecto agregado.', kind: 'ok' });
    } catch (err) {
      setStatus({ text: err.message, kind: 'error' });
    }
  }

  if (loading) return <p className="admin-loading">Cargando proyectos…</p>;

  return (
    <div>
      <h2 className="admin-section-title">Proyectos</h2>
      {status.text && <p className={`admin-status ${status.kind}`}>{status.text}</p>}

      {projects.map((p) => {
        const d = drafts[p.id] || BLANK;
        return (
          <div className="admin-row" key={p.id}>
            <div className="admin-row-grid">
              <label>
                <span>Categoría</span>
                <input value={d.category} onChange={(e) => updateDraft(p.id, 'category', e.target.value)} />
              </label>
              <label>
                <span>Título</span>
                <input value={d.title} onChange={(e) => updateDraft(p.id, 'title', e.target.value)} />
              </label>
            </div>
            <label>
              <span>Descripción</span>
              <textarea rows={2} value={d.description} onChange={(e) => updateDraft(p.id, 'description', e.target.value)} />
            </label>
            <div className="admin-row-grid">
              <label>
                <span>Resultado destacado (opcional)</span>
                <input value={d.result} onChange={(e) => updateDraft(p.id, 'result', e.target.value)} />
              </label>
              <label>
                <span>Enlace en vivo (opcional)</span>
                <input value={d.link} onChange={(e) => updateDraft(p.id, 'link', e.target.value)} />
              </label>
            </div>
            <label>
              <span>Captura (URL, opcional)</span>
              <input value={d.shot} onChange={(e) => updateDraft(p.id, 'shot', e.target.value)} />
            </label>
            <div className="admin-row-actions">
              <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteProject(p.id)}>
                Eliminar
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => saveProject(p.id)}>
                Guardar
              </button>
            </div>
          </div>
        );
      })}

      <form className="admin-row" onSubmit={addProject}>
        <h3 style={{ fontSize: 18, fontWeight: 500 }}>Agregar proyecto</h3>
        <div className="admin-row-grid">
          <label>
            <span>Categoría</span>
            <input value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} />
          </label>
          <label>
            <span>Título</span>
            <input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} required />
          </label>
        </div>
        <label>
          <span>Descripción</span>
          <textarea rows={2} value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
        </label>
        <div className="admin-row-grid">
          <label>
            <span>Resultado destacado (opcional)</span>
            <input value={newProject.result} onChange={(e) => setNewProject({ ...newProject, result: e.target.value })} />
          </label>
          <label>
            <span>Enlace en vivo (opcional)</span>
            <input value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })} />
          </label>
        </div>
        <label>
          <span>Captura (URL, opcional)</span>
          <input value={newProject.shot} onChange={(e) => setNewProject({ ...newProject, shot: e.target.value })} />
        </label>
        <div className="admin-row-actions" style={{ justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary btn-sm">
            + Agregar proyecto
          </button>
        </div>
      </form>
    </div>
  );
}
