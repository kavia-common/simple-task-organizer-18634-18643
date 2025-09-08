import React, { useState } from 'react';
import Button from './Button';
import Alert from './Alert';
import { signup } from '../services/api';
import { getSiteUrl } from '../config';

// PUBLIC_INTERFACE
export default function SignupForm({ onSuccess }) {
  /** Signup form: calls backend /auth/signup and lifts success */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setOk('');
    setBusy(true);
    try {
      await signup({ email, password, emailRedirectTo: getSiteUrl() });
      setOk('Account created. You are now logged in.');
      onSuccess?.();
    } catch (error) {
      setErr(error.message || 'Signup failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 420 }}>
      <h2>Create Account</h2>
      {err && <Alert type="error">{err}</Alert>}
      {ok && <Alert type="success">{ok}</Alert>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border-color)', marginTop: 4 }}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border-color)', marginTop: 4 }}
          />
        </label>
        <Button type="submit" disabled={busy}>{busy ? 'Creating...' : 'Sign up'}</Button>
      </div>
    </form>
  );
}
