'use client'; // Necessário para useState e Framer Motion

import { getClient, urlFor } from '@/lib/sanity.client'; // Alias ajustado
import type { SanityImageObject } from '@/types/sanity'; // Alias ajustado
import { motion } from 'framer-motion';
import Image from 'next/image'; // Importar Next.js Image
import Link from 'next/link'; // Importar Next.js Link
import { useEffect, useState } from 'react';
// Importar Metadata do Next.js se fosse Server Component
// import { Metadata } from 'next';

// Interface para Patrocinador expandida
interface Patrocinador {
  _id: string;
  nome: string;
  categoria?: string;
  logo: SanityImageObject & { alt?: string };
  imagemDeFundo?: SanityImageObject & { alt?: string };
  descricaoCurta?: string;
  descricaoCompleta?: string;
  link?: string;
  ordem?: number;
  corGradiente?: string;
}

const patrocinadoresQuery = `*[_type == "patrocinador" && ativo == true]{
  _id,
  nome,
  categoria,
  logo{alt, asset->},
  imagemDeFundo{alt, asset->},
  descricaoCurta,
  descricaoCompleta,
  link,
  ordem,
  corGradiente
} | order(ordem asc, nome asc)`;

// Metadados estáticos para a página (se fosse Server Component)
// export const metadata: Metadata = {
//   title: `Patrocinadores - Lucas Foresti`,
//   description: `Conheça os patrocinadores e parceiros que apoiam o piloto Lucas Foresti na Stock Car.`,
// };

