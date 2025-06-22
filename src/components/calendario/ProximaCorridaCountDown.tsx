// src/components/calendario/ProximaCorridaCountDown.tsx
'use client';

import type { CountdownUnitProps } from '@/types/sanity';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { memo, useEffect, useMemo, useState } from 'react';

// --- INTERFACES E COMPONENTES AUXILIARES ---
interface ProximaCorridaCountdownProps {
  proximaCorrida?: {
    _id: string;
    nomeDoEvento: string;
    dataDoEvento: string;
    circuito?: string;
    cidade: string;
  } | null;
}

const CountdownUnit = ({
  value,
  label,
}: Pick<CountdownUnitProps, 'value' | 'label'>) => (
  <div className='relative'>
    <div className='relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40'>
      <div className='absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl sm:rounded-2xl backdrop-blur-xl border border-white/10'>
        <div className='relative h-full flex flex-col items-center justify-center'>
          {/* ✅ AJUSTE: Tamanho máximo reduzido e gradiente de cor suavizado */}
          <span className='text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-400'>
            {String(value).padStart(2, '0')}
          </span>
          <span className='text-xs sm:text-xs md:text-sm lg:text-base text-gray-400 uppercase tracking-wider mt-1'>
            {label}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
const ProximaCorridaCountdown = ({
  proximaCorrida,
}: ProximaCorridaCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  const eventData = useMemo(() => {
    if (proximaCorrida?.dataDoEvento) {
      return {
        nome: proximaCorrida.nomeDoEvento,
        data: proximaCorrida.dataDoEvento,
        circuito: proximaCorrida.circuito,
        cidade: proximaCorrida.cidade,
      };
    }
    return null;
  }, [proximaCorrida]);

  useEffect(() => {
    if (!eventData?.data) return;

    const eventTime = new Date(eventData.data).getTime();
    if (isNaN(eventTime)) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = eventTime - now;

      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutos: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventData]);

  if (!eventData) {
    return (
      <section className='relative py-24 md:py-32 overflow-hidden'>
        <div className='container mx-auto px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className='inline-block text-6xl md:text-7xl mb-6'
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              🏁
            </motion.div>
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
              Aguardando Próximas Etapas
            </h2>
            <p className='text-lg text-gray-400 max-w-2xl mx-auto mb-8'>
              O calendário da temporada está sendo finalizado. Fique de olho
              para não perder nenhuma novidade e confira os resultados das
              corridas anteriores.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href='/calendario'
                className='inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-full font-semibold transition-all duration-300'
              >
                <span>Ver Calendário Completo</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className='relative py-16 md:py-24 overflow-hidden'>
      <div className='relative z-10 container mx-auto px-4'>
        <motion.div
          className='text-center mb-12 md:mb-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* ✅ AJUSTE: Tamanho e cor do título ajustados */}
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-black mb-4'>
            <span className='bg-gradient-to-r from-blue-400 to-orange-400 text-transparent bg-clip-text'>
              {eventData.nome}
            </span>
          </h2>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-gray-400'>
            <div className='flex items-center gap-2'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
              <span className='text-base md:text-lg'>{eventData.circuito}</span>
            </div>
            {eventData.cidade && (
              <>
                <span className='hidden sm:block text-gray-600'>•</span>
                <span className='text-base md:text-lg'>{eventData.cidade}</span>
              </>
            )}
          </div>
        </motion.div>

        <div className='flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8 my-12'>
          <CountdownUnit value={timeLeft.dias} label='Dias' />
          <CountdownUnit value={timeLeft.horas} label='Horas' />
          <CountdownUnit value={timeLeft.minutos} label='Minutos' />
          <CountdownUnit value={timeLeft.segundos} label='Segundos' />
        </div>

        <div className='max-w-4xl mx-auto'>
          <div className='relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-1'>
            <div className='relative bg-black rounded-3xl p-6 md:p-8 lg:p-12'>
              <div className='aspect-video rounded-2xl bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative overflow-hidden'>
                <div className='text-center z-10'>
                  <p className='text-gray-500 text-lg mb-2'>Mapa do Circuito</p>
                  <p className='text-gray-600 text-sm'>Em breve</p>
                </div>
              </div>
              <div className='flex flex-col sm:flex-row gap-4 mt-6 md:mt-8 justify-center'>
                <Link
                  href='/calendario'
                  className='inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 border-2 border-gray-600 text-gray-300 hover:border-orange-500 hover:text-orange-400 rounded-full font-bold uppercase tracking-wider transition-all duration-300 text-sm md:text-base'
                >
                  <span>Ver Calendário Completo</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(ProximaCorridaCountdown);
