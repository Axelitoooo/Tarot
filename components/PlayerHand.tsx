'use client';

import { Card as CardType } from '@/types/card';
import TarotCard from './TarotCard';

interface PlayerHandProps {
  cards: CardType[];
  playableCards: CardType[];
  onCardClick?: (card: CardType) => void;
  selectedCards?: Set<string>;
}

export default function PlayerHand({
  cards,
  playableCards,
  onCardClick,
  selectedCards = new Set(),
}: PlayerHandProps) {
  const totalCards = cards.length;
  const maxSpread = 140; // Angle max d'étalement (en degrés)
  const cardSpacing = totalCards > 1 ? maxSpread / (totalCards - 1) : 0;

  return (
    <div className="relative w-full h-64 flex items-end justify-center">
      <div className="relative" style={{ width: `${totalCards * 60}px`, height: '180px' }}>
        {cards.map((card, index) => {
          const isPlayable = playableCards.some(c => c.id === card.id);
          const isSelected = selectedCards.has(card.id);

          // Calcul de la position en arc
          const centerIndex = (totalCards - 1) / 2;
          const offsetFromCenter = index - centerIndex;
          const angle = offsetFromCenter * (cardSpacing / totalCards) * (totalCards > 10 ? 0.8 : 1);

          // Position horizontale
          const xPos = 50 + (offsetFromCenter * (100 / Math.max(totalCards, 10)));

          // Position verticale (arc)
          const yOffset = Math.abs(offsetFromCenter) * 5;

          return (
            <div
              key={card.id}
              className="absolute transition-all duration-300 ease-out"
              style={{
                left: `${xPos}%`,
                bottom: `${isSelected ? 40 : yOffset}px`,
                transform: `translateX(-50%) rotate(${angle}deg)`,
                transformOrigin: 'bottom center',
                zIndex: isSelected ? 100 : totalCards - Math.abs(offsetFromCenter),
              }}
            >
              <TarotCard
                card={card}
                onClick={() => onCardClick && isPlayable && onCardClick(card)}
                isPlayable={isPlayable}
                isSelected={isSelected}
                size="medium"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
