
import { User, KnowledgeBase, Question, UserAnswer, PhaseStatus, UserRole } from './types';

const STORAGE_KEYS = {
  USERS: 'quiz_users',
  KNOWLEDGE: 'quiz_knowledge',
  QUESTIONS: 'quiz_questions',
  ANSWERS: 'quiz_answers',
  PHASES: 'quiz_phases'
};

const INITIAL_MASTER_USER: User = {
  id: 'master-0',
  name: 'Master Admin',
  email: 'master@admin.com',
  passwordHash: 'master@123',
  motherName: 'Admin Mother',
  favoriteColor: 'Blue',
  role: UserRole.MASTER,
  isActive: true,
  createdAt: Date.now(),
  unlockedPhases: [1, 2, 3, 4]
};

const INITIAL_PHASES: PhaseStatus[] = [
  { phaseNumber: 1, isUnlocked: true, difficulty: 'Fácil' },
  { phaseNumber: 2, isUnlocked: true, difficulty: 'Médio' },
  { phaseNumber: 3, isUnlocked: true, difficulty: 'Difícil' },
  { phaseNumber: 4, isUnlocked: true, difficulty: 'Muito difícil' }
];

const QUESTIONS_DATABASE: Question[] = [
  // --- FASE 1: FÁCIL (15 questões) ---
  { id: 'f1-q1', phase: 1, difficulty: 'Fácil', text: "Qual a quantidade exata de alface no McChicken?", options: ["28 gramas", "20 gramas", "30 gramas", "15 gramas"], correctIndex: 0 },
  { id: 'f1-q2', phase: 1, difficulty: 'Fácil', text: "Com qual frequência mínima os funcionários devem lavar as mãos?", options: ["De 1 em 1 hora", "De 2 em 2 horas", "Apenas quando trocar de posto", "Sempre que o gerente pedir"], correctIndex: 0 },
  { id: 'f1-q3', phase: 1, difficulty: 'Fácil', text: "Qual o peso do produto final de uma casquinha?", options: ["99 gramas", "110 gramas", "90 gramas", "105 gramas"], correctIndex: 0 },
  { id: 'f1-q4', phase: 1, difficulty: 'Fácil', text: "A pessoa da lixeira pode limpar bandejas na visão do cliente no salão?", options: ["Nunca", "Somente em baixo movimento", "Sim, se estiver usando luvas", "Sim, é o procedimento padrão"], correctIndex: 0 },
  { id: 'f1-q5', phase: 1, difficulty: 'Fácil', text: "Qual a quantidade de gelo para as bebidas Pequena, Média e Grande?", options: ["5, 10 e 15 unidades", "3, 6 e 9 unidades", "Gelo até a metade do copo", "10 unidades para todas"], correctIndex: 0 },
  { id: 'f1-q6', phase: 1, difficulty: 'Fácil', text: "Quantas carnes de McChicken cabem em uma única gaveta?", options: ["6 carnes", "4 carnes", "8 carnes", "10 carnes"], correctIndex: 0 },
  { id: 'f1-q7', phase: 1, difficulty: 'Fácil', text: "Qual a quantidade de cobertura no McColosso?", options: ["1 tiro de ½", "1 tiro completo", "2 tiros de ½", "Apenas cobertura no fundo"], correctIndex: 0 },
  { id: 'f1-q8', phase: 1, difficulty: 'Fácil', text: "Qual a quantidade máxima de carnes 10:1 que devemos ativar por vez?", options: ["8 unidades", "6 unidades", "12 unidades", "4 unidades"], correctIndex: 0 },
  { id: 'f1-q9', phase: 1, difficulty: 'Fácil', text: "Qual a frequência de lavagem dos utensílios da cozinha?", options: ["De 4 em 4 horas", "Uma vez por turno", "De 2 em 2 horas", "Apenas no fechamento"], correctIndex: 0 },
  { id: 'f1-q10', phase: 1, difficulty: 'Fácil', text: "Para maior rapidez, como o funcionário do caixa deve digitar?", options: ["Com as duas mãos", "Usando apenas o teclado numérico", "Com uma mão enquanto organiza sacos", "Apenas com a mão dominante"], correctIndex: 0 },
  { id: 'f1-q11', phase: 1, difficulty: 'Fácil', text: "Quem é o responsável por limpar os vidros no salão?", options: ["A pessoa do salão", "A pessoa da lixeira", "O gerente de plantão", "Empresa externa"], correctIndex: 0 },
  { id: 'f1-q12', phase: 1, difficulty: 'Fácil', text: "Qual a coloração correta de uma McFrita padrão ouro?", options: ["Marrom-dourada clara e leve brilho", "Amarela pálida", "Dourada escura e crocante", "Branca e macia"], correctIndex: 0 },
  { id: 'f1-q13', phase: 1, difficulty: 'Fácil', text: "O que define o 'Momento do Cliente'?", options: ["Desde a entrada até a saída do restaurante", "Apenas o tempo que ele passa no caixa", "O tempo de espera pelo lanche", "A experiência dentro do salão"], correctIndex: 0 },
  { id: 'f1-q14', phase: 1, difficulty: 'Fácil', text: "Como deve ser a massa das tortas fritas padrão ouro?", options: ["Marrom-dourada, crocante e com bolhas", "Lisa e macia", "Branca e firme", "Escura e sem bolhas"], correctIndex: 0 },
  { id: 'f1-q15', phase: 1, difficulty: 'Fácil', text: "O que acontece se os pães ficarem descobertos?", options: ["Eles ficarão muito secos", "Eles ficarão mais macios", "Não altera a qualidade", "Eles esfriam mais rápido"], correctIndex: 0 },

  // --- FASE 2: MÉDIO (15 questões) ---
  { id: 'f2-q1', phase: 2, difficulty: 'Médio', text: "Qual a temperatura correta das câmaras resfriadas?", options: ["1°C a 4°C", "5°C a 10°C", "-2°C a 2°C", "0°C a 8°C"], correctIndex: 0 },
  { id: 'f2-q2', phase: 2, difficulty: 'Médio', text: "Qual a temperatura das câmaras congeladas?", options: ["-23°C a -18°C", "-10°C a -5°C", "-30°C a -25°C", "-15°C a -10°C"], correctIndex: 0 },
  { id: 'f2-q3', phase: 2, difficulty: 'Médio', text: "Qual a temperatura da estufa de McFritas e seu tempo de vida?", options: ["168°C e 7 minutos", "150°C e 10 minutos", "180°C e 5 minutos", "160°C e 12 minutos"], correctIndex: 0 },
  { id: 'f2-q4', phase: 2, difficulty: 'Médio', text: "Qual o empilhamento máximo de pães de Big Mac?", options: ["26 unidades", "20 unidades", "30 unidades", "15 unidades"], correctIndex: 0 },
  { id: 'f2-q5', phase: 2, difficulty: 'Médio', text: "Qual o tempo de vida do pão fresco?", options: ["6 dias", "4 dias", "10 dias", "3 dias"], correctIndex: 0 },
  { id: 'f2-q6', phase: 2, difficulty: 'Médio', text: "Qual a temperatura interna mínima das carnes 10:1 após cozidas?", options: ["69°C", "60°C", "75°C", "65°C"], correctIndex: 0 },
  { id: 'f2-q7', phase: 2, difficulty: 'Médio', text: "Qual o tempo de resfriamento das tortas e ativação máxima?", options: ["20 min / 16 tortas", "15 min / 12 tortas", "30 min / 20 tortas", "10 min / 8 tortas"], correctIndex: 0 },
  { id: 'f2-q8', phase: 2, difficulty: 'Médio', text: "Qual o empilhamento máximo de bags de Coca-Cola Zero?", options: ["4 caixas", "2 caixas", "6 caixas", "3 caixas"], correctIndex: 0 },
  { id: 'f2-q9', phase: 2, difficulty: 'Médio', text: "Qual o tempo de fritura das McFritas?", options: ["3 minutos e 10 segundos", "2 minutos e 30 segundos", "4 minutos", "3 minutos e 45 segundos"], correctIndex: 0 },
  { id: 'f2-q10', phase: 2, difficulty: 'Médio', text: "Qual o tempo de vida das McFritas congeladas?", options: ["275 dias", "180 dias", "365 dias", "120 dias"], correctIndex: 0 },
  { id: 'f2-q11', phase: 2, difficulty: 'Médio', text: "O que indica que a gordura está velha?", options: ["Cor escura e fumaça", "Cor clara e sem cheiro", "Muitas bolhas na fritura", "Fica mais rala"], correctIndex: 0 },
  { id: 'f2-q12', phase: 2, difficulty: 'Médio', text: "Qual o tempo de vida secundário das tortas na estufa?", options: ["90 minutos", "60 minutos", "120 minutos", "45 minutos"], correctIndex: 0 },
  { id: 'f2-q13', phase: 2, difficulty: 'Médio', text: "Qual o tempo de cozimento das carnes 4:1?", options: ["A partir de 104 segundos", "90 segundos", "120 segundos", "80 segundos"], correctIndex: 0 },
  { id: 'f2-q14', phase: 2, difficulty: 'Médio', text: "Qual a capacidade de McNuggets em uma gaveta?", options: ["24 nuggets", "20 nuggets", "30 nuggets", "12 nuggets"], correctIndex: 0 },
  { id: 'f2-q15', phase: 2, difficulty: 'Médio', text: "Qual o tempo de vida primário do queijo fatiado?", options: ["120 dias", "90 dias", "180 dias", "60 dias"], correctIndex: 0 },

  // --- FASE 3: DIFÍCIL (15 questões) ---
  { id: 'f3-q1', phase: 3, difficulty: 'Difícil', text: "Qual a calibragem correta do molho Big Mac?", options: ["6 tiros = 59 ml", "5 tiros = 50 ml", "6 tiros = 70 ml", "4 tiros = 45 ml"], correctIndex: 0 },
  { id: 'f3-q2', phase: 3, difficulty: 'Difícil', text: "Qual a calibragem da mostarda pouch?", options: ["35 a 60 tiros = 30 ml", "20 a 40 tiros = 25 ml", "50 a 80 tiros = 40 ml", "30 tiros = 30 ml"], correctIndex: 0 },
  { id: 'f3-q3', phase: 3, difficulty: 'Difícil', text: "Qual a quantidade de cebola no sanduíche Cheddar?", options: ["7 gramas", "5 gramas", "10 gramas", "3 gramas"], correctIndex: 0 },
  { id: 'f3-q4', phase: 3, difficulty: 'Difícil', text: "Qual o rendimento ideal das McFritas (porções P por kg)?", options: ["9,11", "9,12", "8,11", "9,14"], correctIndex: 0 },
  { id: 'f3-q5', phase: 3, difficulty: 'Difícil', text: "Qual a temperatura correta do Banho-Maria?", options: ["57°C a 63°C", "45°C a 55°C", "65°C a 75°C", "50°C a 60°C"], correctIndex: 0 },
  { id: 'f3-q6', phase: 3, difficulty: 'Difícil', text: "Qual a temperatura interna mínima dos produtos na UHC?", options: ["60°C", "69°C", "55°C", "70°C"], correctIndex: 0 },
  { id: 'f3-q7', phase: 3, difficulty: 'Difícil', text: "Qual pegador deve ser usado para carnes brancas após o cozimento?", options: ["Pegador Verde", "Pegador Amarelo", "Pegador Azul", "Pegador Vermelho"], correctIndex: 0 },
  { id: 'f3-q8', phase: 3, difficulty: 'Difícil', text: "Qual a quantidade de mostarda por tiro nos sanduíches?", options: ["1/40 oz", "1/20 oz", "1/50 oz", "1/30 oz"], correctIndex: 0 },
  { id: 'f3-q9', phase: 3, difficulty: 'Difícil', text: "Qual a causa de uma carne mole e gordurosa?", options: ["Ajuste incorreto da chapa", "Carne descongelada", "Pouco tempo de chapa", "Chapa muito quente"], correctIndex: 0 },
  { id: 'f3-q10', phase: 3, difficulty: 'Difícil', text: "Qual a proporção xarope/água da Fanta Laranja?", options: ["4.2 oz água / 1.0 oz xarope", "5.0 oz água / 1.0 oz xarope", "4.0 oz água / 1.2 oz xarope", "3.8 oz água / 1.0 oz xarope"], correctIndex: 0 },
  { id: 'f3-q11', phase: 3, difficulty: 'Difícil', text: "Qual o tempo de vida secundário do molho Big Mac (deslacrado)?", options: ["24 horas", "12 horas", "48 horas", "8 horas"], correctIndex: 0 },
  { id: 'f3-q12', phase: 3, difficulty: 'Difícil', text: "O que define contaminação cruzada?", options: ["Transferência de bactérias de cru para cozido", "Usar o mesmo saco para dois lanches", "Lanche fora do tempo de vida", "Misturar dois tipos de pão"], correctIndex: 0 },
  { id: 'f3-q13', phase: 3, difficulty: 'Difícil', text: "Qual o peso das McFritas Kids, Pequena, Média e Grande?", options: ["31g, 73g, 102g e 146g", "30g, 70g, 100g e 150g", "25g, 60g, 90g e 130g", "31g, 80g, 110g e 160g"], correctIndex: 0 },
  { id: 'f3-q14', phase: 3, difficulty: 'Difícil', text: "Qual o peso de um Biju por unidade?", options: ["5,4 gramas", "6,0 gramas", "4,5 gramas", "5,0 gramas"], correctIndex: 0 },
  { id: 'f3-q15', phase: 3, difficulty: 'Difícil', text: "Qual o tempo máximo do EOPE no Drive?", options: ["120 segundos", "180 segundos", "90 segundos", "150 segundos"], correctIndex: 0 },

  // --- FASE 4: EXPERT (15 questões) ---
  { id: 'f4-q1', phase: 4, difficulty: 'Expert', text: "Qual o rendimento total de uma Mostarda Pouch?", options: ["1235 unidades", "1000 unidades", "1500 unidades", "1100 unidades"], correctIndex: 0 },
  { id: 'f4-q2', phase: 4, difficulty: 'Expert', text: "Qual a temperatura da Tostadeira Rápida (Principal/Auxiliar)?", options: ["293°C / 204°C", "250°C / 180°C", "300°C / 250°C", "280°C / 200°C"], correctIndex: 0 },
  { id: 'f4-q3', phase: 4, difficulty: 'Expert', text: "A UHC deve ser aquecida a que temperatura e por quanto tempo?", options: ["85°C por 20 minutos", "90°C por 15 minutos", "80°C por 30 minutos", "75°C por 10 minutos"], correctIndex: 0 },
  { id: 'f4-q4', phase: 4, difficulty: 'Expert', text: "Qual o tempo de vida primário do Ketchup Pouch?", options: ["180 dias", "120 dias", "240 dias", "365 dias"], correctIndex: 0 },
  { id: 'f4-q5', phase: 4, difficulty: 'Expert', text: "Qual o tempo de vida secundário do suco no reservatório?", options: ["7 dias", "5 dias", "10 dias", "3 dias"], correctIndex: 0 },
  { id: 'f4-q6', phase: 4, difficulty: 'Expert', text: "Qual a capacidade máxima de itens no Saco C?", options: ["7 a 9 itens", "5 a 7 itens", "10 a 12 itens", "6 a 8 itens"], correctIndex: 0 },
  { id: 'f4-q7', phase: 4, difficulty: 'Expert', text: "Qual o tempo de vida secundário do pão congelado (incluindo desgelo)?", options: ["48 horas", "24 horas", "72 horas", "36 horas"], correctIndex: 0 },
  { id: 'f4-q8', phase: 4, difficulty: 'Expert', text: "Quanto tempo a tostadeira rápida deve ser pré-aquecida?", options: ["15 minutos", "10 minutos", "20 minutos", "5 minutos"], correctIndex: 0 },
  { id: 'f4-q9', phase: 4, difficulty: 'Expert', text: "Qual a temperatura do mix de sundae no reservatório?", options: ["1°C a 4°C", "5°C a 8°C", "-2°C a 2°C", "0°C a 5°C"], correctIndex: 0 },
  { id: 'f4-q10', phase: 4, difficulty: 'Expert', text: "Qual o ciclo exato de caramelização dos pães?", options: ["22 segundos", "15 segundos", "30 segundos", "18 segundos"], correctIndex: 0 },
  { id: 'f4-q11', phase: 4, difficulty: 'Expert', text: "Qual o tempo de ambientação do molho Cheddar?", options: ["2 horas", "1 hora", "3 horas", "4 horas"], correctIndex: 0 },
  { id: 'f4-q12', phase: 4, difficulty: 'Expert', text: "Qual a temperatura interna mínima de cocção geral das carnes?", options: ["69°C", "74°C", "65°C", "70°C"], correctIndex: 0 },
  { id: 'f4-q13', phase: 4, difficulty: 'Expert', text: "Qual o tempo de vida dos molhos de Nuggets?", options: ["120 dias", "180 dias", "90 dias", "240 dias"], correctIndex: 0 },
  { id: 'f4-q14', phase: 4, difficulty: 'Expert', text: "Por qual cliente o anotador deve iniciar o atendimento?", options: ["Pelo 3º cliente", "Pelo 1º cliente", "Pelo 2º cliente", "Pelo último da fila"], correctIndex: 0 },
  { id: 'f4-q15', phase: 4, difficulty: 'Expert', text: "Qual a temperatura de operação das chapas (Superior/Inferior)?", options: ["Sup 218°C / Inf 177°C", "Sup 200°C / Inf 150°C", "Sup 250°C / Inf 200°C", "Sup 180°C / Inf 180°C"], correctIndex: 0 }
];

