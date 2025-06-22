// src/app/noticias/[slug]/page.tsx
import { getClient, getImageUrl, isValidImage } from '@/lib/sanity.client';
import type { NoticiaDetalhada } from '@/types/sanity';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NoticiaDetalhePageClient from './NoticiaDetalhePageClient'; // Client Component

// Query GROQ para buscar uma notícia específica pelo seu slug
const noticiaQuery = `*[_type == "noticia" && slug.current == $slug][0]{
  _id,
  titulo,
  slug,
  dataDePublicacao,
  dataPublicacao, // Alias para compatibilidade
  imagemDeCapa{alt, asset->},
  resumo,
  conteudo[]{
    ...,
    _type == "image" => {
      alt,
      asset->,
      legenda
    },
    markDefs[]{
      ...,
      _type == "link" => {
        "href": @.href,
        "blank": @.blank
      }
    }
  },
  categorias[]->{_id, nome, slug}
}`;

interface NoticiasDetalhePageProps {
  params: { slug: string };
}

// Função para buscar os dados no servidor
async function getNoticiaBySlug(
  slug: string
): Promise<NoticiaDetalhada | null> {
  const client = getClient();
  try {
    const data = await client.fetch<NoticiaDetalhada | null>(noticiaQuery, {
      slug,
    });
    return data;
  } catch (error) {
    console.error('Erro ao buscar detalhe da notícia:', error);
    return null;
  }
}

// Função para gerar rotas estáticas em tempo de build (SSG)
export async function generateStaticParams() {
  const client = getClient();
  try {
    const slugs: string[] = await client.fetch(
      `*[_type == "noticia"].slug.current`
    );
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Erro ao buscar slugs de notícias:', error);
    return [];
  }
}

// Gerar metadados dinamicamente para SEO
export async function generateMetadata({
  params,
}: NoticiasDetalhePageProps): Promise<Metadata> {
  const noticia = await getNoticiaBySlug(params.slug);

  if (!noticia) {
    return {
      title: 'Notícia não encontrada',
      description: 'A notícia que você está procurando não foi encontrada.',
    };
  }

  const imageUrlCapa =
    noticia.imagemDeCapa && isValidImage(noticia.imagemDeCapa)
      ? getImageUrl(noticia.imagemDeCapa, 1200)
      : undefined;

  return {
    title: `${noticia.titulo} - Notícias`,
    description: noticia.resumo,
    openGraph: {
      title: noticia.titulo,
      description: noticia.resumo,
      images: imageUrlCapa ? [imageUrlCapa] : [],
      url: `https://www.lucasforesti.com.br/noticias/${noticia.slug.current}`,
      type: 'article',
      publishedTime: noticia.dataDePublicacao || noticia.dataPublicacao,
    },
    twitter: {
      card: 'summary_large_image',
      title: noticia.titulo,
      description: noticia.resumo,
      images: imageUrlCapa ? [imageUrlCapa] : [],
    },
  };
}

// Server Component - sem motion, sem hooks
export default async function NoticiasDetalhePage({
  params,
}: NoticiasDetalhePageProps) {
  const { slug } = params;
  const noticia = await getNoticiaBySlug(slug);

  if (!noticia) {
    notFound(); // Next.js vai mostrar a página 404
  }

  // Passar dados para o Client Component
  return <NoticiaDetalhePageClient noticia={noticia} />;
}
