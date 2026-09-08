'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import AdminProjects from '@/components/AdminProjects';
import AdminContent from '@/components/AdminContent';
import AdminComments from '@/components/AdminComments';

const TABS = [
  { id: 'projects', label: 'Proyectos' },
  { id: 'content', label: 'Contenido del sitio' },
  { id: 'comments', label: 'Comentarios' }
];

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('projects');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  if (loading || !user || user.role !== 'admin') {
    return <p className="admin-loading">Verificando acceso…</p>;
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <h1>Panel de administración</h1>
        <div className="nav-links">
          <Link href="/">Ver sitio</Link>
          <button type="button" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </div>
      <div className="admin-body">
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`admin-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'projects' && <AdminProjects />}
        {tab === 'content' && <AdminContent />}
        {tab === 'comments' && <AdminComments />}
      </div>
    </div>
  );
}
