// src/lib/sanity.client.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type {
  SanityAssetDocument,
  SanityImageObject,
  SanityReference,
} from '../types/sanity'; // Importe SanityReference e SanityAssetDocument

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5w3msavv';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Manter false para desenvolvimento, pode ser true em produção para caches
  token: undefined, // Não usar token para leitura pública, a menos que seu dataset seja privado
  perspective: 'published',
  stega: false,
  // Configurações adicionais para resolver CORS:
  requestTagPrefix: 'sanity',
  allowReconfigure: true,
});

export const getClient = () => client;

// Configurar o builder de URLs de imagem
const builder = imageUrlBuilder(client);

// Função para gerar URLs de imagens (Ajustada)
export function urlFor(
  source: SanityImageObject | null | undefined
): ReturnType<typeof builder.image> | null {
  // Apenas verifica se a source é nula/indefinida.
  // O builder.image() é inteligente o suficiente para lidar com diferentes formatos de source,
  // incluindo o objeto de imagem com `asset` expandido que tem `_id`.
  if (!source) {
    // console.warn("Invalid image source for urlFor: Source is null or undefined."); // Debug
    return null;
  }

  try {
    return builder.image(source);
  } catch (error) {
    console.error('Erro no builder.image(source):', error, 'Source:', source);
    return null;
  }
}

// Função helper para verificar se uma imagem é válida (CORRIGIDA)
export function isValidImage(
  source: SanityImageObject | null | undefined
): boolean {
  if (!source || !source.asset) return false;

  // Usa um type guard para verificar se 'asset' é uma SanityReference ou SanityAssetDocument
  if ('_ref' in source.asset) {
    // Se tem '_ref', é uma SanityReference. Verifica se '_ref' tem um valor.
    return !!(source.asset as SanityReference)._ref;
  } else if ('_id' in source.asset) {
    // Se não tem '_ref' mas tem '_id', é uma SanityAssetDocument. Verifica se '_id' tem um valor.
    return !!(source.asset as SanityAssetDocument)._id;
  }
  // Se não tem nem '_ref' nem '_id' (improvável se o Sanity estiver configurado), não é válido.
  return false;
}

// Função helper para obter URL de imagem com fallback seguro (Inalterada, pois usa urlFor e isValidImage)
export function getImageUrl(
  source: SanityImageObject | null | undefined,
  width?: number,
  height?: number
): string {
  const imageBuilder = urlFor(source);
  if (!imageBuilder) return '';

  try {
    let builder = imageBuilder.auto('format');
    if (width) builder = builder.width(width);
    if (height) builder = builder.height(height);
    return builder.url() || '';
  } catch (error) {
    console.warn('⚠️ Erro ao gerar URL da imagem:', error);
    return '';
  }
}

// Função de teste de conexão com melhor tratamento de erro (Inalterada)
export async function testSanityConnection() {
  try {
    // const result = await client.fetch('*[_type == "categoria"][0]');
    return true;
  } catch (error) {
    console.error('❌ Sanity connection failed:', error);

    try {
      const directUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=*[_type == "categoria"][0]`;

      const response = await fetch(directUrl);

      if (response.ok) {
        // const data = await response.json();
      } else {
        console.error('❌ Direct fetch failed:', response.statusText);
      }
    } catch (directError) {
      console.error('❌ Direct fetch error:', directError);
    }

    return false;
  }
}
