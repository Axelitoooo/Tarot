'use client';

import { motion } from 'framer-motion';
import { Player } from '@/types/game';
import { Card } from '@/types/card';
import BeautifulTarotCard from './BeautifulTarotCard';

interface PremiumGameBoardProps {
  players: Player[];
  currentPlayerIndex: number;
  currentTrick: Card[];
  trickNumber: number;
  dealerIndex: number;
  takerIndex: number | null;
}

export default function PremiumGameBoard({
  players,
  currentPlayerIndex,
  currentTrick,
  trickNumber,
  dealerIndex,
  takerIndex,
}: PremiumGameBoardProps) {
  // Positions des joueurs (N, E, S, W pour 4 joueurs)
  const getPlayerPosition = (index: number) => {
    const positions = [
      { top: '80%', left: '50%', transform: 'translate(-50%, 0)' }, // Joueur 0 (humain) - bas
      { top: '50%', right: '5%', transform: 'translate(0, -50%)' }, // Joueur 1 - droite
      { top: '10%', left: '50%', transform: 'translate(-50%, 0)' }, // Joueur 2 - haut
      { top: '50%', left: '5%', transform: 'translate(0, -50%)' }, // Joueur 3 - gauche
    ];

    return positions[index] || positions[0];
  };

  // Position des cartes jouées sur la table
  const getCardPosition = (index: number) => {
    const positions = [
      { top: '55%', left: '50%', transform: 'translate(-50%, 0)' }, // Bas
      { top: '45%', left: '55%', transform: 'translate(0, -50%)' }, // Droite
      { top: '35%', left: '50%', transform: 'translate(-50%, 0)' }, // Haut
      { top: '45%', left: '45%', transform: 'translate(0, -50%)' }, // Gauche
    ];

    return positions[index] || positions[0];
  };

  return (
    <div className="relative w-full h-full">
      {/* Texture de table en feutre vert premium */}
      <div
        className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: `
            radial-gradient(ellipse at center, #2d5f3a 0%, #1e4029 100%)
          `,
        }}
      >
        {/* Texture de feutre */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.1) 2px,
                rgba(0,0,0,0.1) 4px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.1) 2px,
                rgba(0,0,0,0.1) 4px
              )
            `,
          }}
        />

        {/* Ombre intérieure pour profondeur */}
        <div
          className="absolute inset-0"
          style={{
            boxShadow: 'inset 0 10px 50px rgba(0,0,0,0.5), inset 0 0 100px rgba(0,0,0,0.3)',
          }}
        />

        {/* Motif central de la table */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <svg width="400" height="400" viewBox="0 0 200 200">
            <defs>
              <radialGradient id="tablePattern">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="none" stroke="url(#tablePattern)" strokeWidth="2" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="url(#tablePattern)" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="url(#tablePattern)" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Zone centrale pour les plis */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
          {/* Cartes jouées dans le pli actuel */}
          {currentTrick.map((card, index) => {
            const pos = getCardPosition(index);
            return (
              <motion.div
                key={`${card.id}-${index}`}
                className="absolute"
                style={pos}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                  delay: index * 0.1,
                }}
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 10px 30px rgba(0,0,0,0.5)',
                      '0 15px 40px rgba(255,215,0,0.3)',
                      '0 10px 30px rgba(0,0,0,0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-xl"
                >
                  <BeautifulTarotCard card={card} isPlayable={false} size="medium" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Indicateur de tour de jeu */}
        <motion.div
          key={`turn-${currentPlayerIndex}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-16 h-16 rounded-full bg-yellow-400/20 border-4 border-yellow-400 shadow-lg" />
          <motion.div
            className="absolute inset-0 rounded-full bg-yellow-400/10"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Informations des joueurs */}
      {players.map((player, index) => {
        const pos = getPlayerPosition(index);
        const isCurrentPlayer = index === currentPlayerIndex;
        const isTaker = index === takerIndex;
        const isDealer = index === dealerIndex;

        return (
          <motion.div
            key={player.id}
            className="absolute"
            style={pos}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`
                px-6 py-3 rounded-xl
                backdrop-blur-md
                border-2
                shadow-xl
                ${isCurrentPlayer ? 'bg-yellow-500/90 border-yellow-300 scale-110' : 'bg-gray-800/90 border-gray-600'}
                ${isTaker ? 'ring-4 ring-red-500/50' : ''}
              `}
              animate={
                isCurrentPlayer
                  ? {
                      boxShadow: [
                        '0 10px 30px rgba(234, 179, 8, 0.4)',
                        '0 15px 40px rgba(234, 179, 8, 0.6)',
                        '0 10px 30px rgba(234, 179, 8, 0.4)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                {/* Badge preneur */}
                {isTaker && (
                  <motion.div
                    className="text-2xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    👑
                  </motion.div>
                )}

                {/* Badge donneur */}
                {isDealer && !isTaker && (
                  <motion.div className="text-xl">🎴</motion.div>
                )}

                <div className="text-center">
                  <div className={`font-bold text-sm ${isCurrentPlayer ? 'text-gray-900' : 'text-white'}`}>
                    {player.name}
                  </div>
                  <div className={`text-xs ${isCurrentPlayer ? 'text-gray-700' : 'text-gray-400'}`}>
                    {player.hand.length} cartes
                  </div>
                </div>

                {/* Indicateur de plis gagnés */}
                {player.tricksWon.length > 0 && (
                  <motion.div
                    className={`
                      px-2 py-1 rounded-full text-xs font-bold
                      ${isCurrentPlayer ? 'bg-gray-900 text-yellow-400' : 'bg-yellow-500 text-gray-900'}
                    `}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {player.tricksWon.length} 🏆
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Compteur de plis */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border-2 border-yellow-600 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 font-bold">Pli</span>
          <span className="text-white text-xl font-black">{trickNumber}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-400">18</span>
        </div>
      </motion.div>
    </div>
  );
}
