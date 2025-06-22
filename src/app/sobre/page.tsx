// src/app/sobre/page.tsx
import { getClient, getImageUrl, isValidImage } from '@/lib/sanity.client';
import type { PaginaSobreData } from '@/types/sanity';
import { Metadata } from 'next';
import SobrePageClient from './SobrePageClient'; // Client Component

// Query GROQ para buscar os dados da página "Sobre"
const paginaSobreQuery = `*[_type == "paginaSobre"][0]{
  _id,
  titulo,
  imagemPrincipal{alt, asset->},
  biografia[]{
    ...,
    _type == "image" => {
      alt,
      asset->,
      legenda
    },
    markDefs[]{ ..., _type == "link" => { "href": @.href, "blank": @.blank } }
  },
  conquistas[]{_key, ano, descricao}
}`;

// Função para buscar dados da página "Sobre" no servidor
async function getPaginaSobreData(): Promise<PaginaSobreData | null> {
  const client = getClient();
  try {
    const data: PaginaSobreData | null = await client.fetch(paginaSobreQuery);
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados da página Sobre:', error);
    return null;
  }
}

// Gerar metadados dinamicamente para SEO
export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPaginaSobreData();

  if (!pagina) {
    return {
      title: 'Sobre o Piloto - Informações não encontradas',
      description: 'Informações sobre o piloto não encontradas.',
    };
  }

  const description = pagina.biografia
    ? (pagina.biografia[0] as any)?.children?.[0]?.text?.substring(0, 160) ||
      `Saiba mais sobre a carreira e trajetória de ${
        pagina.titulo || 'Lucas Foresti'
      }.`
    : `Saiba mais sobre a carreira e trajetória de ${
        pagina.titulo || 'Lucas Foresti'
      }.`;

  const imageUrlPrincipal =
    pagina.imagemPrincipal && isValidImage(pagina.imagemPrincipal)
      ? getImageUrl(pagina.imagemPrincipal, 1200)
      : undefined;

  return {
    title: `${pagina.titulo || 'Sobre o Piloto'} - Lucas Foresti`,
    description: description,
    openGraph: {
      title: pagina.titulo || 'Sobre o Piloto - Lucas Foresti',
      description: description,
      images: imageUrlPrincipal ? [imageUrlPrincipal] : [],
      url: 'https://www.lucasforesti.com.br/sobre',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: pagina.titulo || 'Sobre o Piloto - Lucas Foresti',
      description: description,
      images: imageUrlPrincipal ? [imageUrlPrincipal] : [],
    },
  };
}

// Server Component - sem motion, sem hooks
export default async function SobrePage() {
  const pagina = await getPaginaSobreData();

  // Passar dados para o Client Component
  return <SobrePageClient pagina={pagina} />;
}
