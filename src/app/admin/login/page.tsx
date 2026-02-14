'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass }),
    });
    const data = await res.json();
    if (data.ok) {
      sessionStorage.setItem('admin_token', data.token);
      router.push('/admin');
    } else setErr('Invalid password');
  };

  return (
    <div className="min-h-screen bg-industrial-dark flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold text-industrial-dark mb-6">Admin Login</h1>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-lg mb-4"
        />
        {err && <p className="text-red-600 text-sm mb-2">{err}</p>}
        <button type="submit" className="w-full py-3 bg-action-orange text-white font-bold rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
}
