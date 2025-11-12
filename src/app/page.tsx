"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Trophy, Flame, Star, ChevronRight, CheckCircle2, ArrowRight, Heart, Target, Clock, AlertCircle, Sparkles, Info, Lock, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

type Pose = {
  id: number;
  name: string;
  duration: number;
  description: string;
  benefits: string;
  difficulty: "iniciante" | "intermediário" | "avançado";
  precautions?: string;
  stepByStep: string[];
  tips: string[];
  isPremium?: boolean;
};

type Session = {
  id: number;
  name: string;
  duration: number;
  poses: Pose[];
  level: "iniciante" | "intermediário" | "avançado";
  calories: number;
  focus: string[];
  isPremium?: boolean;
};

type UserProfile = {
  name: string;
  level: "iniciante" | "intermediário" | "avançado";
  goals: string[];
  limitations: string[];
  timeAvailable: string;
  completed: boolean;
  isPremium: boolean;
};

const freeExercises: Pose[] = [
  {
    id: 101,
    name: "Respiração Quadrada",
    duration: 120,
    description: "Técnica de respiração 4-4-4-4 para acalmar a mente",
    benefits: "Reduz ansiedade, melhora foco, equilibra sistema nervoso",
    difficulty: "iniciante",
    stepByStep: [
      "Sente-se confortavelmente com a coluna ereta",
      "Inspire pelo nariz contando até 4",
      "Segure a respiração contando até 4",
      "Expire pela boca contando até 4",
      "Segure os pulmões vazios contando até 4",
      "Repita o ciclo por 2 minutos"
    ],
    tips: [
      "Mantenha a contagem constante",
      "Não force - ajuste o tempo se necessário",
      "Pratique em qualquer momento do dia"
    ]
  },
  {
    id: 102,
    name: "Gato-Vaca (Marjaryasana-Bitilasana)",
    duration: 60,
    description: "Movimento fluido que aquece e mobiliza a coluna",
    benefits: "Flexibilidade da coluna, alivia tensão nas costas, massageia órgãos",
    difficulty: "iniciante",
    stepByStep: [
      "Fique de quatro apoios (mãos e joelhos)",
      "Mãos sob os ombros, joelhos sob os quadris",
      "Inspire: arqueie as costas, olhe para cima (Vaca)",
      "Expire: arredonde as costas, queixo no peito (Gato)",
      "Flua entre as duas posições com a respiração",
      "Continue por 1 minuto"
    ],
    tips: [
      "Sincronize movimento com respiração",
      "Mova-se lentamente e com controle",
      "Ótimo aquecimento para qualquer prática"
    ]
  },
  {
    id: 103,
    name: "Alongamento de Pescoço",
    duration: 90,
    description: "Série de alongamentos suaves para liberar tensão cervical",
    benefits: "Alivia tensão no pescoço, reduz dores de cabeça, melhora postura",
    difficulty: "iniciante",
    stepByStep: [
      "Sente-se ou fique em pé com postura ereta",
      "Incline a cabeça para o lado direito (orelha em direção ao ombro)",
      "Mantenha por 15 segundos",
      "Volte ao centro e repita do lado esquerdo",
      "Olhe para baixo, queixo no peito, mantenha 15 segundos",
      "Olhe para cima suavemente, mantenha 15 segundos",
      "Faça rotações lentas e controladas"
    ],
    tips: [
      "Nunca force o movimento",
      "Mantenha os ombros relaxados",
      "Respire profundamente durante os alongamentos",
      "Ideal para pausas no trabalho"
    ]
  },
  {
    id: 104,
    name: "Torção Deitada (Supta Matsyendrasana)",
    duration: 90,
    description: "Torção suave e relaxante para a coluna",
    benefits: "Alivia tensão nas costas, massageia órgãos, melhora digestão",
    difficulty: "iniciante",
    stepByStep: [
      "Deite-se de costas",
      "Dobre o joelho direito e traga em direção ao peito",
      "Deixe o joelho cair para o lado esquerdo",
      "Estenda o braço direito para o lado",
      "Olhe para a direita",
      "Mantenha por 45 segundos",
      "Repita do outro lado"
    ],
    tips: [
      "Mantenha os ombros no chão",
      "Não force a torção",
      "Respire profundamente",
      "Ótima postura antes de dormir"
    ]
  },
  {
    id: 105,
    name: "Borboleta (Baddha Konasana)",
    duration: 90,
    description: "Abertura suave de quadril sentado",
    benefits: "Abre quadris, alonga virilha, melhora flexibilidade",
    difficulty: "iniciante",
    stepByStep: [
      "Sente-se com a coluna ereta",
      "Junte as plantas dos pés",
      "Segure os pés com as mãos",
      "Deixe os joelhos caírem para os lados",
      "Mantenha a coluna alongada",
      "Opcionalmente, dobre para frente",
      "Respire profundamente por 90 segundos"
    ],
    tips: [
      "Não force os joelhos para baixo",
      "Use almofadas sob os joelhos se necessário",
      "Mantenha a coluna ereta",
      "Relaxe os ombros"
    ]
  },
  {
    id: 106,
    name: "Prancha Lateral (Vasisthasana)",
    duration: 40,
    description: "Fortalecimento lateral do core e equilíbrio",
    benefits: "Fortalece core, braços, melhora equilíbrio e estabilidade",
    difficulty: "intermediário",
    stepByStep: [
      "Comece em prancha normal",
      "Gire para o lado direito",
      "Empilhe os pés (ou coloque um na frente do outro)",
      "Levante o braço esquerdo para cima",
      "Corpo forma uma linha diagonal",
      "Mantenha por 20 segundos",
      "Repita do outro lado"
    ],
    tips: [
      "Mantenha o core ativado",
      "Não deixe os quadris caírem",
      "Olhe para a mão de cima",
      "Modifique apoiando o joelho se necessário"
    ]
  },
  {
    id: 107,
    name: "Cadeira (Utkatasana)",
    duration: 45,
    description: "Postura de força que trabalha pernas e core",
    benefits: "Fortalece pernas, glúteos, core e melhora postura",
    difficulty: "intermediário",
    stepByStep: [
      "Fique em pé com os pés juntos",
      "Inspire e levante os braços acima da cabeça",
      "Expire e dobre os joelhos como se fosse sentar",
      "Mantenha o peso nos calcanhares",
      "Joelhos não ultrapassam os dedos dos pés",
      "Peito elevado, olhar para frente",
      "Mantenha por 45 segundos"
    ],
    tips: [
      "Imagine sentar em uma cadeira invisível",
      "Mantenha o core ativado",
      "Respire profundamente",
      "Sinta o trabalho nas coxas"
    ]
  },
  {
    id: 108,
    name: "Meio Pombo (Eka Pada Rajakapotasana - versão simples)",
    duration: 90,
    description: "Abertura profunda de quadril",
    benefits: "Abre quadris, alonga glúteos, libera tensão emocional",
    difficulty: "intermediário",
    stepByStep: [
      "Comece de quatro apoios",
      "Traga o joelho direito para frente entre as mãos",
      "Estenda a perna esquerda para trás",
      "Quadris nivelados voltados para frente",
      "Mantenha o tronco ereto ou dobre para frente",
      "Respire profundamente por 45 segundos",
      "Repita do outro lado"
    ],
    tips: [
      "Use almofada sob o quadril se necessário",
      "Não force a abertura",
      "Mantenha os quadris nivelados",
      "Respire na sensação de alongamento"
    ]
  }
];

