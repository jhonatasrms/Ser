
import { Plan, Task, AppNotification } from './types';

export const APP_NAME = "Método Sereninho";
export const APP_SUBTITLE = "O App que transforma a rotina do seu filho em momentos de calma.";

// --- SISTEMA DE NOTIFICAÇÕES ---
export const PROMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "promo_flash",
    title: "Oferta Relâmpago ⚡",
    message: "O plano Rotina Feliz (14 dias) está com 30% de desconto hoje.",
    link: "#pricing-section",
    linkText: "Ver Oferta",
    type: "promo"
  }
];

export const PLANS: Plan[] = [
  { 
    id: "p7", 
    name: "Kit Calmaria (7 dias)", 
    price: "17,90", 
    currency: "BRL", 
    days: 7, 
    highlight: false,
    description: "Para crises pontuais e teste rápido."
  },
  { 
    id: "p14", 
    name: "Rotina Feliz (14 dias)", 
    price: "47,90", 
    currency: "BRL", 
    days: 14, 
    highlight: true,
    description: "O favorito para criar hábito real."
  },
  { 
    id: "p30", 
    name: "Super Família (30 dias)", 
    price: "67,00", 
    currency: "BRL", 
    days: 30, 
    highlight: false,
    description: "Transformação emocional completa."
  }
];

export const TASKS_DEFAULT: Task[] = [
  { 
    id: "t1", 
    title: "O Dragão do Balão", 
    points: 10, 
    duration_min: 5, 
    why: "Ensina respiração profunda de forma visual e divertida, acalmando o sistema nervoso.", 
    benefits: ["Controle da Respiração", "Alívio Imediato"],
    image: "https://images.unsplash.com/photo-1533230635489-0b1928091176?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Entregue um balão vazio para a criança (ou peça para ela imaginar um balão colorido na barriga).",
      "Peça para ela 'encher o balão' puxando o ar bem fundo pelo nariz (a barriga deve crescer!).",
      "Segure o ar por 2 segundos.",
      "Solte o ar bem devagar pela boca, como se estivesse soprando uma vela suavemente.",
      "Repita 5 vezes até o 'dragão' ficar calminho."
    ]
  },
  { 
    id: "t2", 
    title: "Pote da Calma (Shake)", 
    points: 10, 
    duration_min: 3, 
    why: "Focar no movimento do glitter ajuda a criança a se desconectar do caos externo.", 
    benefits: ["Foco Visual", "Regulação Emocional"],
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Use uma garrafa com água e glitter (ou imagine uma bola de neve).",
      "Peça para a criança chacoalhar a garrafa com toda força (representando a raiva/medo).",
      "Coloque a garrafa na mesa e observem juntos o glitter cair devagar.",
      "Diga: 'Vamos esperar o glitter pousar, igual seus pensamentos vão se acalmar'.",
      "Respirem juntos enquanto observam."
    ]
  },
  { 
    id: "t3", 
    title: "Desenho das Emoções", 
    points: 20, 
    duration_min: 10, 
    why: "Externalizar o sentimento dá nome ao 'monstro' e tira o peso dele.", 
    benefits: ["Expressão", "Comunicação"],
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Pegue papel e giz de cera.",
      "Pergunte: 'Se o seu medo fosse um bichinho, que cor ele teria?'.",
      "Peça para a criança desenhar esse sentimento.",
      "Depois, peça para desenhar uma 'jaula' ou um 'super-herói' prendendo esse bichinho.",
      "Comemore que o sentimento foi capturado!"
    ]
  },
  { 
    id: "t4", 
    title: "Caça ao Tesouro Sensorial", 
    points: 40, 
    duration_min: 15, 
    why: "A técnica 5-4-3-2-1 traz a criança para o presente (mindfulness).", 
    benefits: ["Atenção Plena", "Distração Positiva"],
    image: "https://images.unsplash.com/photo-1596464716127-f9a87595ca03?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Desafie a criança a encontrar pela casa:",
      "5 coisas coloridas (visão).",
      "4 coisas macias ou duras (tato).",
      "3 coisas que fazem barulho (audição).",
      "2 coisas que têm cheiro bom (olfato).",
      "1 coisa gostosa de comer (paladar).",
      "Dê os parabéns a cada descoberta!"
    ]
  }
];

export const COPY = {
    heroTitle: "Troque o tempo de tela por calma e conexão.",
    heroSubtitle: "O App que guia seu filho em 7 dias de micro-hábitos e brincadeiras para vencer a ansiedade e as birras.",
    ctaPrimary: "Baixar App / Testar Grátis",
    ctaSecondary: "Conhecer os Planos",
    lockedTask: "Desbloqueie novas brincadeiras terapêuticas no App para fortalecer a confiança do seu pequeno.",
    trialBanner: "Dia 1 Liberado: Use o App agora para acalmar seu filho."
};

// --- NOVOS CONTEÚDOS SOLICITADOS ---

export const BIO = {
    name: "Nathalia Martins",
    role: "Psicóloga Infantil e Mãe da Nay",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400", // Foto placeholder profissional
    story: "Há 9 anos atendo famílias no consultório, mas foi quando minha filha Nay (9 anos) teve sua primeira crise de ansiedade que entendi: os pais precisam de ferramentas práticas para o dia a dia, não apenas teoria. Criei o Método Sereninho para ser o 'botão de emergência' que eu gostaria de ter tido. Um App simples, que troca o vício em telas por momentos de cura entre você e seu filho."
};

export const SCREEN_PROBLEM = {
    title: "O celular está roubando a infância do seu filho?",
    text: "Estudos mostram que crianças com mais de 2h de tela por dia têm 5x mais chances de desenvolver ansiedade e irritabilidade. O App Sereninho usa a tecnologia a seu favor: ele tira a criança do modo passivo e propõe atividades reais, sensoriais e de conexão com você."
};

export const FAQ = [
    { q: "O App serve para qual idade?", a: "O método é ideal para crianças de 3 a 10 anos, com adaptações sugeridas para cada fase." },
    { q: "Preciso pagar mensalidade?", a: "Não! O pagamento é único pelo pacote de dias escolhido. Sem assinaturas surpresas." },
    { q: "Funciona se eu não tiver tempo?", a: "Sim! As atividades duram de 3 a 15 minutos e são desenhadas para caber na rotina corrida." },
    { q: "Como acesso o App?", a: "É um Web App. Você recebe o acesso imediato no seu celular sem precisar baixar nada na loja de aplicativos." }
];
