// src/components/home/LatestNewsSection.tsx
'use client'; // Este componente precisa ser Client Component por usar motion

import CardNoticia from '@/components/noticias/CardNoticia'; // Ajuste o alias se necessário
import type { NoticiaCard } from '@/types/sanity';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface LatestNewsSectionProps {
  ultimasNoticias: NoticiaCard[];
}

const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({
  ultimasNoticias,
}) => {
  return (
    <section className='py-16 md:py-24 bg-gradient-to-b from-black to-neutral-950'>
      <div className='container mx-auto px-4'>
        <motion.div
          className='text-center mb-12 md:mb-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full mb-6'
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
            <span className='text-blue-400 font-semibold uppercase tracking-wider text-sm'>
              Últimas Atualizações
            </span>
          </motion.div>

          <h2 className='font-heading text-4xl md:text-5xl font-bold mb-4 text-neutral-100'>
            Fique por <span className='text-blue-400'>Dentro</span>
          </h2>
          <p className='text-neutral-300 mb-12 md:mb-16 max-w-xl mx-auto text-lg'>
            As últimas novidades, resultados e bastidores do universo de Lucas
            Foresti na Stock Car.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {ultimasNoticias.map((noticia, index) => (
            <motion.div
              key={noticia._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <CardNoticia noticia={noticia} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className='mt-16 text-center'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link
            href='/noticias'
            className='group inline-flex items-center gap-2 px-8 py-4 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full font-semibold transition-all duration-300'
          >
            <span>Ver Todas as Notícias</span>
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
                d='M17 8l4 4m0 0l-4 4m4-4H3'
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestNewsSection;
