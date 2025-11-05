'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Suivi de la souris pour effets parallax (réduit pour éviter l'overflow)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const menuItems = [
    {
      id: 'multiplayer',
      title: 'Multijoueur',
      subtitle: 'Jouez en ligne',
      description: 'Créez une salle et invitez vos amis pour une partie endiablée',
      icon: '🌐',
      color: 'from-purple-600 via-purple-700 to-indigo-800',
      path: '/multiplayer',
      badge: null,
    },
    {
      id: 'solo',
      title: 'Mode Solo',
      subtitle: 'Affrontez l\'IA',
      description: 'Entraînez-vous contre une intelligence artificielle redoutable',
      icon: '🎮',
      color: 'from-rose-600 via-pink-700 to-red-800',
      path: '/game',
      badge: null,
    },
    {
      id: 'cards',
      title: 'Cartes Réalistes',
      subtitle: 'Nouveau design',
      description: 'Découvrez nos magnifiques cartes avec rendu ultra-réaliste',
      icon: '🎴',
      color: 'from-amber-600 via-orange-700 to-red-700',
      path: '/test-cards',
      badge: 'NOUVEAU',
    },
  ];

  const devItems = [
    { title: 'Galerie Cartes', icon: '🖼️', path: '/gallery', color: 'from-purple-500 to-pink-600' },
    { title: 'Test Deck', icon: '🧪', path: '/test-deck', color: 'from-emerald-500 to-teal-600' },
    { title: 'Test Enchères', icon: '🎲', path: '/test-game', color: 'from-blue-500 to-indigo-600' },
    { title: 'Test Jeu', icon: '🎯', path: '/test-play', color: 'from-violet-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Fond animé avec effet de profondeur */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Grille de fond avec parallax */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
          }}
        />

        {/* Orbes lumineux animés avec parallax (réduit pour mobile) */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 md:w-96 md:h-96 bg-purple-500 rounded-full filter blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
          style={{
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-72 h-72 md:w-96 md:h-96 bg-pink-500 rounded-full filter blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
          style={{
            x: mousePosition.x * -0.3,
            y: mousePosition.y * -0.3,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-blue-500 rounded-full filter blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' as const }}
          style={{
            x: mousePosition.x * 0.2,
            y: mousePosition.y * 0.2,
          }}
        />

        {/* Particules flottantes (contraintes au viewport) */}
        {[...Array(15)].map((_, i) => {
          const left = 10 + Math.random() * 80; // Entre 10% et 90%
          const top = 10 + Math.random() * 80; // Entre 10% et 90%
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-300 rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut' as const,
              }}
            />
          );
        })}
      </div>

      {/* Contenu principal */}
      <motion.div
        className="relative z-10 container mx-auto px-4 py-12 md:py-20"
        style={{ opacity }}
      >
        {/* En-tête avec animation améliorée */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring' as const, stiffness: 100 }}
        >
          {/* Logo/Icône avec effet 3D */}
          <motion.div
            className="inline-block mb-6 relative"
            animate={{
              rotateY: [0, 10, -10, 0],
              rotateX: [0, -5, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut' as const,
            }}
            style={{
              transformStyle: 'preserve-3d',
              perspective: 1000,
            }}
          >
            <div className="text-8xl md:text-9xl drop-shadow-2xl filter brightness-110">
              🃏
            </div>
            {/* Ombre de l'icône */}
            <div className="absolute inset-0 text-8xl md:text-9xl opacity-30 blur-xl">
              🃏
            </div>
          </motion.div>

          {/* Titre principal avec effet de glitch subtil */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.5))',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear' as const,
            }}
          >
            TAROT FRANÇAIS
          </motion.h1>

          {/* Ligne décorative améliorée */}
          <motion.div className="relative w-64 h-1 mx-auto mb-4">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1.2, type: 'spring' as const }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' as const }}
            />
          </motion.div>

          {/* Sous-titre */}
          <motion.p
            className="text-xl md:text-2xl text-purple-200 font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            L'Art du Jeu Authentique
          </motion.p>
        </motion.div>

        {/* Cartes de menu principales avec effet 3D */}
        <div className="max-w-6xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: 0.2 * index,
                duration: 0.8,
                type: 'spring' as const,
                stiffness: 100,
              }}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => router.push(item.path)}
              className="cursor-pointer group"
              style={{
                transformStyle: 'preserve-3d',
                perspective: 1000,
              }}
            >
              <motion.div
                className={`relative h-full bg-gradient-to-br ${item.color} rounded-3xl p-8 overflow-hidden shadow-2xl`}
                whileHover={{
                  scale: 1.05,
                  y: -15,
                  rotateY: 5,
                  rotateX: -5,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
              >
                {/* Effet de brillance */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={hoveredCard === item.id ? { x: '200%' } : {}}
                  transition={{ duration: 0.8 }}
                />

                {/* Reflet lumineux */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badge NOUVEAU */}
                {item.badge && (
                  <motion.div
                    className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-black shadow-lg"
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [-5, 5, -5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut' as const,
                    }}
                  >
                    ✨ {item.badge}
                  </motion.div>
                )}

                {/* Contenu */}
                <div className="relative z-10">
                  {/* Icône */}
                  <motion.div
                    className="text-6xl mb-4 filter drop-shadow-lg"
                    animate={hoveredCard === item.id ? { rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Titre */}
                  <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">
                    {item.title}
                  </h2>

                  {/* Sous-titre */}
                  <p className="text-sm text-white/90 font-semibold mb-3 uppercase tracking-widest">
                    {item.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-white/80 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {/* Flèche avec effet pulse */}
                  <motion.div
                    className="mt-6 text-white/70 text-2xl font-bold"
                    animate={hoveredCard === item.id ? { x: [0, 10, 0] } : {}}
                    transition={{ duration: 0.8, repeat: hoveredCard === item.id ? Infinity : 0 }}
                  >
                    →
                  </motion.div>
                </div>

                {/* Bordure lumineuse animée */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-white/0"
                  animate={hoveredCard === item.id ? { borderColor: 'rgba(255,255,255,0.4)' } : {}}
                  transition={{ duration: 0.3 }}
                />

                {/* Lueur au survol */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-white/0"
                  animate={hoveredCard === item.id ? { backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Section développement */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {/* Séparateur élégant avec animation */}
          <div className="flex items-center justify-center mb-8">
            <motion.div
              className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            />
            <motion.div
              className="px-6 py-2 bg-purple-900/50 backdrop-blur-sm rounded-full border border-purple-500/30"
              whileHover={{ scale: 1.05, borderColor: 'rgba(168, 85, 247, 0.5)' }}
            >
              <span className="text-purple-300 text-sm font-semibold uppercase tracking-wider">
                Pages de Développement
              </span>
            </motion.div>
            <motion.div
              className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            />
          </div>

          {/* Cartes de développement */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {devItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 1.3 + 0.1 * index,
                  type: 'spring' as const,
                  stiffness: 200,
                }}
                onClick={() => router.push(item.path)}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
              >
                <div className={`relative bg-gradient-to-br ${item.color} rounded-2xl p-6 overflow-hidden group shadow-lg hover:shadow-2xl transition-shadow duration-300`}>
                  {/* Effet de brillance continu */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' as const, repeatDelay: 1 }}
                  />

                  {/* Contenu */}
                  <div className="relative z-10 flex items-center gap-4">
                    <motion.div
                      className="text-4xl"
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{item.title}</h3>
                      <p className="text-white/70 text-xs">Cliquez pour tester</p>
                    </div>
                    <motion.div
                      className="text-white/50 group-hover:text-white/90 transition-colors text-xl"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </div>

                  {/* Bordure */}
                  <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer élégant avec effet glassmorphism */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10"
            whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.08)' }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-purple-300/70 text-sm">✨ Fait avec passion</span>
            <span className="text-purple-500/50">•</span>
            <span className="text-purple-300/70 text-sm">Tarot Français Traditionnel</span>
            <span className="text-purple-500/50">•</span>
            <span className="text-purple-300/70 text-sm">2024</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Vignette améliorée */}
      <div
        className="fixed inset-0 pointer-events-none -z-5"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
    </div>
  );
}
