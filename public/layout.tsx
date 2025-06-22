import type { Metadata } from 'next';
import { Inter, Rajdhani } from 'next/font/google'; // Importar as fontes do Google Fonts

import '@/app/globals.css'; // Importar seus estilos globais
import Footer from '@/components/layout/Footer'; // Caminho ajustado
import Header from '@/components/layout/Header'; // Caminho ajustado

// Configurar as fontes com next/font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Define a variável CSS --font-inter
});
const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani', // Define a variável CSS --font-rajdhani
});

// Metadados para SEO global (substitui react-helmet-async para informações globais)
export const metadata: Metadata = {
  title: 'Lucas Foresti - Piloto Stock Car | Website Oficial',
  description:
    'Acompanhe a carreira, notícias, calendário e galeria de fotos de Lucas Foresti, piloto da Stock Car Pro Series.',
  keywords: [
    'Lucas Foresti',
    'Stock Car',
    'Piloto',
    'Corrida',
    'Automobilismo',
  ],
  authors: [{ name: 'Lucas Foresti' }],
  creator: 'Lucas Foresti',
  openGraph: {
    title: 'Lucas Foresti - Piloto Stock Car Oficial',
    description:
      'Acompanhe a carreira, notícias, calendário e galeria de fotos de Lucas Foresti, piloto da Stock Car Pro Series.',
    url: 'https://www.lucasforesti.com.br', // Substitua pela URL do seu site
    siteName: 'Lucas Foresti',
    images: [
      {
        url: 'https://www.lucasforesti.com.br/images/og-image.jpg', // Adicione uma imagem OG padrão na pasta public
        width: 1200,
        height: 630,
        alt: 'Lucas Foresti - Piloto de Stock Car',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Foresti - Piloto Stock Car Oficial',
    description:
      'Acompanhe a carreira, notícias, calendário e galeria de fotos de Lucas Foresti, piloto da Stock Car Pro Series.',
    creator: '@lucasforesti',
    images: ['https://www.lucasforesti.com.br/images/og-image.jpg'], // Adicione uma imagem OG padrão na pasta public
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico', // Crie um favicon.ico na pasta public
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest', // Crie um site.webmanifest na pasta public
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-BR' className={`${inter.variable} ${rajdhani.variable}`}>
      <body>
        <div className='flex flex-col min-h-screen bg-neutral-900 text-neutral-100'>
          <Header />
          <main className='flex-grow'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
