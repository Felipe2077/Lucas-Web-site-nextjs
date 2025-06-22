// src/app/calendario/page.tsx
import { getClient } from '@/lib/sanity.client';
import { Metadata } from 'next';
import CalendarioPageClient from './CalendarioPageClient'; // Client Component

// Interfaces para o servidor
interface Resultado {
  posicaoLargada?: number;
  posicaoFinal?: string;
  pontos?: number;
  observacoes?: string;
}

interface Evento {
  _id: string;
  nomeDoEvento: string;
  dataDoEvento: string;
  circuito?: string;
  status: 'agendado' | 'realizado' | 'cancelado' | 'adiado';
  resultado?: Resultado;
  linkParaMateria?: string;
}

// Query GROQ
const eventosQuery = `*[_type == "evento"]{
  _id,
  nomeDoEvento,
  dataDoEvento,
  circuito,
  status,
  resultado,
  linkParaMateria
} | order(dataDoEvento desc)`;

// Metadados para SEO
export const metadata: Metadata = {
  title: 'Calendário e Resultados - Lucas Foresti | Piloto Stock Car',
  description:
    'Acompanhe o calendário de corridas e os resultados do piloto Lucas Foresti na Stock Car Pro Series.',
  openGraph: {
    title: 'Calendário e Resultados - Lucas Foresti',
    description:
      'Acompanhe o calendário de corridas e os resultados do piloto Lucas Foresti na Stock Car Pro Series.',
    url: 'https://www.lucasforesti.com.br/calendario',
    type: 'website',
  },
};

// Função para buscar eventos no servidor
async function getEventosData() {
  const client = getClient();

  try {
    const eventos: Evento[] = await client.fetch(eventosQuery);
    return eventos || [];
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return [];
  }
}

// Server Component - sem motion, sem hooks
export default async function CalendarioPage() {
  // Buscar dados no servidor
  const eventos = await getEventosData();

  // Passar dados para o Client Component
  return <CalendarioPageClient eventos={eventos} />;
}
