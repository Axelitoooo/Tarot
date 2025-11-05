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

export default function TarotCard({
  card,
  onClick,
  isPlayable = true,
  isSelected = false,
  size = 'medium',
  faceDown = false,
  className = '',
}: TarotCardProps) {
  // Couleurs pour chaque couleur de carte
  const getSuitColor = (suit: Suit): string => {
    if (suit === Suit.HEART || suit === Suit.DIAMOND) return '#DC143C'; // Rouge crimson
    if (suit === Suit.TRUMP) return '#4B0082'; // Indigo pour atouts
    if (suit === Suit.EXCUSE) return '#FFD700'; // Or pour l'Excuse
    return '#2C3E50'; // Noir bleuté pour Pique/Trèfle
  };

  // Tailles des cartes
  const sizeClasses = {
    small: 'w-16 h-24',
    medium: 'w-24 h-36',
    large: 'w-28 h-42',
  };

  // DOS DE CARTE
  if (faceDown) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl cursor-default shadow-xl ${className}`}
        style={{
          background: 'linear-gradient(145deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
          border: '3px solid #654321',
        }}
      >
        <div className="w-full h-full p-2 flex items-center justify-center relative overflow-hidden rounded-lg">
          {/* Motif du dos */}
          <div className="absolute inset-1 border-4 border-double border-gold rounded-lg bg-gradient-to-br from-yellow-700 via-yellow-800 to-yellow-900"></div>

          {/* Décoration centrale */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="text-4xl mb-1">🃏</div>
            <div className="text-xs font-bold text-gold-light">TAROT</div>
          </div>

          {/* Motifs décoratifs coins */}
          <div className="absolute top-1 left-1 text-gold text-xs">❖</div>
          <div className="absolute top-1 right-1 text-gold text-xs">❖</div>
          <div className="absolute bottom-1 left-1 text-gold text-xs">❖</div>
          <div className="absolute bottom-1 right-1 text-gold text-xs">❖</div>
        </div>
      </div>
    );
  }

  // Obtenir le nom de la figure
  const getRankName = () => {
    if (card.suit === Suit.TRUMP) {
      if (card.trumpNumber === 1) return 'PETIT';
      if (card.trumpNumber === 21) return 'MONDE';
      return String(card.trumpNumber);
    }
    if (card.suit === Suit.EXCUSE) return 'EXCUSE';

    switch (card.rank) {
      case Rank.KING: return 'ROI';
      case Rank.QUEEN: return 'DAME';
      case Rank.KNIGHT: return 'CAVALIER';
      case Rank.JACK: return 'VALET';
      case Rank.ACE: return 'AS';
      default: return card.rank || '';
    }
  };

  const rankDisplay = getRankName();
  const suitColor = getSuitColor(card.suit);
  const suitSymbol = getSuitSymbol(card.suit);

  // Déterminer si c'est une figure (pour affichage différent)
  const isFigure = card.rank && [Rank.JACK, Rank.KNIGHT, Rank.QUEEN, Rank.KING].includes(card.rank);
  const isTrump = card.suit === Suit.TRUMP;
  const isExcuse = card.suit === Suit.EXCUSE;
  const isOudler = card.isOudler;

  return (
    <div
      onClick={onClick && isPlayable ? onClick : undefined}
      className={`
        ${sizeClasses[size]}
        rounded-xl
        transition-all
        duration-300
        transform
        ${onClick && isPlayable ? 'cursor-pointer hover:scale-110 hover:-translate-y-4 hover:shadow-2xl' : ''}
        ${!isPlayable ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        ${isSelected ? 'ring-4 ring-blue-500 scale-110 -translate-y-4 shadow-2xl' : 'shadow-xl'}
        ${isOudler ? 'ring-2 ring-yellow-400' : ''}
        ${className}
      `}
      style={{
        background: 'linear-gradient(to bottom, #FFFEF5 0%, #FFF9E5 50%, #FFFEF5 100%)',
        border: '3px solid #8B7355',
        boxShadow: isSelected
          ? '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)'
          : '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)',
      }}
    >
      <div className="w-full h-full p-2 flex flex-col relative">
        {/* BORDURE INTÉRIEURE DÉCORATIVE */}
        <div
          className="absolute inset-1 rounded-lg pointer-events-none"
          style={{
            border: '1px solid rgba(139, 115, 85, 0.3)',
          }}
        />

        {/* COIN SUPÉRIEUR GAUCHE */}
        <div className="relative z-10 flex flex-col items-start">
          <div
            className="font-black leading-none"
            style={{
              color: suitColor,
              fontSize: size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px',
            }}
          >
            {isTrump || isExcuse ? (
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold">{rankDisplay}</div>
              </div>
            ) : (
              <>
                <div className="mb-0.5">{suitSymbol}</div>
                <div className="text-xs font-bold mt-0.5">
                  {card.rank === Rank.KING ? 'R' :
                   card.rank === Rank.QUEEN ? 'D' :
                   card.rank === Rank.KNIGHT ? 'C' :
                   card.rank === Rank.JACK ? 'V' :
                   card.rank === Rank.ACE ? 'A' : card.rank}
                </div>
              </>
            )}
          </div>
        </div>

        {/* CENTRE - SYMBOLE PRINCIPAL */}
        <div className="flex-1 flex items-center justify-center">
          {isExcuse ? (
            // L'EXCUSE - Design spécial
            <div className="text-center">
              <div className="text-5xl mb-2">🃏</div>
              <div
                className="text-lg font-black"
                style={{ color: suitColor }}
              >
                L'EXCUSE
              </div>
              <div className="text-xs text-gray-600 font-semibold mt-1">
                Le Mat
              </div>
            </div>
          ) : isTrump ? (
            // ATOUT
            <div className="text-center">
              <div
                className="text-7xl font-black leading-none mb-2"
                style={{
                  color: suitColor,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                {card.trumpNumber}
              </div>
              {card.trumpNumber === 1 && (
                <div className="text-xs font-bold text-gray-700">LE PETIT</div>
              )}
              {card.trumpNumber === 21 && (
                <div className="text-xs font-bold text-gray-700">LE MONDE</div>
              )}
              <div
                className="text-6xl mt-2"
                style={{ color: suitColor }}
              >
                ★
              </div>
            </div>
          ) : isFigure ? (
            // FIGURES (Roi, Dame, Cavalier, Valet)
            <div className="text-center">
              <div
                className="text-6xl leading-none mb-2"
                style={{ color: suitColor }}
              >
                {suitSymbol}
              </div>
              <div
                className="text-sm font-black"
                style={{ color: suitColor }}
              >
                {rankDisplay}
              </div>
            </div>
          ) : (
            // CARTES NUMÉRIQUES (As + numéros)
            <div className="flex flex-wrap items-center justify-center gap-1 px-1">
              {Array.from({ length: Math.min(parseInt(card.rank || '1'), 10) }).map((_, i) => (
                <div
                  key={i}
                  className="text-2xl"
                  style={{ color: suitColor }}
                >
                  {suitSymbol}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COIN INFÉRIEUR DROIT (INVERSÉ) */}
        <div className="relative z-10 flex flex-col items-end transform rotate-180">
          <div
            className="font-black leading-none"
            style={{
              color: suitColor,
              fontSize: size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px',
            }}
          >
            {isTrump || isExcuse ? (
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold">{rankDisplay}</div>
              </div>
            ) : (
              <>
                <div className="mb-0.5">{suitSymbol}</div>
                <div className="text-xs font-bold mt-0.5">
                  {card.rank === Rank.KING ? 'R' :
                   card.rank === Rank.QUEEN ? 'D' :
                   card.rank === Rank.KNIGHT ? 'C' :
                   card.rank === Rank.JACK ? 'V' :
                   card.rank === Rank.ACE ? 'A' : card.rank}
                </div>
              </>
            )}
          </div>
        </div>

        {/* BADGE BOUT */}
        {isOudler && (
          <div
            className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900 text-xs font-black px-2 py-1 rounded-full shadow-lg z-20 animate-pulse"
          >
            ★ BOUT
          </div>
        )}

        {/* POINTS (en bas à gauche si large) */}
        {size === 'large' && (
          <div className="absolute bottom-1 left-1 text-[10px] text-gray-500 font-bold bg-white/80 px-1 rounded">
            {card.points}pts
          </div>
        )}
      </div>
    </div>
  );
}
