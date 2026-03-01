'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiLogin } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [forgotSent, setForgotSent] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    try {
      const data = await apiLogin(email.trim().toLowerCase(), password);
      // Store JWT for the session
      const userRole = data.user?.roleType || role;
      const finalUser = { ...data.user, roleType: userRole };
      sessionStorage.setItem('jwt', data.jwt);
      sessionStorage.setItem('user', JSON.stringify(finalUser));
      router.push('/');
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('credentials') || msg.includes('Invalid')) {
        setError('Wrong email or password. Please try again.');
      } else if (msg.includes('blocked')) {
        setError('Your account has been blocked. Contact your administrator.');
      } else {
        setError('Cannot connect to the server. Make sure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true); setError('');
    try {
      const API = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
      await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setForgotSent(true);
    } catch {
      setError('Could not send reset email. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0EEFF] via-[#E8E4FF] to-white px-4">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-purple-200 opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-60 h-60 rounded-full bg-pink-200 opacity-15 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B4EFA] to-[#E879F9] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-[#1A1340]">EduApp</h1>
          <p className="text-[#8A8AAD] mt-1 text-sm font-medium">Your Smart Gateway to Better Learning</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-purple-100 p-8">
          {!forgotSent ? (
            <>
              <h2 className="text-2xl font-black text-[#1A1340] mb-1">
                {mode === 'login' ? 'Welcome Back!' : 'Reset Password'}
              </h2>
              <p className="text-sm text-[#8A8AAD] mb-6 font-medium">
                {mode === 'login' ? 'Sign in to continue to your account' : 'Enter your email to receive a reset link'}
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-5 flex items-start gap-3">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={mode === 'login' ? handleLogin : handleForgot} className="space-y-4">
                {/* Role Toggle */}
                {mode === 'login' && (
                  <div className="flex bg-[#F8F7FF] rounded-2xl p-1 mb-6 border-2 border-[#E2DEFF]">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all text-sm ${role === 'student' ? 'bg-[#5B4EFA] text-white shadow-md shadow-purple-200' : 'text-[#8A8AAD] hover:bg-[#F0EEFF]'
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all text-sm ${role === 'teacher' ? 'bg-[#5B4EFA] text-white shadow-md shadow-purple-200' : 'text-[#8A8AAD] hover:bg-[#F0EEFF]'
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Teacher
                    </button>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1340] uppercase tracking-wide mb-2">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8AAD]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@school.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-[#E2DEFF] bg-[#F8F7FF] text-[#1A1340] font-semibold text-sm focus:outline-none focus:border-[#5B4EFA] focus:bg-[#F0EEFF] transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                {mode === 'login' && (
                  <div>
                    <label className="block text-xs font-bold text-[#1A1340] uppercase tracking-wide mb-2">Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8AAD]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </span>
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 border-[#E2DEFF] bg-[#F8F7FF] text-[#1A1340] font-semibold text-sm focus:outline-none focus:border-[#5B4EFA] focus:bg-[#F0EEFF] transition-all"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8AAD] hover:text-[#5B4EFA]">
                        {showPass
                          ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                          : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        }
                      </button>
                    </div>
                    <div className="text-right mt-2">
                      <button type="button" onClick={() => { setMode('forgot'); setError(''); }} className="text-sm font-bold text-[#5B4EFA] hover:underline">
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#5B4EFA] to-[#4035D6] text-white font-black text-base shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all disabled:opacity-70 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Loading...
                    </span>
                  ) : mode === 'login' ? 'Sign In' : 'Send Reset Link'}
                </button>

                {mode === 'forgot' && (
                  <button type="button" onClick={() => { setMode('login'); setError(''); }} className="w-full text-center text-sm font-bold text-[#5B4EFA] hover:underline mt-2">
                    ← Back to Login
                  </button>
                )}
              </form>

              {mode === 'login' && (
                <div className="mt-5 bg-[#F0EEFF] rounded-2xl p-4 flex items-start gap-2">
                  <span className="text-[#5B4EFA] text-base">ℹ️</span>
                  <p className="text-xs text-[#5B4EFA] font-medium leading-relaxed">
                    Don't have an account? Contact your school administrator to get your login credentials.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-2xl font-black text-[#1A1340] mb-2">Email Sent!</h2>
              <p className="text-[#8A8AAD] text-sm mb-6">Check your inbox at <strong>{email}</strong> for the password reset link.</p>
              <button onClick={() => { setMode('login'); setForgotSent(false); setError(''); }} className="text-sm font-bold text-[#5B4EFA] hover:underline">
                ← Back to Login
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#8A8AAD] mt-6">© 2025 EduApp • All rights reserved</p>
      </div>
    </div>
  );
}
