
import React, { useMemo } from 'react';
import { db } from '../db';
import { User, UserAnswer } from '../types';

export const Ranking: React.FC = () => {
  const data = useMemo(() => {
    const allUsers = db.getUsers();
    const allAnswers = db.getAnswers();
    
    // Agregar pontos por usuário
    const ranking = allUsers.map(u => {
      const userAnswers = allAnswers.filter(a => a.userId === u.id);
      const totalPoints = userAnswers.filter(a => a.isCorrect).length;
      const lastActivity = userAnswers.length > 0 
        ? Math.max(...userAnswers.map(a => a.timestamp)) 
        : u.createdAt;
      
      return {
        id: u.id,
        name: u.name,
        points: totalPoints,
        lastActivity,
        role: u.role
      };
    });

    // Ordenar por pontos (desc) e depois por última atividade (mais recente primeiro em caso de empate)
    return ranking
      .filter(r => r.role !== 'master') // Opcional: remover master do ranking
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.lastActivity - a.lastActivity;
      });
  }, []);

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tighter">Hall da Fama</h2>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">Os Maiores Especialistas Padrão Ouro</p>
      </div>

      {/* Pódio dos Top 3 */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-16 px-4">
        {/* Segundo Lugar */}
        {data[1] && (
          <div className="w-full md:w-1/4 order-2 md:order-1">
            <div className="bg-white rounded-t-[2rem] p-6 shadow-xl border-t-4 border-slate-300 flex flex-col items-center animate-bounce-slow">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-4 shadow-inner border-2 border-slate-200">🥈</div>
              <p className="font-black text-slate-800 text-sm truncate w-full text-center">{data[1].name}</p>
              <p className="text-2xl font-black text-slate-400">{data[1].points} pts</p>
            </div>
            <div className="h-12 bg-slate-200 rounded-b-2xl shadow-inner flex items-center justify-center">
              <span className="text-slate-500 font-black text-xs">2º LUGAR</span>
            </div>
          </div>
        )}

        {/* Primeiro Lugar */}
        {data[0] && (
          <div className="w-full md:w-1/3 order-1 md:order-2 z-10 -mb-4 md:mb-0">
            <div className="bg-white rounded-t-[3rem] p-10 shadow-2xl border-t-8 border-yellow-400 flex flex-col items-center animate-pulse-gentle">
              <div className="relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl animate-bounce">👑</div>
                <div className="w-24 h-24 rounded-full bg-yellow-50 flex items-center justify-center text-5xl mb-6 shadow-xl border-4 border-yellow-100">🥇</div>
              </div>
              <p className="font-black text-slate-900 text-xl truncate w-full text-center">{data[0].name}</p>
              <p className="text-4xl font-black text-yellow-500 drop-shadow-sm">{data[0].points} pts</p>
            </div>
            <div className="h-20 bg-yellow-400 rounded-b-3xl shadow-lg flex items-center justify-center">
              <span className="text-yellow-900 font-black text-sm tracking-widest">CAMPEÃO</span>
            </div>
          </div>
        )}

        {/* Terceiro Lugar */}
        {data[2] && (
          <div className="w-full md:w-1/4 order-3">
            <div className="bg-white rounded-t-[2rem] p-6 shadow-xl border-t-4 border-orange-300 flex flex-col items-center animate-bounce-slow-delayed">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-3xl mb-4 shadow-inner border-2 border-orange-100">🥉</div>
              <p className="font-black text-slate-800 text-sm truncate w-full text-center">{data[2].name}</p>
              <p className="text-2xl font-black text-orange-400">{data[2].points} pts</p>
            </div>
            <div className="h-10 bg-orange-200 rounded-b-2xl shadow-inner flex items-center justify-center">
              <span className="text-orange-600 font-black text-xs">3º LUGAR</span>
            </div>
          </div>
        )}
      </div>

      {/* Lista Geral */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 bg-slate-900 flex justify-between items-center">
          <h3 className="text-white font-black text-sm uppercase tracking-widest">Classificação Geral</h3>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Atualizado em Tempo Real</span>
        </div>
        <div className="divide-y divide-slate-100">
          {data.map((user, index) => (
            <div key={user.id} className={`flex items-center gap-4 p-6 transition-colors hover:bg-slate-50 ${index < 3 ? 'bg-slate-50/30' : ''}`}>
              <div className="w-10 font-black text-slate-300 text-xl italic">
                #{index + 1}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                {user.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-800 flex items-center gap-2">
                  {user.name}
                  {index === 0 && <span className="text-xs">🔥</span>}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Colaborador Ativo</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-slate-900">{user.points}</p>
                <p className="text-[10px] font-black text-indigo-500 uppercase">Pontos Totais</p>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-bold italic">Nenhum dado de pontuação disponível ainda.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
        .animate-bounce-slow-delayed { animation: bounce-slow 3s infinite ease-in-out 1.5s; }
        .animate-pulse-gentle { animation: pulse-gentle 4s infinite ease-in-out; }
      `}</style>
    </div>
  );
};
