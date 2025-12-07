
import { Plan, Task, AppNotification, Achievement, Testimonial, DayModule } from './types';

export const APP_NAME = "Método Sereninho";

// --- SISTEMA DE NOTIFICAÇÕES (Push Simulator) ---
export const PUSH_LIBRARY: AppNotification[] = [
    { id: "push_1", title: "🥺 Senti sua falta!", message: "O Sereninho fica triste quando você não vem brincar...", type: 'info', link: '#dashboard', linkText: "Voltar agora" },
    { id: "push_2", title: "🔥 Não perca o fogo!", message: "Sua ofensiva está em risco. Complete uma tarefa hoje!", type: 'promo', link: '#dashboard', linkText: "Manter Ofensiva" },
    { id: "push_3", title: "🎁 Presente especial", message: "Tem um bônus secreto esperando na área de planos.", type: 'success', link: '#pricing-section', linkText: "Ver Bônus" },
    { id: "push_4", title: "⏰ Hora da Calma", message: "3 minutinhos agora podem salvar sua noite de sono.", type: 'info', link: '#dashboard', linkText: "Fazer agora" },
    { id: "push_5", title: "🧘‍♂️ Respire...", message: "O 'Dragão do Balão' está pronto para ajudar.", type: 'info', link: '#dashboard', linkText: "Ir para tarefa" }
];

export const PROMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "promo_flash",
    title: "Oferta Relâmpago ⚡",
    message: "O plano Rotina Feliz (14 dias) está com preço especial hoje.",
    link: "#pricing-section",
    linkText: "Ver Oferta",
    type: "promo"
  }
];

// --- JORNADA DE MÓDULOS (Dashboard) ---
export const JOURNEY_MODULES: DayModule[] = [
    {
        id: "day1",
        day: 1,
        title: "Kit de Primeiros Socorros Emocionais",
        subtitle: "Aprenda as 3 técnicas vitais para acalmar seu filho em minutos.",
        locked: false,
        image: "unlock"
    },
    {
        id: "day2",
        day: 2,
        title: "Fim das Birras em Público",
        subtitle: "A técnica 'Tartaruga' para evitar escândalos no mercado ou shopping.",
        locked: true,
        image: "lock"
    },
    {
        id: "day3",
        day: 3,
        title: "Sono Tranquilo e Sem Brigas",
        subtitle: "A rotina sensorial para ele dormir sozinho no quarto dele.",
        locked: true,
        image: "lock"
    },
    {
        id: "day4",
        day: 4,
        title: "Desintoxicação de Telas",
        subtitle: "Como tirar o tablet sem gerar uma guerra nuclear em casa.",
        locked: true,
        image: "lock"
    },
    {
        id: "day5",
        day: 5,
        title: "Autonomia na Hora de Comer",
        subtitle: "Fazendo seu filho comer sem precisar de distração ou TV.",
        locked: true,
        image: "lock"
    },
    {
        id: "day6",
        day: 6,
        title: "Irmãos: Do Caos à Amizade",
        subtitle: "Atividades cooperativas para zerar as brigas entre irmãos.",
        locked: true,
        image: "lock"
    },
    {
        id: "day7",
        day: 7,
        title: "Blindagem Emocional",
        subtitle: "Como criar uma criança segura que sabe se defender e se expressar.",
        locked: true,
        image: "lock"
    }
];

// --- COPYWRITING ---

export const COPY = {
    heroTitle: "Transforme Birras, Ansiedade e Conflitos em Conexão em Apenas 7 Dias",
    heroSubtitle: "O app que guia você e seu filho com micro-hábitos simples, brincadeiras terapêuticas e rotinas emocionais que funcionam de verdade.",
    heroSub2: "Menos telas. Mais vínculo. Mais paz na sua casa.",
    ctaPrimary: "Visualizar 1 Dia Grátis",
    ctaSecondary: "Ver Planos",
    trialBanner: "Dia 1 Liberado: Use o App agora para acalmar seu filho."
};

export const SCREEN_PROBLEM = {
    title: "O que está acontecendo com o seu filho não é “frescura”",
    subtitle: "São sinais claros de sobrecarga emocional:",
    items: [
        "Crises de choro aparentemente sem motivo",
        "Birras intensas ao tirar o tablet",
        "Dificuldade para dormir ou sono agitado",
        "Irritabilidade, ansiedade e agressividade",
        "Falta de concentração",
        "Dificuldade de brincar sozinho",
        "Apegado demais às telas"
    ],
    conclusion: "A verdade é: o cérebro infantil ainda não sabe organizar tantas emoções sozinho. E o excesso de tela só piora — aumenta ansiedade, reduz tolerância à frustração e dificulta o sono. O Sereninho foi criado para reverter esse ciclo."
};

