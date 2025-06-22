// src/components/home/HeroSection.tsx
'use client';

import type { PaginaSobreData } from '@/types/sanity';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface HeroSectionProps {
  paginaSobre?: PaginaSobreData | null;
  imageUrlPrincipal: string | null;
}

const HeroSection: React.FC<HeroSectionProps> = memo(
  ({ paginaSobre, imageUrlPrincipal }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isClient, setIsClient] = useState(false);
    const { scrollY } = useScroll();

    const lastMouseMoveRef = useRef<number>(0);

    const y1 = useTransform(scrollY, [0, 1000], [0, 150]);
    const opacity = useTransform(scrollY, [0, 800], [1, 0]);

    const titleData = useMemo(() => {
      const fullTitle = paginaSobre?.titulo || 'Lucas Foresti';
      const words = fullTitle.split(' ');
      return {
        firstName: words[0] || 'Lucas',
        lastName: words.slice(1).join(' ') || 'Foresti',
      };
    }, [paginaSobre?.titulo]);

    const imageAlt = useMemo(
      () =>
        paginaSobre?.imagemPrincipal?.alt ||
        paginaSobre?.titulo ||
        'Lucas Foresti',
      [paginaSobre?.imagemPrincipal?.alt, paginaSobre?.titulo]
    );

    useEffect(() => {
      setIsClient(true);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseMoveRef.current < 16) return;
      lastMouseMoveRef.current = now;

      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      setMousePosition({ x, y });
    }, []);

    useEffect(() => {
      if (!isClient) return;

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isClient, handleMouseMove]);

    return (
      // ✅ AJUSTE: Adicionado padding inferior (pb-24) para dar espaço no mobile.
      <section className='relative min-h-screen flex items-center overflow-hidden pt-8 pb-24 sm:pb-16'>
        {/* Background Effects */}
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-orange-900/20' />

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

          <div className='absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]' />
        </div>

        <div className='container mx-auto px-4 relative z-10'>
          <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ opacity: isClient ? opacity : 1 }}
            >
              <motion.div
                className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full mb-4'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', delay: 0.2 }}
              >
                <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
                <span className='text-blue-400 font-semibold uppercase tracking-wider text-sm'>
                  Piloto Stock Car
                </span>
              </motion.div>

              <h1 className='font-heading text-5xl md:text-6xl lg:text-7xl font-black mb-3 leading-none'>
                <span className='block text-white'>{titleData.firstName}</span>
                <span className='block bg-gradient-to-r from-blue-400 to-orange-400 text-transparent bg-clip-text'>
                  {titleData.lastName}
                </span>
                <motion.span
                  className='block text-transparent text-5xl md:text-6xl lg:text-8xl font-black mt-1'
                  style={{
                    WebkitTextStroke: '2px rgba(59, 130, 246, 0.3)',
                    transform: isClient
                      ? `translate(${mousePosition.x}px, ${mousePosition.y}px)`
                      : 'translate(0px, 0px)',
                  }}
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.3)',
                      '0 0 40px rgba(59, 130, 246, 0.6)',
                      '0 0 20px rgba(59, 130, 246, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  #12
                </motion.span>
              </h1>

              <p className='text-xl text-gray-300 leading-relaxed mb-6 max-w-xl'>
                Velocidade, paixão e determinação. Acompanhe a jornada de um dos
                talentos da Stock Car brasileira em busca da excelência nas
                pistas.
              </p>

              <motion.div
                className='flex flex-col sm:flex-row gap-4'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href='/noticias'
                    className='inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25'
                  >
                    <span>Últimas Notícias</span>
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
                        d='M17 8l4 4m0 0l-4 4m4-4H3'
                      />
                    </svg>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href='/sobre'
                    className='inline-flex items-center gap-2 px-8 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-full font-semibold transition-all duration-300'
                  >
                    <span>Conheça a História</span>
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
                        d='M17 8l4 4m0 0l-4 4m4-4H3'
                      />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Image */}
            {imageUrlPrincipal && (
              <motion.div
                className='relative lg:ml-8'
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  transform: isClient
                    ? `translate(${mousePosition.x * 0.5}px, ${
                        mousePosition.y * 0.5
                      }px)`
                    : 'translate(0px, 0px)',
                }}
              >
                <div className='relative max-w-lg mx-auto lg:max-w-none'>
                  <div className='absolute -inset-4 bg-gradient-to-r from-blue-500 to-orange-500 rounded-3xl opacity-20 blur-2xl' />

                  <div className='relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]'>
                    <Image
                      src={imageUrlPrincipal}
                      alt={imageAlt}
                      fill
                      className='object-cover object-center'
                      priority
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw'
                    />

                    <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />

                    <div className='absolute top-6 right-6'>
                      <motion.div
                        className='text-6xl lg:text-8xl font-black text-white/10 leading-none'
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        12
                      </motion.div>
                    </div>

                    <div className='absolute bottom-6 left-6'>
                      <div className='px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20'>
                        <span className='text-white font-semibold text-sm uppercase tracking-wider'>
                          Stock Car Pro Series
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ opacity: isClient ? opacity : 1 }}
        >
          <div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center'>
            <motion.div
              className='w-1 h-3 bg-blue-400 rounded-full mt-2'
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.div
          className='absolute bottom-0 left-0 right-0 h-32 z-10'
          style={{ y: isClient ? y1 : 0 }}
        >
          <div className='h-full bg-gradient-to-t from-black to-transparent' />
        </motion.div>
      </section>
    );
  }
);

HeroSection.displayName = 'HeroSection';

export default HeroSection;
