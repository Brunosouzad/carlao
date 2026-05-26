import { Metadata, ResolvingMetadata } from 'next'
import { INITIAL_PROPERTIES, Property } from '@/data/properties'
import { generateSlug } from '@/utils/slug'
import { supabase } from '@/lib/supabase'

type Props = {
  params: Promise<{ id: string }>
}

function formatPriceSEO(price: string): string {
  const num = parseFloat(price);
  if (isNaN(num)) return price;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  const decodedId = decodeURIComponent(id);

  let property = INITIAL_PROPERTIES.find(p => {
    const pSlug = generateSlug(p);
    return (
      pSlug.toLowerCase() === decodedId.toLowerCase() || 
      String(p.id) === String(decodedId) ||
      p.code?.toLowerCase() === decodedId.toLowerCase()
    );
  })

  // Se não encontrou nas estáticas, tenta no Supabase (para SEO dinâmico)
  if (!property) {
    try {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .or(`code.ilike.${decodedId},id.eq.${decodedId}`);
      
      if (data && data.length > 0) {
        const p = data[0];
        property = {
          ...p,
          videoUrl: p.video_url,
          zipCode: p.zip_code,
          images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : [])
        } as Property;
      }
    } catch (e) {
      console.error("Erro ao buscar metadados dinâmicos:", e);
    }
  }

  // Se ainda não encontrou, tenta extrair o código do slug
  if (!property) {
    const slugCodeMatch = decodedId.match(/-([a-zA-Z0-9-]+)$/);
    if (slugCodeMatch) {
      const extractedCode = slugCodeMatch[1];
      try {
        const { data } = await supabase
          .from('properties')
          .select('*')
          .ilike('code', extractedCode);
        
        if (data && data.length > 0) {
          const p = data[0];
          property = {
            ...p,
            videoUrl: p.video_url,
            zipCode: p.zip_code,
            images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : [])
          } as Property;
        }
      } catch (e) {}
    }
  }

  if (!property) {
    return {
      title: 'Imóvel não encontrado',
      robots: { index: false, follow: true },
    }
  }

  const BASE_URL = 'https://www.carlaoimoveismg.com.br';
  const pSlug = generateSlug(property);
  const priceFormatted = formatPriceSEO(property.price);
  const suffix = property.type === 'Aluguel' ? '/mês' : '';
  const specs = [
    property.beds > 0 ? `${property.beds} quartos` : null,
    property.baths > 0 ? `${property.baths} banheiros` : null,
    property.area > 0 ? `${property.area}m²` : null,
  ].filter(Boolean).join(', ');

  const title = `${property.title} - ${property.code}`;
  const description = property.description
    || `${property.category} ${property.type === 'Aluguel' ? 'para alugar' : 'à venda'} em ${property.location}. ${specs}. ${priceFormatted}${suffix}.`;
  const shortDescription = `${description.slice(0, 140)}... Confira fotos e detalhes na Carlão Imóveis.`;

  // Garante URL absoluta para og:image — obrigatório para WhatsApp, Telegram, iMessage etc.
  const rawImage = property.image || '';
  const ogImageUrl = rawImage.startsWith('http')
    ? rawImage
    : rawImage.startsWith('/')
      ? `${BASE_URL}${rawImage}`
      : rawImage;

  const ogTitle = `${property.title} | ${priceFormatted}${suffix}`;
  const ogDescription = `${property.category} em ${property.location}. ${specs}. Veja fotos e agende uma visita.`;

  return {
    title,
    description: shortDescription,
    alternates: {
      canonical: `${BASE_URL}/imovel/${pSlug}`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      siteName: 'Carlão Imóveis',
      locale: 'pt_BR',
      type: 'website',
      url: `${BASE_URL}/imovel/${pSlug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: property.title,
          type: 'image/jpeg',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
  }
}

export default function ImovelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
