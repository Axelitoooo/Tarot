'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export interface HistoryEntry {
  id: string;
  timestamp: Date;
  player: string;
  action: string;
  details?: string;
  icon: string;
}

interface GameHistoryProps {
  entries: HistoryEntry[];
}

export default function GameHistory({ entries }: GameHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed left-6 top-20 z-40">
      <motion.div
        className="bg-black/80 backdrop-blur-md rounded-xl border-2 border-yellow-600/50 overflow-hidden shadow-2xl"
        initial={{ width: 60 }}
        animate={{ width: isExpanded ? 350 : 60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Bouton toggle */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-14 flex items-center justify-center bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-2xl">📜</span>
          </motion.div>

          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3 text-white font-bold text-sm whitespace-nowrap"
              >
                Historique
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Contenu de l'historique */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[500px] overflow-y-auto"
            >
              <div className="p-4 space-y-2">
                {entries.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    Aucune action pour le moment
                  </p>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {entries.slice().reverse().map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 25,
                          delay: index * 0.05,
                        }}
                        className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-yellow-600/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {/* Icône */}
                          <div className="text-2xl flex-shrink-0">
                            {entry.icon}
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-yellow-400 font-bold text-xs">
                                {entry.player}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {entry.timestamp.toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </span>
                            </div>

                            <p className="text-white text-sm font-medium leading-tight">
                              {entry.action}
                            </p>

                            {entry.details && (
                              <p className="text-gray-400 text-xs mt-1">
                                {entry.details}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
