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
  const getSuitColor = (suit: Suit): string => {
    if (suit === Suit.HEART || suit === Suit.DIAMOND) return 'text-red-600';
    if (suit === Suit.TRUMP) return 'text-purple-700';
    if (suit === Suit.EXCUSE) return 'text-yellow-600';
    return 'text-gray-900';
  };

  const sizeClasses = {
    small: 'w-16 h-24',
    medium: 'w-20 h-32',
    large: 'w-24 h-36',
  };

  const fontSizes = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
  };

  if (faceDown) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-lg cursor-default ${className}`}
        style={{
          background: 'linear-gradient(135deg, #8B4513 0%, #654321 50%, #8B4513 100%)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="w-3/4 h-3/4 rounded border-4 border-yellow-700"
            style={{
              background: 'repeating-linear-gradient(45deg, #654321, #654321 10px, #8B4513 10px, #8B4513 20px)',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        rounded-lg
        transition-all
        duration-300
        transform
        ${onClick && isPlayable ? 'cursor-pointer hover:scale-110 hover:-translate-y-2' : ''}
        ${!isPlayable ? 'opacity-40 cursor-not-allowed' : ''}
        ${isSelected ? 'ring-4 ring-blue-500 scale-105 -translate-y-2' : ''}
        ${card.isOudler ? 'ring-2 ring-yellow-400' : ''}
        ${className}
      `}
      style={{
        background: 'linear-gradient(to bottom, #ffffff 0%, #f8f8f8 100%)',
        boxShadow: isSelected
          ? '0 12px 24px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3)'
          : '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div className="w-full h-full p-2 flex flex-col justify-between relative">
        {/* Coin supérieur gauche */}
        <div className={`${getSuitColor(card.suit)} font-bold`}>
          <div className={`${fontSizes[size]} leading-none`}>
            {getSuitSymbol(card.suit)}
          </div>
          {card.suit === Suit.TRUMP && card.trumpNumber && (
            <div className="text-xs font-bold mt-0.5">{card.trumpNumber}</div>
          )}
          {card.rank && card.rank !== Rank.ACE && (
            <div className="text-xs font-bold mt-0.5">
              {card.rank === Rank.KING ? 'R' :
               card.rank === Rank.QUEEN ? 'D' :
               card.rank === Rank.KNIGHT ? 'C' :
               card.rank === Rank.JACK ? 'V' : ''}
            </div>
          )}
        </div>

        {/* Centre - Symbole principal */}
        <div className={`flex-1 flex items-center justify-center ${getSuitColor(card.suit)}`}>
          <div className="text-center">
            <div className={`${size === 'large' ? 'text-6xl' : size === 'medium' ? 'text-4xl' : 'text-3xl'} leading-none`}>
              {getSuitSymbol(card.suit)}
            </div>
            {card.suit === Suit.TRUMP && card.trumpNumber && (
              <div className="text-2xl font-black mt-2">{card.trumpNumber}</div>
            )}
            {card.suit === Suit.EXCUSE && (
              <div className="text-xs font-bold mt-1">EXCUSE</div>
            )}
          </div>
        </div>

        {/* Coin inférieur droit (inversé) */}
        <div className={`${getSuitColor(card.suit)} font-bold text-right transform rotate-180`}>
          <div className={`${fontSizes[size]} leading-none`}>
            {getSuitSymbol(card.suit)}
          </div>
          {card.suit === Suit.TRUMP && card.trumpNumber && (
            <div className="text-xs font-bold mt-0.5">{card.trumpNumber}</div>
          )}
        </div>

        {/* Badge Bout */}
        {card.isOudler && (
          <div
            className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-[8px] font-black px-1.5 py-0.5 rounded-full"
            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            BOUT
          </div>
        )}

        {/* Points */}
        {size === 'large' && (
          <div className="absolute bottom-1 right-1 text-[8px] text-gray-400 font-bold">
            {card.points}pts
          </div>
        )}
      </div>
    </div>
  );
}
