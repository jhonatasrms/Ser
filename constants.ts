
import { Plan, Task, AppNotification } from './types';

export const APP_NAME = "Método Sereninho";
export const APP_SUBTITLE = "7 dias para transformar sua rotina com micro-hábitos gamificados.";

// --- SISTEMA DE NOTIFICAÇÕES ---
// Adicione ou remova notificações aqui para que apareçam no app
export const PROMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "promo_flash",
    title: "Oferta Relâmpago! ⚡",
    message: "O plano de 14 dias está com desconto especial hoje. Não perca seu progresso.",
    link: "#pricing",
    linkText: "Ver Oferta",
    type: "promo"
  },
  {
    id: "dica_dia",
    title: "Dica do Mentor",
    message: "Sabia que beber água ao acordar aumenta seu foco em 30%?",
    type: "info"
  }
];

export const PLANS: Plan[] = [
  { 
    id: "p7", 
    name: "7 dias", 
    price: "17,90", 
    currency: "BRL", 
    days: 7, 
    highlight: false,
    description: "Teste inicial para começar a mudança."
  },
  { 
    id: "p14", 
    name: "14 dias", 
    price: "47,90", 
    currency: "BRL", 
    days: 14, 
    highlight: true,
    description: "O mais escolhido para consolidar hábitos."
  },
  { 
    id: "p30", 
    name: "30 dias Pro", 
    price: "67,00", 
    currency: "BRL", 
    days: 30, 
    highlight: false,
    description: "Transformação completa e acesso vitalício."
  }
];

export const TASKS_DEFAULT: Task[] = [
  { 
    id: "t1", 
    title: "Respiração 3 minutos", 
    points: 10, 
    duration_min: 3, 
    why: "Regula nervos, reduz ansiedade", 
    benefits: ["Foco", "Calma"],
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Sente-se em uma posição confortável com as costas retas.",
      "Feche os olhos e coloque a mão sobre o abdômen.",
      "Inspire profundamente pelo nariz contando até 4.",
      "Segure o ar nos pulmões por 4 segundos.",
      "Expire lentamente pela boca contando até 6."
    ]
  },
  { 
    id: "t2", 
    title: "Alongamento 5 minutos", 
    points: 10, 
    duration_min: 5, 
    why: "Prevenir rigidez, aumentar circulação", 
    benefits: ["Energia", "Postura"],
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Fique em pé e estique os braços para o alto o máximo que puder.",
      "Incline o pescoço suavemente para a direita e depois para a esquerda.",
      "Gire os ombros para trás 10 vezes.",
      "Toque a ponta dos pés (ou até onde conseguir) e segure por 15s.",
      "Respire fundo e solte o corpo."
    ]
  },
  { 
    id: "t3", 
    title: "Planejar 3 prioridades", 
    points: 20, 
    duration_min: 7, 
    why: "Clareza e foco", 
    benefits: ["Produtividade", "Progresso"],
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Pegue um papel ou abra seu app de notas favorito.",
      "Liste tudo o que está na sua cabeça agora.",
      "Circule apenas as 3 tarefas que trarão mais resultado hoje.",
      "Defina um horário específico para começar a primeira tarefa.",
      "Esconda a lista completa e foque apenas nas 3 escolhidas."
    ]
  },
  { 
    id: "t4", 
    title: "Exercício leve 15 minutos", 
    points: 40, 
    duration_min: 15, 
    why: "Fortalecer corpo e humor", 
    benefits: ["Energia", "Melhor sono"],
    image: "https://images.unsplash.com/photo-1538805060504-6335d7aa1b72?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Coloque uma roupa confortável e um tênis.",
      "Faça um aquecimento rápido de 2 minutos (polichinelos ou marcha).",
      "Realize uma caminhada rápida, yoga ou treino funcional.",
      "Mantenha um ritmo constante sem se exaurir.",
      "Beba um copo de água ao terminar."
    ]
  },
  { 
    id: "t5", 
    title: "Jornal de gratidão", 
    points: 10, 
    duration_min: 2, 
    why: "Ajuste emocional positivo", 
    benefits: ["Resiliência", "Satisfação"],
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Respire fundo e pense no seu dia até agora.",
      "Identifique uma coisa simples que te fez sorrir ou facilitou sua vida.",
      "Escreva essa gratidão em uma frase completa.",
      "Sinta a emoção positiva por alguns segundos."
    ]
  },
  { 
    id: "t6", 
    title: "Desconectar 30 minutos", 
    points: 40, 
    duration_min: 30, 
    why: "Restaurar atenção", 
    benefits: ["Criatividade", "Descanso"],
    image: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Coloque o celular no modo avião ou em outro cômodo.",
      "Escolha uma atividade analógica: ler, desenhar, limpar ou apenas sentar.",
      "Se sentir tédio, não recorra às telas; deixe a mente vagar.",
      "Observe os sons e texturas ao seu redor.",
      "Retorne renovado após o tempo acabar."
    ]
  },
  { 
    id: "t7", 
    title: "Revisão noturna", 
    points: 10, 
    duration_min: 3, 
    why: "Consolidar aprendizados", 
    benefits: ["Sono", "Preparação"],
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Desligue as telas principais.",
      "Reflita: O que funcionou bem hoje? O que posso melhorar?",
      "Visualize como quer se sentir amanhã ao acordar.",
      "Prepare o ambiente para dormir (luz baixa, temperatura agradável)."
    ]
  }
];

export const COPY = {
    heroTitle: "Método Sereninho",
    heroSubtitle: "7 dias para transformar sua rotina com micro-hábitos gamificados.",
    ctaPrimary: "Visualizar 1 dia grátis",
    ctaSecondary: "Ver planos",
    lockedTask: "Desbloqueie este dia e acesse técnicas completas, guias e pontos extras — escolha um plano.",
    trialBanner: "Visualizando 1 dia grátis — termine o teste e escolha um plano"
};