// src/components/layout/Header.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const HeaderGlassmorphism = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const currentPath = pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏁' },
    { href: '/noticias', label: 'Notícias', icon: '📰' },
    { href: '/galeria', label: 'Galeria', icon: '📸' },
    { href: '/sobre', label: 'Sobre', icon: '👤' },
    { href: '/patrocinadores', label: 'Parceiros', icon: '🤝' },
    { href: '/calendario', label: 'Calendário', icon: '📅' },
    { href: '/contato', label: 'Contato', icon: '📧' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(href);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all bg-transparent  duration-500 ${
          isScrolled ? 'py-1 sm:py-2' : 'py-2 sm:py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='container mx-auto px-3 sm:px-4'>
          <div
            className={`relative rounded-xl sm:rounded-2xl transition-all duration-500 ${
              // ✅ CORREÇÃO: Alterado para uma cor mais visível e com maior opacidade.
              isScrolled
                ? 'bg-gray-900/60 backdrop-blur-2xl border border-white/10'
                : 'bg-transparent'
            }`}
          >
            {/* Glow effect */}
            <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-orange-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500' />
            <div className='relative px-3 sm:px-6 py-3 sm:py-4'>
              <div className='flex items-center justify-between'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='flex-shrink-0'
                >
                  <Link
                    href='/'
                    className='flex items-center gap-2 sm:gap-3 group'
                  >
                    <div className='relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24'>
                      <Image
                        src='/logo-lucas-foresti.png'
                        alt='Lucas Foresti'
                        fill
                        className='object-contain'
                        priority
                      />
                      <div className='absolute -inset-2 bg-blue-500 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity' />
                    </div>
                  </Link>
                </motion.div>

                <nav className='hidden lg:flex items-center gap-2'>
                  {navLinks.map((link, index) => {
                    const isActive = isActiveLink(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        className='relative'
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group flex items-center gap-2 ${
                            isActive
                              ? 'text-white bg-gradient-to-r from-blue-500/20 to-orange-500/20 border border-blue-500/30'
                              : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          {!isActive && (
                            <div className='absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                          )}
                          <span
                            className={`text-sm transition-opacity duration-300 relative z-10 ${
                              isActive
                                ? 'opacity-100'
                                : 'opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            {link.icon}
                          </span>
                          <span className='relative z-10'>{link.label}</span>
                          <motion.div
                            className='absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full'
                            initial={{ width: 0, x: '-50%' }}
                            animate={{
                              width: isActive ? '80%' : 0,
                            }}
                            whileHover={{ width: '80%' }}
                            transition={{ duration: 0.3 }}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <button
                  className='lg:hidden relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0'
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <div className='absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg' />
                  <motion.div className='relative w-5 h-4 sm:w-6 sm:h-5 flex flex-col justify-between'>
                    <motion.span
                      className='w-full h-0.5 bg-white rounded-full'
                      animate={{
                        rotate: isMobileMenuOpen ? 45 : 0,
                        y: isMobileMenuOpen ? 8 : 0,
                      }}
                    />
                    <motion.span
                      className='w-full h-0.5 bg-white rounded-full'
                      animate={{
                        opacity: isMobileMenuOpen ? 0 : 1,
                      }}
                    />
                    <motion.span
                      className='w-full h-0.5 bg-white rounded-full'
                      animate={{
                        rotate: isMobileMenuOpen ? -45 : 0,
                        y: isMobileMenuOpen ? -8 : 0,
                      }}
                    />
                  </motion.div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className='fixed inset-0 z-40 lg:hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='absolute inset-0 bg-black/80 backdrop-blur-xl'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              className='absolute top-16 sm:top-20 left-3 right-3 sm:left-4 sm:right-4 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 p-4 sm:p-6'
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              transition={{ type: 'spring' }}
            >
              <nav className='flex flex-col gap-2'>
                {navLinks.map((link, index) => {
                  const isActive = isActiveLink(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Link
                          href={link.href}
                          className={`relative px-4 py-3 rounded-xl font-medium group overflow-hidden block ${
                            isActive
                              ? 'text-white bg-gradient-to-r from-blue-500/20 to-orange-500/20 border border-blue-500/30'
                              : 'text-gray-300 hover:text-white'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {!isActive && (
                            <motion.div
                              className='absolute inset-0 bg-gradient-to-r from-blue-500/20 to-orange-500/20'
                              initial={{ x: '-100%' }}
                              whileHover={{ x: 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          <span className='relative z-10 flex items-center gap-3'>
                            <span className='text-lg'>{link.icon}</span>
                            {link.label}
                            {isActive && (
                              <motion.div
                                className='ml-auto w-2 h-2 bg-blue-400 rounded-full'
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                            )}
                          </span>
                        </Link>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='h-24 sm:h-28' />
    </>
  );
};

export default HeaderGlassmorphism;
