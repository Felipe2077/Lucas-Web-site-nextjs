// src/app/calendario/CalendarioPageClient.tsx
'use client'; // Client Component para usar motion e hooks

import { motion } from 'framer-motion';

// Interfaces (mesmas do servidor)
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

interface CalendarioPageClientProps {
  eventos: Evento[];
}

// Funções de formatação
const formatarData = (dataISO: string) => {
  try {
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  } catch (e) {
    return 'Data inválida' + e;
  }
};

const formatarHora = (dataISO: string) => {
  try {
    if (dataISO && dataISO.includes('T')) {
      const dateObj = new Date(dataISO);
      if (
        dateObj.getUTCHours() === 0 &&
        dateObj.getUTCMinutes() === 0 &&
        dateObj.getUTCSeconds() === 0
      ) {
        return '';
      }
      return dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      });
    }
    return '';
  } catch (e) {
    return '' + e;
  }
};

// Função para obter status badge
const getStatusBadge = (status: string) => {
  const badges = {
    agendado: {
      text: 'Agendado',
      className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      icon: '📅',
    },
    adiado: {
      text: 'Adiado',
      className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      icon: '⚠️',
    },
    realizado: {
      text: 'Realizado',
      className: 'bg-green-500/20 text-green-400 border-green-500/30',
      icon: '✅',
    },
    cancelado: {
      text: 'Cancelado',
      className: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: '❌',
    },
  };
  return badges[status as keyof typeof badges] || badges.agendado;
};

