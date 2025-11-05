'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import BeautifulTarotCard from '@/components/BeautifulTarotCard';
import { Card, Suit, Rank } from '@/types/card';
import { createDeck } from '@/lib/game/deck';

type FilterType = 'all' | 'bouts' | 'trumps' | 'hearts' | 'diamonds' | 'spades' | 'clubs';

export default function GalleryPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const deck = useMemo(() => createDeck(), []);

  const filteredCards = useMemo(() => {
    switch (filter) {
      case 'bouts':
        return deck.filter(card => card.isOudler);
      case 'trumps':
        return deck.filter(card => card.suit === Suit.TRUMP || card.suit === Suit.EXCUSE);
      case 'hearts':
        return deck.filter(card => card.suit === Suit.HEART);
      case 'diamonds':
        return deck.filter(card => card.suit === Suit.DIAMOND);
      case 'spades':
        return deck.filter(card => card.suit === Suit.SPADE);
      case 'clubs':
        return deck.filter(card => card.suit === Suit.CLUB);
      default:
        return deck;
    }
  }, [deck, filter]);

  const filters: { type: FilterType; label: string; icon: string; color: string }[] = [
    { type: 'all', label: 'Toutes', icon: '🎴', color: 'from-purple-500 to-pink-500' },
    { type: 'bouts', label: 'Bouts', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
    { type: 'trumps', label: 'Atouts', icon: '👑', color: 'from-indigo-500 to-purple-500' },
    { type: 'hearts', label: 'Cœurs', icon: '♥️', color: 'from-red-500 to-rose-500' },
    { type: 'diamonds', label: 'Carreaux', icon: '♦️', color: 'from-rose-500 to-pink-500' },
    { type: 'spades', label: 'Piques', icon: '♠️', color: 'from-slate-500 to-gray-700' },
    { type: 'clubs', label: 'Trèfles', icon: '♣️', color: 'from-gray-600 to-slate-800' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full filter blur-[120px] opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full filter blur-[120px] opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' as const }}
        />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block text-7xl mb-4"
            animate={{
              rotateY: [0, 15, -15, 0],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            🎴
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
            Galerie du Tarot
          </h1>
          <p className="text-xl text-purple-200">
            {filteredCards.length} carte{filteredCards.length > 1 ? 's' : ''} • Design Premium SVG
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {filters.map((f, index) => (
            <motion.button
              key={f.type}
              onClick={() => setFilter(f.type)}
              className={`px-6 py-3 rounded-full font-bold text-white transition-all ${
                filter === f.type
                  ? `bg-gradient-to-r ${f.color} shadow-lg scale-105`
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: filter === f.type ? 1.05 : 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{f.icon}</span>
              {f.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-12"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.02,
                  layout: { duration: 0.3 },
                }}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setSelectedCard(card)}
                className="cursor-pointer"
              >
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    y: -10,
                    rotateY: 10,
                    zIndex: 50,
                  }}
                  transition={{ type: 'spring' as const, stiffness: 300 }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <BeautifulTarotCard
                    card={card}
                    size="small"
                    isSelected={selectedCard?.id === card.id}
                    isPlayable={true}
                  />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal pour carte sélectionnée */}
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCard(null)}
            >
              <motion.div
                className="relative"
                initial={{ scale: 0.5, rotateY: -180 }}
                animate={{ scale: 1, rotateY: 0 }}
                exit={{ scale: 0.5, rotateY: 180 }}
                transition={{ type: 'spring' as const, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  animate={{
                    rotateY: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <BeautifulTarotCard
                    card={selectedCard}
                    size="large"
                    isSelected={false}
                    isPlayable={true}
                  />
                </motion.div>

                {/* Info carte */}
                <motion.div
                  className="mt-6 text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedCard.suit === Suit.TRUMP && selectedCard.trumpNumber
                      ? `Atout ${selectedCard.trumpNumber}`
                      : selectedCard.suit === Suit.EXCUSE
                      ? "L'Excuse"
                      : `${selectedCard.rank} de ${
                          selectedCard.suit === Suit.HEART
                            ? 'Cœur'
                            : selectedCard.suit === Suit.DIAMOND
                            ? 'Carreau'
                            : selectedCard.suit === Suit.SPADE
                            ? 'Pique'
                            : 'Trèfle'
                        }`}
                  </h3>
                  <div className="flex items-center justify-center gap-4 text-purple-200">
                    <span>{selectedCard.points} points</span>
                    {selectedCard.isOudler && (
                      <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                        ⭐ BOUT
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Bouton fermer */}
                <motion.button
                  className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full font-bold text-xl shadow-lg"
                  onClick={() => setSelectedCard(null)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Retour au menu
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
