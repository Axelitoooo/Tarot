'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'bid' | 'play';
  duration?: number;
}

interface GameNotificationProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export default function GameNotification({ notifications, onRemove }: GameNotificationProps) {
  useEffect(() => {
    notifications.forEach(notification => {
      const duration = notification.duration || 3000;
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [notifications, onRemove]);

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-600 to-green-700',
          icon: '✅',
          border: 'border-green-400',
        };
      case 'error':
        return {
          bg: 'from-red-600 to-red-700',
          icon: '❌',
          border: 'border-red-400',
        };
      case 'warning':
        return {
          bg: 'from-yellow-600 to-yellow-700',
          icon: '⚠️',
          border: 'border-yellow-400',
        };
      case 'bid':
        return {
          bg: 'from-purple-600 to-indigo-700',
          icon: '💬',
          border: 'border-purple-400',
        };
      case 'play':
        return {
          bg: 'from-blue-600 to-blue-700',
          icon: '🎴',
          border: 'border-blue-400',
        };
      default:
        return {
          bg: 'from-gray-600 to-gray-700',
          icon: 'ℹ️',
          border: 'border-gray-400',
        };
    }
  };

  return (
    <div className="fixed top-20 right-6 z-50 pointer-events-none">
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => {
            const style = getNotificationStyle(notification.type);

            return (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
                className="pointer-events-auto"
              >
                <motion.div
                  className={`
                    relative
                    bg-gradient-to-r ${style.bg}
                    rounded-xl
                    px-6 py-4
                    shadow-2xl
                    border-2 ${style.border}
                    backdrop-blur-sm
                    min-w-[300px]
                    max-w-[400px]
                  `}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Effet de lueur */}
                  <div className="absolute inset-0 rounded-xl opacity-50 blur-xl bg-current" />

                  {/* Contenu */}
                  <div className="relative flex items-center gap-4">
                    {/* Icône animée */}
                    <motion.div
                      className="text-3xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 0.5,
                        times: [0, 0.5, 0.75, 1],
                      }}
                    >
                      {style.icon}
                    </motion.div>

                    {/* Message */}
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm leading-tight">
                        {notification.message}
                      </p>
                    </div>

                    {/* Bouton fermer */}
                    <button
                      onClick={() => onRemove(notification.id)}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Barre de progression */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-xl overflow-hidden"
                  >
                    <motion.div
                      className="h-full bg-white/50"
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{
                        duration: (notification.duration || 3000) / 1000,
                        ease: 'linear',
                      }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
