import { Metadata, ResolvingMetadata } from 'next'
import { INITIAL_PROPERTIES } from '@/data/properties'
import { generateSlug } from '@/utils/slug'

type Props = {
  params: { slug: string }
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
  const slug = params.slug
  const property = INITIAL_PROPERTIES.find(p => {
    const pSlug = generateSlug(p);
    return (
      pSlug.toLowerCase() === slug.toLowerCase() || 
      String(p.id) === String(slug) ||
      p.code?.toLowerCase() === slug.toLowerCase()
    );
  })

  if (!property) {
    return {
      title: 'Imóvel não encontrado',
      robots: { index: false, follow: true },
    }
  }

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

  return {
    title,
    description: `${description.slice(0, 140)}... Confira fotos e detalhes na Carlão Imóveis.`,
    alternates: {
      canonical: `/imovel/${pSlug}`,
    },
    openGraph: {
      title: `${property.title} | ${priceFormatted}${suffix}`,
      description: `${property.category} em ${property.location}. ${specs}. Veja fotos e agende uma visita.`,
      images: [
        {
          url: property.image,
          width: 800,
          height: 600,
          alt: property.title,
        }
      ],
      type: 'website',
      url: `/imovel/${pSlug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${property.title} | ${priceFormatted}${suffix}`,
      description: `${property.category} em ${property.location}. ${specs}.`,
      images: [property.image],
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
