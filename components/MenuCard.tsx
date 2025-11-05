'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface MenuCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
  badge?: string;
  large?: boolean;
}

export default function MenuCard({
  href,
  icon,
  title,
  description,
  gradient,
  delay = 0,
  badge,
  large = false,
}: MenuCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link href={href}>
        <motion.div
          className={`group relative overflow-hidden rounded-3xl ${
            large ? 'p-10' : 'p-8'
          } cursor-pointer`}
          style={{
            background: gradient,
          }}
          whileHover={{
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(212, 175, 55, 0.2)',
          }}
        >
          {/* Effet de brillance au survol */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.8 }}
          />

          {/* Badge NOUVEAU */}
          {badge && (
            <motion.div
              className="absolute -top-2 -right-2 z-10"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                {badge}
              </div>
            </motion.div>
          )}

          <div className="relative z-10">
            {/* Icône avec animation */}
            <motion.div
              className={`${large ? 'text-7xl mb-6' : 'text-5xl mb-4'}`}
              whileHover={{
                scale: 1.2,
                rotate: [0, -10, 10, 0],
              }}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.div>

            {/* Titre */}
            <motion.h2
              className={`font-black text-white mb-3 ${
                large ? 'text-4xl' : 'text-2xl'
              }`}
              style={{
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              {title}
            </motion.h2>

            {/* Description */}
            <motion.p
              className={`text-white/90 ${large ? 'text-lg' : 'text-sm'}`}
              style={{
                textShadow: '0 1px 5px rgba(0, 0, 0, 0.3)',
              }}
            >
              {description}
            </motion.p>

            {/* Indicateur de flèche */}
            <motion.div
              className="mt-4 text-white/70 text-xl"
              initial={{ x: 0 }}
              whileHover={{ x: 10 }}
              transition={{ duration: 0.3 }}
            >
              →
            </motion.div>
          </div>

          {/* Effet de lueur en bas */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-white/50"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
