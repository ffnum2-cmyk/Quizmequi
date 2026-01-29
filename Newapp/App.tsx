
import React, { useState, useEffect } from 'react';
import { db } from './db';
import { User, UserRole } from './types';
import { Auth } from './components/Auth';
import { AdminPanel } from './components/AdminPanel';
import { QuizGame } from './components/QuizGame';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    db.init();
    // Persistence check
    const savedUser = sessionStorage.getItem('logged_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    sessionStorage.setItem('logged_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdminView(false);
    sessionStorage.removeItem('logged_user');
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl font-black tracking-tighter text-indigo-400">QUIZMASTER PRO</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Version 2.0 Enterprise</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setIsAdminView(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${!isAdminView ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <span className="text-lg">🎮</span>
            <span className="font-semibold text-sm">Play Game</span>
          </button>

          {user.role === UserRole.MASTER && (
            <button
              onClick={() => setIsAdminView(true)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isAdminView ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <span className="text-lg">🛠️</span>
              <span className="font-semibold text-sm">Admin Panel</span>
            </button>
          )}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">
                {user.name[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate mt-1">{user.role}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-3 text-slate-400 hover:text-red-400 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 rounded-xl hover:bg-red-500/5 hover:border-red-500/20 transition-all"
          >
            Sair 🚪
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center">
           <h1 className="text-lg font-black text-indigo-600">QUIZMASTER</h1>
           <div className="flex gap-2">
              {user.role === UserRole.MASTER && (
                <button onClick={() => setIsAdminView(!isAdminView)} className="p-2 bg-slate-100 rounded-lg">⚙️</button>
              )}
              <button onClick={handleLogout} className="p-2 bg-slate-100 rounded-lg">🚪</button>
           </div>
        </div>

        {isAdminView ? <AdminPanel /> : <QuizGame user={user} />}
      </main>
    </div>
  );
};

export default App;
