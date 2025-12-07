
import { Plan, Task, AppNotification } from './types';

export const APP_NAME = "Método Sereninho";
export const APP_SUBTITLE = "Transforme a ansiedade do seu filho em momentos de calma e conexão.";

// --- SISTEMA DE NOTIFICAÇÕES ---
export const PROMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "promo_flash",
    title: "Escola sem choro? 🎒",
    message: "Desbloqueie o módulo 'Volta às aulas tranquila' no plano de 14 dias.",
    link: "#pricing",
    linkText: "Ver Oferta",
    type: "promo"
  },
  {
    id: "dica_dia",
    title: "Dica de Mãe",
    message: "O abraço de urso libera oxitocina e acalma o choro em segundos.",
    type: "info"
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
    description: "Para crises pontuais e teste."
  },
  { 
    id: "p14", 
    name: "Rotina Feliz (14 dias)", 
    price: "47,90", 
    currency: "BRL", 
    days: 14, 
    highlight: true,
    description: "O favorito das mães para criar hábito."
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
  },
  { 
    id: "t5", 
    title: "Abraço de Urso", 
    points: 10, 
    duration_min: 2, 
    why: "A pressão profunda libera oxitocina, o hormônio do amor e segurança.", 
    benefits: ["Segurança", "Vínculo"],
    image: "https://images.unsplash.com/photo-1544098485-2a2a4b9d0b8d?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Ajoelhe-se na altura da criança.",
      "Abra os braços bem grandes e diga 'Lá vem o urso!'.",
      "Dê um abraço bem apertado e conte até 10 segundos.",
      "Peça para ela apertar de volta com força.",
      "Solte devagar e sorria."
    ]
  },
  { 
    id: "t6", 
    title: "Tenda da Coragem", 
    points: 40, 
    duration_min: 20, 
    why: "Criar um refúgio seguro ajuda a criança a ter para onde ir quando sentir medo.", 
    benefits: ["Autonomia", "Segurança"],
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Usem lençóis, cadeiras e almofadas para montar uma cabaninha na sala.",
      "Levem lanternas e os brinquedos favoritos.",
      "Entrem na tenda e contem uma história onde a criança é a heroína.",
      "Deixe a tenda montada por um tempo como 'zona segura'."
    ]
  },
  { 
    id: "t7", 
    title: "Massagem da Formiguinha", 
    points: 10, 
    duration_min: 5, 
    why: "Relaxamento muscular progressivo antes de dormir.", 
    benefits: ["Sono Tranquilo", "Relaxamento"],
    image: "https://images.unsplash.com/photo-1512552278912-87009fc22649?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Com a criança deitada, use os dedos para simular formiguinhas caminhando.",
      "Comece pelos pés, subindo pelas pernas, costas e braços.",
      "Diga: 'As formiguinhas estão levando todo o cansaço embora'.",
      "Termine com um carinho na cabeça."
    ]
  }
];

export const COPY = {
    heroTitle: "Seu filho mais calmo, confiante e feliz em 7 dias.",
    heroSubtitle: "O fim das crises de ansiedade e birras através de brincadeiras guiadas e conexão emocional.",
    ctaPrimary: "Testar com meu filho hoje",
    ctaSecondary: "Conhecer o método",
    lockedTask: "Desbloqueie novas brincadeiras terapêuticas para fortalecer a confiança do seu pequeno.",
    trialBanner: "Dia 1 Liberado: Comece a transformar o ambiente da sua casa agora."
};