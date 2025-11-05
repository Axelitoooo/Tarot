'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
    { title: 'Test Deck', icon: '🧪', path: '/test-deck', color: 'from-emerald-500 to-teal-600' },
    { title: 'Test Enchères', icon: '🎲', path: '/test-game', color: 'from-blue-500 to-indigo-600' },
    { title: 'Test Jeu', icon: '🎯', path: '/test-play', color: 'from-violet-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Fond animé avec effet de profondeur */}
      <div className="absolute inset-0">
        {/* Grille de fond */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        {/* Orbes lumineux animés */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full filter blur-[100px] opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full filter blur-[100px] opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full filter blur-[100px] opacity-15"
          animate={{
            scale: [1, 1.3, 1],
            x: [-50, -50, -50],
            y: [-50, -50, -50],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* En-tête avec animation */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo/Icône */}
          <motion.div
            className="inline-block mb-6"
            animate={{
              rotate: [0, -5, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="text-8xl md:text-9xl drop-shadow-2xl">🃏</div>
          </motion.div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 drop-shadow-lg">
            TAROT FRANÇAIS
          </h1>

          {/* Ligne décorative */}
          <motion.div
            className="w-64 h-1 mx-auto mb-4 rounded-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-purple-200 font-light">
            L'Art du Jeu Authentique
          </p>
        </motion.div>

        {/* Cartes de menu principales */}
        <div className="max-w-6xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => router.push(item.path)}
              className="cursor-pointer group"
            >
              <motion.div
                className={`relative h-full bg-gradient-to-br ${item.color} rounded-3xl p-8 overflow-hidden`}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Effet de brillance */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={hoveredCard === item.id ? { x: '200%' } : {}}
                  transition={{ duration: 0.8 }}
                />

                {/* Badge NOUVEAU */}
                {item.badge && (
                  <motion.div
                    className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-black shadow-lg"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [-3, 3, -3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {item.badge}
                  </motion.div>
                )}

                {/* Contenu */}
                <div className="relative z-10">
                  {/* Icône */}
                  <motion.div
                    className="text-6xl mb-4"
                    animate={hoveredCard === item.id ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Titre */}
                  <h2 className="text-3xl font-black text-white mb-2">
                    {item.title}
                  </h2>

                  {/* Sous-titre */}
                  <p className="text-sm text-white/80 font-semibold mb-3 uppercase tracking-wide">
                    {item.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-white/90 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {/* Flèche */}
                  <motion.div
                    className="mt-6 text-white/70 text-2xl"
                    animate={hoveredCard === item.id ? { x: 10 } : { x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    →
                  </motion.div>
                </div>

                {/* Bordure lumineuse */}
                <div className="absolute inset-0 rounded-3xl border border-white/10" />
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-white/0"
                  animate={hoveredCard === item.id ? { borderColor: 'rgba(255,255,255,0.3)' } : {}}
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
          transition={{ delay: 0.8 }}
        >
          {/* Séparateur élégant */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="px-6 py-2 bg-purple-900/50 backdrop-blur-sm rounded-full border border-purple-500/30">
              <span className="text-purple-300 text-sm font-semibold uppercase tracking-wider">
                Pages de Développement
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          </div>

          {/* Cartes de développement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {devItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + 0.1 * index }}
                onClick={() => router.push(item.path)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
              >
                <div className={`relative bg-gradient-to-br ${item.color} rounded-2xl p-6 overflow-hidden group`}>
                  {/* Effet de brillance */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Contenu */}
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="text-4xl">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{item.title}</h3>
                      <p className="text-white/70 text-xs">Cliquez pour tester</p>
                    </div>
                    <div className="text-white/50 group-hover:text-white/90 transition-colors">→</div>
                  </div>

                  {/* Bordure */}
                  <div className="absolute inset-0 rounded-2xl border border-white/10" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer élégant */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
            <span className="text-purple-300/70 text-sm">
              ✨ Fait avec passion
            </span>
            <span className="text-purple-500/50">•</span>
            <span className="text-purple-300/70 text-sm">
              Tarot Français Traditionnel
            </span>
            <span className="text-purple-500/50">•</span>
            <span className="text-purple-300/70 text-sm">
              2024
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
