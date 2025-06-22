// src/app/noticias/page.tsx
import { getClient } from '@/lib/sanity.client';
import type { Categoria, NoticiaCard } from '@/types/sanity';
import { Metadata } from 'next';
import NoticiasPageClient from './NoticiasPageClient';

// Metadados da página de notícias
export const metadata: Metadata = {
  title: 'Notícias - Lucas Foresti | Piloto Stock Car',
  description:
    'Fique por dentro das últimas notícias e novidades sobre Lucas Foresti na Stock Car Pro Series.',
  openGraph: {
    title: 'Notícias - Lucas Foresti',
    description:
      'Fique por dentro das últimas notícias e novidades sobre Lucas Foresti na Stock Car Pro Series.',
    url: 'https://www.lucasforesti.com.br/noticias',
    type: 'website',
  },
};

const ITEMS_PER_PAGE = 5;

// Queries GROQ
const categoriasQuery = `*[_type == "categoria"]{_id, nome, slug} | order(nome asc)`;

const noticiasQuery = `*[_type == "noticia"] | order(dataDePublicacao desc) {
  _id,
  titulo,
  slug,
  dataDePublicacao,
  imagemDeCapa{alt, asset->},
  resumo,
  categorias[]->{_id, nome, slug}
}`;

// Função para buscar dados no servidor
async function getNoticiasData() {
  const client = getClient();

  try {
    const [noticias, categorias] = await Promise.all([
      client.fetch<NoticiaCard[]>(noticiasQuery),
      client.fetch<Categoria[]>(categoriasQuery),
    ]);

    return {
      noticias: noticias || [],
      categorias: categorias || [],
      totalNoticias: noticias?.length || 0,
    };
  } catch (error) {
    console.error('Erro ao buscar dados de notícias:', error);
    return {
      noticias: [],
      categorias: [],
      totalNoticias: 0,
    };
  }
}

// ✅ Server Component - searchParams agora é Promise
export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // ✅ Promise type
}) {
  // ✅ Await searchParams antes de usar
  const resolvedSearchParams = await searchParams;

  // Buscar dados no servidor
  const { noticias, categorias, totalNoticias } = await getNoticiasData();

  // ✅ Extrair parâmetros de busca do searchParams resolvido
  const page =
    typeof resolvedSearchParams.page === 'string'
      ? parseInt(resolvedSearchParams.page)
      : 1;
  const categoria =
    typeof resolvedSearchParams.categoria === 'string'
      ? resolvedSearchParams.categoria
      : null;

  // Filtrar notícias por categoria se especificada
  const noticiasFiltradas = categoria
    ? noticias.filter((noticia) =>
        noticia.categorias?.some((cat) => cat.slug?.current === categoria)
      )
    : noticias;

  // Paginação
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const noticiasPaginadas = noticiasFiltradas.slice(startIndex, endIndex);
  const totalPages = Math.ceil(noticiasFiltradas.length / ITEMS_PER_PAGE);

  // Passar dados para o Client Component
  return (
    <NoticiasPageClient
      noticias={noticiasPaginadas}
      categorias={categorias}
      currentPage={page}
      totalPages={totalPages}
      totalNoticias={noticiasFiltradas.length}
      currentCategory={categoria}
    />
  );
}
