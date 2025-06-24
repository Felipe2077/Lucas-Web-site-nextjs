// src/app/noticias/NoticiasPageClient.tsx
'use client'; // Client Component para usar motion e interações

import CardNoticia from '@/components/noticias/CardNoticia';
import PaginationControls from '@/components/noticias/PaginationControls';
import type { Categoria, NoticiaCard } from '@/types/sanity';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Adicione useSearchParams aqui
import { useEffect, useState } from 'react'; // Adicione useEffect aqui

interface NoticiasPageClientProps {
  noticias: NoticiaCard[];
  categorias: Categoria[];
  currentPage: number;
  totalPages: number;
  totalNoticias: number; // Esta prop foi comentada anteriormente, mas se você a usa, certifique-se de que está sendo passada corretamente
  currentCategory: string | null;
}

export default function NoticiasPageClient({
  noticias,
  categorias,
  currentPage,
  totalPages,

  currentCategory,
}: NoticiasPageClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const nomeDoPiloto = 'Lucas Foresti';
  //const pageTitle = `Notícias - ${nomeDoPiloto}`; // Comentada conforme correção anterior
  const pageDescription = `Fique por dentro das últimas notícias e novidades sobre ${nomeDoPiloto} na Stock Car.`;

  // NOVO: useEffect para definir loading como false quando os dados são atualizados
  useEffect(() => {
    setLoading(false);
  }, [noticias, categorias, currentPage, totalPages, currentCategory]); // Dependências: quando qualquer uma destas props mudar, significa que os dados foram carregados.

  // Função para filtrar por categoria
  const handleCategoryFilter = (categorySlug: string | null) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categorySlug) {
      params.set('categoria', categorySlug);
    }
    params.set('pagina', '1'); // Reset para página 1
    router.push(`/noticias?${params.toString()}`);
  };

  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Hero Section */}
      <section className='relative min-h-[20vh] flex items-center overflow-hidden pt-16'>
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
          <motion.div
            className='text-center max-w-4xl mx-auto'
            initial={{ opacity: 0, y: 30 }}
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
                <li className='text-blue-400'>Notícias</li>
              </ol>
            </nav>

            <motion.div
              className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full mb-6'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', delay: 0.2 }}
            >
              <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
              <span className='text-blue-400 font-semibold uppercase tracking-wider text-sm'>
                Últimas Atualizações
              </span>
            </motion.div>

            <h1 className='text-4xl md:text-5xl lg:text-6xl font-black mb-6'>
              <span className='text-white'>Notícias do</span>{' '}
              <span className='bg-gradient-to-r from-blue-400 to-orange-400 text-transparent bg-clip-text'>
                Piloto
              </span>
            </h1>

            <p className='text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto'>
              {pageDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filtros de Categoria */}
      {categorias.length > 0 && (
        <section className='py-8'>
          <div className='container mx-auto px-4'>
            <motion.div
              className='flex flex-wrap justify-center gap-3'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <button
                onClick={() => handleCategoryFilter(null)}
                // Adicione a classe 'cursor-pointer' aqui:
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer ${
                  !currentCategory
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Todas
              </button>
              {categorias.map((categoria) => (
                <button
                  key={categoria._id}
                  onClick={() =>
                    handleCategoryFilter(categoria.slug?.current || null)
                  }
                  // Adicione a classe 'cursor-pointer' aqui:
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer ${
                    currentCategory === categoria.slug?.current
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {categoria.nome}
                </button>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Lista de Notícias */}
      <section className='py-16 bg-black'>
        <div className='container mx-auto px-4'>
          {loading ? (
            <div className='text-center py-12'>
              <motion.div
                className='w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto'
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className='text-gray-400 mt-4'>Carregando notícias...</p>
            </div>
          ) : noticias.length > 0 ? (
            <>
              <motion.div
                className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {noticias.map((noticia, index) => (
                  <motion.div
                    key={noticia._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <CardNoticia noticia={noticia} index={index} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Paginação */}
              {totalPages > 1 && (
                <motion.div
                  className='mt-16'
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <PaginationControls
                    paginaAtual={currentPage}
                    totalPaginas={totalPages}
                  />
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              className='text-center py-16'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className='text-6xl mb-6'>📰</div>
              <h3 className='text-2xl font-bold mb-4'>
                Nenhuma notícia encontrada
              </h3>
              <p className='text-gray-400 mb-8'>
                {currentCategory
                  ? 'Não há notícias nesta categoria no momento.'
                  : 'Não há notícias disponíveis no momento.'}
              </p>
              {currentCategory && (
                <button
                  onClick={() => handleCategoryFilter(null)}
                  className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold'
                >
                  Ver todas as notícias
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