export default function PatrocinadoresPage() {
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Patrocinador | null>(
    null
  );
  const nomeDoPiloto = 'Lucas Foresti';

  useEffect(() => {
    const client = getClient();
    const fetchPatrocinadores = async () => {
      setLoading(true);
      try {
        const data: Patrocinador[] = await client.fetch(patrocinadoresQuery);
        setPatrocinadores(data);
      } catch (error) {
        console.error('Erro ao buscar patrocinadores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatrocinadores();
  }, []);

  // Atualiza o título da página dinamicamente
  useEffect(() => {
    document.title = `Patrocinadores - ${nomeDoPiloto}`;
    // Para meta description, seria necessário um Server Component
  }, [nomeDoPiloto]);

  const getGradientColor = (patrocinador: Patrocinador, index: number) => {
    if (patrocinador.corGradiente) {
      return patrocinador.corGradiente;
    }

    const defaultGradients = [
      'from-blue-600 to-blue-800',
      'from-orange-600 to-red-600',
      'from-purple-600 to-pink-600',
      'from-green-600 to-teal-600',
      'from-yellow-600 to-orange-600',
      'from-indigo-600 to-purple-600',
      'from-red-600 to-pink-600',
    ];

    return defaultGradients[index % defaultGradients.length];
  };

  return (
    <section className='py-20 bg-black overflow-hidden'>
      <div className='container mx-auto px-4'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full mb-6'
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
            <span className='text-blue-400 font-semibold uppercase tracking-wider text-sm'>
              Nossos Parceiros
            </span>
          </motion.div>

          <h1 className='text-5xl md:text-6xl font-black text-white mb-4'>
            <span className='bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text'>
              Patrocinadores
            </span>
          </h1>
          <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
            Empresas que acreditam na nossa jornada e fazem parte da nossa
            história na Stock Car
          </p>
        </motion.div>

        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className='h-80 bg-gray-800 rounded-2xl animate-pulse'
              />
            ))}
          </div>
        ) : patrocinadores && patrocinadores.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {patrocinadores.map((patrocinador, index) => {
              const logoBuilderInstance = patrocinador.logo
                ? urlFor(patrocinador.logo)
                : null;
              const logoSrc = logoBuilderInstance
                ? logoBuilderInstance
                    .height(100)
                    .fit('max')
                    .auto('format')
                    .quality(85)
                    .url()
                : '/img/placeholder-logo.png'; // Caminho para imagem local

              const backgroundBuilderInstance = patrocinador.imagemDeFundo
                ? urlFor(patrocinador.imagemDeFundo)
                : null;
              const backgroundSrc = backgroundBuilderInstance
                ? backgroundBuilderInstance
                    .width(800)
                    .height(600)
                    .auto('format')
                    .quality(80)
                    .url()
                : 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80';

              const gradientColor = getGradientColor(patrocinador, index);

              return (
                <motion.div
                  key={patrocinador._id}
                  className='group relative'
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredCard(patrocinador._id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div
                    className='relative h-80 rounded-2xl overflow-hidden cursor-pointer'
                    style={{
                      transform:
                        hoveredCard === patrocinador._id
                          ? 'rotateY(5deg) rotateX(-5deg) scale(1.02)'
                          : 'rotateY(0deg) rotateX(0deg) scale(1)',
                      transition:
                        'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                    onClick={() => setSelectedPartner(patrocinador)}
                  >
                    <div className='absolute inset-0'>
                      <Image // Usando Next.js Image
                        src={backgroundSrc}
                        alt={
                          patrocinador.imagemDeFundo?.alt ||
                          `${patrocinador.nome} background`
                        }
                        fill
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        style={{ objectFit: 'cover' }}
                        loading='lazy'
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${gradientColor} opacity-80`}
                      />
                      <div className='absolute inset-0 bg-black/40' />
                    </div>

                    <div className='absolute top-6 left-6 right-6'>
                      <div className='w-16 h-16 bg-white rounded-xl p-3 shadow-lg'>
                        <Image // Usando Next.js Image
                          src={logoSrc}
                          alt={
                            patrocinador.logo.alt || `Logo ${patrocinador.nome}`
                          }
                          width={64} // Ajuste de largura
                          height={64} // Ajuste de altura
                          className='object-contain'
                          loading='lazy'
                        />
                      </div>
                    </div>

                    <div className='absolute bottom-0 left-0 right-0 p-6'>
                      <motion.div
                        animate={{
                          y: hoveredCard === patrocinador._id ? -10 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {patrocinador.categoria && (
                          <span className='inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full uppercase tracking-wider mb-3'>
                            {patrocinador.categoria}
                          </span>
                        )}
                        <h3 className='text-2xl font-bold text-white mb-2'>
                          {patrocinador.nome}
                        </h3>
                        {patrocinador.descricaoCurta && (
                          <p className='text-gray-200 text-sm leading-relaxed line-clamp-3'>
                            {patrocinador.descricaoCurta}
                          </p>
                        )}
                      </motion.div>

                      <motion.div
                        className='mt-4'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: hoveredCard === patrocinador._id ? 1 : 0,
                          y: hoveredCard === patrocinador._id ? 0 : 20,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <button className='inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-sm font-semibold'>
                          <span>Saiba Mais</span>
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
                        </button>
                      </motion.div>
                    </div>

                    <div
                      className={`absolute -inset-0.5 bg-gradient-to-br ${gradientColor} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 pointer-events-none`}
                    />
                  </div>

                  <div
                    className='absolute -bottom-2 left-2 right-2 h-8 bg-black/40 rounded-full blur-xl transition-opacity duration-300'
                    style={{
                      opacity: hoveredCard === patrocinador._id ? 0.6 : 0.3,
                      transform: 'translateZ(-20px)',
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className='text-center text-gray-400 py-20'>
            <h3 className='text-2xl font-semibold mb-4'>Em breve</h3>
            <p>
              Informações sobre nossos valiosos parceiros serão adicionadas em
              breve.
            </p>
          </div>
        )}

        <motion.div
          className='text-center mt-20'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className='text-3xl font-bold text-white mb-4'>
            Seja Nosso Parceiro
          </h3>
          <p className='text-gray-400 mb-8 max-w-2xl mx-auto'>
            Junte-se a essas grandes empresas e apoie nossa jornada na Stock
            Car. Vamos acelerar juntos rumo ao sucesso!
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href='/contato'
              className='group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-orange-600 text-white rounded-full font-bold text-lg uppercase tracking-wider transition-all duration-300'
            >
              <span>Quero Ser Parceiro</span>
              <svg
                className='w-5 h-5 group-hover:translate-x-2 transition-transform'
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

        {selectedPartner && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPartner(null)}
          >
            <div className='absolute inset-0 bg-black/80 backdrop-blur-xl' />

            <motion.div
              className='relative w-full max-w-2xl max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden flex flex-col'
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='relative h-48 flex-shrink-0'>
                {selectedPartner.imagemDeFundo ? (
                  <Image
                    src={
                      urlFor(selectedPartner.imagemDeFundo)
                        ?.width(800)
                        .height(300)
                        .auto('format')
                        .quality(80)
                        .url() || ''
                    }
                    alt={
                      selectedPartner.imagemDeFundo.alt || selectedPartner.nome
                    }
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className='w-full h-full bg-gradient-to-br from-gray-700 to-gray-900' />
                )}

                <div className='absolute inset-0 bg-black/60' />

                <button
                  onClick={() => setSelectedPartner(null)}
                  className='absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-30'
                >
                  <svg
                    className='w-5 h-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>

              <div className='relative z-30 -mt-8 ml-6 mb-4'>
                <div className='w-16 h-16 bg-white rounded-xl p-3 shadow-lg border border-gray-200'>
                  <Image
                    src={
                      urlFor(selectedPartner.logo)
                        ?.height(100)
                        .fit('max')
                        .auto('format')
                        .quality(85)
                        .url() || ''
                    }
                    alt={
                      selectedPartner.logo.alt || `${selectedPartner.nome} logo`
                    }
                    width={64}
                    height={64}
                    className='object-contain'
                  />
                </div>
              </div>

              <div className='flex-1 overflow-y-auto'>
                <div className='p-6 pt-4'>
                  {selectedPartner.categoria && (
                    <span className='inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider mb-3'>
                      {selectedPartner.categoria}
                    </span>
                  )}
                  <h3 className='text-3xl font-bold text-white mb-4'>
                    {selectedPartner.nome}
                  </h3>
                  <div className='text-gray-300 leading-relaxed mb-6'>
                    {selectedPartner.descricaoCompleta ||
                      selectedPartner.descricaoCurta ||
                      'Descrição não disponível.'}
                  </div>

                  <div className='flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-700'>
                    {selectedPartner.link && (
                      <a
                        href={selectedPartner.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center'
                      >
                        Visitar Site
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedPartner(null)}
                      className='px-6 py-3 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors'
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
