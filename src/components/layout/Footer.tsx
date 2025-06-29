'use client'; // Necessário para motion e useState (se aplicado em sub-componentes)

import { motion } from 'framer-motion';

const FooterFuturista = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/pilotolucasforesti',
      icon: (
        <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z' />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'X',
      href: 'https://x.com/lucasforesti',
      icon: (
        <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
        </svg>
      ),
      color: 'from-blue-400 to-blue-600',
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/pilotolucasforesti/?locale=pt_BR',
      icon: (
        <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
        </svg>
      ),
      color: 'from-blue-600 to-blue-800',
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/c/PilotoLucasForesti', // URL de exemplo
      icon: (
        <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
        </svg>
      ),
      color: 'from-red-500 to-red-700',
    },
  ];

  const footerLinks = [
    { label: 'Sobre', href: '/sobre' },
    { label: 'Notícias', href: '/noticias' },
    { label: 'Galeria', href: '/galeria' },
    { label: 'Parceiros', href: '/patrocinadores' },
    { label: 'Calendário', href: '/calendario' },
    { label: 'Contato', href: '/contato' },
  ];

  return (
    <footer className='relative bg-black overflow-hidden pt-20 pb-10'>
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]' />

        <motion.div
          className='absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl'
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='absolute -bottom-20 -right-20 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl'
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className='relative z-10 container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='md:col-span-2 lg:col-span-1'
          >
            <div className='flex items-center gap-4 mb-6'>
              <motion.div
                className='text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600'
                animate={{
                  textShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.5)',
                    '0 0 40px rgba(59, 130, 246, 0.8)',
                    '0 0 20px rgba(59, 130, 246, 0.5)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                12
              </motion.div>
              <div>
                <h3 className='text-xl md:text-2xl font-bold text-white'>
                  Lucas Foresti
                </h3>
                <p className='text-gray-400 text-sm md:text-base'>
                  Stock Car Pro Series
                </p>
              </div>
            </div>
            <p className='text-gray-400 leading-relaxed mb-6 text-sm md:text-base'>
              Acompanhe minha jornada nas pistas, conquistas e bastidores do
              automobilismo brasileiro.
            </p>

            <div className='relative'>
              <motion.div
                className='relative p-1 rounded-2xl bg-gradient-to-r from-blue-500 to-orange-500'
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                <div className='bg-black rounded-xl p-3 md:p-4'>
                  <p className='text-white font-semibold mb-3 text-sm md:text-base'>
                    Receba novidades
                  </p>

                  <div className='flex flex-col sm:flex-row gap-2'>
                    <input
                      type='email'
                      placeholder='Seu e-mail'
                      className='flex-1 bg-gray-900 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base min-w-0'
                    />
                    <motion.button
                      className='px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm md:text-base whitespace-nowrap'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Inscrever
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='lg:col-span-1'
          >
            <h4 className='text-lg md:text-xl font-bold text-white mb-6'>
              Links Rápidos
            </h4>
            <div className='grid grid-cols-2 gap-3'>
              {footerLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className='text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm md:text-base'
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className='w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='md:col-span-2 lg:col-span-1'
          >
            <h4 className='text-lg md:text-xl font-bold text-white mb-6'>
              Redes Sociais
            </h4>
            <div className='flex flex-wrap gap-4'>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group relative'
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className='relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-900 flex items-center justify-center overflow-hidden'>
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />

                    <span className='relative z-10 text-gray-400 group-hover:text-white transition-colors duration-300'>
                      <div className='w-5 h-5 md:w-6 md:h-6'>{social.icon}</div>
                    </span>

                    <div
                      className={`absolute -inset-1 bg-gradient-to-br ${social.color} rounded-xl opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300`}
                    />
                  </div>
                </motion.a>
              ))}
            </div>

            <div className='mt-8 grid grid-cols-2 gap-4'>
              <motion.div
                className='bg-gray-900 rounded-xl p-3 md:p-4 text-center'
                whileHover={{ scale: 1.05 }}
              >
                <p className='text-2xl md:text-3xl font-bold text-blue-400'>
                  12
                </p>
                <p className='text-xs md:text-sm text-gray-400'>
                  Número do Carro
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className='pt-8 border-t border-gray-800'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-gray-400 text-xs md:text-sm text-center md:text-left'>
              © {currentYear} Lucas Foresti. Todos os direitos reservados.
            </p>
            <div className='flex items-center gap-2 md:gap-4'>
              <p className='text-gray-400 text-xs md:text-sm'>
                Desenvolvido com
              </p>
              <motion.div
                className='text-red-500'
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                ❤️
              </motion.div>
              <p className='text-gray-400 text-xs md:text-sm'>
                para a velocidade
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterFuturista;
