
import React, { useState } from 'react';
import { Cpu, Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { UserAccount } from '../types';

interface LoginProps {
  onLogin: (user: UserAccount) => void;
}

const MOCK_USERS: UserAccount[] = [
  { id: '1', name: 'João Silva', role: 'Administrador', username: 'admin' },
  { id: '2', name: 'Ricardo Martins', role: 'Técnico', username: 'ricardo' },
  { id: '3', name: 'Ana Tech', role: 'Técnico', username: 'ana' },
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulação de delay de rede
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.username === username.toLowerCase());
      
      // Senha padrão "123" para todos para este exemplo
      if (user && password === '123') {
        onLogin(user);
      } else {
        setError('Usuário ou senha incorretos. Tente "admin" e senha "123".');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-600/30 mb-6 animate-bounce">
            <Cpu size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">TechGuard<span className="text-blue-500">Pro</span></h1>
          <p className="text-slate-400 mt-2 font-medium">Acesso Restrito a Técnicos Autorizados</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Usuário</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  required
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-slate-700"
                  placeholder="Seu login"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={24} />
                  ENTRAR NO SISTEMA
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400 font-medium italic">Versão 2.5.0 - Enterprise Edition</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