export const db = {
  init: () => {
    // Inicialização de Usuários
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([INITIAL_MASTER_USER]));
    } else {
      // Migração refinada: Garante que o Master tenha tudo e os demais comecem vazios (ou o que já tinham)
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const updated = existing.map((u: any) => ({
        ...u,
        unlockedPhases: u.unlockedPhases || (u.role === UserRole.MASTER ? [1, 2, 3, 4] : [])
      }));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    }
    
    // Inicialização de Fases Globais (por padrão liberadas no sistema, o bloqueio agora é INDIVIDUAL)
    if (!localStorage.getItem(STORAGE_KEYS.PHASES)) {
      localStorage.setItem(STORAGE_KEYS.PHASES, JSON.stringify(INITIAL_PHASES));
    }
    
    // SEMPRE atualizar questões com o banco de dados curado para garantir que as alterações reflitam
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(QUESTIONS_DATABASE));
    
    // Popular a Base de Conhecimento para o Admin visualizar
    const knowledgeData: KnowledgeBase[] = QUESTIONS_DATABASE.map((q, i) => ({
        id: `k-${i}`,
        theme: q.difficulty === 'Fácil' ? 'Operação Básica' : q.difficulty === 'Médio' ? 'Armazenamento' : 'Técnico Avançado',
        content: `Padrão Ouro: ${q.text} -> RESPOSTA: ${q.options[q.correctIndex]}`,
        phase: q.phase,
        difficulty: q.difficulty
    }));
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE, JSON.stringify(knowledgeData));
    
    if (!localStorage.getItem(STORAGE_KEYS.ANSWERS)) localStorage.setItem(STORAGE_KEYS.ANSWERS, '[]');
  },

  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),

  getKnowledge: (): KnowledgeBase[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.KNOWLEDGE) || '[]'),
  saveKnowledge: (k: KnowledgeBase[]) => localStorage.setItem(STORAGE_KEYS.KNOWLEDGE, JSON.stringify(k)),

  getQuestions: (): Question[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTIONS) || '[]'),
  saveQuestions: (q: Question[]) => localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(q)),

  getAnswers: (): UserAnswer[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS) || '[]'),
  saveAnswer: (ans: UserAnswer) => {
    const all = db.getAnswers();
    all.push(ans);
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(all));
  },

  getPhases: (): PhaseStatus[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PHASES) || '[]'),
  savePhases: (p: PhaseStatus[]) => localStorage.setItem(STORAGE_KEYS.PHASES, JSON.stringify(p))
};
