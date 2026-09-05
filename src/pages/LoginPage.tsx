import React from 'react';

export const LoginPage: React.FC = () => {
  const handleGoogleSignIn = () => {
    window.location.href = '/login';
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-end bg-white font-sans antialiased text-navy-900 overflow-hidden">
      {/* LOGIN BACKGROUND IMAGE */}
      <img
        src="/Login.png"
        alt="DYPIU Campus Login Background"
        className="absolute inset-0 h-full w-full object-cover object-left z-0"
      />

      {/* RIGHT LOGIN CARD */}
      <div className="relative z-10 flex w-full max-w-xl justify-end p-6 sm:p-10 lg:pr-16">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-2xl backdrop-blur-md sm:p-10 text-center">
          {/* DYPIU Logo */}
          <div className="mx-auto mb-2 flex justify-center">
            <img src="/DYPIU colour logo 1.png" alt="DYPIU Logo" className="h-16 sm:h-20 w-auto object-contain" />
          </div>

          {/* UniOne Brand Title */}
          <div className="mt-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              <span className="text-[#050554]">Uni</span>
              <span className="text-[#E85116]">One</span>
            </h1>
          </div>

          {/* Decorative Divider Line */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-3.5 px-4 text-sm font-bold text-navy-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-[0.99]"
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
            Login
          </button>

          {/* Footer */}
          <div className="pt-2 text-center text-xs text-slate-400">
            <p className="font-medium text-slate-500">Secure authentication powered by</p>
            <div className="mt-1 flex items-center justify-center gap-2 font-semibold text-slate-600">
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
