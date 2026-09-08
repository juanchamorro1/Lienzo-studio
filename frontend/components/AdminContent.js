'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const FIELDS = [
  { key: 'brand_name', label: 'Nombre de la marca' },
  { key: 'hero_kicker', label: 'Texto pequeño sobre el título (hero)' },
  { key: 'hero_title', label: 'Título principal (hero)', textarea: true },
  { key: 'hero_subtitle', label: 'Subtítulo (hero)', textarea: true },
  { key: 'about_p1', label: 'Sobre el estudio — párrafo 1', textarea: true },
  { key: 'about_p2', label: 'Sobre el estudio — párrafo 2', textarea: true },
  { key: 'contact_title', label: 'Título de contacto' },
  { key: 'contact_subtitle', label: 'Subtítulo de contacto', textarea: true },
  { key: 'whatsapp_number', label: 'Número de WhatsApp (solo dígitos, con código de país, ej: 5491122334455)' },
  { key: 'contact_email', label: 'Email de contacto' }
];

export default function AdminContent() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ text: '', kind: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/api/content')
      .then((data) => setValues(data.content))
      .catch((err) => setStatus({ text: err.message, kind: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  function update(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus({ text: '', kind: '' });
    try {
      const data = await api.put('/api/content', values);
      setValues(data.content);
      setStatus({ text: 'Contenido guardado.', kind: 'ok' });
    } catch (err) {
      setStatus({ text: err.message, kind: 'error' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="admin-loading">Cargando contenido…</p>;

  return (
    <div>
      <h2 className="admin-section-title">Contenido del sitio</h2>
      <form className="admin-content-grid" onSubmit={handleSave}>
        {FIELDS.map((f) => (
          <label key={f.key}>
            <span>{f.label}</span>
            {f.textarea ? (
              <textarea rows={3} value={values[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} />
            ) : (
              <input value={values[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} />
            )}
          </label>
        ))}
        {status.text && <p className={`admin-status ${status.kind}`}>{status.text}</p>}
        <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: 'flex-start' }}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
