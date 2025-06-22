// src/components/home/HeroSection.tsx
'use client'; // Este componente precisa ser Client Component por usar hooks e framer-motion

import type { PaginaSobreData } from '@/types/sanity'; // Importar tipos
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image'; // Importar Image do Next.js
import Link from 'next/link'; // Importar Link do Next.js
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  paginaSobre?: PaginaSobreData | null;
  imageUrlPrincipal: string | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  paginaSobre,
  imageUrlPrincipal,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false); // Para controlar hidratação
  const { scrollY } = useScroll();

  // Parallax effects - só ativados no cliente
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Garantir que está no cliente para evitar erro de hidratação
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Só adicionar listener se estiver no cliente
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      // FÓRMULA DO ORIGINAL VITE - Movimento mais sutil e contido
      const x = (e.clientX / window.innerWidth - 0.5) * 10; // Era * 20, agora * 10
      const y = (e.clientY / window.innerHeight - 0.5) * 10; // Era * 20, agora * 10
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isClient]);

  console.log(
    'URL da imagem principal recebida no HeroSection:',
    imageUrlPrincipal
  );

  return (
    <section className='relative min-h-screen flex items-center overflow-hidden pt-8'>
      {/* Background Effects */}
      <div className='absolute inset-0'>
        {/* Animated gradient background */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-orange-900/20' />

        {/* Animated orbs */}
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

        {/* Grid pattern */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]' />
      </div>

      <div className='container mx-auto px-4 relative z-10'>
        <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
          {/* Text Content - AJUSTADO PARA FICAR MAIS COMPACTO COMO O ORIGINAL */}
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

            {/* TÍTULO AJUSTADO - Tamanhos aumentados para ficar igual ao original */}
            <h1 className='font-heading text-5xl md:text-6xl lg:text-7xl font-black mb-3 leading-tight'>
              <span className='block text-white'>
                {paginaSobre?.titulo?.split(' ')[0] || 'Lucas'}
              </span>
              <span className='block bg-gradient-to-r from-blue-400 to-orange-400 text-transparent bg-clip-text'>
                {paginaSobre?.titulo?.split(' ').slice(1).join(' ') ||
                  'Foresti'}
              </span>
              {/* NÚMERO #12 AJUSTADO - Tamanho aumentado para ficar igual ao original */}
              <motion.span
                className='block text-transparent text-5xl md:text-6xl lg:text-7xl font-black mt-1'
                style={{
                  WebkitTextStroke: '2px rgba(59, 130, 246, 0.3)',
                  // Só aplicar transform se estiver no cliente
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

            {/* DESCRIÇÃO - Tamanho aumentado */}
            <p className='text-xl text-gray-300 leading-relaxed mb-6 max-w-xl'>
              Velocidade, paixão e determinação. Acompanhe a jornada de um dos
              talentos da Stock Car brasileira em busca da excelência nas
              pistas.
            </p>

            {/* BOTÕES AJUSTADOS PARA FICAR IGUAL AO ORIGINAL */}
            <motion.div
              className='flex flex-col sm:flex-row gap-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {/* Botão Últimas Notícias - Estilo do original */}
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

              {/* Botão Conheça a História - Estilo do original */}
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

          {/* Image - AJUSTADA PARA FICAR IGUAL AO ORIGINAL */}
          {imageUrlPrincipal && (
            <motion.div
              className='relative lg:ml-8'
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                // Só aplicar transform se estiver no cliente
                transform: isClient
                  ? `translate(${mousePosition.x * 0.5}px, ${
                      mousePosition.y * 0.5
                    }px)`
                  : 'translate(0px, 0px)',
              }}
            >
              <div className='relative max-w-lg mx-auto lg:max-w-none'>
                {/* Glow effect */}
                <div className='absolute -inset-4 bg-gradient-to-r from-blue-500 to-orange-500 rounded-3xl opacity-20 blur-2xl' />

                {/* Main image container - PROPORÇÃO AJUSTADA */}
                <div className='relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]'>
                  <Image
                    src={imageUrlPrincipal}
                    alt={
                      paginaSobre?.imagemPrincipal?.alt ||
                      paginaSobre?.titulo ||
                      'Lucas Foresti'
                    }
                    fill
                    className='object-cover object-center'
                    priority
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw'
                  />

                  {/* Overlay gradient */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />

                  {/* Racing elements overlay */}
                  <div className='absolute top-6 right-6'>
                    <motion.div
                      className='text-6xl lg:text-8xl font-black text-white/10 leading-none'
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      12
                    </motion.div>
                  </div>

                  {/* Stock Car badge */}
                  <div className='absolute bottom-6 left-6'>
                    <div className='px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20'>
                      <span className='text-white font-semibold text-sm uppercase tracking-wider'>
                        Stock Car Pro Series
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating elements - AJUSTADOS */}
                <motion.div
                  className='absolute -top-4 -right-4 w-16 h-16 lg:w-20 lg:h-20 bg-blue-500/20 backdrop-blur-md rounded-full flex items-center justify-center'
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <svg
                    className='w-8 h-8 lg:w-10 lg:h-10 text-blue-400'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z' />
                  </svg>
                </motion.div>

                {/* Speed lines - AJUSTADAS */}
                <motion.div
                  className='absolute -left-2 top-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent to-blue-400'
                  animate={{ x: [0, 20, 0], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className='absolute -left-2 top-1/2 mt-3 w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-400'
                  animate={{ x: [0, 15, 0], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                />
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
        // Só aplicar opacity transform se estiver no cliente
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

      {/* Speed Lines Effect */}
      <motion.div
        className='absolute bottom-0 left-0 right-0 h-32 z-10'
        // Só aplicar y transform se estiver no cliente
        style={{ y: isClient ? y1 : 0 }}
      >
        <div className='h-full bg-gradient-to-t from-black to-transparent' />
      </motion.div>
    </section>
  );
};

export default HeroSection;
