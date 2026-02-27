'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

      if (res?.error) {
        setErr('Invalid credentials');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      setErr('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-industrial-dark flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-industrial-dark">Admin Login</h1>
          <p className="text-industrial-silver text-sm mt-2">AutoPac Content Management</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@autopacbd.com"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-action-orange focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-action-orange focus:outline-none"
              required
            />
          </div>
        </div>

        {err && <p className="text-red-600 text-sm mt-4 text-center">{err}</p>}
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-6 py-3 bg-action-orange text-white font-bold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
