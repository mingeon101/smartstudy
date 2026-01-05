
import React, { useState } from 'react';
import { User, Language } from '../types';
import { locales } from '../locales';

interface AuthProps {
  onLogin: (user: User) => void;
  lang: Language;
}

const Auth: React.FC<AuthProps> = ({ onLogin, lang }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const t = locales[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 시뮬레이션 로그인
    onLogin({
      id: 'user_123',
      email: email,
      name: email.split('@')[0]
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 text-white rounded-2xl shadow-lg mb-6 transform rotate-3">
              <span className="text-4xl">🎓</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
            <p className="text-slate-500 mt-2">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t.email}</label>
              <input
                type="email"
                required
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t.password}</label>
              <input
                type="password"
                required
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
            >
              {t.login}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account? <span className="text-indigo-600 font-bold cursor-pointer hover:underline">{t.signup}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
