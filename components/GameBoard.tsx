'use client';

import { Card as CardType } from '@/types/card';
import { Player } from '@/types/game';
import TarotCard from './TarotCard';

interface GameBoardProps {
  players: Player[];
  currentPlayerIndex: number;
  currentTrick: CardType[];
  trickNumber: number;
  dealerIndex: number;
  takerIndex: number | null;
}

export default function GameBoard({
  players,
  currentPlayerIndex,
  currentTrick,
  trickNumber,
  dealerIndex,
  takerIndex,
}: GameBoardProps) {
  // Position des joueurs autour de la table (circulaire)
  const getPlayerPosition = (index: number, total: number) => {
    // Joueur 0 en bas, les autres tournent dans le sens anti-horaire
    const positions = {
      3: [
        { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }, // Bas
        { top: '20%', left: '10%' }, // Gauche
        { top: '20%', right: '10%' }, // Droite
      ],
      4: [
        { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }, // Bas
        { top: '50%', left: '5%', transform: 'translateY(-50%)' }, // Gauche
        { top: '5%', left: '50%', transform: 'translateX(-50%)' }, // Haut
        { top: '50%', right: '5%', transform: 'translateY(-50%)' }, // Droite
      ],
      5: [
        { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }, // Bas
        { bottom: '25%', left: '8%' }, // Bas-gauche
        { top: '25%', left: '8%' }, // Haut-gauche
        { top: '25%', right: '8%' }, // Haut-droite
        { bottom: '25%', right: '8%' }, // Bas-droite
      ],
    };

    return positions[total as 3 | 4 | 5][index];
  };

  // Position des cartes dans le pli central
  const getTrickCardPosition = (index: number, total: number) => {
    const angle = (index * 360) / total;
    const radius = 60; // pixels
    const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
    const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;

    return {
      left: '50%',
      top: '50%',
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle}deg)`,
    };
  };

  return (
    <div className="relative w-full h-full">
      {/* Table de jeu (feutre vert) */}
      <div
        className="absolute inset-0 rounded-[50%] shadow-2xl"
        style={{
          background: 'radial-gradient(ellipse at center, #2d5016 0%, #1a3d0a 70%, #0d1f05 100%)',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Motif du feutre */}
        <div
          className="absolute inset-0 rounded-[50%] opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.03) 10px,
              rgba(255,255,255,0.03) 20px
            )`,
          }}
        />
      </div>

      {/* Zone centrale pour le pli en cours */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96">
        {/* Cercle central */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
            border: '2px solid rgba(255,215,0,0.3)',
          }}
        />

        {/* Indicateur de pli */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-yellow-200 text-sm font-bold opacity-70">
            Pli {trickNumber}/18
          </div>
        </div>

        {/* Cartes du pli en cours */}
        {currentTrick.map((card, index) => (
          <div
            key={`trick-${index}`}
            className="absolute"
            style={getTrickCardPosition(index, players.length)}
          >
            <TarotCard card={card} size="medium" isPlayable={false} />
          </div>
        ))}
      </div>

      {/* Zones des joueurs */}
      {players.map((player, index) => {
        const position = getPlayerPosition(index, players.length);
        const isCurrentPlayer = index === currentPlayerIndex;
        const isDealer = index === dealerIndex;
        const isTaker = takerIndex === index;

        return (
          <div
            key={player.id}
            className="absolute"
            style={position}
          >
            <div className="relative">
              {/* Badge joueur */}
              <div
                className={`
                  px-4 py-2 rounded-lg font-bold text-sm shadow-lg
                  transition-all duration-300
                  ${isCurrentPlayer ? 'bg-yellow-400 text-yellow-900 scale-110' : 'bg-white/90 text-gray-800'}
                `}
                style={{
                  boxShadow: isCurrentPlayer
                    ? '0 0 20px rgba(234, 179, 8, 0.8), 0 4px 12px rgba(0,0,0,0.3)'
                    : '0 4px 8px rgba(0,0,0,0.2)',
                }}
              >
                <div className="flex items-center gap-2">
                  {/* Indicateurs */}
                  <div className="flex gap-1">
                    {isCurrentPlayer && (
                      <span className="text-lg">▶️</span>
                    )}
                    {isDealer && (
                      <span className="text-lg" title="Donneur">🎴</span>
                    )}
                    {isTaker && (
                      <span className="text-lg" title="Preneur">👑</span>
                    )}
                  </div>

                  {/* Nom */}
                  <span>{player.name}</span>
                </div>

                {/* Informations supplémentaires */}
                <div className="text-xs mt-1 opacity-75 flex gap-3">
                  <span>🃏 {player.hand.length}</span>
                  <span>🏆 {player.tricksWon.length}</span>
                  {player.score !== 0 && (
                    <span className={player.score > 0 ? 'text-green-600' : 'text-red-600'}>
                      {player.score > 0 ? '+' : ''}{player.score}
                    </span>
                  )}
                </div>
              </div>

              {/* Indicateur de tour (cercle pulsant) */}
              {isCurrentPlayer && (
                <div
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-yellow-400 animate-ping"
                  style={{ boxShadow: '0 0 10px rgba(234, 179, 8, 0.8)' }}
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Décorations de coins */}
      <div className="absolute top-4 left-4 text-yellow-700/20 text-6xl">♠</div>
      <div className="absolute top-4 right-4 text-red-700/20 text-6xl">♥</div>
      <div className="absolute bottom-4 left-4 text-red-700/20 text-6xl">♦</div>
      <div className="absolute bottom-4 right-4 text-yellow-700/20 text-6xl">♣</div>
    </div>
  );
}
