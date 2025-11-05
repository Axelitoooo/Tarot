'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          scale: 0.95,
          filter: 'blur(10px)',
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
        }}
        exit={{
          opacity: 0,
          scale: 1.05,
          filter: 'blur(10px)',
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut' as const,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
