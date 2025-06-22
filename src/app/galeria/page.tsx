import Galeria3DModernCard, {
  type AlbumDataCard,
} from '@/components/galeria/Galeria3DModernCard'; // Alias ajustado
import { getClient } from '@/lib/sanity.client'; // Alias ajustado
import { Metadata } from 'next'; // Para metadados

// Query GROQ para buscar todos os álbuns de fotos
const albunsQuery = `*[_type == "albumDeFotos" && defined(slug.current)]{
  _id,
  titulo,
  slug,
  dataDoAlbum,
  imagemDeCapa{alt, asset->{_id, url, metadata{dimensions}}},
  "fotos": fotos[0...2]{ // Pega as primeiras 3 fotos para o efeito de stack
    _key,
    alt,
    asset->{_id, url, metadata{dimensions}}
  },
  descricao
} | order(dataDoAlbum desc, _createdAt desc)`;

// Função para buscar os álbuns no servidor
async function getAlbuns(): Promise<AlbumDataCard[]> {
  const client = getClient();
  try {
    const data: AlbumDataCard[] = await client.fetch(albunsQuery);
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar álbuns:', error);
    return [];
  }
}

// Metadados para SEO
export const metadata: Metadata = {
  title: 'Galeria de Fotos - Lucas Foresti',
  description:
    'Veja os álbuns de fotos e os melhores momentos do piloto Lucas Foresti.',
};

export default async function GaleriaPage() {
  const albuns = await getAlbuns();

  return (
    <div className='min-h-screen bg-neutral-900 text-neutral-100 py-8 md:py-12'>
      <div className='container mx-auto px-4'>
        <h1 className='font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-10 md:mb-16 text-white'>
          Galeria de <span className='text-piloto-azul-light'>Fotos</span>
        </h1>

        {albuns && albuns.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 xl:gap-14 [perspective:1000px]'>
            {albuns.map((album, index) => (
              <Galeria3DModernCard
                key={album._id}
                album={album}
                index={index}
              />
            ))}
          </div>
        ) : (
          <p className='text-center text-neutral-400 text-lg'>
            Nenhum álbum de fotos disponível no momento. Volte em breve!
          </p>
        )}
      </div>
    </div>
  );
}
