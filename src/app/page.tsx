// src/app/page.tsx
// Este arquivo agora é um Server Component por padrão (sem 'use client')

import { getClient, getImageUrl, isValidImage } from '@/lib/sanity.client';
import type {
  NoticiaCard,
  PaginaSobreData,
  SanityImageObject,
  SanitySlug,
} from '@/types/sanity';
import { Metadata } from 'next';

// Importar os Client Components encapsulados
import ProximaCorridaCountdown from '@/components/calendario/ProximaCorridaCountDown';
import HomeGaleriaSection from '@/components/galeria/HomeGaleriaSection';
import HeroSection from '@/components/home/HeroSection';
import LatestNewsSection from '@/components/home/LatestNewsSection';

export const metadata: Metadata = {
  title: 'Lucas Foresti - Piloto Stock Car | Website Oficial',
  description:
    'Acompanhe a carreira, notícias, calendário e galeria de fotos de Lucas Foresti, piloto da Stock Car Pro Series.',
};

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

async function getHomePageData(): Promise<HomePageData> {
  const client = getClient();
  try {
    const data: HomePageData = await client.fetch(homePageDataQuery, {
      hojeISO,
    });

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

export default async function HomePage() {
  const homeData = await getHomePageData();
  const { ultimasNoticias, proximaCorrida, paginaSobre } = homeData;

  const imageUrlPrincipal =
    paginaSobre?.imagemPrincipal && isValidImage(paginaSobre.imagemPrincipal)
      ? getImageUrl(paginaSobre.imagemPrincipal, 1200)
      : null;

  return (
    // ✅ CORREÇÃO: Aplicado o mesmo padrão de grade do HeroSection ao container principal da página
    <div className='bg-black text-white bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]'>
      <HeroSection
        paginaSobre={paginaSobre}
        imageUrlPrincipal={imageUrlPrincipal}
      />

      {ultimasNoticias && ultimasNoticias.length > 0 && (
        <LatestNewsSection ultimasNoticias={ultimasNoticias} />
      )}

      <ProximaCorridaCountdown proximaCorrida={proximaCorrida} />

      <HomeGaleriaSection />
    </div>
  );
}
