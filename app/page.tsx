'use client';

import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import AnimatedTitle from '@/components/AnimatedTitle';
import MenuCard from '@/components/MenuCard';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fond dégradé de base */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        }}
      />

      {/* Texture bois subtile */}
      <div
        className="fixed inset-0 -z-10 opacity-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(139, 69, 19, 0.3) 2px,
              rgba(139, 69, 19, 0.3) 4px
            )
          `,
        }}
      />

      {/* Background animé */}
      <AnimatedBackground />

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-7xl w-full">
          {/* Titre animé */}
          <AnimatedTitle />

          {/* Grille de cartes principales */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {/* Multijoueur - Card Large */}
            <MenuCard
              href="/multiplayer"
              icon="🌐"
              title="MULTIJOUEUR"
              description="Créez une partie et invitez vos amis en temps réel ! Jouez ensemble où que vous soyez."
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              delay={0}
              large
            />

            {/* Mode Solo */}
            <MenuCard
              href="/game"
              icon="🎮"
              title="MODE SOLO"
              description="Affrontez l'IA dans une partie de Tarot classique. Perfectionnez vos stratégies !"
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              delay={0.1}
              large
            />
          </motion.div>

          {/* Carte Showcase Réaliste */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7, duration: 0.6 }}
          >
            <MenuCard
              href="/test-cards"
              icon="🎴"
              title="CARTES RÉALISTES"
              description="Découvrez nos cartes avec un design ultra-réaliste et authentique. Texture, ombres, animations... tout y est !"
              gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
              delay={0}
              badge="NOUVEAU"
            />
          </motion.div>

          {/* Séparateur animé */}
          <motion.div
            className="relative my-12"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.9, duration: 0.8 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-white/20" />
            </div>
            <div className="relative flex justify-center">
              <motion.span
                className="px-6 py-2 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm text-white/70 text-sm font-semibold rounded-full border border-white/10"
                whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                PAGES DE DÉVELOPPEMENT
              </motion.span>
            </div>
          </motion.div>

          {/* Cartes de test - Grid compact */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
              <a
                href="/test-deck"
                className="block group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.6 }}
                />
                <div className="relative text-white">
                  <div className="text-4xl mb-2">🧪</div>
                  <h3 className="font-bold text-lg mb-1">Test Deck</h3>
                  <p className="text-sm text-white/80">Distribution & Validation</p>
                </div>
              </a>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
              <a
                href="/test-game"
                className="block group relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.6 }}
                />
                <div className="relative text-white">
                  <div className="text-4xl mb-2">🎲</div>
                  <h3 className="font-bold text-lg mb-1">Test Enchères</h3>
                  <p className="text-sm text-white/80">Phase d'enchères</p>
                </div>
              </a>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
              <a
                href="/test-play"
                className="block group relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.6 }}
                />
                <div className="relative text-white">
                  <div className="text-4xl mb-2">🎯</div>
                  <h3 className="font-bold text-lg mb-1">Test Jeu</h3>
                  <p className="text-sm text-white/80">Jouer une partie</p>
                </div>
              </a>
            </motion.div>
          </motion.div>

          {/* Footer avec animation */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <motion.div
              className="inline-block px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
              whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <p className="text-white/60 text-sm">
                ✨ Fait avec passion • Tarot Français traditionnel • 2024
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Effet de vignette */}
      <div
        className="fixed inset-0 pointer-events-none -z-5"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />
    </div>
  );
}