export default function CalendarioPageClient({
  eventos,
}: CalendarioPageClientProps) {
  const hojeISO = new Date().toISOString();

  // ✅ Separar eventos de forma mais clara
  const eventosFuturos = eventos
    .filter((e) => {
      const dataEvento = new Date(e.dataDoEvento);
      return (
        (e.status === 'agendado' || e.status === 'adiado') &&
        dataEvento.toISOString() >= hojeISO
      );
    })
    .sort(
      (a, b) =>
        new Date(a.dataDoEvento).getTime() - new Date(b.dataDoEvento).getTime()
    );

  // ✅ Eventos passados: Data passou OU status realizado/cancelado
  const eventosPassados = eventos
    .filter((e) => {
      const dataEvento = new Date(e.dataDoEvento);

      // ✅ NOVA LÓGICA: Se a data passou, incluir INDEPENDENTE do status
      if (dataEvento.toISOString() < hojeISO) {
        return true;
      }

      // ✅ OU se é realizado/cancelado, mesmo que seja futuro
      if (e.status === 'realizado' || e.status === 'cancelado') {
        return true;
      }

      return false;
    })
    .sort(
      (a, b) =>
        new Date(b.dataDoEvento).getTime() - new Date(a.dataDoEvento).getTime() // ✅ Mais recente primeiro
    );

  return (
    <section className='min-h-screen bg-black text-white py-20'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full mb-6'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
            <span className='text-blue-400 font-semibold uppercase tracking-wider text-sm'>
              Temporada 2025
            </span>
          </motion.div>

          <h1 className='text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4'>
            {' '}
            {/* ✅ RESPONSIVO */}
            <span className='bg-gradient-to-r from-blue-400 to-orange-400 text-transparent bg-clip-text'>
              Calendário
            </span>{' '}
            & Resultados
          </h1>
          <p className='text-lg md:text-xl text-gray-400 max-w-3xl mx-auto'>
            {' '}
            {/* ✅ RESPONSIVO */}
            Acompanhe todas as corridas da temporada e os resultados em tempo
            real
          </p>
        </motion.div>

        {/* Próximas Corridas */}
        <motion.section
          className='mb-20'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }} // ✅ Mudado de whileInView para animate
          transition={{ duration: 0.8 }}
        >
          <div className='flex items-center gap-4 mb-8'>
            <motion.div
              className='text-4xl'
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏁
            </motion.div>
            <h2 className='text-3xl md:text-4xl font-bold text-white'>
              {' '}
              {/* ✅ RESPONSIVO (já estava bom, mas mantive a consistência) */}
              Próximas Corridas ({eventosFuturos.length})
            </h2>
          </div>

          {eventosFuturos.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {eventosFuturos.map((evento, index) => {
                const statusBadge = getStatusBadge(evento.status);
                const horaFormatada = formatarHora(evento.dataDoEvento);

                return (
                  <motion.div
                    key={evento._id}
                    className='group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-500'
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }} // ✅ Mudado de whileInView
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    {/* Background Pattern */}
                    <div className='absolute inset-0 bg-gradient-to-br from-blue-900/10 to-orange-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

                    <div className='p-6'>
                      {/* Header */}
                      <div className='flex items-start justify-between mb-4'>
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.className}`}
                        >
                          <span>{statusBadge.icon}</span>
                          {statusBadge.text}
                        </span>
                        <div className='text-right'>
                          <div className='text-sm text-gray-400'>
                            {formatarData(evento.dataDoEvento)}
                          </div>
                          {horaFormatada && (
                            <div className='text-xs text-gray-500'>
                              {horaFormatada}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className='space-y-4'>
                        <h3 className='text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300'>
                          {evento.nomeDoEvento}
                        </h3>

                        {evento.circuito && (
                          <div className='flex items-center gap-2 text-gray-400'>
                            <svg
                              className='w-4 h-4'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='text-sm'>{evento.circuito}</span>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      {evento.linkParaMateria && (
                        <div className='mt-6'>
                          <a
                            href={evento.linkParaMateria}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 text-blue-400 hover:text-orange-400 transition-colors duration-300 text-sm font-semibold'
                          >
                            <span>Mais informações</span>
                            <svg
                              className='w-4 h-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M17 8l4 4m0 0l-4 4m4-4H3'
                              />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className='text-center py-16'>
              <div className='text-6xl mb-4'>🏎️</div>
              <p className='text-gray-400 text-lg'>
                Nenhuma corrida agendada no momento.
              </p>
            </div>
          )}
        </motion.section>

        {/* Corridas Anteriores */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }} // ✅ Mudado de whileInView para animate
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className='flex items-center gap-4 mb-8'>
            <div className='text-4xl'>🏆</div>
            <h2 className='text-3xl md:text-4xl font-bold text-white'>
              {' '}
              {/* ✅ RESPONSIVO (já estava bom, mas mantive a consistência) */}
              Corridas Anteriores ({eventosPassados.length})
            </h2>
          </div>

          {eventosPassados.length > 0 ? (
            <div className='space-y-6'>
              {eventosPassados.map((evento, index) => {
                const statusBadge = getStatusBadge(evento.status);

                return (
                  <motion.div
                    key={evento._id}
                    className='group bg-gray-900 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-500 overflow-hidden'
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }} // ✅ Mudado de whileInView
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className='p-6'>
                      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
                        {/* Event Info */}
                        <div className='flex-1'>
                          <div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-3'>
                            <h3 className='text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300'>
                              {evento.nomeDoEvento}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.className} w-fit`}
                            >
                              <span>{statusBadge.icon}</span>
                              {statusBadge.text}
                            </span>
                          </div>

                          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-400'>
                            <span>{formatarData(evento.dataDoEvento)}</span>
                            {evento.circuito && (
                              <>
                                <span className='hidden sm:block'>•</span>
                                <span>{evento.circuito}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Results */}
                        {evento.status === 'realizado' && evento.resultado ? (
                          <div className='flex flex-wrap gap-4 lg:gap-6'>
                            {evento.resultado.posicaoLargada !== null &&
                              evento.resultado.posicaoLargada !== undefined && (
                                <div className='text-center'>
                                  <div className='text-xs text-gray-400 uppercase tracking-wider mb-1'>
                                    Largada
                                  </div>
                                  <div className='text-lg font-bold text-blue-400'>
                                    P{evento.resultado.posicaoLargada}
                                  </div>
                                </div>
                              )}
                            {evento.resultado.posicaoFinal && (
                              <div className='text-center'>
                                <div className='text-xs text-gray-400 uppercase tracking-wider mb-1'>
                                  Final
                                </div>
                                <div className='text-lg font-bold text-orange-400'>
                                  P{evento.resultado.posicaoFinal}
                                </div>
                              </div>
                            )}
                            {evento.resultado.pontos !== undefined && (
                              <div className='text-center'>
                                <div className='text-xs text-gray-400 uppercase tracking-wider mb-1'>
                                  Pontos
                                </div>
                                <div className='text-lg font-bold text-green-400'>
                                  {evento.resultado.pontos}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : null}

                        {/* Link */}
                        {evento.linkParaMateria && (
                          <a
                            href={evento.linkParaMateria}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-300 text-sm font-semibold'
                          >
                            <span>Ver matéria</span>
                            <svg
                              className='w-4 h-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                              />
                            </svg>
                          </a>
                        )}
                      </div>

                      {/* Observações */}
                      {evento.resultado?.observacoes && (
                        <div className='mt-4 pt-4 border-t border-gray-800'>
                          <p className='text-sm text-gray-400 italic'>
                            <span className='text-yellow-400'>💭</span>{' '}
                            {evento.resultado.observacoes}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className='text-center py-16'>
              <div className='text-6xl mb-4'>📊</div>
              <p className='text-gray-400 text-lg'>
                Nenhum resultado anterior disponível.
              </p>
            </div>
          )}
        </motion.section>
      </div>
    </section>
  );
}
