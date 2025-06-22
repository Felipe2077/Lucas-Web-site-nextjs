// src/app/galeria/[slug]/page.tsx
import { getClient } from '@/lib/sanity.client';
import type { SanityImageObject, SanitySlug } from '@/types/sanity';
import { Metadata } from 'next';
// Removido import { use } - não necessário para Server Components
import GaleriaAlbumPageClient from './GaleriaAlbumPageClient';

// --- Interfaces ---
interface SanityImageMetadata {
  dimensions: {
    width: number;
    height: number;
    aspectRatio: number;
  };
}

interface FotoDoAlbum extends SanityImageObject {
  legenda?: string;
  alt?: string;
  _key: string;
  asset: SanityImageObject['asset'] & {
    url?: string;
    metadata?: SanityImageMetadata;
  };
}

export interface AlbumDetalhado {
  _id: string;
  titulo: string;
  slug: SanitySlug;
  dataDoAlbum?: string;
  descricao?: string;
  fotos?: FotoDoAlbum[];
}

const albumDetalhadoQuery = `*[_type == "albumDeFotos" && slug.current == $slug][0]{
  _id,
  titulo,
  slug,
  dataDoAlbum,
  descricao,
  "fotos": fotos[]{
    _key,
    legenda,
    alt,
    asset->{
      _id,
      url,
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    }
  }
}`;

interface GaleriaAlbumPageProps {
  params: Promise<{ slug: string }>;
}

// ✅ Server Component - Busca dados e metadados
export async function generateMetadata({
  params,
}: GaleriaAlbumPageProps): Promise<Metadata> {
  const { slug } = await params; // ✅ await params em Server Component

  try {
    const client = getClient();
    const album: AlbumDetalhado | null = await client.fetch(
      albumDetalhadoQuery,
      { slug }
    );

    if (!album) {
      return {
        title: 'Álbum não encontrado - Galeria',
        description: 'Álbum não encontrado na galeria de fotos.',
      };
    }

    return {
      title: `${album.titulo} - Galeria de Fotos`,
      description: album.descricao || `Veja as fotos do álbum ${album.titulo}`,
    };
  } catch (error) {
    console.error('Erro ao buscar metadados do álbum:', error);
    return {
      title: 'Álbum - Galeria de Fotos',
      description: 'Galeria de fotos do piloto Lucas Foresti',
    };
  }
}

export default async function GaleriaAlbumPage({
  params,
}: GaleriaAlbumPageProps) {
  const { slug } = await params; // ✅ await params em Server Component

  let album: AlbumDetalhado | null = null;

  try {
    const client = getClient();
    album = await client.fetch(albumDetalhadoQuery, { slug });
  } catch (error) {
    console.error('Erro ao buscar detalhes do álbum:', error);
  }

  // ✅ Passa dados para Client Component
  return <GaleriaAlbumPageClient album={album} slug={slug} />;
}
