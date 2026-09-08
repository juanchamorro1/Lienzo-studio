'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(name, email, password);
      router.push('/');
    } catch (err) {
      setError(err.message || 'No se pudo crear la cuenta.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-card">
          <h1>Crear cuenta</h1>
          <form onSubmit={handleSubmit}>
            <label>
              <span>Nombre</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              <span>Contraseña</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </label>
            <span className="form-note">Al menos 6 caracteres.</span>
            {error && <span className="form-error">{error}</span>}
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>
          <span className="auth-switch">
            ¿Ya tenés cuenta? <Link href="/login">Iniciá sesión</Link>
          </span>
        </div>
      </div>
      <Footer />
    </>
  );
}