const sessions: Session[] = [
  {
    id: 1,
    name: "Despertar Matinal",
    duration: 10,
    level: "iniciante",
    calories: 45,
    focus: ["flexibilidade", "energia"],
    poses: [
      {
        id: 1,
        name: "Postura da Montanha (Tadasana)",
        duration: 30,
        description: "Postura fundamental de alinhamento e consciência corporal",
        benefits: "Melhora postura e equilíbrio, fortalece pernas, aumenta consciência corporal",
        difficulty: "iniciante",
        stepByStep: [
          "Fique em pé com os pés juntos ou ligeiramente afastados",
          "Distribua o peso igualmente entre os dois pés",
          "Contraia levemente as coxas e eleve as rótulas",
          "Alongue a coluna para cima, mantendo os ombros relaxados",
          "Deixe os braços ao lado do corpo com as palmas viradas para frente",
          "Olhe para frente, queixo paralelo ao chão",
          "Respire profundamente e mantenha a postura"
        ],
        tips: [
          "Imagine uma linha reta da cabeça aos pés",
          "Mantenha o peso distribuído nos quatro cantos dos pés",
          "Relaxe os ombros longe das orelhas",
          "Esta é a base para todas as posturas em pé"
        ]
      },
      {
        id: 2,
        name: "Saudação ao Sol (Surya Namaskar)",
        duration: 60,
        description: "Sequência fluida que aquece todo o corpo",
        benefits: "Aquece o corpo, energiza, melhora circulação e flexibilidade",
        difficulty: "iniciante",
        stepByStep: [
          "Comece em pé na Postura da Montanha",
          "Inspire e eleve os braços acima da cabeça",
          "Expire e dobre para frente, mãos no chão",
          "Inspire e olhe para frente, alongando a coluna",
          "Expire e volte à posição de prancha",
          "Desça o corpo ao chão (ou joelhos primeiro)",
          "Inspire e eleve o peito (Cobra ou Cachorro olhando para cima)",
          "Expire e empurre para Cachorro olhando para baixo",
          "Mantenha por 5 respirações",
          "Inspire e pule ou caminhe os pés para frente",
          "Expire e dobre para frente",
          "Inspire e suba com os braços elevados",
          "Expire e volte à Postura da Montanha"
        ],
        tips: [
          "Sincronize cada movimento com a respiração",
          "Vá no seu ritmo, não force",
          "Modifique dobrando os joelhos se necessário",
          "Faça 3-5 repetições para aquecer completamente"
        ]
      },
      {
        id: 3,
        name: "Cachorro Olhando para Baixo (Adho Mukha Svanasana)",
        duration: 45,
        description: "Postura de inversão suave que alonga todo o corpo",
        benefits: "Alonga coluna, fortalece braços e pernas, energiza o corpo",
        difficulty: "iniciante",
        precautions: "Evite se tiver pressão alta não controlada ou lesão nos ombros",
        stepByStep: [
          "Comece de quatro apoios (mãos e joelhos no chão)",
          "Posicione as mãos na largura dos ombros",
          "Coloque os joelhos na largura dos quadris",
          "Enrole os dedos dos pés e levante os quadris para cima",
          "Forme um 'V' invertido com o corpo",
          "Empurre as mãos firmemente no chão",
          "Alongue a coluna e leve o peito em direção às coxas",
          "Tente aproximar os calcanhares do chão (não precisa tocar)",
          "Relaxe a cabeça entre os braços",
          "Respire profundamente por 5-8 respirações"
        ],
        tips: [
          "Mantenha os dedos bem abertos para melhor apoio",
          "Dobre levemente os joelhos se sentir tensão nas costas",
          "Foque em alongar a coluna, não em tocar os calcanhares no chão",
          "Distribua o peso igualmente entre mãos e pés"
        ]
      },
      {
        id: 4,
        name: "Postura da Criança (Balasana)",
        duration: 45,
        description: "Postura de descanso e relaxamento profundo",
        benefits: "Relaxamento profundo, alívio de tensão nas costas, acalma a mente",
        difficulty: "iniciante",
        stepByStep: [
          "Ajoelhe-se no chão com os joelhos afastados",
          "Junte os dedões dos pés atrás de você",
          "Sente-se sobre os calcanhares",
          "Expire e dobre o tronco para frente",
          "Estenda os braços à frente ou ao lado do corpo",
          "Apoie a testa no chão ou em um bloco",
          "Relaxe completamente os ombros",
          "Respire profundamente e permaneça por 1-3 minutos"
        ],
        tips: [
          "Use um travesseiro sob a testa se não alcançar o chão",
          "Coloque uma manta sobre os calcanhares se sentir desconforto",
          "Esta é sua postura de descanso - volte a ela sempre que precisar",
          "Foque em respirar profundamente e relaxar"
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Força e Equilíbrio",
    duration: 15,
    level: "intermediário",
    calories: 80,
    focus: ["força", "equilíbrio"],
    poses: [
      {
        id: 5,
        name: "Guerreiro I (Virabhadrasana I)",
        duration: 40,
        description: "Postura poderosa que desenvolve força e estabilidade",
        benefits: "Fortalece pernas, core, ombros e melhora foco mental",
        difficulty: "intermediário",
        stepByStep: [
          "Comece em pé, dê um grande passo para trás com o pé esquerdo",
          "Gire o pé de trás 45 graus para fora",
          "Mantenha o pé da frente apontando para frente",
          "Dobre o joelho da frente até 90 graus (joelho sobre o tornozelo)",
          "Mantenha a perna de trás estendida e forte",
          "Eleve os braços acima da cabeça, palmas se tocando",
          "Quadris voltados para frente",
          "Olhe para cima em direção às mãos",
          "Mantenha por 5-8 respirações",
          "Repita do outro lado"
        ],
        tips: [
          "Pressione firmemente o calcanhar de trás no chão",
          "Mantenha o joelho da frente alinhado com o tornozelo",
          "Alongue a coluna para cima, não se incline para frente",
          "Respire profundamente para manter a postura"
        ]
      },
      {
        id: 6,
        name: "Guerreiro II (Virabhadrasana II)",
        duration: 40,
        description: "Postura de força lateral com abertura de quadril",
        benefits: "Aumenta resistência, força nas pernas e concentração",
        difficulty: "intermediário",
        stepByStep: [
          "Abra as pernas em uma distância ampla (cerca de 1 metro)",
          "Gire o pé direito 90 graus para fora",
          "Gire o pé esquerdo levemente para dentro",
          "Alinhe o calcanhar direito com o arco do pé esquerdo",
          "Dobre o joelho direito até 90 graus",
          "Estenda os braços na altura dos ombros, paralelos ao chão",
          "Olhe sobre a mão da frente",
          "Mantenha os ombros sobre os quadris",
          "Pressione o pé de trás firmemente no chão",
          "Mantenha por 5-8 respirações e repita do outro lado"
        ],
        tips: [
          "Mantenha o tronco vertical, não se incline para frente",
          "Joelho da frente alinhado com o segundo dedo do pé",
          "Ombros relaxados, longe das orelhas",
          "Sinta a força e estabilidade nas pernas"
        ]
      },
      {
        id: 7,
        name: "Árvore (Vrksasana)",
        duration: 35,
        description: "Postura de equilíbrio que desenvolve concentração",
        benefits: "Melhora equilíbrio, concentração, fortalece pernas e tornozelos",
        difficulty: "intermediário",
        precautions: "Use apoio se tiver problemas de equilíbrio",
        stepByStep: [
          "Comece na Postura da Montanha",
          "Transfira o peso para o pé esquerdo",
          "Dobre o joelho direito e coloque a planta do pé na coxa esquerda",
          "Evite colocar o pé diretamente no joelho",
          "Pressione o pé e a coxa um contra o outro",
          "Encontre um ponto fixo para olhar (drishti)",
          "Quando estável, junte as mãos em frente ao peito",
          "Ou eleve os braços acima da cabeça",
          "Mantenha por 5-10 respirações",
          "Repita do outro lado"
        ],
        tips: [
          "Se não conseguir na coxa, coloque o pé na panturrilha ou tornozelo",
          "Nunca coloque o pé diretamente no joelho",
          "Mantenha o olhar fixo em um ponto para ajudar no equilíbrio",
          "É normal balançar - faz parte do processo",
          "Use uma parede para apoio se necessário"
        ]
      },
      {
        id: 8,
        name: "Prancha (Phalakasana)",
        duration: 45,
        description: "Postura fundamental de força do core",
        benefits: "Fortalece core, braços, ombros e melhora postura",
        difficulty: "intermediário",
        stepByStep: [
          "Comece de quatro apoios",
          "Posicione as mãos diretamente sob os ombros",
          "Estenda as pernas para trás, uma de cada vez",
          "Apoie-se nos dedos dos pés",
          "Corpo forma uma linha reta da cabeça aos calcanhares",
          "Ative o core, puxando o umbigo para dentro",
          "Mantenha o pescoço neutro, olhando para baixo",
          "Não deixe os quadris caírem ou subirem demais",
          "Respire normalmente",
          "Mantenha por 20-60 segundos"
        ],
        tips: [
          "Imagine empurrar o chão para longe de você",
          "Mantenha os ombros longe das orelhas",
          "Se muito difícil, apoie os joelhos no chão",
          "Foque em manter a linha reta do corpo",
          "Aumente gradualmente o tempo de permanência"
        ]
      },
      {
        id: 9,
        name: "Ponte (Setu Bandhasana)",
        duration: 40,
        description: "Flexão suave das costas que fortalece e abre",
        benefits: "Fortalece glúteos, coluna, abre o peito e melhora postura",
        difficulty: "intermediário",
        stepByStep: [
          "Deite-se de costas com os joelhos dobrados",
          "Pés no chão, na largura dos quadris",
          "Calcanhares próximos aos glúteos",
          "Braços ao lado do corpo, palmas para baixo",
          "Pressione os pés e braços no chão",
          "Inspire e levante os quadris para cima",
          "Mantenha as coxas paralelas",
          "Entrelaçe as mãos sob as costas (opcional)",
          "Empurre o peito em direção ao queixo",
          "Mantenha por 5-10 respirações",
          "Expire e desça vértebra por vértebra"
        ],
        tips: [
          "Mantenha os joelhos alinhados, não deixe abrirem",
          "Pressione firmemente os pés no chão",
          "Não vire a cabeça enquanto estiver na postura",
          "Foque em abrir o peito e fortalecer as pernas",
          "Respire profundamente no peito"
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Flexibilidade Avançada",
    duration: 20,
    level: "avançado",
    calories: 120,
    focus: ["flexibilidade", "força"],
    isPremium: true,
    poses: [
      {
        id: 10,
        name: "Corvo (Bakasana)",
        duration: 30,
        description: "Equilíbrio sobre os braços que requer força e concentração",
        benefits: "Força nos braços, pulsos, core e melhora equilíbrio e concentração",
        difficulty: "avançado",
        precautions: "Use almofada para proteger a cabeça inicialmente, evite se tiver lesões nos pulsos",
        isPremium: true,
        stepByStep: [
          "Comece agachado com os pés juntos",
          "Coloque as mãos no chão na largura dos ombros",
          "Dobre levemente os cotovelos",
          "Coloque os joelhos na parte externa dos braços (perto das axilas)",
          "Incline-se para frente, transferindo o peso para as mãos",
          "Olhe para frente, não para baixo",
          "Levante um pé do chão, depois o outro",
          "Junte os pés e aponte os dedos",
          "Mantenha o core ativado",
          "Respire e mantenha por 5-15 segundos"
        ],
        tips: [
          "Coloque uma almofada à frente para segurança",
          "Pratique levantar um pé de cada vez primeiro",
          "Olhar para frente ajuda no equilíbrio",
          "Mantenha os cotovelos sobre os pulsos",
          "Seja paciente - esta postura leva tempo para dominar"
        ]
      },
      {
        id: 11,
        name: "Parada de Cabeça (Sirsasana)",
        duration: 45,
        description: "Inversão completa, a rainha das posturas",
        benefits: "Melhora circulação, foco mental, fortalece core e ombros",
        difficulty: "avançado",
        precautions: "NÃO faça se tiver problemas cervicais, pressão alta, glaucoma ou durante menstruação",
        isPremium: true,
        stepByStep: [
          "Ajoelhe-se e entrelaçe os dedos firmemente",
          "Coloque os antebraços no chão, cotovelos na largura dos ombros",
          "Coloque o topo da cabeça no chão, mãos entrelaçadas atrás",
          "Levante os quadris, estendendo as pernas",
          "Caminhe os pés em direção à cabeça",
          "Quando os quadris estiverem sobre os ombros, dobre os joelhos",
          "Levante os joelhos em direção ao peito",
          "Quando estável, estenda as pernas para cima",
          "Mantenha o corpo em linha reta",
          "Respire normalmente, mantenha por 30-60 segundos",
          "Desça com controle, descanse em Postura da Criança"
        ],
        tips: [
          "SEMPRE pratique perto de uma parede inicialmente",
          "A maior parte do peso deve estar nos antebraços, não na cabeça",
          "Mantenha o core super ativado",
          "Não entre ou saia da postura com pressa",
          "Descanse em Postura da Criança depois",
          "Considere aprender com um professor qualificado"
        ]
      },
      {
        id: 12,
        name: "Roda (Urdhva Dhanurasana)",
        duration: 35,
        description: "Flexão profunda das costas que abre todo o corpo",
        benefits: "Flexibilidade total da coluna, abertura do peito, fortalece braços e pernas",
        difficulty: "avançado",
        precautions: "Aqueça muito bem antes, evite se tiver lesões nas costas ou pulsos",
        isPremium: true,
        stepByStep: [
          "Deite-se de costas com os joelhos dobrados",
          "Pés no chão, na largura dos quadris, próximos aos glúteos",
          "Coloque as mãos ao lado da cabeça, dedos apontando para os ombros",
          "Pressione firmemente as mãos e pés no chão",
          "Levante os quadris e coloque o topo da cabeça no chão",
          "Pause e respire",
          "Pressione as mãos e estenda os braços completamente",
          "Levante a cabeça do chão",
          "Empurre o peito em direção à parede atrás de você",
          "Mantenha por 5-10 respirações",
          "Desça com controle, descanse"
        ],
        tips: [
          "Aqueça com Ponte e Cobra antes",
          "Mantenha os pés paralelos, não deixe abrirem",
          "Pressione firmemente as mãos no chão",
          "Não force - desenvolva gradualmente",
          "Pratique Ponte primeiro até dominar",
          "Alongue as costas depois (flexão para frente)"
        ]
      },
      {
        id: 13,
        name: "Pombo Real (Eka Pada Rajakapotasana)",
        duration: 40,
        description: "Abertura profunda de quadril com flexão das costas",
        benefits: "Abertura profunda de quadril, flexibilidade da coluna, alongamento intenso",
        difficulty: "avançado",
        isPremium: true,
        stepByStep: [
          "Comece em Cachorro olhando para baixo",
          "Traga o joelho direito para frente entre as mãos",
          "Coloque a canela direita no chão (paralela à frente do tapete)",
          "Estenda a perna esquerda para trás",
          "Quadris nivelados e voltados para frente",
          "Dobre o joelho de trás, trazendo o pé em direção ao glúteo",
          "Alcance o pé com a mão do mesmo lado",
          "Puxe o pé em direção à cabeça",
          "Opcionalmente, alcance com ambas as mãos",
          "Mantenha por 5-10 respirações",
          "Repita do outro lado"
        ],
        tips: [
          "Comece com Pombo simples antes de adicionar a flexão",
          "Use blocos sob o quadril se necessário",
          "Não force a abertura do quadril",
          "Mantenha os quadris nivelados",
          "Respire profundamente para relaxar na postura",
          "Esta é uma postura avançada - seja paciente"
        ]
      },
      {
        id: 14,
        name: "Escorpião (Vrschikasana)",
        duration: 30,
        description: "Inversão avançada com flexão extrema das costas",
        benefits: "Equilíbrio extremo, flexibilidade total, força do core e ombros",
        difficulty: "avançado",
        precautions: "APENAS para praticantes muito experientes, evite se tiver qualquer lesão",
        isPremium: true,
        stepByStep: [
          "Comece em Cachorro olhando para baixo nos antebraços",
          "Caminhe os pés em direção aos cotovelos",
          "Levante uma perna para cima",
          "Impulsione-se e leve a outra perna para cima",
          "Encontre equilíbrio na inversão sobre os antebraços",
          "Quando estável, comece a dobrar os joelhos",
          "Arqueie as costas, levando os pés em direção à cabeça",
          "Olhe para frente",
          "Mantenha por 5-15 segundos",
          "Desça com controle"
        ],
        tips: [
          "SEMPRE pratique com parede ou supervisor",
          "Domine Parada de Cabeça e Roda primeiro",
          "Aqueça extensivamente antes",
          "Não tente sem experiência prévia em inversões",
          "Considere trabalhar com um professor especializado",
          "Respeite seus limites - esta é extremamente avançada"
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Relaxamento e Respiração",
    duration: 12,
    level: "iniciante",
    calories: 30,
    focus: ["relaxamento", "respiração"],
    poses: [
      {
        id: 15,
        name: "Respiração Profunda (Pranayama)",
        duration: 60,
        description: "Técnica de respiração consciente para acalmar a mente",
        benefits: "Reduz estresse, acalma a mente, oxigena o corpo, melhora foco",
        difficulty: "iniciante",
        stepByStep: [
          "Sente-se confortavelmente com a coluna ereta",
          "Pode ser em posição de lótus, meio lótus ou em uma cadeira",
          "Feche os olhos suavemente",
          "Coloque uma mão no peito e outra no abdômen",
          "Inspire lentamente pelo nariz por 4 segundos",
          "Sinta o abdômen expandir primeiro, depois o peito",
          "Segure a respiração por 2 segundos",
          "Expire lentamente pela boca por 6 segundos",
          "Sinta o peito esvaziar primeiro, depois o abdômen",
          "Repita por 10-15 ciclos"
        ],
        tips: [
          "A expiração deve ser mais longa que a inspiração",
          "Respire pelo diafragma, não apenas pelo peito",
          "Mantenha os ombros relaxados",
          "Se sentir tontura, volte à respiração normal",
          "Pratique diariamente para melhores resultados"
        ]
      },
      {
        id: 16,
        name: "Torção Sentada (Ardha Matsyendrasana)",
        duration: 45,
        description: "Torção suave que massageia os órgãos internos",
        benefits: "Massageia órgãos internos, alivia tensão nas costas, melhora digestão",
        difficulty: "iniciante",
        stepByStep: [
          "Sente-se com as pernas estendidas à frente",
          "Dobre o joelho direito e cruze sobre a perna esquerda",
          "Pé direito no chão ao lado do joelho esquerdo",
          "Dobre o joelho esquerdo, trazendo o pé para perto do quadril direito",
          "Inspire e alongue a coluna",
          "Expire e torça para a direita",
          "Cotovelo esquerdo do lado externo do joelho direito",
          "Mão direita atrás de você para apoio",
          "Olhe sobre o ombro direito",
          "Mantenha por 5-8 respirações",
          "Repita do outro lado"
        ],
        tips: [
          "Alongue a coluna antes de torcer",
          "Torça a partir do abdômen, não apenas dos ombros",
          "Mantenha ambos os glúteos no chão",
          "Não force a torção",
          "Use cada inspiração para alongar, cada expiração para torcer mais"
        ]
      },
      {
        id: 17,
        name: "Pernas na Parede (Viparita Karani)",
        duration: 90,
        description: "Inversão suave e restauradora",
        benefits: "Melhora circulação, relaxa pernas, reduz inchaço, acalma o sistema nervoso",
        difficulty: "iniciante",
        stepByStep: [
          "Sente-se de lado próximo a uma parede",
          "Deite-se de costas enquanto gira as pernas para cima na parede",
          "Glúteos próximos ou encostados na parede",
          "Pernas estendidas verticalmente, apoiadas na parede",
          "Braços ao lado do corpo, palmas para cima",
          "Ou braços abertos em 'T'",
          "Feche os olhos",
          "Relaxe completamente",
          "Respire profundamente",
          "Permaneça por 5-15 minutos"
        ],
        tips: [
          "Use uma almofada sob os quadris para maior conforto",
          "Não precisa manter as pernas perfeitamente retas",
          "Ótima postura para fazer antes de dormir",
          "Ajuda a aliviar pernas cansadas",
          "Pode praticar enquanto ouve música relaxante"
        ]
      },
      {
        id: 18,
        name: "Savasana (Postura do Cadáver)",
        duration: 120,
        description: "Postura final de relaxamento profundo e integração",
        benefits: "Relaxamento profundo, integração da prática, reduz estresse e ansiedade",
        difficulty: "iniciante",
        stepByStep: [
          "Deite-se de costas no tapete",
          "Pernas estendidas, pés caindo naturalmente para os lados",
          "Braços ao lado do corpo, palmas para cima",
          "Afaste os braços ligeiramente do corpo",
          "Feche os olhos",
          "Relaxe cada parte do corpo conscientemente",
          "Comece pelos pés, subindo até a cabeça",
          "Solte toda a tensão",
          "Respire naturalmente",
          "Permaneça completamente imóvel por 5-10 minutos",
          "Para sair, mova suavemente os dedos",
          "Role para o lado direito",
          "Use as mãos para sentar-se lentamente"
        ],
        tips: [
          "Use uma manta para cobrir-se se sentir frio",
          "Coloque uma almofada sob os joelhos se tiver desconforto nas costas",
          "Esta é a postura mais importante - não pule!",
          "Permite que o corpo absorva os benefícios da prática",
          "Pratique render-se completamente",
          "Se a mente vagar, gentilmente traga de volta à respiração"
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Yoga para Iniciantes Absolutos",
    duration: 8,
    level: "iniciante",
    calories: 35,
    focus: ["flexibilidade", "relaxamento"],
    poses: [
      freeExercises[0], // Respiração Quadrada
      freeExercises[1], // Gato-Vaca
      freeExercises[4], // Borboleta
    ]
  },
  {
    id: 6,
    name: "Alívio de Tensão Rápido",
    duration: 7,
    level: "iniciante",
    calories: 25,
    focus: ["relaxamento", "flexibilidade"],
    poses: [
      freeExercises[2], // Alongamento de Pescoço
      freeExercises[3], // Torção Deitada
    ]
  },
  {
    id: 7,
    name: "Fortalecimento Intermediário",
    duration: 12,
    level: "intermediário",
    calories: 70,
    focus: ["força", "equilíbrio"],
    poses: [
      freeExercises[5], // Prancha Lateral
      freeExercises[6], // Cadeira
      freeExercises[7], // Meio Pombo
    ]
  }
];

const healthTips = {
  iniciante: [
    "🌅 Pratique pela manhã para energizar seu dia",
    "💧 Mantenha-se hidratado antes e depois da prática",
    "🧘‍♀️ Ouça seu corpo - não force além dos seus limites",
    "📅 Consistência é mais importante que intensidade",
    "🎯 Comece com 10-15 minutos por dia"
  ],
  intermediário: [
    "🔥 Aumente gradualmente a duração das poses",
    "🌬️ Foque na respiração durante toda a prática",
    "💪 Desafie-se com variações mais difíceis",
    "🧘 Pratique meditação após as poses",
    "📈 Varie entre diferentes tipos de sessões"
  ],
  avançado: [
    "🎯 Explore inversões e equilíbrios avançados",
    "🧠 Integre pranayama (técnicas de respiração)",
    "⚡ Pratique em jejum para melhor performance",
    "🌟 Ensine outros - compartilhe seu conhecimento",
    "🔄 Mantenha uma prática diária consistente"
  ]
};

const pricingPlans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    features: [
      "8 exercícios livres completos",
      "3 sessões guiadas básicas",
      "Instruções detalhadas passo a passo",
      "Dicas de segurança",
      "Rastreamento básico de progresso"
    ],
    cta: "Plano Atual",
    highlighted: false
  },
  {
    name: "Premium",
    price: "R$ 29,90",
    period: "/mês",
    features: [
      "✨ Todos os exercícios gratuitos",
      "🔥 Sessões avançadas exclusivas",
      "🎯 Planos personalizados por IA",
      "📊 Análise detalhada de progresso",
      "🎥 Vídeos demonstrativos HD",
      "💬 Suporte prioritário",
      "🏆 Desafios e conquistas especiais",
      "📱 Acesso offline"
    ],
    cta: "Assinar Premium",
    highlighted: true,
    badge: "Mais Popular"
  }
];

export default function YogaApp() {
  const [screen, setScreen] = useState<"welcome" | "questionnaire" | "dashboard" | "session" | "pricing" | "free-exercises">("welcome");
  const [questionStep, setQuestionStep] = useState(1);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    level: "iniciante",
    goals: [],
    limitations: [],
    timeAvailable: "10-15",
    completed: false,
    isPremium: false
  });

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedPoses, setCompletedPoses] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive && selectedSession) {
      const points = selectedSession.poses[currentPoseIndex].difficulty === "avançado" ? 30 : 
                     selectedSession.poses[currentPoseIndex].difficulty === "intermediário" ? 20 : 10;
      setTotalPoints(prev => prev + points);
      setCompletedPoses(prev => prev + 1);
      
      if (currentPoseIndex < selectedSession.poses.length - 1) {
        setCurrentPoseIndex(prev => prev + 1);
        setTimeRemaining(selectedSession.poses[currentPoseIndex + 1].duration);
        setShowInstructions(true);
        setIsActive(false);
      } else {
        setIsActive(false);
        setStreak(prev => prev + 1);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, currentPoseIndex, selectedSession]);

  const startQuestionnaire = () => {
    setScreen("questionnaire");
    setQuestionStep(1);
  };

  const handleGoalToggle = (goal: string) => {
    setUserProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleLimitationToggle = (limitation: string) => {
    setUserProfile(prev => ({
      ...prev,
      limitations: prev.limitations.includes(limitation)
        ? prev.limitations.filter(l => l !== limitation)
        : [...prev.limitations, limitation]
    }));
  };

  const completeQuestionnaire = () => {
    setUserProfile(prev => ({ ...prev, completed: true }));
    setScreen("dashboard");
  };

  const getRecommendedSessions = () => {
    return sessions.filter(session => {
      // Filtra sessões premium se usuário não for premium
      if (session.isPremium && !userProfile.isPremium) return false;
      
      if (userProfile.level === "iniciante" && session.level === "avançado") return false;
      if (userProfile.level === "intermediário" && session.level === "avançado") return false;
      
      const maxTime = parseInt(userProfile.timeAvailable.split("-")[1]);
      if (session.duration > maxTime) return false;

      const hasMatchingGoal = session.focus.some(f => userProfile.goals.includes(f));
      return hasMatchingGoal || userProfile.goals.length === 0;
    });
  };

  const startSession = (session: Session) => {
    // Verifica se é premium e usuário não tem acesso
    if (session.isPremium && !userProfile.isPremium) {
      setScreen("pricing");
      return;
    }
    
    setSelectedSession(session);
    setCurrentPoseIndex(0);
    setTimeRemaining(session.poses[0].duration);
    setIsActive(false);
    setShowInstructions(true);
    setScreen("session");
  };

  const togglePause = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setShowInstructions(false);
    }
  };

  const resetSession = () => {
    if (selectedSession) {
      setCurrentPoseIndex(0);
      setTimeRemaining(selectedSession.poses[0].duration);
      setIsActive(false);
      setShowInstructions(true);
    }
  };

  const backToDashboard = () => {
    setSelectedSession(null);
    setIsActive(false);
    setScreen("dashboard");
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "iniciante": return "from-emerald-400 to-teal-500";
      case "intermediário": return "from-orange-400 to-pink-500";
      case "avançado": return "from-purple-500 to-pink-600";
      default: return "from-blue-400 to-cyan-500";
    }
  };

  // TELA DE BOAS-VINDAS
  if (screen === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 sm:p-12 text-center border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <div className="mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Bem-vindo ao Yoga Flow
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              Sua jornada de bem-estar começa aqui
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Vamos conhecer você melhor para criar uma experiência personalizada
            </p>
          </div>

          <div className="grid gap-4 mb-8 text-left">
            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Personalizado para você</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sessões adaptadas ao seu nível e objetivos</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <Heart className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Seguro e saudável</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Respeitamos suas limitações e condições físicas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">No seu ritmo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pratique quando e onde quiser, no tempo que tiver</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={startQuestionnaire}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg text-lg py-6"
          >
            Começar Questionário
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  // QUESTIONÁRIO
  if (screen === "questionnaire") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-6 sm:p-8 border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Pergunta {questionStep} de 5
              </span>
              <span className="text-sm font-bold text-purple-600">
                {Math.round((questionStep / 5) * 100)}%
              </span>
            </div>
            <Progress value={(questionStep / 5) * 100} className="h-2" />
          </div>

          {/* Pergunta 1: Nome */}
          {questionStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                  Como podemos te chamar?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Vamos personalizar sua experiência
                </p>
              </div>
              <div>
                <Label htmlFor="name" className="text-base mb-2 block">Seu nome</Label>
                <input
                  id="name"
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite seu nome"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-purple-500 focus:outline-none text-lg"
                />
              </div>
              <Button 
                onClick={() => setQuestionStep(2)}
                disabled={!userProfile.name.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg"
              >
                Continuar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Pergunta 2: Nível */}
          {questionStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                  Qual seu nível de experiência com yoga?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Seja honesto para termos as melhores recomendações
                </p>
              </div>
              <RadioGroup value={userProfile.level} onValueChange={(value: any) => setUserProfile(prev => ({ ...prev, level: value }))}>
                <div className="space-y-3">
                  <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-500 transition-all has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20">
                    <RadioGroupItem value="iniciante" id="iniciante" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Iniciante</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Nunca pratiquei ou pratiquei poucas vezes</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-500 transition-all has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20">
                    <RadioGroupItem value="intermediário" id="intermediario" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Intermediário</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Pratico regularmente há alguns meses</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-500 transition-all has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20">
                    <RadioGroupItem value="avançado" id="avancado" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Avançado</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Pratico há anos e domino poses complexas</div>
                    </div>
                  </label>
                </div>
              </RadioGroup>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setQuestionStep(1)}
                  variant="outline"
                  className="flex-1 py-6"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={() => setQuestionStep(3)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6"
                >
                  Continuar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Pergunta 3: Objetivos */}
          {questionStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                  Quais são seus objetivos?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Selecione todos que se aplicam
                </p>
              </div>
              <div className="space-y-3">
                {["flexibilidade", "força", "equilíbrio", "relaxamento", "energia", "respiração"].map((goal) => (
                  <label 
                    key={goal}
                    className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-500 transition-all has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20"
                  >
                    <Checkbox 
                      checked={userProfile.goals.includes(goal)}
                      onCheckedChange={() => handleGoalToggle(goal)}
                    />
                    <span className="font-medium text-gray-800 dark:text-gray-100 capitalize">{goal}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setQuestionStep(2)}
                  variant="outline"
                  className="flex-1 py-6"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={() => setQuestionStep(4)}
                  disabled={userProfile.goals.length === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6"
                >
                  Continuar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Pergunta 4: Limitações */}
          {questionStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                  Você tem alguma limitação física?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Isso nos ajuda a recomendar poses seguras para você
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "Nenhuma limitação",
                  "Problemas nas costas",
                  "Problemas nos joelhos",
                  "Problemas nos ombros",
                  "Pressão alta",
                  "Gravidez",
                  "Lesão recente"
                ].map((limitation) => (
                  <label 
                    key={limitation}
                    className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-500 transition-all has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20"
                  >
                    <Checkbox 
                      checked={userProfile.limitations.includes(limitation)}
                      onCheckedChange={() => handleLimitationToggle(limitation)}
                    />
                    <span className="font-medium text-gray-800 dark:text-gray-100">{limitation}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setQuestionStep(3)}
                  variant="outline"
                  className="flex-1 py-6"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={() => setQuestionStep(5)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6"
                >
                  Continuar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Pergunta 5: Tempo disponível */}
          {questionStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                  Quanto tempo você tem por dia?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Vamos sugerir sessões que cabem na sua rotina
                </p>
              </div>
              <RadioGroup value={userProfile.timeAvailable} onValueChange={(value) => setUserProfile(prev => ({ ...prev, timeAvailable: value }))}>
                <div className="space-y-3">
                  {[
                    { value: "5-10", label: "5-10 minutos", desc: "Rápido e eficiente" },
                    { value: "10-15", label: "10-15 minutos", desc: "Ideal para iniciantes" },
                    { value: "15-20", label: "15-20 minutos", desc: "Prática completa" },
                    { value: "20-30", label: "20-30 minutos", desc: "Sessão aprofundada" }
                  ].map((option) => (
                    <label 
                      key={option.value}
                      className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-500 transition-all has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20"
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{option.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setQuestionStep(4)}
                  variant="outline"
                  className="flex-1 py-6"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={completeQuestionnaire}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6"
                >
                  Finalizar
                  <CheckCircle2 className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // TELA DE PRICING
  if (screen === "pricing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setScreen("dashboard")}
            className="mb-6 hover:bg-white/50"
          >
            ← Voltar ao Dashboard
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Escolha seu Plano
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Comece grátis ou desbloqueie todo o potencial com Premium
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative overflow-hidden border-0 shadow-2xl transition-all duration-300 ${
                  plan.highlighted 
                    ? "scale-105 ring-4 ring-purple-500/50" 
                    : "hover:scale-102"
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {plan.badge}
                  </div>
                )}
                
                <div className={`h-2 bg-gradient-to-r ${plan.highlighted ? "from-purple-500 to-pink-600" : "from-gray-300 to-gray-400"}`} />
                
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? "text-purple-600" : "text-gray-400"
                        }`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full py-6 text-lg ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                    disabled={!plan.highlighted}
                  >
                    {plan.highlighted && <Crown className="w-5 h-5 mr-2" />}
                    {plan.cta}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="inline-block p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-600" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Garantia de 7 dias:</strong> Experimente Premium sem riscos. Cancele quando quiser.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // TELA DE EXERCÍCIOS LIVRES
  if (screen === "free-exercises") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setScreen("dashboard")}
            className="mb-6 hover:bg-white/50"
          >
            ← Voltar ao Dashboard
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Exercícios Livres
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Pratique no seu ritmo com nossa biblioteca gratuita
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {freeExercises.map((exercise) => (
              <Card 
                key={exercise.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className={`h-2 bg-gradient-to-r ${getDifficultyColor(exercise.difficulty)}`} />
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                      {exercise.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {exercise.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span>{exercise.duration} segundos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="text-xs">{exercise.benefits}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => {
                      // Cria uma sessão temporária com apenas este exercício
                      const tempSession: Session = {
                        id: 999,
                        name: exercise.name,
                        duration: Math.ceil(exercise.duration / 60),
                        level: exercise.difficulty,
                        calories: 20,
                        focus: ["flexibilidade"],
                        poses: [exercise]
                      };
                      startSession(tempSession);
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Praticar Agora
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  if (screen === "dashboard") {
    const recommendedSessions = getRecommendedSessions();
    const currentTips = healthTips[userProfile.level];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Personalizado */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Olá, {userProfile.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Pronto para sua prática de hoje?
            </p>
            {!userProfile.isPremium && (
              <Button
                onClick={() => setScreen("pricing")}
                className="mt-4 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg"
              >
                <Crown className="w-4 h-4 mr-2" />
                Desbloquear Premium
              </Button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-orange-400 to-pink-500 text-white border-0 shadow-xl hover:scale-105 transition-transform">
              <div className="flex flex-col items-center gap-2">
                <Flame className="w-6 h-6 sm:w-8 sm:h-8" />
                <div className="text-2xl sm:text-3xl font-bold">{streak}</div>
                <div className="text-xs sm:text-sm opacity-90">Sequência</div>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl hover:scale-105 transition-transform">
              <div className="flex flex-col items-center gap-2">
                <Star className="w-6 h-6 sm:w-8 sm:h-8" />
                <div className="text-2xl sm:text-3xl font-bold">{totalPoints}</div>
                <div className="text-xs sm:text-sm opacity-90">Pontos</div>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-cyan-400 to-blue-500 text-white border-0 shadow-xl hover:scale-105 transition-transform">
              <div className="flex flex-col items-center gap-2">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
                <div className="text-2xl sm:text-3xl font-bold">{completedPoses}</div>
                <div className="text-xs sm:text-sm opacity-90">Poses</div>
              </div>
            </Card>
          </div>

          {/* Botão Exercícios Livres */}
          <Card 
            className="p-6 mb-8 bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-0 shadow-xl cursor-pointer hover:scale-102 transition-all"
            onClick={() => setScreen("free-exercises")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Exercícios Livres</h3>
                  <p className="text-sm opacity-90">Pratique {freeExercises.length} exercícios no seu ritmo</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6" />
            </div>
          </Card>

          {/* Dicas Personalizadas */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-3">Dicas para você ({userProfile.level})</h3>
                <div className="space-y-2">
                  {currentTips.slice(0, 3).map((tip, index) => (
                    <p key={index} className="text-sm opacity-90">{tip}</p>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Avisos de Segurança */}
          {userProfile.limitations.length > 0 && !userProfile.limitations.includes("Nenhuma limitação") && (
            <Card className="p-4 mb-8 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">
                    Atenção às suas limitações
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Selecionamos poses seguras para: {userProfile.limitations.join(", ")}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Sessões Recomendadas */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Recomendado para você
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedSessions.map((session) => (
              <Card 
                key={session.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer relative"
                onClick={() => startSession(session)}
              >
                {session.isPremium && (
                  <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white p-2 rounded-full">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <div className={`h-2 bg-gradient-to-r ${getDifficultyColor(session.level)}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                        {session.name}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getDifficultyColor(session.level)}`}>
                        {session.level}
                      </span>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>{session.duration} minutos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-500" />
                      <span>{session.poses.length} poses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span>~{session.calories} calorias</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {session.focus.map(f => (
                        <span key={f} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className={`w-full mt-6 ${
                      session.isPremium && !userProfile.isPremium
                        ? "bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    } text-white shadow-lg`}
                  >
                    {session.isPremium && !userProfile.isPremium ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Desbloquear
                      </>
                    ) : (
                      "Começar Sessão"
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {recommendedSessions.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Nenhuma sessão encontrada para seus critérios. Tente ajustar suas preferências.
              </p>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // SESSÃO ATIVA
  if (screen === "session" && selectedSession) {
    const currentPose = selectedSession.poses[currentPoseIndex];
    const isSessionComplete = currentPoseIndex === selectedSession.poses.length - 1 && timeRemaining === 0 && !isActive;
    const progress = ((currentPoseIndex + (selectedSession.poses[currentPoseIndex].duration - timeRemaining) / selectedSession.poses[currentPoseIndex].duration) / selectedSession.poses.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={backToDashboard}
              className="hover:bg-white/50"
            >
              ← Voltar
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold">{totalPoints}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Progresso da Sessão
              </span>
              <span className="text-sm font-bold text-purple-600">
                {currentPoseIndex + 1} / {selectedSession.poses.length}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {isSessionComplete ? (
            <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-2xl">
              <CheckCircle2 className="w-20 h-20 mx-auto mb-6 animate-bounce" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Sessão Completa! 🎉
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Você ganhou {selectedSession.poses.length * (selectedSession.level === "avançado" ? 30 : selectedSession.level === "intermediário" ? 20 : 10)} pontos!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={resetSession}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                  size="lg"
                >
                  Repetir Sessão
                </Button>
                <Button 
                  onClick={backToDashboard}
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  size="lg"
                >
                  Escolher Outra
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {/* Main Pose Card */}
              <Card className="overflow-hidden border-0 shadow-2xl mb-6">
                <div className={`h-3 bg-gradient-to-r ${getDifficultyColor(currentPose.difficulty)}`} />
                <div className="p-6 sm:p-8">
                  {/* Timer Circle */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <svg className="w-48 h-48 sm:w-64 sm:h-64 transform -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                          strokeDashoffset={2 * Math.PI * 45 * (1 - timeRemaining / currentPose.duration)}
                          className="transition-all duration-1000 ease-linear"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {timeRemaining}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            segundos
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pose Info */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {currentPose.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                      {currentPose.description}
                    </p>
                    <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-4 py-2 rounded-full mb-4">
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        💡 {currentPose.benefits}
                      </span>
                    </div>
                    {currentPose.precautions && (
                      <div className="inline-block bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full">
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                          ⚠️ {currentPose.precautions}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Instruções Detalhadas */}
                  {showInstructions && (
                    <div className="mb-8 space-y-6">
                      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3 mb-4">
                          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-3">
                              Como fazer (passo a passo):
                            </h3>
                            <ol className="space-y-2">
                              {currentPose.stepByStep.map((step, index) => (
                                <li key={index} className="flex gap-3 text-sm text-blue-800 dark:text-blue-200">
                                  <span className="font-bold min-w-[24px]">{index + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-bold text-lg text-green-900 dark:text-green-100 mb-3">
                              Dicas importantes:
                            </h3>
                            <ul className="space-y-2">
                              {currentPose.tips.map((tip, index) => (
                                <li key={index} className="flex gap-3 text-sm text-green-800 dark:text-green-200">
                                  <span className="text-green-600">✓</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={togglePause}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg px-8"
                    >
                      {isActive ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          {timeRemaining === currentPose.duration ? "Iniciar" : "Continuar"}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={resetSession}
                      size="lg"
                      variant="outline"
                      className="border-2"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reiniciar
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Poses Timeline */}
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
                <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
                  Próximas Poses
                </h3>
                <div className="space-y-3">
                  {selectedSession.poses.map((pose, index) => (
                    <div
                      key={pose.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        index === currentPoseIndex
                          ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                          : index < currentPoseIndex
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === currentPoseIndex
                          ? "bg-white text-purple-600"
                          : index < currentPoseIndex
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      }`}>
                        {index < currentPoseIndex ? "✓" : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{pose.name}</div>
                        <div className={`text-xs ${index === currentPoseIndex ? "opacity-90" : "opacity-70"}`}>
                          {pose.duration}s
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
