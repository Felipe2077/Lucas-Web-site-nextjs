// 'use client'; // Não é necessário para este componente puro

import { urlFor } from '@/lib/sanity.client'; // Alias ajustado
import type { SanityImageObject, SanitySlug } from '@/types/sanity'; // Alias ajustado
import Image from 'next/image'; // Importar Next.js Image
import Link from 'next/link'; // Importar Next.js Link

export interface AlbumParaCard {
  _id: string;
  titulo: string;
  slug: SanitySlug;
  imagemDeCapa?: SanityImageObject & { alt?: string };
  dataDoAlbum?: string;
  descricao?: string;
}

interface CardAlbumProps {
  album: AlbumParaCard;
}

const CardAlbum: React.FC<CardAlbumProps> = ({ album }) => {
  const { titulo, slug, imagemDeCapa, dataDoAlbum } = album;

  const dataFormatada = dataDoAlbum
    ? new Date(dataDoAlbum + 'T00:00:00').toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : null;

  const imageUrl = imagemDeCapa
    ? urlFor(imagemDeCapa)
        ?.width(450)
        .height(300)
        .auto('format')
        .quality(75)
        .url()
    : undefined;

  return (
    <Link
      href={`/galeria/${slug?.current}`} // Usar href no Next.js Link
      className='block group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-piloto-blue focus:ring-opacity-50'
    >
      <div className='relative aspect-w-4 aspect-h-3 w-full overflow-hidden'>
        {imageUrl ? (
          <Image // Usando Next.js Image
            src={imageUrl}
            alt={imagemDeCapa?.alt || `Capa do álbum ${titulo}`}
            fill // Para preencher o container com aspect-ratio
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            style={{ objectFit: 'cover' }}
            loading='lazy'
          />
        ) : (
          <div className='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
            <span className='text-gray-500 text-sm'>Sem capa</span>
          </div>
        )}
      </div>
      <div className='p-4 md:p-5'>
        <h3 className='font-heading text-lg md:text-xl font-semibold text-gray-800 dark:text-white group-hover:text-piloto-blue dark:group-hover:text-piloto-blue-light transition-colors truncate'>
          {titulo}
        </h3>
        {dataFormatada && (
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            {dataFormatada}
          </p>
        )}
      </div>
    </Link>
  );
};

export default CardAlbum;
