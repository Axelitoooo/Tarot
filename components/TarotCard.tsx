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
  // Couleurs authentiques des cartes de tarot françaises
  const getSuitColor = (suit: Suit): string => {
    if (suit === Suit.HEART || suit === Suit.DIAMOND) return '#C41E3A'; // Rouge vermillon traditionnel
    if (suit === Suit.TRUMP) return '#1A1A5E'; // Bleu royal profond
    if (suit === Suit.EXCUSE) return '#8B7355'; // Brun cuivré pour l'Excuse
    return '#000000'; // Noir pur pour Pique/Trèfle
  };

  // Tailles des cartes (CORRECTION DU BUG h-42)
  const sizeConfig = {
    small: { class: 'w-16 h-24', fontSize: 'small' as const },
    medium: { class: 'w-24 h-36', fontSize: 'medium' as const },
    large: { class: 'w-32 h-48', fontSize: 'large' as const }, // Fixé: h-48 au lieu de h-42
  };

  const { class: sizeClass, fontSize } = sizeConfig[size];

  // DOS DE CARTE - Design traditionnel français
  if (faceDown) {
    return (
      <div
        className={`${sizeClass} rounded-lg cursor-default shadow-2xl ${className} relative overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, #2C1810 0%, #4A2C1A 25%, #6B3E2E 50%, #4A2C1A 75%, #2C1810 100%)',
          border: '2px solid #8B6F47',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Texture cuir */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />

        <div className="w-full h-full p-3 flex items-center justify-center relative">
          {/* Bordure dorée ornée */}
          <div
            className="absolute inset-2 rounded"
            style={{
              border: '2px double #D4AF37',
              boxShadow: 'inset 0 0 10px rgba(212,175,55,0.3)',
            }}
          />

          {/* Motif central damassé */}
          <div className="absolute inset-4" style={{
            background: 'radial-gradient(circle, rgba(139,115,85,0.3) 0%, transparent 70%)',
          }}>
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              <path d="M50,30 Q60,40 50,50 Q40,40 50,30 M50,50 Q60,60 50,70 Q40,60 50,50"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="0.5"
                    opacity="0.4"/>
              <circle cx="50" cy="50" r="15" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3"/>
            </svg>
          </div>

          {/* Texte central */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="text-4xl mb-1 filter drop-shadow-lg">🃏</div>
            <div
              className="text-xs font-bold tracking-wider"
              style={{
                color: '#D4AF37',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                fontFamily: 'serif',
              }}
            >
              TAROT
            </div>
          </div>

          {/* Ornements aux coins */}
          {[
            'top-2 left-2',
            'top-2 right-2',
            'bottom-2 left-2',
            'bottom-2 right-2'
          ].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} text-xs`}
              style={{ color: '#D4AF37', opacity: 0.6 }}
            >
              ❋
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Obtenir le nom de la figure
  const getRankName = () => {
    if (card.suit === Suit.TRUMP) {
      if (card.trumpNumber === 1) return 'I';
      if (card.trumpNumber === 21) return 'XXI';
      return card.trumpNumber?.toString() || '';
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

  // Tailles de police adaptatives
  const fontSizes = {
    small: { corner: '14px', rank: '10px', main: '32px', symbol: '24px' },
    medium: { corner: '18px', rank: '12px', main: '48px', symbol: '36px' },
    large: { corner: '24px', rank: '14px', main: '64px', symbol: '48px' },
  };

  const fonts = fontSizes[fontSize];

  return (
    <div
      onClick={onClick && isPlayable ? onClick : undefined}
      className={`
        ${sizeClass}
        rounded-lg
        transition-all
        duration-300
        transform
        relative
        ${onClick && isPlayable ? 'cursor-pointer hover:scale-105 hover:-translate-y-2 hover:shadow-2xl' : ''}
        ${!isPlayable ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        ${isSelected ? 'ring-4 ring-yellow-500 scale-105 -translate-y-2 shadow-2xl' : 'shadow-xl'}
        ${isOudler ? 'ring-2 ring-amber-400' : ''}
        ${className}
      `}
      style={{
        background: 'linear-gradient(to bottom right, #FFFBF0 0%, #FFF8E7 50%, #FFFBF0 100%)',
        border: '3px solid #8B7355',
        boxShadow: isSelected
          ? '0 20px 40px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.7), inset 0 -2px 4px rgba(139,115,85,0.2)'
          : '0 10px 25px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.7), inset 0 -2px 4px rgba(139,115,85,0.2)',
      }}
    >
      {/* Texture parchemin subtile */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,115,85,0.03) 2px, rgba(139,115,85,0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139,115,85,0.03) 2px, rgba(139,115,85,0.03) 4px)
          `,
        }}
      />

      <div className="w-full h-full p-2 flex flex-col relative">
        {/* BORDURE INTÉRIEURE DÉCORATIVE DOUBLE */}
        <div
          className="absolute inset-1.5 rounded pointer-events-none"
          style={{
            border: '1.5px solid rgba(212,175,55,0.4)',
            boxShadow: 'inset 0 0 8px rgba(212,175,55,0.15)',
          }}
        />
        <div
          className="absolute inset-2.5 rounded pointer-events-none"
          style={{
            border: '0.5px solid rgba(139,115,85,0.2)',
          }}
        />

        {/* COIN SUPÉRIEUR GAUCHE */}
        <div className="relative z-10 flex flex-col items-start pl-1 pt-0.5">
          <div
            className="font-bold leading-tight"
            style={{
              color: suitColor,
              fontSize: fonts.corner,
              fontFamily: 'Georgia, serif',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {isTrump || isExcuse ? (
              <div className="flex flex-col items-center" style={{ fontSize: fonts.rank }}>
                <div className="font-black tracking-tight">{rankDisplay}</div>
              </div>
            ) : (
              <>
                <div className="mb-0.5 leading-none">{suitSymbol}</div>
                <div className="font-black" style={{ fontSize: fonts.rank }}>
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
        <div className="flex-1 flex items-center justify-center px-2">
          {isExcuse ? (
            // L'EXCUSE - Le Mat - Design élégant
            <div className="text-center">
              <div
                style={{
                  fontSize: fonts.main,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}
              >
                🃏
              </div>
              <div
                className="font-black tracking-tight mt-1"
                style={{
                  color: suitColor,
                  fontSize: fontSize === 'small' ? '10px' : fontSize === 'medium' ? '13px' : '16px',
                  fontFamily: 'Georgia, serif',
                  textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                }}
              >
                L'EXCUSE
              </div>
              <div
                className="font-serif italic mt-0.5"
                style={{
                  fontSize: fontSize === 'small' ? '7px' : fontSize === 'medium' ? '9px' : '11px',
                  color: '#6B5D4F',
                }}
              >
                Le Mat
              </div>
            </div>
          ) : isTrump ? (
            // ATOUT - Style chiffres romains élégant
            <div className="text-center">
              <div
                className="font-black leading-none tracking-tight"
                style={{
                  fontSize: fonts.main,
                  color: suitColor,
                  fontFamily: 'Georgia, serif',
                  textShadow: '0 3px 6px rgba(0,0,0,0.25)',
                }}
              >
                {card.trumpNumber}
              </div>
              {card.trumpNumber === 1 && (
                <div
                  className="font-serif italic mt-1"
                  style={{
                    fontSize: fontSize === 'small' ? '8px' : fontSize === 'medium' ? '10px' : '12px',
                    color: '#4A4A4A',
                  }}
                >
                  Le Petit
                </div>
              )}
              {card.trumpNumber === 21 && (
                <div
                  className="font-serif italic mt-1"
                  style={{
                    fontSize: fontSize === 'small' ? '8px' : fontSize === 'medium' ? '10px' : '12px',
                    color: '#4A4A4A',
                  }}
                >
                  Le Monde
                </div>
              )}
              {/* Étoile décorative pour atouts */}
              <div
                className="mt-1"
                style={{
                  fontSize: fontSize === 'small' ? '20px' : fontSize === 'medium' ? '28px' : '36px',
                  color: suitColor,
                  opacity: 0.3,
                }}
              >
                ★
              </div>
            </div>
          ) : isFigure ? (
            // FIGURES (Roi, Dame, Cavalier, Valet) - Design classique
            <div className="text-center">
              <div
                className="leading-none mb-1"
                style={{
                  fontSize: fonts.symbol,
                  color: suitColor,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}
              >
                {suitSymbol}
              </div>
              <div
                className="font-black tracking-tight"
                style={{
                  fontSize: fontSize === 'small' ? '10px' : fontSize === 'medium' ? '12px' : '15px',
                  color: suitColor,
                  fontFamily: 'Georgia, serif',
                  textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                }}
              >
                {rankDisplay}
              </div>
              {/* Symbole décoratif supplémentaire pour figures */}
              <div
                className="mt-1 opacity-20"
                style={{
                  fontSize: fontSize === 'small' ? '16px' : fontSize === 'medium' ? '20px' : '24px',
                  color: suitColor,
                }}
              >
                {suitSymbol}
              </div>
            </div>
          ) : (
            // CARTES NUMÉRIQUES - Disposition classique des symboles
            <div className="flex flex-wrap items-center justify-center gap-1 px-1">
              {Array.from({ length: Math.min(parseInt(card.rank || '1'), 10) }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: fontSize === 'small' ? '14px' : fontSize === 'medium' ? '18px' : '24px',
                    color: suitColor,
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
                  }}
                >
                  {suitSymbol}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COIN INFÉRIEUR DROIT (INVERSÉ) - Symétrie traditionnelle */}
        <div className="relative z-10 flex flex-col items-end pr-1 pb-0.5 transform rotate-180">
          <div
            className="font-bold leading-tight"
            style={{
              color: suitColor,
              fontSize: fonts.corner,
              fontFamily: 'Georgia, serif',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {isTrump || isExcuse ? (
              <div className="flex flex-col items-center" style={{ fontSize: fonts.rank }}>
                <div className="font-black tracking-tight">{rankDisplay}</div>
              </div>
            ) : (
              <>
                <div className="mb-0.5 leading-none">{suitSymbol}</div>
                <div className="font-black" style={{ fontSize: fonts.rank }}>
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

        {/* BADGE BOUT - Design élégant */}
        {isOudler && (
          <div
            className="absolute -top-2 -right-2 text-xs font-black px-2 py-1 rounded-full shadow-lg z-20"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#654321',
              border: '2px solid #FFE55C',
              fontFamily: 'Georgia, serif',
              fontSize: fontSize === 'small' ? '8px' : fontSize === 'medium' ? '9px' : '10px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          >
            ★ BOUT
          </div>
        )}

        {/* POINTS - Affichage discret */}
        {size === 'large' && (
          <div
            className="absolute bottom-1 left-1 font-bold px-1.5 py-0.5 rounded"
            style={{
              fontSize: '9px',
              color: '#6B5D4F',
              backgroundColor: 'rgba(255,255,255,0.85)',
              border: '0.5px solid rgba(139,115,85,0.3)',
              fontFamily: 'Georgia, serif',
            }}
          >
            {card.points}pts
          </div>
        )}

        {/* Effet de brillance subtil sur la carte */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.1) 100%)',
          }}
        />
      </div>
    </div>
  );
}
