
import { Plan, Task, AppNotification, Achievement, Testimonial, DayModule, Product } from './types';

export const APP_NAME = "Método Sereninho";

// --- SYSTEM PRODUCTS (The Items that can be granted) ---
export const PRODUCTS: Product[] = [
    {
        id: 'main_method',
        title: 'Método Sereninho (Jornada 7 Dias)',
        description: 'Acesso completo aos módulos diários e trilha principal.',
        total_tasks: 7, // Maps to 7 Days roughly
        partial_default: 1, // Day 1 only
        active: true,
        price: 47.90,
        image: "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 'kit_calmaria',
        title: 'Kit Calmaria Express',
        description: 'Técnicas de emergência para crises pontuais.',
        total_tasks: 10,
        partial_default: 2,
        active: true,
        price: 17.90
    },
    {
        id: 'sos_birras',
        title: 'SOS Birras (Áudios)',
        description: 'Guia de áudio para pais.',
        total_tasks: 20,
        partial_default: 1,
        active: true,
        price: 29.90
    },
    {
        id: 'guia_sono',
        title: 'Guia Sono Profundo',
        description: 'Rotinas noturnas e e-book.',
        total_tasks: 1,
        partial_default: 0,
        active: true,
        price: 37.00
    }
];

// --- PLANS (Front-facing offers) ---
export const PLANS: Plan[] = [
  { 
    id: "offer_method", 
    product_id: "main_method",
    name: "Método Sereninho Completo", 
    price: "47,90", 
    currency: "BRL", 
    days: 365, 
    highlight: true,
    description: "Acesso vitalício ao método de 7 dias + bônus.",
    features: ["✔ Acesso Vitalício", "✔ Todas as missões", "✔ Guia do Sono", "✔ Suporte WhatsApp"],
    ctaText: "Quero a Rotina Completa",
    category: "Método",
    image: "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: "offer_kit", 
    product_id: "kit_calmaria",
    name: "Kit Calmaria Express", 
    price: "17,90", 
    currency: "BRL", 
    days: 365, 
    highlight: false,
    description: "Para crises pontuais. Alívio imediato.",
    features: ["✔ Acesso Imediato", "✔ Técnicas de emergência", "✔ Áudios guiados"],
    ctaText: "Testar Kit Calmaria",
    paymentLink: "https://pay.kiwify.com.br/7umfDIV",
    category: "Iniciante",
    image: "https://images.unsplash.com/photo-1484820540004-14229fe36ca4?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: "offer_sos", 
    product_id: "sos_birras",
    name: "SOS Birras (Áudios)", 
    price: "29,90", 
    currency: "BRL", 
    days: 365, 
    highlight: false,
    description: "O que fazer (e não fazer) na hora da crise.",
    features: ["✔ Áudios para pais", "✔ Scripts do que falar", "✔ Como agir em público"],
    ctaText: "Quero parar as Birras",
    category: "Áudio",
    image: "https://images.unsplash.com/photo-1623696883279-787d544422e9?auto=format&fit=crop&q=80&w=400"
  }
];

// --- NOTIFICATIONS ---
export const PUSH_LIBRARY: AppNotification[] = [
    { id: "push_1", user_id: 'system', title: "🥺 Senti sua falta!", message: "O Sereninho fica triste quando você não vem brincar...", type: 'info', link: '#dashboard', status: 'pending', channel: 'in_app', timestamp: Date.now() },
    { id: "push_2", user_id: 'system', title: "🔥 Não perca o fogo!", message: "Sua ofensiva está em risco. Complete uma tarefa hoje!", type: 'promo', link: '#dashboard', status: 'pending', channel: 'in_app', timestamp: Date.now() },
];

export const PROMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "promo_flash_wa",
    user_id: 'system',
    title: "⚡ OFERTA RELÂMPAGO",
    message: "Fale com o suporte agora e garanta uma condição especial no PIX!",
    link: "https://wa.me/5567993535250",
    linkText: "Chamar no WhatsApp",
    type: "promo",
    status: 'sent',
    channel: 'in_app',
    timestamp: Date.now(),
    isGlobal: true
  }
];

// --- JOURNEY ---
export const JOURNEY_MODULES: DayModule[] = [
    { id: "day1", day: 1, title: "Kit de Primeiros Socorros", subtitle: "Técnicas vitais para acalmar em minutos.", locked: false, image: "unlock" },
    { id: "day2", day: 2, title: "Fim das Birras em Público", subtitle: "Técnica 'Tartaruga' para evitar escândalos.", locked: true, image: "lock" },
    { id: "day3", day: 3, title: "Sono Tranquilo", subtitle: "Rotina sensorial para dormir sozinho.", locked: true, image: "lock" },
    { id: "day4", day: 4, title: "Desintoxicação de Telas", subtitle: "Como tirar o tablet sem guerra.", locked: true, image: "lock" },
    { id: "day5", day: 5, title: "Autonomia na Alimentação", subtitle: "Comer sem distrações.", locked: true, image: "lock" },
    { id: "day6", day: 6, title: "Irmãos: Do Caos à Amizade", subtitle: "Atividades cooperativas.", locked: true, image: "lock" },
    { id: "day7", day: 7, title: "Blindagem Emocional", subtitle: "Criando uma criança segura.", locked: true, image: "lock" }
];

