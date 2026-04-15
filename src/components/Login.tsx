import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../utils/api';
import { setAuthData } from '../utils/jwt';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BRAND = {
    primary: '#1e3b8b',
    secondary: '#f8f6f5',
    accent: '#f4ac37',
    primaryDark: '#162d6b',
    accentDark: '#d4962a'
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authAPI.login({ username, password });
      const data = res.data?.data || res.data;

      if (data && data.token) {
        setAuthData(data.token, data);
        
        // Check if role is ADMIN or TELLER
        if (data.role === 'ADMIN' || data.role === 'TELLER') {
          navigate('/members');
        } else {
          // If not authorized role, we might want to log them out or show error
          setError('Access denied. Only Admins and Tellers can access this portal.');
        }
      } else {
        setError('Invalid login credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-20">
      <div className="max-w-md w-full">
        {/* Logo/Brand Area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-900 rounded-3xl shadow-xl shadow-blue-900/20 mb-6">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Salem Saccos</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">{t('staff_portal_login') || 'Staff Portal Login'}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transform transition-all hover:scale-[1.01]">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                  <span className="text-red-800 text-sm font-bold">{error}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('username') || 'Username'}</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-900 transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-900 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('password') || 'Password'}</label>
                     <button type="button" className="text-[10px] font-black text-blue-900 uppercase tracking-widest hover:text-blue-700">Forgot?</button>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-900 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-900 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-900 text-white rounded-2xl py-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {t('sign_in') || 'Sign In'}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
             <p className="text-slate-500 text-[11px] font-bold uppercase tracking-tight flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-blue-900" />
                SECURE ACCESS AUTHORIZED PERSONNEL ONLY
             </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
           <button 
             onClick={() => navigate('/')}
             className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-900 font-black text-[10px] uppercase tracking-widest transition-colors"
           >
              <LayoutDashboard size={14} />
              Return to Public Site
           </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
