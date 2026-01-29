
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Question, PhaseStatus, UserAnswer } from '../types';

interface QuizGameProps {
  user: User;
}

export const QuizGame: React.FC<QuizGameProps> = ({ user }) => {
  const [phases, setPhases] = useState<PhaseStatus[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Recarrega os dados do usuário do banco local para garantir que a liberação em tempo real funcione
  const usersFromDb = db.getUsers();
  const dbUser = usersFromDb.find(u => u.id === user.id);
  const userUnlocked = dbUser?.unlockedPhases || (user.role === 'master' ? [1, 2, 3, 4] : []);

  useEffect(() => {
    setPhases(db.getPhases());
  }, []);

  const startPhase = (p: number) => {
    const allQs = db.getQuestions();
    const phaseQs = allQs.filter(q => q.phase === p);
    
    if (phaseQs.length < 15) {
        alert(`Erro técnico: Esta fase possui apenas ${phaseQs.length} perguntas. Contate o Master.`);
        return;
    }

    setQuestions(phaseQs.slice(0, 15)); // Garante exatamente 15
    setSelectedPhase(p);
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
  };

  const handleAnswer = (optionIdx: number) => {
    if (feedback) return;

    const q = questions[currentIndex];
    const isCorrect = optionIdx === q.correctIndex;

    const answer: UserAnswer = {
      userId: user.id,
      questionId: q.id,
      selectedOption: optionIdx,
      isCorrect,
      timestamp: Date.now(),
      phase: q.phase
    };
    db.saveAnswer(answer);

    if (isCorrect) setScore(s => s + 1);

    setFeedback({
      isCorrect,
      message: isCorrect ? 'Excelente! Padrão Ouro mantido.' : `Ops! O correto é: ${q.options[q.correctIndex]}`
    });

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(i => i + 1);
      } else {
        setFinished(true);
      }
    }, 1500);
  };

  if (selectedPhase === null) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black mb-2 text-slate-800 text-center">Treinamento de Qualidade</h2>
        <p className="text-slate-500 text-center mb-10 font-bold uppercase text-xs tracking-widest">Módulos de Capacitação Técnica</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {phases.map(p => {
            // Regra: A fase deve estar liberada GLOBALMENTE e o USUÁRIO deve ter a LIBERAÇÃO INDIVIDUAL
            // Exceção: O Master vê tudo que estiver liberado globalmente
            const isIndividualUnlocked = userUnlocked.includes(p.phaseNumber);
            const isGlobalUnlocked = p.isUnlocked;
            const canAccess = isIndividualUnlocked && isGlobalUnlocked;
            
            return (
              <div
                key={p.phaseNumber}
                className={`p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden group ${canAccess ? 'border-white bg-white shadow-xl hover:-translate-y-2 cursor-pointer' : 'border-slate-200 bg-slate-100/50 opacity-80'}`}
                onClick={() => canAccess && startPhase(p.phaseNumber)}
              >
                {!canAccess && (
                  <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <div className="bg-white/90 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                       <span className="text-xl">🔒</span>
                       <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Aguardando Liberação Master</span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${canAccess ? 'text-indigo-600' : 'text-slate-400'}`}>Módulo {p.phaseNumber}</span>
                  <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-black tracking-widest ${!canAccess ? 'bg-slate-200 text-slate-400' : p.phaseNumber === 1 ? 'bg-green-100 text-green-700' : p.phaseNumber === 2 ? 'bg-yellow-100 text-yellow-700' : p.phaseNumber === 3 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                    {p.difficulty}
                  </span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${canAccess ? 'text-slate-900' : 'text-slate-400'}`}>Nível de Especialização {p.phaseNumber}</h3>
                <p className="text-slate-400 text-[11px] mb-8 leading-tight font-medium">Avaliação de padrões, tempos e processos conforme o Guia Operacional vigente.</p>
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${canAccess ? 'text-indigo-500' : 'text-slate-300'}`}>
                  <span>15 Questões</span>
                  <span>•</span>
                  <span>Avaliação Final</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-white rounded-[3rem] shadow-2xl max-w-2xl mx-auto mt-8 border border-slate-100">
        <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl shadow-indigo-200">🏁</div>
        <h2 className="text-4xl font-black text-slate-900 mb-2">Treinamento Concluído</h2>
        <p className="text-slate-500 mb-8 text-lg font-medium">Seu desempenho no Módulo {selectedPhase} foi processado.</p>

        <div className="grid grid-cols-2 gap-8 mb-10 w-full">
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
            <span className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total de Acertos</span>
            <span className="text-5xl font-black text-indigo-600">{score} <small className="text-lg text-indigo-300">/ 15</small></span>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-center">
            <span className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Status Final</span>
            <span className={`text-2xl font-black ${score >= 12 ? 'text-emerald-600' : 'text-orange-600'}`}>
                {score >= 12 ? 'APROVADO' : 'EM REVISÃO'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setSelectedPhase(null)}
          className="bg-slate-900 hover:bg-black text-white font-black uppercase py-5 px-14 rounded-3xl transition-all shadow-xl text-xs tracking-widest"
        >
          Retornar ao Painel
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-5">
          <div className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-100">
            {currentIndex + 1}
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avaliação Técnica em Curso</h4>
            <span className="text-sm text-slate-800 font-bold">Módulo {selectedPhase} • Questão {currentIndex + 1} de 15</span>
          </div>
        </div>
        <div className="text-right px-6 border-l border-slate-100">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Acertos</span>
          <span className="text-2xl font-black text-indigo-600">{score}</span>
        </div>
      </div>

      <div className="w-full bg-slate-200 h-2.5 rounded-full mb-10 p-0.5">
        <div className="bg-indigo-600 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-slate-100 relative overflow-hidden min-h-[450px]">
        {feedback && (
          <div className={`absolute inset-0 flex items-center justify-center z-20 animate-in fade-in duration-300 ${feedback.isCorrect ? 'bg-emerald-600/95' : 'bg-red-600/95'}`}>
             <div className="text-center text-white p-8">
                <span className="text-7xl mb-4 block">{feedback.isCorrect ? '✓' : '✗'}</span>
                <p className="text-2xl font-black uppercase tracking-tighter max-w-md mx-auto">{feedback.message}</p>
             </div>
          </div>
        )}

        <div className="mb-6">
            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-slate-200">
                Nível: {q.difficulty}
            </span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-12 leading-tight">
          {q.text}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="flex items-center w-full p-6 text-left border-2 border-slate-50 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group bg-slate-50/40"
            >
              <span className="w-10 h-10 rounded-xl bg-white text-slate-400 flex items-center justify-center font-black mr-4 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="font-bold text-slate-700 group-hover:text-indigo-900 text-sm">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
