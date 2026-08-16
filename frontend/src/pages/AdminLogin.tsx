import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, KeyRound, Wheat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@nongsanviet.vn');
  const [password, setPassword] = useState('AdminRice2026@Secure!');
  const [otpToken, setOtpToken] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password, otpToken || undefined);
      if (res.requires2FA) {
        setRequires2FA(true);
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rice-slate flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl space-y-6 border border-rice-gold/30">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-rice-green text-rice-gold rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Wheat className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-rice-slate">Admin Security Portal</h1>
          <p className="text-xs text-gray-500 font-medium">Hệ Thống Quản Trị Độc Quyền Nông Sản Việt</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-rice-slate block mb-1">Email Quản Trị Viên *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-rice-cream border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 font-semibold text-rice-slate focus:ring-2 focus:ring-rice-green"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-rice-slate block mb-1">Mật Khẩu *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-rice-cream border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 font-semibold text-rice-slate focus:ring-2 focus:ring-rice-green"
              />
            </div>
          </div>

          {requires2FA && (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
              <label className="font-extrabold text-amber-900 block flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-600" /> Mã Xác Thực 2FA OTP (Authenticator) *
              </label>
              <input
                type="text"
                required
                placeholder="6 chữ số OTP"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-center text-lg font-mono font-bold tracking-widest text-rice-slate"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-rice-green text-white font-black text-xs hover:bg-rice-green/90 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-rice-gold" />
            <span>{loading ? 'Đang Xác Thực...' : requires2FA ? 'Xác Nhận 2FA OTP' : 'Đăng Nhập Quản Trị'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
