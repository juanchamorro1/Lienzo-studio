'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function Header({ brandName }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/');
    router.refresh();
  }

  const [first, ...rest] = (brandName || 'Estudio Lienzo').split(' ');

  return (
    <header>
      <div className="wrap nav">
        <Link className="brand" href="/#top">
          {first} <em>{rest.join(' ')}</em>
        </Link>
        <nav className="nav-links">
          <Link href="/#proyectos">Proyectos</Link>
          <Link href="/#estudio">Estudio</Link>
          <Link href="/#comentarios">Comentarios</Link>
          {!loading && user && user.role === 'admin' && <Link href="/admin">Admin</Link>}
          {!loading && user && <span>Hola, {user.name.split(' ')[0]}</span>}
          {!loading && user && (
            <button type="button" onClick={handleLogout}>
              Salir
            </button>
          )}
          {!loading && !user && (
            <Link className="nav-cta" href="/login">
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
