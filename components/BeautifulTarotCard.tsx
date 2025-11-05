'use client';

import { motion } from 'framer-motion';
import { Card as CardType, Suit, Rank } from '@/types/card';
import { getSuitSymbol, getCardName } from '@/lib/game';

interface TarotCardProps {
  card: CardType;
  onClick?: () => void;
  isPlayable?: boolean;
  isSelected?: boolean;
  size?: 'small' | 'medium' | 'large';
  faceDown?: boolean;
  className?: string;
}

export default function BeautifulTarotCard({
  card,
  onClick,
  isPlayable = true,
  isSelected = false,
  size = 'medium',
  faceDown = false,
  className = '',
}: TarotCardProps) {
  const getSuitColor = (suit: Suit): string => {
    if (suit === Suit.HEART || suit === Suit.DIAMOND) return '#DC143C';
    if (suit === Suit.TRUMP) return '#1a1a2e';
    if (suit === Suit.EXCUSE) return '#d4af37';
    return '#000000';
  };

  const sizeClasses = {
    small: { width: 80, height: 120 },
    medium: { width: 120, height: 180 },
    large: { width: 140, height: 210 },
  };

  const dimensions = sizeClasses[size];
  const suitColor = getSuitColor(card.suit);
  const suitSymbol = getSuitSymbol(card.suit);

  const getRankDisplay = () => {
    if (card.suit === Suit.TRUMP) {
      return card.trumpNumber?.toString() || '';
    }
    if (card.suit === Suit.EXCUSE) return 'E';
    if (card.rank === Rank.KING) return 'R';
    if (card.rank === Rank.QUEEN) return 'D';
    if (card.rank === Rank.KNIGHT) return 'C';
    if (card.rank === Rank.JACK) return 'V';
    if (card.rank === Rank.ACE) return 'A';
    return card.rank || '';
  };

  // DOS DE CARTE - Design magnifique
  if (faceDown) {
    return (
      <motion.svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 120 180"
        className={`cursor-pointer ${className}`}
        onClick={onClick && isPlayable ? onClick : undefined}
        whileHover={isPlayable ? { scale: 1.05, y: -5 } : {}}
        whileTap={isPlayable ? { scale: 0.98 } : {}}
      >
        {/* Fond principal */}
        <defs>
          <linearGradient id="cardBack" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#8B0000', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#A52A2A', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#8B0000', stopOpacity: 1 }} />
          </linearGradient>
          <pattern id="backPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.5" fill="#FFD700" opacity="0.3" />
          </pattern>
        </defs>

        {/* Carte de base */}
        <rect width="120" height="180" rx="8" fill="url(#cardBack)" />
        <rect width="120" height="180" rx="8" fill="url(#backPattern)" />

        {/* Bordure dorée */}
        <rect x="5" y="5" width="110" height="170" rx="6" fill="none" stroke="#FFD700" strokeWidth="2" />
        <rect x="8" y="8" width="104" height="164" rx="5" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.5" />

        {/* Motif central */}
        <g transform="translate(60, 90)">
          {/* Étoile centrale */}
          <path
            d="M0,-20 L5,-6 L20,-6 L8,3 L13,17 L0,8 L-13,17 L-8,3 L-20,-6 L-5,-6 Z"
            fill="#FFD700"
            opacity="0.8"
          />
          {/* Cercle */}
          <circle r="30" fill="none" stroke="#FFD700" strokeWidth="1.5" opacity="0.5" />
          <circle r="35" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* Coins décoratifs */}
        {[
          [15, 15],
          [105, 15],
          [15, 165],
          [105, 165],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#FFD700" opacity="0.6" />
        ))}

        {/* Ombre portée */}
        <rect
          width="120"
          height="180"
          rx="8"
          fill="none"
          stroke="#000"
          strokeWidth="1"
          opacity="0.2"
        />
      </motion.svg>
    );
  }

  // FACE DE CARTE - Design magnifique
  return (
    <motion.svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 120 180"
      className={`${onClick && isPlayable ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick && isPlayable ? onClick : undefined}
      whileHover={isPlayable ? { scale: 1.08, y: -8 } : {}}
      whileTap={isPlayable ? { scale: 0.98 } : {}}
      animate={isSelected ? { scale: 1.08, y: -8 } : {}}
    >
      <defs>
        {/* Gradient de fond */}
        <linearGradient id={`cardFace-${card.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFFEF7', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FFF9E6', stopOpacity: 1 }} />
        </linearGradient>

        {/* Ombre portée */}
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>

        {/* Ombre douce pour le symbole */}
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Carte de base */}
      <rect width="120" height="180" rx="8" fill="url(#cardFace-${card.id})" filter="url(#shadow)" />

      {/* Bordure */}
      <rect
        x="2"
        y="2"
        width="116"
        height="176"
        rx="7"
        fill="none"
        stroke="#8B7355"
        strokeWidth="1.5"
      />
      <rect
        x="5"
        y="5"
        width="110"
        height="170"
        rx="6"
        fill="none"
        stroke="#D4C4A8"
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* Coin supérieur gauche */}
      <g transform="translate(12, 12)">
        <text
          fontSize="16"
          fontWeight="bold"
          fill={suitColor}
          fontFamily="serif"
          filter="url(#softShadow)"
        >
          {getRankDisplay()}
        </text>
        <text
          y="18"
          fontSize="20"
          fill={suitColor}
          filter="url(#softShadow)"
        >
          {suitSymbol}
        </text>
      </g>

      {/* Coin inférieur droit (inversé) */}
      <g transform="translate(108, 168) rotate(180)">
        <text
          fontSize="16"
          fontWeight="bold"
          fill={suitColor}
          fontFamily="serif"
          filter="url(#softShadow)"
        >
          {getRankDisplay()}
        </text>
        <text
          y="18"
          fontSize="20"
          fill={suitColor}
          filter="url(#softShadow)"
        >
          {suitSymbol}
        </text>
      </g>

      {/* Symbole central */}
      <g transform="translate(60, 90)">
        {card.suit === Suit.EXCUSE ? (
          <>
            <text
              textAnchor="middle"
              fontSize="50"
              y="15"
            >
              🃏
            </text>
            <text
              textAnchor="middle"
              y="30"
              fontSize="10"
              fontWeight="bold"
              fill={suitColor}
              fontFamily="serif"
            >
              EXCUSE
            </text>
          </>
        ) : card.suit === Suit.TRUMP ? (
          <>
            <text
              textAnchor="middle"
              fontSize="50"
              fontWeight="bold"
              fill={suitColor}
              fontFamily="serif"
              filter="url(#softShadow)"
            >
              {card.trumpNumber}
            </text>
            <text
              textAnchor="middle"
              y="25"
              fontSize="30"
              fill={suitColor}
              filter="url(#softShadow)"
            >
              ★
            </text>
          </>
        ) : (
          <text
            textAnchor="middle"
            fontSize="60"
            fill={suitColor}
            filter="url(#softShadow)"
          >
            {suitSymbol}
          </text>
        )}
      </g>

      {/* Badge BOUT */}
      {card.isOudler && (
        <g transform="translate(95, 15)">
          <rect
            x="-22"
            y="-8"
            width="44"
            height="16"
            rx="8"
            fill="#FFD700"
            stroke="#B8942C"
            strokeWidth="1"
          />
          <text
            textAnchor="middle"
            y="4"
            fontSize="8"
            fontWeight="bold"
            fill="#3A2F1E"
            fontFamily="sans-serif"
          >
            ★ BOUT
          </text>
        </g>
      )}

      {/* Sélection */}
      {isSelected && (
        <rect
          width="120"
          height="180"
          rx="8"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
        />
      )}

      {/* Non jouable */}
      {!isPlayable && (
        <rect width="120" height="180" rx="8" fill="#000" opacity="0.4" />
      )}
    </motion.svg>
  );
}