export const SOLUTION_SECTION = {
    title: "O App que devolve calma e conexão ao seu filho — usando a tecnologia a favor.",
    items: [
        "Regulam o emocional",
        "Reduzem ansiedade e agitação",
        "Diminuem birras rapidamente",
        "Aumentam o vínculo entre vocês",
        "Equilibram o sono sem remédios",
        "Criam segurança emocional",
        "Substituem telas por brincadeiras reais"
    ]
};

export const HOW_IT_WORKS = [
    {
        title: "1. Receba a Missão do Dia",
        desc: "Atividades sensoriais, brincadeiras terapêuticas e micro-hábitos organizados por fases."
    },
    {
        title: "2. Brinque por Alguns Minutos",
        desc: "Passo a passo ilustrado e fácil, mesmo para quem nunca fez nada parecido."
    },
    {
        title: "3. Ganhe Estrelinhas",
        desc: "O sistema de gamificação motiva seu filho de forma leve e saudável."
    }
];

export const BENEFITS_LIST = [
    "Reduz ansiedade infantil em poucos dias",
    "Diminui birras e agressividade",
    "Aumenta concentração e autonomia",
    "Melhora o sono naturalmente",
    "Diminui dependência das telas",
    "Cria vínculo afetivo forte",
    "Ajuda o cérebro infantil a se organizar",
    "Torna a casa mais leve e previsível"
];

export const TESTIMONIALS: Testimonial[] = [
    { id: "t1", text: "Meu filho dormiu a noite inteira depois de 4 dias seguindo as missões. Mudou nossa casa.", author: "Camila", childAge: "mãe do Theo (4)" },
    { id: "t2", text: "As birras diminuíram MUITO. Conexão é pouco, agora ele pede as atividades.", author: "Juliana", childAge: "mãe da Bia (6)" },
    { id: "t3", text: "Eu achei que não teria tempo. Hoje virou nosso momento preferido do dia.", author: "Renata", childAge: "mãe do Gui (5)" }
];

export const BONUS_LIST = [
    { title: "Bônus 1 – Guia do Sono Tranquilo", desc: "Técnicas sensoriais e rotina noturna que regulam o sono infantil." },
    { title: "Bônus 2 – 10 Atividades Anti-Birras", desc: "Ferramentas imediatas para reduzir crises em minutos." },
    { title: "Bônus 3 – Mini Treinamento para Pais", desc: "Como falar, corrigir e orientar sem gritos, sem punições e sem culpa." }
];

export const PLANS: Plan[] = [
  { 
    id: "p7", 
    name: "Kit Calmaria (7 dias)", 
    price: "17,90", 
    currency: "BRL", 
    days: 7, 
    highlight: false,
    description: "Para crises pontuais ou para testar o método.",
    features: [
        "✔ 7 dias de atividades",
        "✔ Áudios guiados",
        "✔ Acesso via Web App",
        "✔ Entrega imediata"
    ],
    ctaText: "Quero Testar por 7 Dias",
    paymentLink: "https://pay.kiwify.com.br/7umfDIV"
  },
  { 
    id: "p14", 
    name: "Rotina Feliz (14 dias)", 
    price: "47,90", 
    currency: "BRL", 
    days: 14, 
    highlight: true,
    description: "O favorito para criar hábito real.",
    features: [
        "✔ 14 dias completos",
        "✔ Acesso vitalício",
        "✔ Guia do Sono Tranquilo",
        "✔ Suporte por WhatsApp",
        "✔ Atividades extras"
    ],
    ctaText: "Quero Criar uma Rotina Feliz"
  },
  { 
    id: "p30", 
    name: "Super Família (30 dias)", 
    price: "67,00", 
    currency: "BRL", 
    days: 30, 
    highlight: false,
    description: "Transformação completa.",
    features: [
        "✔ 30 dias de atividades",
        "✔ Acesso vitalício + atualizações",
        "✔ Todos os bônus",
        "✔ Comunidade exclusiva",
        "✔ Materiais complementares"
    ],
    ctaText: "Quero Transformar Minha Família"
  }
];

export const BIO = {
    name: "Nathalia Martins",
    role: "Psicóloga Infantil – CRP 06/12345 | Mãe da Nay",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    story: "Depois que minha filha Nay teve sua primeira crise de ansiedade, percebi que nenhuma família precisa passar por isso sem apoio. O Sereninho nasceu como o 'botão de emergência' que eu gostaria de ter tido: simples, prático e transformador."
};

