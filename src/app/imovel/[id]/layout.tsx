import { Metadata, ResolvingMetadata } from 'next'
import { INITIAL_PROPERTIES, Property } from '@/data/properties'
import { generateSlug } from '@/utils/slug'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/utils/format'

type Props = {
  params: Promise<{ id: string }>
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

  // Função auxiliar para mapear dados do Supabase
  const mapSupabaseProperty = (p: any): Property => ({
    ...p,
    videoUrl: p.video_url,
    zipCode: p.zip_code,
    images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : [])
  } as Property);

  if (!property) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedId);
    
    if (isUUID) {
      try {
        const { data } = await supabase.from('properties').select('*').eq('id', decodedId).single();
        if (data) property = mapSupabaseProperty(data);
      } catch (e) {}
    } else {
      let query = supabase.from('properties').select('*').limit(1);
      const orConditions = [];

      // Tentar extrair possíveis códigos do final do slug (último segmento, ou dois últimos, ou três últimos)
      // Ex: ...-imov-3695 -> testa 'imov-3695', '3695'
      // Ex: ...-im3656 -> testa 'im3656'
      const segments = decodedId.split('-');
      const possibleCodes = [];
      if (segments.length >= 1) possibleCodes.push(segments[segments.length - 1]);
      if (segments.length >= 2) possibleCodes.push(segments.slice(-2).join('-'));
      if (segments.length >= 3) possibleCodes.push(segments.slice(-3).join('-'));

      for (const code of possibleCodes) {
        if (!code || code.length < 2) continue;
        const spaceCode = code.replace(/-/g, ' ');
        const noSpaceCode = code.replace(/-/g, '');
        orConditions.push(`code.ilike.${code}`, `code.ilike.${spaceCode}`, `code.ilike.${noSpaceCode}`);
      }

      // Se só tem número no final, tenta buscar códigos genéricos também (ex: LIKE %3695)
      const possibleNumeric = decodedId.match(/-(\d+)$/)?.[1];
      if (possibleNumeric) {
        orConditions.push(`code.ilike.%${possibleNumeric}%`);
      }

      if (orConditions.length > 0) {
        try {
          // Remove duplicatas para a query não ficar gigante
          const uniqueConditions = Array.from(new Set(orConditions));
          const { data } = await query.or(uniqueConditions.join(','));
          if (data && data.length > 0) {
            property = mapSupabaseProperty(data[0]);
          }
        } catch(e) {}
      }
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
  const priceFormatted = formatPrice(property.price);
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
  const rawImage = property.image || (property.images && property.images.length > 0 ? property.images[0] : '') || '';
  const ogImageUrl = rawImage.startsWith('http')
    ? rawImage
    : rawImage.startsWith('/')
      ? `${BASE_URL}${rawImage}`
      : rawImage;

  const ogTitle = `${property.title} | ${priceFormatted}${suffix}`;
  const ogDescription = `${property.category} em ${property.location}. ${specs}. Veja fotos e agende uma visita.`;

  // Usa URL relativa para canonical/url — o metadataBase do root layout faz o prefixo
  // Mas og:image precisa ser ABSOLUTA (scrapers não seguem metadataBase)
  return {
    title,
    description: shortDescription,
    alternates: {
      canonical: `/imovel/${pSlug}`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      siteName: 'Carlão Imóveis',
      locale: 'pt_BR',
      type: 'website',
      url: `/imovel/${pSlug}`,
      images: [
        {
          // URL absoluta é obrigatória para WhatsApp/Telegram/iMessage
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: property.title,
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
