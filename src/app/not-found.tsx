// src/app/not-found.tsx
import { Metadata } from 'next'; // Para metadados da página 404
import Link from 'next/link'; // Usar Link do Next.js

export const metadata: Metadata = {
  title: 'Página Não Encontrada - Lucas Foresti',
  description: 'A página que você está procurando não existe ou foi movida.',
};

export default function NotFound() {
  return (
    <div className='min-h-screen bg-black flex items-center justify-center text-white text-center px-4'>
      <div className='max-w-md mx-auto'>
        <h1 className='text-6xl md:text-8xl font-bold text-blue-500 mb-4'>
          404
        </h1>
        <h2 className='text-3xl md:text-4xl font-semibold mb-6'>
          Página Não Encontrada
        </h2>
        <p className='text-lg text-gray-400 mb-8'>
          A URL que você tentou acessar não existe ou pode ter sido movida. Não
          se preocupe, você pode voltar para a página inicial.
        </p>
        <Link
          href='/'
          className='inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-blue-500/25'
        >
          <svg
            className='w-5 h-5 mr-2'
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
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
}