export const FAQ = [
    { q: "Serve para qual idade?", a: "O método é ideal para crianças de 3 a 10 anos, com adaptações sugeridas para cada fase." },
    { q: "Quanto tempo leva por dia?", a: "Menos de 10 minutos! As atividades são micro-hábitos desenhados para caber na rotina corrida." },
    { q: "Funciona sem tirar as telas de uma vez?", a: "Sim! O objetivo é substituir gradualmente o tédio pela conexão, reduzindo a dependência naturalmente." },
    { q: "Eu preciso participar das atividades?", a: "Sim, o método foca na conexão pais e filhos. É o seu momento de vínculo que cura." },
    { q: "Serve para crianças com diagnóstico?", a: "O método auxilia na regulação emocional e rotina, beneficiando crianças com TDAH, TEA e Ansiedade, mas não substitui terapia." },
    { q: "Tenho pouco tempo… dá certo para mim?", a: "Com certeza. Foi feito para pais ocupados que precisam de resultados rápidos e práticos." },
    { q: "Como acesso o App?", a: "Acesso imediato via Web App no seu celular, sem ocupar memória." }
];

export const TASKS_DEFAULT: Task[] = [
  { 
    id: "t1", 
    title: "O Dragão do Balão", 
    points: 10, 
    duration_min: 5, 
    why: "Baseado na respiração diafragmática, clinicamente comprovada para reduzir o cortisol e ativar o sistema parassimpático (relaxamento imediato).", 
    benefits: ["Regulação Cardíaca", "Redução de Cortisol", "Alívio de Crises", "Consciência Corporal"],
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
    why: "Ferramenta sensorial baseada em Montessori. O rastreamento visual do glitter induz ondas cerebrais alfa, promovendo foco e calma.", 
    benefits: ["Foco Visual Sustentado", "Desaceleração Mental", "Interrupção da Raiva", "Mindfulness"],
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
    why: "Técnica de externalização da TCC (Terapia Cognitivo-Comportamental). Dar forma ao sentimento permite que a criança se distancie dele.", 
    benefits: ["Vocabulário Emocional", "Processamento de Traumas", "Redução da Angústia", "Expressão"],
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
    why: "Técnica de Aterramento (Grounding) usada para interromper crises de ansiedade, reconectando o cérebro ao presente via sentidos.", 
    benefits: ["Interrupção de Pânico", "Reconexão com o Presente", "Estímulo Cognitivo", "Redução da Hipervigilância"],
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
    title: "O Abraço da Borboleta", 
    points: 20, 
    duration_min: 5, 
    why: "Adaptação da Estimulação Bilateral do EMDR. O toque alternado ajuda a processar emoções difíceis e a auto-regular o sistema límbico.", 
    benefits: ["Auto-acolhimento", "Processamento Emocional", "Segurança Interna", "Redução de Estresse"],
    image: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Peça para a criança cruzar os braços sobre o peito.",
      "As mãos devem tocar os ombros (como asas de borboleta).",
      "Dê batidinhas alternadas: esquerda, direita, esquerda, direita.",
      "Faça isso devagar enquanto respira fundo.",
      "Diga frases positivas: 'Eu estou seguro', 'Eu sou amado'."
    ]
  },
  { 
    id: "t6", 
    title: "A Tartaruga Escondida", 
    points: 10, 
    duration_min: 5, 
    why: "Relaxamento Muscular Progressivo de Jacobson. Ensina a identificar a tensão física da raiva e soltá-la voluntariamente.", 
    benefits: ["Relaxamento Muscular", "Controle de Impulsos", "Consciência Corporal", "Gestão da Raiva"],
    image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Diga que perigo está vindo! Peça para a criança encolher os ombros até as orelhas e fechar os olhos bem forte (esconder no casco).",
      "Segure bem forte por 5 segundos (tensão).",
      "Diga: 'O perigo passou!'. Peça para soltar tudo de uma vez e relaxar o pescoço.",
      "Sinta como o corpo fica 'mole' e gostoso depois de sair do casco."
    ]
  },
  { 
    id: "t7", 
    title: "A Peninha Mágica", 
    points: 15, 
    duration_min: 5, 
    why: "Exercício de Controle Inibitório e Atenção Sustentada. Desenvolve o córtex pré-frontal, responsável pelo autocontrole.", 
    benefits: ["Treino de Foco", "Coordenação Motora Fina", "Paciência", "Controle da Respiração"],
    image: "https://images.unsplash.com/photo-1595358087796-0df78d47936a?auto=format&fit=crop&q=80&w=600",
    steps: [
      "Imagine que existe uma pena flutuando no ar.",
      "A missão é não deixar ela cair no chão, mas só pode usar sopros bem leves.",
      "Sopre devagar para cima... e acompanhe com a cabeça.",
      "Faça movimentos lentos com o corpo como se fosse uma pena caindo."
    ]
  }
];

export const ACHIEVEMENTS: Achievement[] = [
    { id: "first_steps", name: "Primeiros Passos", condition: 20, icon: "star" },
    { id: "calm_master", name: "Mestre da Calma", condition: 100, icon: "zap" },
    { id: "zen_kid", name: "Criança Zen", condition: 300, icon: "trophy" }
];
