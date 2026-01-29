
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { db } from '../db';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'register' | 'recover'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [favoriteColor, setFavoriteColor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = db.getUsers();
    const user = users.find(u => u.email === email && u.passwordHash === password);
    if (user) {
      if (!user.isActive) {
        setError('Esta conta está bloqueada.');
        return;
      }
      onLogin(user);
    } else {
      setError('E-mail ou senha inválidos.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const users = db.getUsers();
    if (users.find(u => u.email === email)) {
      setError('E-mail já cadastrado.');
      return;
    }

    // Fix: Add missing 'unlockedPhases' property to the User object to resolve the TypeScript error.
    // Newly registered users start with Phase 1 unlocked by default.
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      passwordHash: password,
      motherName,
      favoriteColor,
      role: UserRole.USER,
      isActive: true,
      createdAt: Date.now(),
      unlockedPhases: [1]
    };

    db.saveUsers([...users, newUser]);
    setSuccess('Cadastro realizado com sucesso! Faça login.');
    setView('login');
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    const users = db.getUsers();
    const user = users.find(u => u.email === email && u.motherName === motherName && u.favoriteColor === favoriteColor);
    if (user) {
      setSuccess(`Usuário validado. Sua senha é: ${user.passwordHash}`);
      setTimeout(() => setView('login'), 3000);
    } else {
      setError('Informações de recuperação incorretas.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold tracking-tight">QuizMaster Pro</h1>
          <p className="mt-2 text-indigo-100 opacity-90">Plataforma Profissional de Conhecimento</p>
        </div>

        <div className="p-8">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">{success}</div>}

          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                <input type="password" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors">Entrar</button>
              <div className="flex justify-between text-sm mt-4">
                <button type="button" onClick={() => setView('register')} className="text-indigo-600 hover:underline">Registrar-se</button>
                <button type="button" onClick={() => setView('recover')} className="text-slate-500 hover:underline">Esqueci a senha</button>
              </div>
            </form>
          )}

          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                <input type="password" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-xs uppercase">Nome da Mãe</label>
                  <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={motherName} onChange={e => setMotherName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-xs uppercase">Cor Favorita</label>
                  <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={favoriteColor} onChange={e => setFavoriteColor(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors">Criar Conta</button>
              <button type="button" onClick={() => setView('login')} className="w-full text-sm text-slate-500 hover:underline mt-2">Já tenho uma conta</button>
            </form>
          )}

          {view === 'recover' && (
            <form onSubmit={handleRecover} className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">Confirme seus dados para recuperar o acesso.</p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Mãe</label>
                <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={motherName} onChange={e => setMotherName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cor Favorita</label>
                <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={favoriteColor} onChange={e => setFavoriteColor(e.target.value)} />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors">Validar Dados</button>
              <button type="button" onClick={() => setView('login')} className="w-full text-sm text-slate-500 hover:underline mt-2">Voltar ao Login</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
