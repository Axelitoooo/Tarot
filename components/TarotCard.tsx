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
  // Couleurs authentiques pour chaque couleur de carte
  const getSuitColor = (suit: Suit): string => {
    if (suit === Suit.HEART || suit === Suit.DIAMOND) return '#B8282E'; // Rouge vermillon authentique
    if (suit === Suit.TRUMP) return '#2C1A52'; // Indigo foncé royal
    if (suit === Suit.EXCUSE) return '#C9A861'; // Or ancien mat
    return '#1A1A1A'; // Noir profond pour Pique/Trèfle
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
        className={`${sizeClasses[size]} rounded-lg cursor-default transition-all duration-300 ease-out ${
          onClick && isPlayable ? 'hover:scale-[1.05] hover:-translate-y-2' : ''
        } ${className}`}
        style={{
          background: `
            linear-gradient(180deg,
              rgba(0,0,0,0.15) 0%,
              transparent 3%,
              transparent 97%,
              rgba(0,0,0,0.25) 100%
            ),
            repeating-linear-gradient(
              90deg,
              #6B4423 0px,
              #7A4F2A 2px,
              #8B5A31 4px,
              #6B4423 6px
            ),
            linear-gradient(145deg, #7A4F2A 0%, #6B4423 50%, #7A4F2A 100%)
          `,
          border: '2px solid #4A3218',
          boxShadow: `
            0 2px 4px rgba(0,0,0,0.3),
            0 4px 8px rgba(0,0,0,0.2),
            0 8px 16px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.3)
          `,
        }}
      >
        <div className="w-full h-full p-2 flex items-center justify-center relative overflow-hidden rounded">
          {/* Texture bois subtile */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0,0,0,0.1) 2px,
                  rgba(0,0,0,0.1) 3px
                )
              `,
            }}
          />

          {/* Bordure intérieure dorée ornée */}
          <div
            className="absolute inset-2 rounded"
            style={{
              border: '3px double #C9A861',
              boxShadow: 'inset 0 0 0 1px rgba(201,168,97,0.3)',
            }}
          >
            {/* Motif central décoratif */}
            <div className="w-full h-full flex items-center justify-center relative">
              {/* Fond du motif central */}
              <div
                className="absolute inset-4 rounded-sm"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(201,168,97,0.25) 0%, transparent 70%)',
                }}
              />

              {/* Décoration centrale */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div
                  className="text-4xl mb-1 filter drop-shadow-md"
                  style={{
                    filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))',
                  }}
                >
                  🃏
                </div>
                <div
                  className="text-xs font-bold tracking-widest"
                  style={{
                    color: '#C9A861',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    fontFamily: 'serif',
                  }}
                >
                  TAROT
                </div>
              </div>

              {/* Ornements coins avec floriture */}
              <div
                className="absolute top-0 left-0 text-sm"
                style={{
                  color: '#C9A861',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                ✦
              </div>
              <div
                className="absolute top-0 right-0 text-sm"
                style={{
                  color: '#C9A861',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                ✦
              </div>
              <div
                className="absolute bottom-0 left-0 text-sm"
                style={{
                  color: '#C9A861',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                ✦
              </div>
              <div
                className="absolute bottom-0 right-0 text-sm"
                style={{
                  color: '#C9A861',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                ✦
              </div>
            </div>
          </div>
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
        rounded-lg
        transition-all
        duration-300
        ease-out
        transform
        ${onClick && isPlayable ? 'cursor-pointer hover:scale-[1.08] hover:-translate-y-3 hover:rotate-[1deg]' : ''}
        ${!isPlayable ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        ${isSelected ? 'ring-4 ring-blue-400/60 scale-[1.08] -translate-y-3 rotate-[1deg]' : ''}
        ${isOudler ? 'ring-2 ring-yellow-400/70' : ''}
        ${className}
      `}
      style={{
        background: `
          linear-gradient(180deg,
            rgba(255,255,255,0.4) 0%,
            transparent 10%,
            transparent 90%,
            rgba(0,0,0,0.05) 100%
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(139,115,85,0.02) 1px,
            rgba(139,115,85,0.02) 2px
          ),
          linear-gradient(to bottom, #F8F6F0 0%, #F5F3E8 50%, #F0EDE0 100%)
        `,
        border: '2px solid #8B7355',
        boxShadow: isSelected
          ? `
            0 2px 4px rgba(0,0,0,0.2),
            0 4px 8px rgba(0,0,0,0.15),
            0 8px 16px rgba(0,0,0,0.12),
            0 16px 32px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.9),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `
          : `
            0 1px 2px rgba(0,0,0,0.15),
            0 2px 4px rgba(0,0,0,0.1),
            0 4px 8px rgba(0,0,0,0.08),
            inset 0 1px 0 rgba(255,255,255,0.9),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `,
        transformOrigin: 'center bottom',
        willChange: isPlayable ? 'transform, box-shadow' : 'auto',
      }}
    >
      <div className="w-full h-full p-2 flex flex-col relative">
        {/* EFFET DE VIEILLISSEMENT SUBTIL */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, transparent 0%, rgba(139,115,85,0.03) 100%),
              radial-gradient(ellipse at 70% 80%, transparent 0%, rgba(0,0,0,0.02) 100%)
            `,
          }}
        />

        {/* BORDURE INTÉRIEURE DÉCORATIVE ORNÉE */}
        <div
          className="absolute inset-1 rounded pointer-events-none"
          style={{
            border: '1px solid rgba(139, 115, 85, 0.4)',
            boxShadow: `
              inset 0 0 0 1px rgba(255,255,255,0.3),
              0 0 0 1px rgba(139, 115, 85, 0.15)
            `,
          }}
        />

        {/* BORDURE EXTÉRIEURE SUBTILE */}
        <div
          className="absolute inset-0.5 rounded pointer-events-none"
          style={{
            border: '0.5px solid rgba(139, 115, 85, 0.2)',
          }}
        />

        {/* COIN SUPÉRIEUR GAUCHE */}
        <div className="relative z-10 flex flex-col items-start">
          <div
            className="font-black leading-none"
            style={{
              color: suitColor,
              fontSize: size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px',
              textShadow: '0 1px 2px rgba(0,0,0,0.15)',
              fontFamily: 'serif',
            }}
          >
            {isTrump || isExcuse ? (
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold">{rankDisplay}</div>
              </div>
            ) : (
              <>
                <div className="mb-0.5" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))' }}>
                  {suitSymbol}
                </div>
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
              <div
                className="text-5xl mb-2"
                style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))' }}
              >
                🃏
              </div>
              <div
                className="text-lg font-black tracking-tight"
                style={{
                  color: suitColor,
                  textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  fontFamily: 'serif',
                }}
              >
                L'EXCUSE
              </div>
              <div
                className="text-xs font-semibold mt-1"
                style={{
                  color: '#6B5D4F',
                  fontFamily: 'serif',
                  fontStyle: 'italic',
                }}
              >
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
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  fontFamily: 'serif',
                }}
              >
                {card.trumpNumber}
              </div>
              {card.trumpNumber === 1 && (
                <div
                  className="text-xs font-bold"
                  style={{
                    color: '#6B5D4F',
                    fontFamily: 'serif',
                  }}
                >
                  LE PETIT
                </div>
              )}
              {card.trumpNumber === 21 && (
                <div
                  className="text-xs font-bold"
                  style={{
                    color: '#6B5D4F',
                    fontFamily: 'serif',
                  }}
                >
                  LE MONDE
                </div>
              )}
              <div
                className="text-6xl mt-2"
                style={{
                  color: suitColor,
                  filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))',
                }}
              >
                ★
              </div>
            </div>
          ) : isFigure ? (
            // FIGURES (Roi, Dame, Cavalier, Valet)
            <div className="text-center">
              <div
                className="text-6xl leading-none mb-2"
                style={{
                  color: suitColor,
                  filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))',
                }}
              >
                {suitSymbol}
              </div>
              <div
                className="text-sm font-black tracking-wide"
                style={{
                  color: suitColor,
                  textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  fontFamily: 'serif',
                }}
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
                  style={{
                    color: suitColor,
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                  }}
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
              textShadow: '0 1px 2px rgba(0,0,0,0.15)',
              fontFamily: 'serif',
            }}
          >
            {isTrump || isExcuse ? (
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold">{rankDisplay}</div>
              </div>
            ) : (
              <>
                <div className="mb-0.5" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))' }}>
                  {suitSymbol}
                </div>
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
            className="absolute -top-2 -right-2 text-xs font-black px-2 py-1 rounded-full z-20"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #C9A861 50%, #B8942C 100%)',
              color: '#3A2F1E',
              boxShadow: `
                0 2px 4px rgba(0,0,0,0.3),
                0 4px 8px rgba(0,0,0,0.15),
                inset 0 1px 0 rgba(255,255,255,0.4),
                inset 0 -1px 0 rgba(0,0,0,0.2)
              `,
              border: '1.5px solid #E8C66A',
              textShadow: '0 1px 0 rgba(255,255,255,0.3)',
              fontFamily: 'serif',
              animation: 'gentle-glow 3s ease-in-out infinite',
            }}
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
