'use client';

import { motion } from 'framer-motion';

export default function AnimatedTitle() {
  const title = 'TAROT FRANÇAIS';
  const subtitle = "L'Art du Jeu Authentique";

  // Animation lettre par lettre
  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        type: 'spring' as const,
        stiffness: 100,
      },
    }),
  };

  // Animation du joker
  const jokerVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.8,
        duration: 0.8,
        type: 'spring' as const,
        stiffness: 120,
      },
    },
    float: {
      y: [-5, 5, -5],
      rotate: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div className="text-center mb-16">
      {/* Icône Joker */}
      <motion.div
        className="text-8xl mb-4"
        variants={jokerVariants}
        initial="hidden"
        animate={['visible', 'float']}
      >
        🃏
      </motion.div>

      {/* Titre principal avec effet de particules dorées */}
      <div className="relative">
        <motion.div
          className="absolute inset-0 blur-2xl opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.5) 0%, transparent 70%)',
          }}
        />

        <h1 className="relative text-7xl md:text-8xl font-black mb-4">
          {title.split('').map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="inline-block"
              style={{
                background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
                filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Ligne décorative animée */}
      <motion.div
        className="w-64 h-1 mx-auto mb-4 rounded-full overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #FFD700 50%, transparent 100%)',
        }}
      >
        <motion.div
          className="h-full w-full"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* Sous-titre avec effet de fade */}
      <motion.p
        className="text-2xl md:text-3xl text-amber-200/90 font-light tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        style={{
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        }}
      >
        {subtitle}
      </motion.p>

      {/* Étoiles scintillantes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300"
          style={{
            left: `${20 + i * 15}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}
