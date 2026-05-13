export interface Property {
  id: string;
  code: string;
  title: string;
  location: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  complement?: string;
  zipCode?: string;
  price: string;
  condominium?: string;
  iptu?: string;
  beds: number;
  suites?: number;
  baths: number;
  garages: number;
  area: number;
  type: "Venda" | "Aluguel";
  category: string;
  image: string;
  images?: string[];
  features?: string[];
  tag?: string;
  description?: string;
  videoUrl?: string;
  active?: boolean;
  slug?: string;
  created_at?: string;
}

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "1",
    code: "CV-001",
    title: "Casa de Alto Padrão no Belvedere",
    location: "Belvedere, Governador Valadares - MG",
    price: "185000000",
    beds: 4,
    baths: 5,
    garages: 4,
    area: 320,
    type: "Venda",
    category: "Casa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop",
    tag: "Destaque",
    description: "Excelente casa com acabamento de luxo, 4 suítes, área de lazer completa com piscina e churrasqueira."
  },
  {
    id: "2",
    code: "CV-002",
    title: "Apartamento Luxo Vila Bretas",
    location: "Vila Bretas, Governador Valadares - MG",
    price: "85000000",
    beds: 3,
    baths: 2,
    garages: 2,
    area: 110,
    type: "Venda",
    category: "Apartamento",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    tag: "Novo",
    description: "Apartamento novo, sol da manhã, 3 quartos sendo 1 suíte, varanda gourmet e 2 vagas soltas."
  },
  {
    id: "4",
    code: "CV-003",
    title: "Mansão Lagoa Santa",
    location: "Lagoa Santa, Gov. Valadares - MG",
    price: "240000000",
    beds: 5,
    baths: 6,
    garages: 6,
    area: 450,
    type: "Venda",
    category: "Casa",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    tag: "Exclusivo",
    description: "Mansão espetacular com vista para a Ibituruna, 5 suítes, home cinema, adega e área externa cinematográfica."
  },
  {
    id: "5",
    code: "CV-004",
    title: "Apto Garden Grã-Duquesa",
    location: "Grã-Duquesa, Gov. Valadares - MG",
    price: "68000000",
    beds: 3,
    baths: 2,
    garages: 2,
    area: 140,
    type: "Venda",
    category: "Apartamento",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
    tag: "Oportunidade",
    description: "Apartamento tipo Garden com ampla área externa privativa, ideal para famílias com pets."
  },
  {
    id: "3",
    code: "AL-001",
    title: "Cobertura Duplex Centro",
    location: "Centro, Coronel Fabriciano - MG",
    price: "450000",
    beds: 3,
    baths: 3,
    garages: 2,
    area: 180,
    type: "Aluguel",
    category: "Apartamento",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop",
    tag: "Destaque",
    description: "Linda cobertura duplex no centro, perto de tudo. Totalmente montada e decorada."
  },
  {
    id: "6",
    code: "AL-002",
    title: "Apto Moderno Melo Viana",
    location: "Melo Viana, Coronel Fabriciano - MG",
    price: "1800",
    beds: 2,
    baths: 1,
    garages: 1,
    area: 75,
    type: "Aluguel",
    category: "Apartamento",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&auto=format&fit=crop",
    tag: "Novo",
    description: "Apartamento recém reformado, prédio com elevador e portaria eletrônica."
  },
  {
    id: "7",
    code: "AL-003",
    title: "Casa Ampla Caladinho",
    location: "Caladinho, Coronel Fabriciano - MG",
    price: "2800",
    beds: 3,
    baths: 2,
    garages: 2,
    area: 200,
    type: "Aluguel",
    category: "Casa",
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=800&auto=format&fit=crop",
    tag: "Familiar",
    description: "Casa muito espaçosa com quintal, perfeita para crianças. Bairro tranquilo."
  },
  {
    id: "8",
    code: "AL-004",
    title: "Sala Comercial Centro",
    location: "Centro, Gov. Valadares - MG",
    price: "1200",
    beds: 0,
    baths: 1,
    garages: 1,
    area: 45,
    type: "Aluguel",
    category: "Comercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    tag: "Comercial",
    description: "Sala comercial no melhor ponto da cidade, pronta para o seu negócio."
  },
  // NOVOS IMÓVEIS - VENDA
  {
    id: "9",
    code: "CV-005",
    title: "Apartamento Vista Ibituruna",
    location: "Ilha dos Araújos, Gov. Valadares - MG",
    price: "1250000",
    beds: 3,
    baths: 3,
    garages: 2,
    area: 160,
    type: "Venda",
    category: "Apartamento",
    image: "https://images.unsplash.com/photo-1512918766674-ed62b90daa95?q=80&w=800&auto=format&fit=crop",
    tag: "Luxo",
    description: "Espetacular cobertura na Ilha com vista definitiva para o Pico da Ibituruna."
  },
  {
    id: "10",
    code: "CV-006",
    title: "Lote no Condomínio Solar",
    location: "Parque das Nações, Gov. Valadares - MG",
    price: "350000",
    beds: 0,
    baths: 0,
    garages: 0,
    area: 450,
    type: "Venda",
    category: "Lote",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
    tag: "Oportunidade",
    description: "Lote plano em condomínio fechado com infraestrutura completa e segurança 24h."
  },
  {
    id: "11",
    code: "CV-007",
    title: "Fazenda Vale do Rio Doce",
    location: "Zona Rural, Gov. Valadares - MG",
    price: "4800000",
    beds: 4,
    baths: 3,
    garages: 10,
    area: 250000,
    type: "Venda",
    category: "Fazenda",
    image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=800&auto=format&fit=crop",
    tag: "Investimento",
    description: "Fazenda produtiva com muita água, curral, casa sede centenária e pastagens formadas."
  },
  {
    id: "12",
    code: "CV-008",
    title: "Casa Moderna no Altinópolis",
    location: "Altinópolis, Gov. Valadares - MG",
    price: "720000",
    beds: 3,
    baths: 2,
    garages: 2,
    area: 180,
    type: "Venda",
    category: "Casa",
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=800&auto=format&fit=crop",
    tag: "Financiável",
    description: "Casa nova com projeto arquitetônico moderno, suíte master e área gourmet."
  },
  // NOVOS IMÓVEIS - ALUGUEL
  {
    id: "13",
    code: "AL-005",
    title: "Studio Design no Centro",
    location: "Centro, Gov. Valadares - MG",
    price: "2200",
    beds: 1,
    baths: 1,
    garages: 1,
    area: 45,
    type: "Aluguel",
    category: "Apartamento",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
    tag: "Mobiliado",
    description: "Studio totalmente mobiliado e decorado, ideal para executivos. Prédio com rooftop."
  },
  {
    id: "14",
    code: "AL-006",
    title: "Galpão Industrial",
    location: "Distrito Industrial, Gov. Valadares - MG",
    price: "8500",
    beds: 0,
    baths: 2,
    garages: 5,
    area: 600,
    type: "Aluguel",
    category: "Comercial",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
    tag: "Industrial",
    description: "Amplo galpão com pé direito duplo, escritório e acesso para carretas."
  },
  {
    id: "15",
    code: "AL-007",
    title: "Casa Geminada no Santos Dumont",
    location: "Santos Dumont, Gov. Valadares - MG",
    price: "1600",
    beds: 2,
    baths: 2,
    garages: 1,
    area: 90,
    type: "Aluguel",
    category: "Casa",
    image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=800&auto=format&fit=crop",
    tag: "Barato",
    description: "Casa geminada independente, bem arejada e em rua tranquila do bairro."
  },
  {
    id: "16",
    code: "AL-008",
    title: "Apartamento Família no Esplanada",
    location: "Esplanada, Gov. Valadares - MG",
    price: "2500",
    beds: 3,
    baths: 2,
    garages: 2,
    area: 120,
    type: "Aluguel",
    category: "Apartamento",
    image: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?q=80&w=800&auto=format&fit=crop",
    tag: "Próximo à Praça",
    description: "Apartamento amplo, 3 quartos, dependência completa de empregada e excelente localização."
  }
];
