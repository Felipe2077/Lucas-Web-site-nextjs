// src/app/contato/page.tsx
import { Metadata } from 'next';
import ContatoPageClient from './ContatoPageClient';

// ✅ Server Component - Metadados para SEO
export const metadata: Metadata = {
  title: `Contato - Lucas Foresti`,
  description: `Entre em contato com Lucas Foresti. Siga nas redes sociais para acompanhar a carreira na Stock Car.`,
};

export default function ContatoPage() {
  // ✅ Server Component - sem 'use client', sem motion, sem hooks
  // Aqui poderia buscar configurações de contato do Sanity se necessário

  return <ContatoPageClient />;
}
