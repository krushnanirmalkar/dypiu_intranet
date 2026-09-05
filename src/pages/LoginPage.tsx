import React, { useState } from 'react';
import { AlertCircle, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('Username/password authentication will be available in a future release. Please continue with Google.');
  };

  const handleForgotPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMessage('Username/password authentication will be available in a future release. Please continue with Google.');
  };

  const handleGoogleSignIn = () => {
    window.location.href = '/login';
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-start bg-white font-sans antialiased text-navy-900 overflow-hidden">
      {/* CAMPUS BANNER IMAGE WITH RIGHT FOCAL POINT (SLIDES PHOTO CONTENT TO THE LEFT) */}
      <img
        src="/dypiu-campus-banner-v2.png"
        alt="DY Patil International University Campus Banner"
        className="absolute inset-0 h-full w-full object-cover object-right z-0"
      />

      {/* LEFT LOGIN CARD OVER THE LEFT SIDE OF THE IMAGE */}
      <div className="relative z-10 flex w-full max-w-xl justify-start p-6 sm:p-10 lg:pl-16">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-2xl backdrop-blur-md sm:p-10">
          {/* Header Inside Card */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex justify-center">
              <img src="/DYPIU colour logo 1.png" alt="DYPIU Logo" className="h-12 w-auto object-contain" />
            </div>
            <h2 className="text-2xl font-black text-navy-950">Sign In</h2>
            <p className="mt-1 text-xs text-slate-500">
              Access your DYPIU Intranet workspace
            </p>
          </div>

          {/* Alert Message for Email/Password Attempt */}
          {message && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-xs text-amber-900 shadow-sm" role="alert">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
              <p className="font-medium leading-relaxed">{message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="email-input" className="block text-xs font-bold text-navy-900">
                Email
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@dypiu.ac.in"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-medium text-navy-900 transition focus:border-navy-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-800/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password-input" className="block text-xs font-bold text-navy-900">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-medium text-navy-900 transition focus:border-navy-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-800/20"
                />
              </div>
            </div>

            {/* Primary Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-navy-900 py-3 text-sm font-bold text-white shadow-md transition hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2 active:scale-[0.99]"
            >
              Sign In
            </button>
          </form>

          {/* Secondary Separator */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative bg-white px-3 text-xs font-semibold uppercase text-slate-400">
              OR
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-3 px-4 text-sm font-bold text-navy-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-[0.99]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <div className="pt-4 text-center text-xs text-slate-400">
            <p className="font-medium text-slate-500">Secure authentication powered by</p>
            <div className="mt-1.5 flex items-center justify-center gap-3 font-semibold text-slate-600">
              <span>Google Workspace</span>
              <span>•</span>
              <span>Keycloak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