export const COPY = {
    heroTitle: "Transforme Birras em Conexão em 7 Dias",
    heroSubtitle: "Micro-hábitos gamificados para pais e filhos.",
    heroSub2: "Menos telas. Mais vínculo.",
    ctaPrimary: "Começar Grátis",
    ctaSecondary: "Ver Conteúdos",
    trialBanner: "Dia 1 Liberado: Use o App agora."
};

// --- DATA LISTS ---
export const SCREEN_PROBLEM = {
    title: "O que está acontecendo não é “frescura”",
    subtitle: "Sinais de sobrecarga emocional:",
    items: ["Crises de choro", "Birras intensas", "Dificuldade para dormir", "Agressividade", "Apegado às telas"],
    conclusion: "O Sereninho foi criado para reverter esse ciclo."
};

export const HOW_IT_WORKS = [
    { title: "1. Receba a Missão", desc: "Atividades sensoriais e micro-hábitos." },
    { title: "2. Brinque", desc: "Passo a passo ilustrado e fácil." },
    { title: "3. Ganhe Estrelinhas", desc: "Gamificação motiva a criança." }
];

export const BENEFITS_LIST = ["Reduz ansiedade", "Diminui birras", "Melhora o sono", "Cria vínculo", "Reduz telas"];

export const TESTIMONIALS: Testimonial[] = [
    { id: "t1", text: "Meu filho dormiu a noite inteira após 4 dias.", author: "Camila", childAge: "mãe do Theo (4)" },
    { id: "t2", text: "As birras diminuíram MUITO.", author: "Juliana", childAge: "mãe da Bia (6)" },
    { id: "t3", text: "Virou nosso momento preferido.", author: "Renata", childAge: "mãe do Gui (5)" }
];

export const BONUS_LIST = [
    { title: "Guia do Sono", desc: "Rotina noturna." },
    { title: "Atividades Anti-Birras", desc: "Ferramentas imediatas." },
    { title: "Treinamento para Pais", desc: "Como falar sem gritos." }
];

export const BIO = {
    name: "Nathalia Martins",
    role: "Psicóloga Infantil",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    story: "O Sereninho nasceu como o 'botão de emergência' que eu gostaria de ter tido."
};

export const FAQ = [
    { q: "Serve para qual idade?", a: "3 a 10 anos." },
    { q: "Quanto tempo?", a: "10 minutos por dia." },
    { q: "Funciona sem tirar telas?", a: "Sim, substitui gradualmente." },
];

export const TASKS_DEFAULT: Task[] = [
  { id: "t1", title: "O Dragão do Balão", points: 10, duration_min: 5, why: "Respiração diafragmática reduz cortisol.", benefits: ["Calma Imediata", "Foco"], image: "https://images.unsplash.com/photo-1533230635489-0b1928091176?auto=format&fit=crop&q=80&w=600", steps: ["Imagine um balão na barriga.", "Encha puxando o ar pelo nariz.", "Solte devagar pela boca."] },
  { id: "t2", title: "Pote da Calma", points: 10, duration_min: 3, why: "Rastreamento visual induz ondas alfa.", benefits: ["Mindfulness", "Interrupção da Raiva"], image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600", steps: ["Chacoalhe o pote com glitter.", "Observe cair devagar.", "Respire fundo."] },
  { id: "t3", title: "Desenho das Emoções", points: 20, duration_min: 10, why: "Externalização da TCC.", benefits: ["Vocabulário Emocional", "Expressão"], image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600", steps: ["Desenhe o medo como um bicho.", "Desenhe uma jaula para ele."] },
  { id: "t4", title: "Caça ao Tesouro", points: 40, duration_min: 15, why: "Grounding (Aterramento).", benefits: ["Sai do Pânico", "Foco no Presente"], image: "https://images.unsplash.com/photo-1596464716127-f9a87595ca03?auto=format&fit=crop&q=80&w=600", steps: ["Ache 5 cores.", "Ache 4 texturas.", "Ache 3 sons."] },
  { id: "t5", title: "Abraço da Borboleta", points: 20, duration_min: 5, why: "Estimulação Bilateral (EMDR).", benefits: ["Segurança", "Auto-regulação"], image: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&q=80&w=600", steps: ["Cruze os braços.", "Bata nos ombros alternadamente.", "Diga: Estou seguro."] },
  { id: "t6", title: "Tartaruga", points: 10, duration_min: 5, why: "Relaxamento Muscular Progressivo.", benefits: ["Soltar Tensão", "Consciência Corporal"], image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&q=80&w=600", steps: ["Encolha os ombros (esconda).", "Segure a tensão.", "Solte e relaxe."] },
  { id: "t7", title: "Peninha Mágica", points: 15, duration_min: 5, why: "Controle Inibitório.", benefits: ["Paciência", "Foco"], image: "https://images.unsplash.com/photo-1595358087796-0df78d47936a?auto=format&fit=crop&q=80&w=600", steps: ["Imagine uma pena.", "Sopre suavemente para não cair.", "Movimente-se devagar."] }
];

export const ACHIEVEMENTS: Achievement[] = [
    { id: "first_steps", name: "Primeiros Passos", condition: 20, icon: "star" },
    { id: "calm_master", name: "Mestre da Calma", condition: 100, icon: "zap" },
    { id: "zen_kid", name: "Criança Zen", condition: 300, icon: "trophy" }
];
