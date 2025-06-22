// src/components/noticias/CardNoticia.tsx
'use client'; // Necessário para useState e Framer Motion

import { getClient } from '@/lib/sanity.client'; // Ajuste o caminho com alias
import type {
  NoticiaCard as NoticiaCardType,
  SanityImageObject,
} from '@/types/sanity'; // Ajuste o caminho com alias
import { motion } from 'framer-motion';
import Image from 'next/image'; // Importar componente Image do Next.js
import Link from 'next/link'; // Usar Link do Next.js
import { useState } from 'react';

// Configura o builder de URL de imagem do Sanity
import imageUrlBuilder from '@sanity/image-url'; // Importado aqui, mas idealmente centralizado

const client = getClient();
const builder = imageUrlBuilder(client);

function urlFor(
  source: SanityImageObject | null | undefined
): ReturnType<typeof builder.image> | null {
  if (!source || (!source.asset && !source._ref)) {
    return null;
  }
  try {
    return builder.image(source);
  } catch (error) {
    console.error(
      'Erro no builder.image(source) no CardNoticiaModern:',
      error,
      'Source:',
      source
    );
    return null;
  }
}

// Helper para obter URL de imagem otimizada para `next/image`
// Esta função é uma adaptação local, mas é ideal que venha de um utilitário global (`@/lib/sanity.client` ou `@/lib/imageUtils`)
function getOptimizedImageUrl(
  source: SanityImageObject | null | undefined,
  width: number,
  height: number,
  quality: number = 75
): string | null {
  const imageBuilder = urlFor(source);
  if (!imageBuilder) return null;

  try {
    return imageBuilder
      .width(width)
      .height(height)
      .auto('format')
      .quality(quality)
      .url();
  } catch (error) {
    console.warn('⚠️ Erro ao gerar URL de imagem otimizada:', error);
    return null;
  }
}

interface CardNoticiaModernProps {
  noticia: NoticiaCardType;
  index?: number; // ✅ Adicionar esta linha
}

const CardNoticiaModern: React.FC<CardNoticiaModernProps> = ({
  noticia,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Se 'noticia' for null ou undefined, podemos retornar um placeholder ou nada
  if (!noticia) {
    // Você pode querer um card de fallback ou skeleton aqui
    return (
      <div className='h-full bg-neutral-800 rounded-2xl p-6 text-center text-neutral-400'>
        Carregando notícia...
      </div>
    );
  }

  // Extraindo dados da prop 'noticia'
  const {
    titulo,
    resumo,
    dataDePublicacao,
    imagemDeCapa, // Este é SanityImageObject, tem 'alt' e 'asset'
    slug,
    categorias, // Assumindo que é Array<{ nome?: string }> ou similar
  } = noticia;

  const dataFormatada = dataDePublicacao
    ? new Date(dataDePublicacao).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short', // 'short' para ex: 'jun'
        year: 'numeric',
        timeZone: 'UTC',
      })
    : 'Data Indisponível';

  // Usar a função getOptimizedImageUrl para src do Next.js Image
  const imageUrl =
    getOptimizedImageUrl(imagemDeCapa, 800, 600, 80) ||
    'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=800&q=80';

  const categoriaDisplay =
    categorias && categorias.length > 0 && categorias[0].nome
      ? categorias[0].nome.toUpperCase()
      : 'NOTÍCIA'; // Fallback

  const tempoLeituraPlaceholder = '3 min'; // Manter como placeholder ou remover

  // Construindo o href para o link "Leia mais"
  const linkNoticia = slug?.current ? `/noticias/${slug.current}` : '#';

  return (
    <motion.article
      className='group relative h-full flex flex-col'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className='relative h-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-500 shadow-xl group-hover:shadow-blue-500/25'>
        {/* Glow Effect */}
        <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 pointer-events-none' />

        {/* Image Container */}
        <div className='relative h-56 overflow-hidden'>
          <Link href={linkNoticia}>
            {' '}
            {/* Alterado 'to' para 'href' */}
            {imageUrl ? (
              <motion.div // Mantém motion.div para as animações de escala
                className='w-full h-full'
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.6, ease: 'circOut' }}
              >
                <Image // Usar Next.js Image
                  src={imageUrl}
                  alt={imagemDeCapa?.alt || titulo || 'Imagem da notícia'}
                  fill // Preenche o container pai
                  sizes='(max-width: 768px) 100vw, 33vw' // Otimiza o carregamento responsivo
                  style={{ objectFit: 'cover' }} // Para que a imagem cubra o espaço
                  priority={index === 0} // Carrega a primeira imagem de card mais cedo
                />
              </motion.div>
            ) : (
              <div className='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                <span className='text-gray-500 text-sm'>Sem capa</span>
              </div>
            )}
          </Link>
          {/* Overlay Gradient */}
          <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent pointer-events-none' />
          {/* Category Badge */}
          {categoriaDisplay && ( // Exibir apenas se houver categoria
            <motion.div
              className='absolute top-4 left-4 z-10'
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            >
              <span className='px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-md'>
                {categoriaDisplay}
              </span>
            </motion.div>
          )}
          {/* Date & Time */}
          <div className='absolute bottom-4 left-4 flex items-center gap-2 text-white/80 text-xs z-10'>
            <span>{dataFormatada}</span>
            <span className='w-1 h-1 bg-white/60 rounded-full' />
            <span>{tempoLeituraPlaceholder} de leitura</span>
          </div>
        </div>

        {/* Content */}
        <div className='p-5 md:p-6 space-y-3 flex-grow flex flex-col'>
          <motion.h3 className='text-xl font-bold text-white leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors duration-300'>
            <Link href={linkNoticia}>{titulo}</Link>{' '}
            {/* Alterado 'to' para 'href' */}
          </motion.h3>
          {resumo && ( // Exibir resumo apenas se existir
            <p className='text-gray-400 text-sm leading-relaxed line-clamp-3 flex-grow'>
              {resumo}
            </p>
          )}
          {/* CTA */}
          <motion.div
            className='pt-3 mt-auto'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link // Usando Link do Next.js
              href={linkNoticia} // Alterado 'to' para 'href'
              className='group/link inline-flex items-center gap-1.5 text-blue-400 font-semibold text-sm hover:text-orange-400 transition-colors duration-300'
            >
              <span>Leia mais</span>
              <motion.svg
                className='w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 8l4 4m0 0l-4 4m4-4H3'
                />
              </motion.svg>
            </Link>
          </motion.div>
        </div>

        {/* Interactive Border Effect */}
        <motion.div
          className='absolute inset-0 border-2 border-transparent rounded-2xl pointer-events-none'
          animate={{
            borderColor: isHovered ? 'rgba(59, 130, 246, 0.5)' : 'transparent',
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Corner Accents */}
        <div className='absolute top-0 left-0 w-16 h-16 md:w-20 md:h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'>
          <div className='absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-transparent' />
          <div className='absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-blue-500 to-transparent' />
        </div>
        <div className='absolute bottom-0 right-0 w-16 h-16 md:w-20 md:h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'>
          <div className='absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-orange-500 to-transparent' />
          <div className='absolute bottom-0 right-0 h-full w-0.5 bg-gradient-to-t from-orange-500 to-transparent' />
        </div>
      </div>
    </motion.article>
  );
};

export default CardNoticiaModern;
