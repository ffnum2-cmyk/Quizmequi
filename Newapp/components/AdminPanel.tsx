
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, KnowledgeBase, Question, PhaseStatus, UserRole } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [users, setUsers] = useState<User[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeBase[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [phases, setPhases] = useState<PhaseStatus[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // States para CRUD
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);
  const [editingKnowledge, setEditingKnowledge] = useState<Partial<KnowledgeBase> | null>(null);
  const [filterPhase, setFilterPhase] = useState<number | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setUsers(db.getUsers());
    setKnowledge(db.getKnowledge());
    setQuestions(db.getQuestions());
    setPhases(db.getPhases());
    setAnswers(db.getAnswers());
  };

  const togglePhase = (phaseNumber: number) => {
    const updatedPhases = phases.map(p => p.phaseNumber === phaseNumber ? { ...p, isUnlocked: !p.isUnlocked } : p);
    db.savePhases(updatedPhases);
    setPhases(updatedPhases);
  };

  const toggleUserStatus = (id: string) => {
    const updatedUsers = users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u);
    db.saveUsers(updatedUsers);
    setUsers(updatedUsers);
  };

  const deleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user?.role === UserRole.MASTER) return alert('Não é possível excluir o usuário master.');
    if (!window.confirm(`Excluir permanentemente o usuário ${user?.name}?`)) return;
    const updatedUsers = users.filter(u => u.id !== id);
    db.saveUsers(updatedUsers);
    setUsers(updatedUsers);
  };

  const toggleUserPhase = (userId: string, phaseNum: number) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const currentPhases = u.unlockedPhases || [];
        const newPhases = currentPhases.includes(phaseNum)
          ? currentPhases.filter(p => p !== phaseNum)
          : [...currentPhases, phaseNum].sort();
        return { ...u, unlockedPhases: newPhases };
      }
      return u;
    });
    db.saveUsers(updatedUsers);
    setUsers(updatedUsers);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    
    const newQuestions = [...questions];
    if (editingQuestion.id) {
      const idx = newQuestions.findIndex(q => q.id === editingQuestion.id);
      newQuestions[idx] = editingQuestion as Question;
    } else {
      const newQ = { ...editingQuestion, id: `q-${Date.now()}` } as Question;
      newQuestions.push(newQ);
    }
    
    db.saveQuestions(newQuestions);
    setQuestions(newQuestions);
    setIsQuestionModalOpen(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: string) => {
    if (!window.confirm("Excluir esta pergunta?")) return;
    const newQs = questions.filter(q => q.id !== id);
    db.saveQuestions(newQs);
    setQuestions(newQs);
  };

  const handleSaveKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKnowledge) return;

    const newK = [...knowledge];
    if (editingKnowledge.id) {
      const idx = newK.findIndex(k => k.id === editingKnowledge.id);
      newK[idx] = editingKnowledge as KnowledgeBase;
    } else {
      const entry = { ...editingKnowledge, id: `k-${Date.now()}` } as KnowledgeBase;
      newK.push(entry);
    }

    db.saveKnowledge(newK);
    setKnowledge(newK);
    setIsKnowledgeModalOpen(false);
    setEditingKnowledge(null);
  };

  const handleDeleteKnowledge = (id: string) => {
    if (!window.confirm("Excluir este registro?")) return;
    const newK = knowledge.filter(k => k.id !== id);
    db.saveKnowledge(newK);
    setKnowledge(newK);
  };

  const filteredUsers = users.filter(u => 
    u.role !== UserRole.MASTER && 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const usersByPhase = phases.map(p => {
    const count = new Set(answers.filter(a => a.phase === p.phaseNumber).map(a => a.userId)).size;
    return { name: `Fase ${p.phaseNumber}`, users: count };
  });

  const accuracyData = [
    { name: 'Acertos', value: answers.filter(a => a.isCorrect).length },
    { name: 'Erros', value: answers.filter(a => !a.isCorrect).length }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <span className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">👑</span>
          Gestão Master
        </h2>
        <div className="flex gap-4 items-center">
            <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Total de Colaboradores</p>
                <p className="text-xl font-black text-indigo-700">{users.length - 1}</p>
            </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {[
          {id: 'stats', label: '📊 Estatísticas'},
          {id: 'liberacao', label: '🔐 Liberação Individual'},
          {id: 'conhecimento', label: '📚 Conhecimento'},
          {id: 'perguntas', label: '❓ Perguntas'},
          {id: 'fases', label: '⚙️ Fases Globais'},
          {id: 'usuarios', label: '👥 Usuários'}
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'border-b-4 border-indigo-600 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 min-h-[600px]">
        {activeTab === 'stats' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-[1.5rem] border border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Progresso por Módulo</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usersByPhase}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="users" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-[1.5rem] border border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Qualidade de Respostas</h3>
              <div className="h-64 flex flex-col items-center">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie data={accuracyData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-8 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-black text-emerald-600">{accuracyData[0].value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Acertos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-red-600">{accuracyData[1].value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Erros</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'liberacao' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-800">Controle de Acesso Individual</h3>
                <p className="text-slate-500 text-xs font-bold">Libere ou bloqueie fases específicas para cada colaborador.</p>
              </div>
              <div className="relative w-full md:w-64">
                <input 
                  type="text" 
                  placeholder="Buscar colaborador..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 opacity-30">🔍</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Colaborador</th>
                    {[1, 2, 3, 4].map(n => (
                      <th key={n} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Fase {n}</th>
                    ))}
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{u.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{u.email}</span>
                        </div>
                      </td>
                      {[1, 2, 3, 4].map(num => (
                        <td key={num} className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleUserPhase(u.id, num)}
                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${u.unlockedPhases?.includes(num) ? 'bg-emerald-500' : 'bg-slate-200'}`}
                          >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${u.unlockedPhases?.includes(num) ? 'left-8' : 'left-1'}`} />
                          </button>
                          <span className="block text-[8px] font-black text-slate-400 mt-1 uppercase tracking-tighter">
                            {u.unlockedPhases?.includes(num) ? 'LIBERADO' : 'BLOQUEADO'}
                          </span>
                        </td>
                      ))}
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            const all = [1,2,3,4];
                            const updatedUsers = users.map(user => user.id === u.id ? {...user, unlockedPhases: all} : user);
                            db.saveUsers(updatedUsers);
                            setUsers(updatedUsers);
                          }}
                          className="text-[9px] font-black text-indigo-600 uppercase border border-indigo-100 px-2 py-1 rounded-md hover:bg-indigo-50">
                          Liberar Tudo
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold italic">Nenhum colaborador encontrado para os critérios de busca.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'conhecimento' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-800">Base de Padrões</h3>
                <p className="text-slate-500 text-xs font-bold">Conteúdo técnico que serve de base para as questões.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingKnowledge({ theme: '', content: '', phase: 1, difficulty: 'Fácil' });
                  setIsKnowledgeModalOpen(true);
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                Novo Registro
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {knowledge.map(k => (
                <div key={k.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-white px-3 py-1 rounded-lg text-[10px] font-black text-indigo-600 shadow-sm uppercase tracking-widest">{k.theme}</span>
                    <span className="text-[10px] font-bold text-slate-400">MOD {k.phase}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed mb-6">"{k.content}"</p>
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setEditingKnowledge(k); setIsKnowledgeModalOpen(true); }} className="text-[10px] font-black text-indigo-600 uppercase">Editar</button>
                    <button onClick={() => handleDeleteKnowledge(k.id)} className="text-[10px] font-black text-red-600 uppercase">Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'perguntas' && (
          <div>
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-800">Banco de Questões</h3>
                <div className="flex gap-2">
                  {filterPhase && (
                    <button onClick={() => setFilterPhase(null)} className="text-xs font-bold text-slate-500 border border-slate-200 px-3 py-1 rounded-lg">Ver Todas as Fases</button>
                  )}
                  <button 
                    onClick={() => {
                      setEditingQuestion({ text: '', options: ['', '', '', ''], correctIndex: 0, phase: filterPhase || 1, difficulty: 'Fácil' });
                      setIsQuestionModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-md">
                    Nova Pergunta
                  </button>
                </div>
            </div>

            {!filterPhase ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(p => {
                  const count = questions.filter(q => q.phase === p).length;
                  return (
                      <div key={p} className="bg-slate-50 rounded-2xl p-6 flex justify-between items-center border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${count >= 15 ? 'bg-emerald-600 text-white' : 'bg-orange-500 text-white'}`}>
                                {p}
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 uppercase text-sm">Fase {p}</h4>
                                <p className="text-xs font-bold text-slate-400">{count} / 15 questões</p>
                            </div>
                        </div>
                        <button 
                          onClick={() => setFilterPhase(p)}
                          className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100">
                          Gerenciar
                        </button>
                      </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4 bg-indigo-50 p-4 rounded-xl">
                   <span className="font-black text-indigo-900 uppercase text-xs">Fase {filterPhase}: Editando Questões</span>
                </div>
                {questions.filter(q => q.phase === filterPhase).map(q => (
                  <div key={q.id} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 text-sm mb-3">{q.text}</p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10px] text-slate-500 bg-slate-50 p-3 rounded-lg">
                        {q.options.map((opt, i) => (
                          <div key={i} className={`flex items-center gap-2 ${i === q.correctIndex ? 'text-emerald-600 font-black' : ''}`}>
                            <span className="w-4 h-4 rounded bg-white flex items-center justify-center border border-slate-200">{String.fromCharCode(65+i)}</span>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button onClick={() => { setEditingQuestion(q); setIsQuestionModalOpen(true); }} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">✏️</button>
                      <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'fases' && (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex gap-3 items-center">
                <span className="text-2xl">⚠️</span>
                <p className="text-xs font-bold text-orange-800">CUIDADO: Bloquear uma fase globalmente impede o acesso até mesmo de usuários que possuam liberação individual.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {phases.map(p => (
                <div key={p.phaseNumber} className={`p-8 rounded-[2rem] border-4 transition-all ${p.isUnlocked ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex justify-between items-start mb-6">
                    <span className="text-3xl font-black text-slate-800">{p.phaseNumber}</span>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.isUnlocked ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'}`}>
                        {p.isUnlocked ? 'Liberada Geral' : 'Bloqueada Geral'}
                    </div>
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Nível: {p.difficulty}</p>
                    <button
                    onClick={() => togglePhase(p.phaseNumber)}
                    className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md ${p.isUnlocked ? 'bg-white text-red-600 border border-red-100 hover:bg-red-50' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'}`}
                    >
                    {p.isUnlocked ? 'Bloquear Global' : 'Liberar Global'}
                    </button>
                </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800">Controle de Colaboradores</h3>
            <div className="overflow-hidden rounded-2xl border border-slate-100">
                <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white">
                    <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Colaborador</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">E-mail</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Status de Conta</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500 text-xs">{u.name[0]}</div>
                                <span className="font-bold text-slate-800">{u.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{u.email}</td>
                        <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {u.isActive ? 'Ativa' : 'Bloqueada'}
                        </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-3">
                            <button onClick={() => toggleUserStatus(u.id)} title={u.isActive ? "Bloquear Conta" : "Desbloquear Conta"} className="p-2 hover:bg-white rounded-lg transition-all shadow-sm">
                            {u.isActive ? '🔒' : '🔓'}
                            </button>
                            <button onClick={() => deleteUser(u.id)} disabled={u.role === UserRole.MASTER} className={`p-2 rounded-lg transition-all ${u.role === UserRole.MASTER ? 'opacity-20 grayscale' : 'hover:bg-red-50 text-red-600'}`}>
                            🗑️
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAIS */}
      
      {isQuestionModalOpen && editingQuestion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-xl p-10 overflow-y-auto max-h-[90vh] shadow-2xl">
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter text-slate-800">Configurar Questão</h3>
            <form onSubmit={handleSaveQuestion} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Enunciado da Pergunta</label>
                <textarea 
                  required
                  className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none min-h-[100px]" 
                  placeholder="Digite o enunciado aqui..."
                  value={editingQuestion.text} 
                  onChange={e => setEditingQuestion({...editingQuestion, text: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Fase / Módulo</label>
                    <select 
                      className="w-full px-5 py-3 border border-slate-200 rounded-2xl bg-slate-50 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100"
                      value={editingQuestion.phase}
                      onChange={e => setEditingQuestion({...editingQuestion, phase: parseInt(e.target.value)})}
                    >
                      {[1, 2, 3, 4].map(n => <option key={n} value={n}>Fase {n}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Dificuldade</label>
                    <select 
                      className="w-full px-5 py-3 border border-slate-200 rounded-2xl bg-slate-50 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100"
                      value={editingQuestion.difficulty}
                      onChange={e => setEditingQuestion({...editingQuestion, difficulty: e.target.value})}
                    >
                      <option value="Fácil">Fácil</option>
                      <option value="Médio">Médio</option>
                      <option value="Difícil">Difícil</option>
                      <option value="Expert">Expert</option>
                    </select>
                 </div>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Alternativas de Resposta</label>
                {editingQuestion.options?.map((opt, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl border ${editingQuestion.correctIndex === i ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">{String.fromCharCode(65+i)}</span>
                    <input 
                      required
                      className="flex-1 bg-transparent text-sm font-bold text-slate-700 outline-none" 
                      placeholder={`Alternativa ${String.fromCharCode(65+i)}...`}
                      value={opt}
                      onChange={e => {
                        const newOpts = [...(editingQuestion.options || [])];
                        newOpts[i] = e.target.value;
                        setEditingQuestion({...editingQuestion, options: newOpts as [string, string, string, string]});
                      }}
                    />
                    <input 
                      type="radio" 
                      name="correct" 
                      className="w-5 h-5 accent-emerald-500 cursor-pointer"
                      checked={editingQuestion.correctIndex === i}
                      onChange={() => setEditingQuestion({...editingQuestion, correctIndex: i})}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase py-4 rounded-2xl transition-all shadow-lg shadow-indigo-100">Salvar Alterações</button>
                <button type="button" onClick={() => setIsQuestionModalOpen(false)} className="px-8 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black uppercase py-4 rounded-2xl transition-all">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isKnowledgeModalOpen && editingKnowledge && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-xl p-10 shadow-2xl">
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter text-slate-800">Padrão Operacional</h3>
            <form onSubmit={handleSaveKnowledge} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Tema Principal</label>
                <input 
                  required
                  placeholder="Ex: Higiene, Fritas, Temperaturas..."
                  className="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all" 
                  value={editingKnowledge.theme} 
                  onChange={e => setEditingKnowledge({...editingKnowledge, theme: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Padrão Ouro (Conteúdo Técnico)</label>
                <textarea 
                  required
                  placeholder="Descreva aqui o padrão oficial..."
                  className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none min-h-[150px]" 
                  value={editingKnowledge.content} 
                  onChange={e => setEditingKnowledge({...editingKnowledge, content: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Módulo Associado</label>
                  <select 
                    className="w-full px-5 py-3 border border-slate-200 rounded-2xl bg-slate-50 font-bold outline-none"
                    value={editingKnowledge.phase}
                    onChange={e => setEditingKnowledge({...editingKnowledge, phase: parseInt(e.target.value)})}
                  >
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>Fase {n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Complexidade</label>
                  <select 
                    className="w-full px-5 py-3 border border-slate-200 rounded-2xl bg-slate-50 font-bold outline-none"
                    value={editingKnowledge.difficulty}
                    onChange={e => setEditingKnowledge({...editingKnowledge, difficulty: e.target.value})}
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Médio">Médio</option>
                    <option value="Difícil">Difícil</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase py-4 rounded-2xl transition-all shadow-lg shadow-indigo-100">Registrar Padrão</button>
                <button type="button" onClick={() => setIsKnowledgeModalOpen(false)} className="px-8 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black uppercase py-4 rounded-2xl transition-all">Sair</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
