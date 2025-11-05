'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Générer des particules flottantes
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient animé de fond */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 30%, rgba(139, 69, 19, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(34, 139, 34, 0.3) 0%, transparent 50%)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        }}
      />

      {/* Particules flottantes */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-yellow-200/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
        />
      ))}

      {/* Vagues lumineuses */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255, 215, 0, 0.05) 50%, transparent 100%)',
        }}
        animate={{
          y: ['-100%', '100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear' as const,
        }}
      />

      {/* Brillance dorée */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.5) 50%, transparent 100%)',
          boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear' as const,
        }}
      />
    </div>
  );
}
