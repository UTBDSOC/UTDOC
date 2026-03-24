import React from 'react'
import { Mail, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-status-red/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-500">
        {/* Logo Placeholder */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent-gold flex items-center justify-center font-bold text-bg-primary text-3xl shadow-[0_0_30px_rgba(232,197,71,0.2)] mb-4">
            U
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight font-sans">UTSBDSOC</h1>
          <p className="text-text-secondary text-sm mt-1">Event Management Dashboard</p>
        </div>

        <div className="bg-bg-card border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-6">
            {/* Google Sign In */}
            <button onClick={() => alert('Authentication is currently disabled in the demo.')} className="w-full flex items-center justify-center gap-3 bg-accent-gold hover:bg-accent-gold/90 text-bg-primary font-bold py-3 rounded-xl transition-all shadow-lg shadow-accent-gold/10 group">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative bg-bg-card px-4 text-xs font-mono uppercase tracking-widest text-text-secondary">or</span>
            </div>

            {/* Magic Link */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-gold/50 transition-all shadow-inner"
                  />
                </div>
              </div>
              
              <button onClick={() => alert('Authentication is currently disabled in the demo.')} className="w-full flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 text-text-primary font-semibold py-3 rounded-xl transition-all group">
                Send Magic Link
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-text-secondary text-[10px] mt-8 uppercase tracking-widest">
          UTSBDSOC Society Management &copy; 2026
        </p>
      </div>
    </div>
  )
}
