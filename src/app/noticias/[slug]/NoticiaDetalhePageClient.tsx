// src/app/noticias/[slug]/NoticiaDetalhePageClient.tsx
'use client'; // Client Component para usar motion e hooks

import { getImageUrl, isValidImage } from '@/lib/sanity.client';
import type { NoticiaDetalhada, SanityImageObject } from '@/types/sanity';
import {
  PortableText,
  type PortableTextComponentProps,
} from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';

interface NoticiaDetalhePageClientProps {
  noticia: NoticiaDetalhada;
}

export default function NoticiaDetalhePageClient({
  noticia,
}: NoticiaDetalhePageClientProps) {
  const [readingProgress, setReadingProgress] = useState(0);

  // Reading progress bar
  useEffect(() => {
    const updateReadingProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const windowHeight = scrollHeight - clientHeight;
      const progress = (scrollTop / windowHeight) * 100;

      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  // Componentes customizados para PortableText
  const PortableTextContent = ({ value }: { value: PortableTextBlock[] }) => {
    const PortableTextComponentsInner = {
      types: {
        image: ({
          value,
        }: {
          value: SanityImageObject & {
            alt?: string;
            isInline?: boolean;
            legenda?: string;
          };
        }) => {
          if (!isValidImage(value)) {
            return null;
          }
          const imageUrl = getImageUrl(value, 800);
          if (!imageUrl) return null;

          return (
            <figure
              className={`my-12 ${
                value.isInline ? 'inline-block max-w-md mx-4' : 'w-full'
              }`}
            >
              <div className='relative group overflow-hidden rounded-2xl shadow-2xl'>
                <Image
                  src={imageUrl}
                  alt={value.alt || noticia?.titulo || 'Imagem do conteúdo'}
                  width={800}
                  height={600}
                  className={`w-full transition-transform duration-500 group-hover:scale-105 ${
                    value.isInline ? 'max-w-xs' : ''
                  }`}
                  loading='lazy'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              </div>
              {value.legenda && (
                <figcaption className='text-center text-gray-500 dark:text-gray-400 mt-4 italic font-medium'>
                  {value.legenda}
                </figcaption>
              )}
            </figure>
          );
        },
      },
      marks: {
        link: ({
          children,
          value,
        }: {
          children: ReactNode;
          value?: { href?: string; blank?: boolean };
        }) => {
          const href = value?.href;
          const isExternal =
            value?.blank ||
            (href && !href.startsWith('/') && !href.startsWith('#'));
          if (
            isExternal ||
            (href &&
              (href.startsWith('http://') || href.startsWith('https://')))
          ) {
            return (
              <a
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 hover:text-blue-400 underline decoration-blue-500/50 hover:decoration-blue-400 transition-all duration-300 font-medium hover:bg-blue-500/10 px-1 py-0.5 rounded'
              >
                {children}
              </a>
            );
          }
          return href ? (
            <Link
              href={href}
              className='text-blue-500 hover:text-blue-400 underline decoration-blue-500/50 hover:decoration-blue-400 transition-all duration-300 font-medium hover:bg-blue-500/10 px-1 py-0.5 rounded'
            >
              {children}
            </Link>
          ) : (
            <>{children}</>
          );
        },
        strong: ({ children }: { children?: ReactNode }) => (
          <strong className='font-bold text-white bg-gradient-to-r from-blue-500/20 to-orange-500/20 px-1 py-0.5 rounded'>
            {children}
          </strong>
        ),
        em: ({ children }: { children?: ReactNode }) => (
          <em className='italic text-blue-400'>{children}</em>
        ),
      },
      block: {
        h2: (props: PortableTextComponentProps<PortableTextBlock>) => (
          <h2 className='text-3xl md:text-4xl font-bold mt-16 mb-8 text-white'>
            <span className='bg-gradient-to-r from-blue-400 to-orange-400 text-transparent bg-clip-text'>
              {props.children}
            </span>
          </h2>
        ),
        h3: (props: PortableTextComponentProps<PortableTextBlock>) => (
          <h3 className='text-2xl md:text-3xl font-semibold mt-12 mb-6 text-gray-100'>
            {props.children}
          </h3>
        ),
        h4: (props: PortableTextComponentProps<PortableTextBlock>) => (
          <h4 className='text-xl md:text-2xl font-medium mt-10 mb-4 text-gray-200'>
            {props.children}
          </h4>
        ),
        blockquote: (props: PortableTextComponentProps<PortableTextBlock>) => (
          <blockquote className='relative border-l-4 border-blue-400 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm pl-8 pr-6 py-6 italic my-12 rounded-r-2xl text-gray-200 font-medium text-lg leading-relaxed'>
            <div className='absolute top-4 left-4 text-blue-400/40 text-6xl font-serif leading-none'>
              "
            </div>
            <div className='relative z-10 mt-6'>{props.children}</div>
          </blockquote>
        ),
        normal: (props: PortableTextComponentProps<PortableTextBlock>) => (
          <p className='text-lg leading-8 text-gray-300 mb-6'>
            {props.children}
          </p>
        ),
      },
      list: {
        bullet: ({ children }: { children?: ReactNode }) => (
          <motion.ul
            className='list-none my-8 space-y-4'
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {children}
          </motion.ul>
        ),
        number: ({ children }: { children?: ReactNode }) => (
          <motion.ol
            className='list-none my-8 space-y-4'
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {children}
          </motion.ol>
        ),
      },
      listItem: {
        bullet: ({ children }: { children?: ReactNode }) => (
          <li className='flex items-start gap-4 text-gray-300 text-lg leading-relaxed'>
            <div className='w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0' />
            <span>{children}</span>
          </li>
        ),
        number: ({ children }: { children?: ReactNode }) => (
          <li className='flex items-start gap-4 text-gray-300 text-lg leading-relaxed'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0'>
              •
            </div>
            <span>{children}</span>
          </li>
        ),
      },
    };

    return (
      <div className='prose prose-xl prose-invert max-w-none'>
        <PortableText value={value} components={PortableTextComponentsInner} />
      </div>
    );
  };

  const dataPublicacao = noticia.dataPublicacao || noticia.dataDePublicacao;

  const dataFormatada = dataPublicacao
    ? new Date(dataPublicacao).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : 'Data não disponível';

  const horaFormatada = dataPublicacao
    ? new Date(dataPublicacao).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      })
    : '00:00';

  const imageUrlCapa =
    noticia.imagemDeCapa && isValidImage(noticia.imagemDeCapa)
      ? getImageUrl(noticia.imagemDeCapa, 1200)
      : null;

  const tempoLeitura = noticia.conteudo
    ? Math.ceil(JSON.stringify(noticia.conteudo).length / 1000)
    : 3;

  return (
    <>
      {/* Reading Progress Bar */}
      <motion.div
        className='fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-orange-500 z-50 origin-left'
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      <div className='min-h-screen bg-black text-white'>
        {/* Hero Section */}
        <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
          {imageUrlCapa && (
            <div className='absolute inset-0'>
              <Image
                src={imageUrlCapa}
                alt={
                  noticia.imagemDeCapa?.alt ||
                  `Imagem de capa para ${noticia.titulo}`
                }
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30' />
            </div>
          )}

          <div className='absolute inset-0'>
            <div className='absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]' />

            <motion.div
              className='absolute top-1/4 -left-40 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl'
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className='absolute bottom-1/4 -right-40 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl'
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className='container mx-auto px-4 relative z-10'>
            <motion.div
              className='max-w-4xl mx-auto text-center'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Breadcrumb */}
              <nav className='mb-8'>
                <ol className='flex justify-center items-center space-x-2 text-sm text-gray-400'>
                  <li>
                    <Link
                      href='/'
                      className='hover:text-blue-400 transition-colors'
                    >
                      Início
                    </Link>
                  </li>
                  <li>
                    <svg
                      className='w-4 h-4 mx-2'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </li>
                  <li>
                    <Link
                      href='/noticias'
                      className='hover:text-blue-400 transition-colors'
                    >
                      Notícias
                    </Link>
                  </li>
                  <li>
                    <svg
                      className='w-4 h-4 mx-2'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </li>
                  <li className='text-blue-400'>Artigo</li>
                </ol>
              </nav>

              {/* Categories */}
              {noticia.categorias && noticia.categorias.length > 0 && (
                <div className='flex justify-center flex-wrap gap-2 mb-6'>
                  {noticia.categorias.map((categoria) => (
                    <span
                      key={categoria._id}
                      className='px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-semibold rounded-full border border-blue-500/30'
                    >
                      {categoria.nome}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight'>
                {noticia.titulo}
              </h1>

              {/* Summary */}
              {noticia.resumo && (
                <p className='text-xl md:text-2xl text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto'>
                  {noticia.resumo}
                </p>
              )}

              {/* Meta info */}
              <div className='flex justify-center items-center gap-6 text-gray-400 text-sm'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z'
                    />
                  </svg>
                  <span>
                    {dataFormatada} às {horaFormatada}
                  </span>
                </div>
                <div className='w-1 h-1 bg-gray-500 rounded-full' />
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span>{tempoLeitura} min de leitura</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center'>
              <motion.div
                className='w-1 h-3 bg-blue-400 rounded-full mt-2'
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Content Section */}
        <section className='py-20 bg-gray-900'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl mx-auto'>
              {noticia.conteudo && (
                <PortableTextContent value={noticia.conteudo} />
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-16 bg-black border-t border-gray-800'>
          <div className='container mx-auto px-4'>
            <motion.div
              className='text-center'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className='text-2xl font-bold text-white mb-6'>
                Continue Acompanhando
              </h3>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link
                  href='/noticias'
                  className='group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300'
                >
                  <svg
                    className='w-5 h-5 group-hover:-translate-x-1 transition-transform'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M10 19l-7-7m0 0l7-7m-7 7h18'
                    />
                  </svg>
                  Todas as Notícias
                </Link>

                <Link
                  href='/calendario'
                  className='group inline-flex items-center gap-2 px-8 py-4 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-lg font-semibold transition-all duration-300'
                >
                  <span>Próximas Corridas</span>
                  <svg
                    className='w-5 h-5 group-hover:translate-x-1 transition-transform'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z'
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
