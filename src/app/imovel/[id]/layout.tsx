import { Metadata, ResolvingMetadata } from 'next'
import { INITIAL_PROPERTIES } from '@/data/properties'

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id
  const property = INITIAL_PROPERTIES.find(p => p.id === id)

  if (!property) {
    return {
      title: 'Imóvel não encontrado | Carlão Imóveis'
    }
  }

  return {
    title: `${property.title} - ${property.code} | Carlão Imóveis`,
    description: property.description || `Confira este imóvel: ${property.title} em ${property.location}.`,
    openGraph: {
      title: `${property.title} - ${property.code} | Carlão Imóveis`,
      description: property.description || `Confira este excelente imóvel em ${property.location}.`,
      images: [
        {
          url: property.image,
          width: 800,
          height: 600,
          alt: property.title,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${property.title} - ${property.code} | Carlão Imóveis`,
      description: property.description || `Confira este excelente imóvel em ${property.location}.`,
      images: [property.image],
    }
  }
}

export default function ImovelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
