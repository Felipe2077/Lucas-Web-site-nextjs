import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

if (!projectId || !dataset || !apiVersion) {
  throw new Error(
    'Missing Sanity environment variables. Check .env.local and next.config.js'
  );
}

export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // Use CDN em produção
  token: process.env.SANITY_API_READ_TOKEN, // Se você tiver um token de leitura com acesso restrito
  perspective: 'published',
});

// A função `getClient` de sanity.client.ts é para uso geral,
// mas para o servidor, você pode usar `serverClient` diretamente.
