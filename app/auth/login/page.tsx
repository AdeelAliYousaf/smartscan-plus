'use client';

import React, { useState } from 'react';
import { 
  Scan, 
  ShieldCheck, 
  Lock, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

interface DemoError extends Error {
    message: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Redirect to admin dashboard on successful login
            window.location.href = '/admin';
        } else {
            setError(data.error || 'Login failed');
        }
    } catch (error) {
        setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 poppins-regular relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Abstract Medical Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-100/40 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* --- LEFT: BRANDING & COMPLIANCE --- */}
        <div className="hidden lg:flex flex-col justify-center p-10 rounded-[2.5rem] bg-white/60 backdrop-blur-md shadow-2xl border border-white/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-linear-to-br from-teal-500 to-teal-700 p-3.5 rounded-2xl shadow-lg text-white">
              <Scan size={32} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Smart Scan<span className="text-teal-600">Plus</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">Admin Portal</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100 flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  System Online
                </span>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Secure. Compliant. Reliable.</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Access the central diagnostic hub to review AI screening results, manage patient cohorts, and audit model performance logs.
            </p>
          </div>

          <div className="space-y-4">
            <ComplianceCard 
              icon={<ShieldCheck className="text-teal-600" size={20} />}
              title="HIPAA-Ready Architecture"
              desc="End-to-end encryption for all PHI data transmission."
            />
            <ComplianceCard 
              icon={<Lock className="text-teal-600" size={20} />}
              title="Role-Based Access Control"
              desc="Strict IAM policies enforcing least-privilege access."
            />
            <ComplianceCard 
              icon={<Activity className="text-teal-600" size={20} />}
              title="Model Performance Audit"
              desc="Real-time tracking of AI confidence intervals."
            />
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-200/60 flex justify-between items-center text-xs text-slate-400 font-mono">
             <span>System v2.4.0</span>
             <span>ID: US-EAST-1A</span>
          </div>
        </div>

        {/* --- RIGHT: LOGIN FORM --- */}
        <div className="p-8 md:p-12 rounded-[2.5rem] bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
            <p className="text-slate-500">Authorized personnel only. All access is logged.</p>
          </div>

          {error && (
            <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@smartscan.com"
                  className="w-full pl-4 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200 bg-slate-50/50 group-hover:bg-white outline-none text-slate-800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-12 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200 bg-slate-50/50 group-hover:bg-white outline-none text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-slate-600 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mr-2 accent-teal-600" />
                Remember this device
              </label>

              <a href="#" className="text-sm text-teal-600 hover:text-teal-700 font-semibold hover:underline decoration-2 underline-offset-2 transition-all">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying Credentials...
                </>
              ) : (
                'Sign In to Portal'
              )}
            </button>

            <div className="text-xs text-center text-slate-400 mt-6">
              By signing in, you agree to the <a href="#" className="underline hover:text-slate-600">Privacy Policy</a> and <a href="#" className="underline hover:text-slate-600">Terms of Service</a>.
            </div>
          </form>

          <div className="mt-8 flex flex-col items-center justify-center text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg p-4">
            <span className="font-semibold text-slate-700 mb-1 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-500" /> Demo Credentials Active
            </span>
            <div className="font-mono bg-white px-2 py-1 rounded border border-slate-200 mt-1 select-all">
              admin@smartscan.com / smartscan123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean layout
type ComplianceCardProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

const ComplianceCard = ({ icon, title, desc }: ComplianceCardProps) => (
  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-white/40 shadow-sm hover:bg-white/80 transition-colors">
    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-slate-800 font-bold text-sm leading-tight mb-1">{title}</h3>
      <p className="text-slate-500 text-sm leading-snug">{desc}</p>
    </div>
  </div>
);