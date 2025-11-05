'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/types/card';
import BeautifulTarotCard from './BeautifulTarotCard';
import { useState } from 'react';

interface PlayerHandFanProps {
  cards: Card[];
  playableCards?: Card[];
  selectedCards?: Set<string>;
  onCardClick?: (card: Card) => void;
  onCardSelect?: (cardId: string) => void;
  maxCards?: number;
}

export default function PlayerHandFan({
  cards,
  playableCards = [],
  selectedCards = new Set(),
  onCardClick,
  onCardSelect,
  maxCards = 18,
}: PlayerHandFanProps) {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Calculer l'angle de rotation pour chaque carte dans l'éventail
  const getCardTransform = (index: number, total: number) => {
    // Position relative dans l'éventail (-0.5 à 0.5)
    const position = (index - (total - 1) / 2) / Math.max(total - 1, 1);

    // Angle de rotation de cette carte (plus petit pour meilleure lisibilité)
    const maxAngle = 40; // Angle max de l'éventail en degrés
    const rotation = position * maxAngle;

    // Espacement horizontal BEAUCOUP plus large pour lisibilité
    let spacing;
    if (total <= 5) {
      spacing = 140; // Très espacé pour peu de cartes
    } else if (total <= 10) {
      spacing = 110; // Bien espacé
    } else if (total <= 15) {
      spacing = 85; // Espace moyen
    } else {
      spacing = 70; // Plus compact mais toujours lisible
    }

    const x = position * spacing * total * 0.4; // Multiplier pour étaler

    // Arc plus prononcé pour effet réaliste
    const y = Math.abs(position) * Math.abs(position) * 80;

    return {
      rotation,
      x,
      y,
      zIndex: index,
    };
  };

  const isCardPlayable = (card: Card) => {
    return playableCards.length === 0 || playableCards.some(c => c.id === card.id);
  };

  const isCardHovered = (cardId: string) => hoveredCardId === cardId;
  const isCardSelected = (cardId: string) => selectedCards.has(cardId);

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-end justify-center pb-2 pointer-events-none z-30">
      <div className="relative" style={{ width: '100vw', height: '320px' }}>
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => {
            const transform = getCardTransform(index, cards.length);
            const isPlayable = isCardPlayable(card);
            const isHovered = isCardHovered(card.id);
            const isSelected = isCardSelected(card.id);

            return (
              <motion.div
                key={card.id}
                layout
                className="absolute bottom-0 left-1/2 pointer-events-auto"
                initial={{
                  opacity: 0,
                  scale: 0.5,
                  y: 100,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: transform.x,
                  y: isSelected ? -80 : (isHovered ? -60 : transform.y),
                  rotate: transform.rotation,
                  zIndex: isHovered || isSelected ? 1000 : transform.zIndex,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                  y: 100,
                  transition: { duration: 0.3 },
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8,
                }}
                style={{
                  transformOrigin: 'bottom center',
                }}
                onMouseEnter={() => isPlayable && setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => {
                  if (isPlayable) {
                    if (onCardSelect) {
                      onCardSelect(card.id);
                    } else if (onCardClick) {
                      onCardClick(card);
                    }
                  }
                }}
              >
                <motion.div
                  animate={{
                    scale: isHovered ? 1.15 : (isSelected ? 1.1 : 1),
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                  className="relative"
                >
                  {/* Effet de brillance sur hover */}
                  {isHovered && (
                    <motion.div
                      className="absolute -inset-2 rounded-2xl"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(255, 215, 0, 0.5)',
                          '0 0 40px rgba(255, 215, 0, 0.8)',
                          '0 0 20px rgba(255, 215, 0, 0.5)',
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  )}

                  {/* Badge de sélection */}
                  {isSelected && (
                    <motion.div
                      className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center z-10"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                    >
                      <span className="text-white text-xl font-bold">✓</span>
                    </motion.div>
                  )}

                  {/* Badge non-jouable */}
                  {!isPlayable && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10">
                      <span className="text-white text-4xl">🚫</span>
                    </div>
                  )}

                  {/* La carte elle-même */}
                  <div
                    className={`
                      ${isPlayable ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}
                      ${isHovered ? 'filter drop-shadow-2xl' : 'filter drop-shadow-lg'}
                    `}
                    style={{
                      filter: isHovered
                        ? 'drop-shadow(0 20px 30px rgba(0,0,0,0.5)) brightness(1.1)'
                        : 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                    }}
                  >
                    <BeautifulTarotCard
                      card={card}
                      size="small"
                      isPlayable={isPlayable}
                      isSelected={isSelected}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Indicateur du nombre de cartes */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border-2 border-yellow-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold text-sm">Votre main:</span>
          <span className="text-white font-black text-lg">{cards.length}</span>
          <span className="text-gray-400 text-sm">carte{cards.length > 1 ? 's' : ''}</span>
        </div>
      </motion.div>

      {/* Indication de cartes jouables */}
      {playableCards.length > 0 && playableCards.length < cards.length && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-green-600/90 backdrop-blur-md px-6 py-3 rounded-full border-2 border-green-400 shadow-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">
              ✨ {playableCards.length} carte{playableCards.length > 1 ? 's' : ''} jouable{playableCards.length > 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>
      )}

      {/* Indication de sélection multiple */}
      {selectedCards.size > 0 && onCardSelect && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur-md px-6 py-3 rounded-full border-2 border-blue-400 shadow-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-white font-bold">
              📋 {selectedCards.size} carte{selectedCards.size > 1 ? 's' : ''} sélectionnée{selectedCards.size > 1 ? 's' : ''}
            </span>
            {selectedCards.size >= maxCards && (
              <span className="text-yellow-300 text-sm font-bold">
                (Maximum atteint)
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
