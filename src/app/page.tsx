// src/app/page.tsx
// Este arquivo agora é um Server Component por padrão (sem 'use client')

import { Metadata } from 'next'; // A importação de Metadata é para tipagem do objeto exportado
// Importar Image do Next.js e Link (embora Link seja usado em Client Components, é bom manter para consistência)

// Importar os módulos do Sanity (sem 'use client')
import { getClient, getImageUrl, isValidImage } from '@/lib/sanity.client'; // Importar getImageUrl e isValidImage aqui
import type {
  NoticiaCard,
  PaginaSobreData,
  SanityImageObject,
  SanitySlug,
} from '@/types/sanity';

// Importar os Client Components encapsulados
import HomeGaleriaSection from '@/components/galeria/HomeGaleriaSection'; // Já é 'use client'
import HeroSection from '@/components/home/HeroSection'; // Este é o componente que já existia e já é 'use client'
import LatestNewsSection from '@/components/home/LatestNewsSection'; // Novo componente criado no passo anterior, e é 'use client'

// Metadados para SEO da Home Page (definidos em Server Component)
export const metadata: Metadata = {
  title: 'Lucas Foresti - Piloto Stock Car | Website Oficial',
  description:
    'Acompanhe a carreira, notícias, calendário e galeria de fotos de Lucas Foresti, piloto da Stock Car Pro Series.',
};

// Interfaces (mantidas)
interface ProximaCorrida {
  _id: string;
  nomeDoEvento: string;
  dataDoEvento: string;
  circuito?: string;
  cidade: string;
}

interface AlbumTeaser {
  _id: string;
  titulo: string;
  slug: SanitySlug;
  imagemDeCapa?: SanityImageObject & { alt?: string };
}

interface HomePageData {
  ultimasNoticias?: NoticiaCard[];
  proximaCorrida?: ProximaCorrida | null;
  teaserAlbuns?: AlbumTeaser[];
  paginaSobre?: PaginaSobreData | null;
}

const hojeISO = new Date().toISOString().split('T')[0];

// Query unificada (mantida, agora rodará no servidor)
const homePageDataQuery = `{
  "ultimasNoticias": *[_type == "noticia"] | order(dataDePublicacao desc) [0...3] {
    _id, titulo, slug, dataDePublicacao, imagemDeCapa{alt, asset->}, resumo
  },
  "proximaCorrida": *[_type == "evento" && (status == "agendado" || status == "adiado") && dataDoEvento >= $hojeISO] | order(dataDoEvento asc) [0] {
    _id, nomeDoEvento, dataDoEvento, circuito, cidade
  },
  "teaserAlbuns": *[_type == "albumDeFotos" && defined(imagemDeCapa.asset) && defined(slug.current)] | order(dataDoAlbum desc, _createdAt desc) [0...6] {
    _id, titulo, slug, imagemDeCapa{alt, asset->}
  },
  "paginaSobre": *[_type == "paginaSobre"][0] {
    _id, titulo, imagemPrincipal{alt, asset->}
  }
}`;

// Função assíncrona para buscar os dados no servidor (Server Component)
async function getHomePageData(): Promise<HomePageData> {
  const client = getClient();
  try {
    const data: HomePageData = await client.fetch(homePageDataQuery, {
      hojeISO,
    });
    console.log('Server - Dados da paginaSobre do Sanity:', data.paginaSobre); // Mantido para debug

    return data;
  } catch (error) {
    console.error(
      'Erro ao buscar dados para a Home Page (Server Component):',
      error
    );
    return {
      ultimasNoticias: [],
      proximaCorrida: null,
      teaserAlbuns: [],
      paginaSobre: null,
    };
  }
}

// O componente principal da página agora é 'async' e renderizado no servidor
export default async function HomePage() {
  const homeData = await getHomePageData(); // Busca os dados no servidor
  const { ultimasNoticias, proximaCorrida, teaserAlbuns, paginaSobre } =
    homeData;

  // RE-INTRODUZIDA A CÁLCULO DA URL DA IMAGEM AQUI (NO SERVER COMPONENT)
  const imageUrlPrincipal =
    paginaSobre?.imagemPrincipal && isValidImage(paginaSobre.imagemPrincipal)
      ? getImageUrl(paginaSobre.imagemPrincipal, 1200) // Calcula a URL da imagem no servidor
      : null;

  // Log para verificar a URL final antes de passar para o Client Component
  console.log(
    'Server - imageUrlPrincipal after calculation (page.tsx):',
    imageUrlPrincipal
  );

  return (
    <div className='bg-black text-white'>
      {/* Hero Section - Agora é um Client Component dedicado */}
      {/* PASSANDO AS PROPS NECESSÁRIAS AQUI */}
      <HeroSection
        paginaSobre={paginaSobre}
        imageUrlPrincipal={imageUrlPrincipal}
      />

      {/* Seção de Últimas Notícias - Agora é um Client Component dedicado */}
      {ultimasNoticias && ultimasNoticias.length > 0 && (
        <LatestNewsSection ultimasNoticias={ultimasNoticias} />
      )}

      {/* Seção Próxima Corrida (se houver um componente Client para isso, adapte o import) */}
      {/* Você pode passar 'proximaCorrida' para um Client Component se ele tiver contagem regressiva ou outras interações */}
      {/* Ex: {proximaCorrida && <ProximaCorridaCountdown proximaCorrida={proximaCorrida} />} */}

      {/* Seção Galeria - Já é Client Component */}
      <HomeGaleriaSection />
    </div>
  );
}
