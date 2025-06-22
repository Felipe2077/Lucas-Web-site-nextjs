// src/app/galeria/[slug]/GaleriaAlbumPageClient.tsx
'use client'; // ✅ Client Component - Lightbox, estado, interações

import { getImageUrl, isValidImage } from '@/lib/sanity.client';
import type { SanityImageObject, SanitySlug } from '@/types/sanity';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

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

interface GaleriaAlbumPageClientProps {
  album: AlbumDetalhado | null;
  slug: string;
}

export default function GaleriaAlbumPageClient({
  album,
  slug,
}: GaleriaAlbumPageClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Se álbum não encontrado
  if (!album) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <h1 className='font-heading text-3xl font-bold mb-4'>
          Álbum não encontrado
        </h1>
        <Link href='/galeria' className='text-piloto-blue hover:underline'>
          &larr; Voltar para a galeria
        </Link>
      </div>
    );
  }

  const dataFormatada = album.dataDoAlbum
    ? new Date(album.dataDoAlbum + 'T00:00:00').toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : null;

  const slides =
    album.fotos
      ?.map((foto) => {
        const imgSrc = isValidImage(foto)
          ? getImageUrl(foto, 1200)
          : '/img/placeholder-image.png';
        return {
          src: imgSrc,
          alt: foto.alt || foto.legenda || album.titulo,
          title: foto.legenda,
          width: foto.asset?.metadata?.dimensions?.width,
          height: foto.asset?.metadata?.dimensions?.height,
        };
      })
      .filter((slide) => slide.src !== '/img/placeholder-image.png') || [];

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className='container mx-auto px-4 py-8 md:py-12'>
        <header className='mb-8 md:mb-12 text-center'>
          <h1 className='font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-2'>
            {album.titulo}
          </h1>
          {dataFormatada && (
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {dataFormatada}
            </p>
          )}
          {album.descricao && (
            <p className='mt-2 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto'>
              {album.descricao}
            </p>
          )}
        </header>

        {album.fotos && album.fotos.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4'>
            {album.fotos.map((foto, index) => {
              const thumbnailUrl = isValidImage(foto)
                ? getImageUrl(foto, 300, 300)
                : '/img/placeholder-image.png';

              return (
                <div
                  key={foto._key}
                  className='group relative aspect-square rounded-md overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow'
                  onClick={() => handleImageClick(index)}
                >
                  {thumbnailUrl !== '/img/placeholder-image.png' ? (
                    <Image
                      src={thumbnailUrl}
                      alt={
                        foto.alt ||
                        foto.legenda ||
                        `Foto do álbum ${album.titulo}`
                      }
                      fill
                      sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
                      style={{ objectFit: 'cover' }}
                      className='group-hover:scale-105 transition-transform duration-300 ease-in-out'
                      loading='lazy'
                    />
                  ) : (
                    <div className='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                      <span className='text-gray-500 text-xs'>
                        Imagem Indisponível
                      </span>
                    </div>
                  )}
                  {foto.legenda && (
                    <div className='absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-60 text-white text-[10px] sm:text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center truncate'>
                      {foto.legenda}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className='text-center text-gray-500 dark:text-gray-300'>
            Nenhuma foto neste álbum.
          </p>
        )}

        {slides.length > 0 && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            slides={slides}
            index={lightboxIndex}
            plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
            zoom={{
              maxZoomPixelRatio: 3,
              zoomInMultiplier: 1.5,
              doubleTapDelay: 300,
            }}
            thumbnails={{
              vignette: false,
              showToggle: true,
              position: 'bottom',
            }}
          />
        )}

        <div className='mt-12 text-center'>
          <Link
            href='/galeria'
            className='text-piloto-blue hover:underline font-semibold'
          >
            &larr; Voltar para todos os álbuns
          </Link>
        </div>
      </div>
    </>
  );
}
