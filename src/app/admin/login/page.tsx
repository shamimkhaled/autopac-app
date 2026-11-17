'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.status === 429 || res?.error === 'RATE_LIMITED') {
        setErr('Too many wrong passwords. Wait 15 minutes and try again.');
      } else if (res?.error) {
        setErr('Invalid email or password.');
      } else if (res?.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setErr('Sign-in failed. Try again.');
      }
    } catch {
      setErr('Too many requests or network error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-paper flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <p className="section-kicker mb-1">Auto Pac Machinery</p>
          <h1 className="font-display text-3xl font-semibold text-stone-900 tracking-tight">
            Admin sign in
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage catalog, quotations, and website content
          </p>
        </div>

        <form onSubmit={submit} className="surface-card p-6 sm:p-7 space-y-4">
          <div>
            <label htmlFor="admin-email" className="field-label">
              Email address
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@autopacbd.com"
              autoComplete="username"
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="field-label">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="input-field"
              required
            />
          </div>

          {err && (
            <p role="alert" className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {err}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Sign in to CMS
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-brand-maroon transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Auto Pac website
          </Link>
        </div>
      </div>
    </div>
  );
}
