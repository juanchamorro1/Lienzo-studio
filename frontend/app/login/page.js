'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await login(email, password);
      router.push(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-card">
          <h1>Iniciar sesión</h1>
          <form onSubmit={handleSubmit}>
            <label>
              <span>Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              <span>Contraseña</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            {error && <span className="form-error">{error}</span>}
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
          <span className="auth-switch">
            ¿No tenés cuenta? <Link href="/registro">Registrate</Link>
          </span>
        </div>
      </div>
      <Footer />
    </>
  );
}
