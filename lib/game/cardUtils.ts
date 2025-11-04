import { Card, Suit, Rank } from '@/types/card';

/**
 * Ordre de priorité des couleurs (pour le tri et comparaisons)
 */
const SUIT_ORDER = {
  [Suit.TRUMP]: 5,
  [Suit.EXCUSE]: 4,
  [Suit.SPADE]: 3,
  [Suit.HEART]: 2,
  [Suit.DIAMOND]: 1,
  [Suit.CLUB]: 0,
};

/**
 * Ordre des rangs pour les cartes normales
 */
const RANK_ORDER = {
  [Rank.KING]: 13,
  [Rank.QUEEN]: 12,
  [Rank.KNIGHT]: 11,
  [Rank.JACK]: 10,
  [Rank.TEN]: 9,
  [Rank.NINE]: 8,
  [Rank.EIGHT]: 7,
  [Rank.SEVEN]: 6,
  [Rank.SIX]: 5,
  [Rank.FIVE]: 4,
  [Rank.FOUR]: 3,
  [Rank.THREE]: 2,
  [Rank.TWO]: 1,
  [Rank.ACE]: 0,
};

/**
 * Trie les cartes par couleur puis par valeur
 */
export function sortCards(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    // D'abord trier par couleur
    const suitDiff = SUIT_ORDER[b.suit] - SUIT_ORDER[a.suit];
    if (suitDiff !== 0) return suitDiff;

    // Pour les atouts, trier par numéro
    if (a.suit === Suit.TRUMP && b.suit === Suit.TRUMP) {
      return (b.trumpNumber || 0) - (a.trumpNumber || 0);
    }

    // Pour les cartes normales, trier par rang
    if (a.rank && b.rank) {
      return RANK_ORDER[b.rank] - RANK_ORDER[a.rank];
    }

    return 0;
  });
}

/**
 * Compare deux cartes pour savoir laquelle est la plus forte
 * Retourne un nombre positif si a > b, négatif si a < b, 0 si égales
 */
export function compareCards(a: Card, b: Card, leadSuit?: Suit): number {
  // L'Excuse ne gagne jamais
  if (a.suit === Suit.EXCUSE) return -1;
  if (b.suit === Suit.EXCUSE) return 1;

  // Les atouts battent toujours les couleurs
  if (a.suit === Suit.TRUMP && b.suit !== Suit.TRUMP) return 1;
  if (b.suit === Suit.TRUMP && a.suit !== Suit.TRUMP) return -1;

  // Si les deux sont des atouts, le plus fort gagne
  if (a.suit === Suit.TRUMP && b.suit === Suit.TRUMP) {
    return (a.trumpNumber || 0) - (b.trumpNumber || 0);
  }

  // Si une couleur a été demandée
  if (leadSuit) {
    // La carte dans la couleur demandée bat les autres couleurs
    if (a.suit === leadSuit && b.suit !== leadSuit) return 1;
    if (b.suit === leadSuit && a.suit !== leadSuit) return -1;
  }

  // Si même couleur, comparer les rangs
  if (a.suit === b.suit && a.rank && b.rank) {
    return RANK_ORDER[a.rank] - RANK_ORDER[b.rank];
  }

  return 0;
}

/**
 * Détermine quelle carte gagne le pli
 */
export function getWinningCard(trick: Card[], leadSuit: Suit): Card {
  if (trick.length === 0) {
    throw new Error('Cannot determine winning card from empty trick');
  }

  let winningCard = trick[0];

  for (let i = 1; i < trick.length; i++) {
    if (compareCards(trick[i], winningCard, leadSuit) > 0) {
      winningCard = trick[i];
    }
  }

  return winningCard;
}

/**
 * Vérifie si une carte est jouable selon les règles
 */
export function isCardPlayable(
  card: Card,
  hand: Card[],
  trick: Card[],
  leadSuit: Suit | null
): { playable: boolean; reason?: string } {
  // L'Excuse est toujours jouable (sauf au dernier pli, géré ailleurs)
  if (card.suit === Suit.EXCUSE) {
    return { playable: true };
  }

  // Si on entame, toute carte est jouable
  if (trick.length === 0) {
    return { playable: true };
  }

  // Si on a la couleur demandée, on doit la jouer
  if (leadSuit && card.suit !== leadSuit) {
    const hasLeadSuit = hand.some(c => c.suit === leadSuit);
    if (hasLeadSuit) {
      return {
        playable: false,
        reason: 'Vous devez fournir la couleur demandée'
      };
    }
  }

  // Si la couleur demandée est un atout
  if (leadSuit === Suit.TRUMP) {
    if (card.suit === Suit.TRUMP) {
      // On doit monter si possible (surcouper)
      const highestTrumpInTrick = Math.max(
        ...trick.filter(c => c.suit === Suit.TRUMP).map(c => c.trumpNumber || 0)
      );

      const canSurcut = hand.some(
        c => c.suit === Suit.TRUMP && (c.trumpNumber || 0) > highestTrumpInTrick
      );

      if (canSurcut && (card.trumpNumber || 0) <= highestTrumpInTrick) {
        return {
          playable: false,
          reason: 'Vous devez surcouper si possible'
        };
      }

      return { playable: true };
    }
  }

  // Si on n'a pas la couleur demandée, on doit couper
  if (leadSuit && card.suit !== leadSuit) {
    const hasTrump = hand.some(c => c.suit === Suit.TRUMP);

    if (hasTrump && card.suit !== Suit.TRUMP) {
      return {
        playable: false,
        reason: 'Vous devez couper'
      };
    }

    // Si on coupe, on doit surcouper si possible
    if (card.suit === Suit.TRUMP) {
      const trumpsInTrick = trick.filter(c => c.suit === Suit.TRUMP);

      if (trumpsInTrick.length > 0) {
        const highestTrump = Math.max(...trumpsInTrick.map(c => c.trumpNumber || 0));
        const canSurcut = hand.some(
          c => c.suit === Suit.TRUMP && (c.trumpNumber || 0) > highestTrump
        );

        if (canSurcut && (card.trumpNumber || 0) <= highestTrump) {
          return {
            playable: false,
            reason: 'Vous devez surcouper si possible'
          };
        }
      }

      return { playable: true };
    }
  }

  return { playable: true };
}

/**
 * Filtre les cartes jouables d'une main selon les règles
 */
export function getPlayableCards(
  hand: Card[],
  trick: Card[],
  leadSuit: Suit | null
): Card[] {
  return hand.filter(card =>
    isCardPlayable(card, hand, trick, leadSuit).playable
  );
}

/**
 * Obtient le nom français d'une carte
 */
export function getCardName(card: Card): string {
  if (card.suit === Suit.EXCUSE) {
    return 'Excuse';
  }

  if (card.suit === Suit.TRUMP) {
    if (card.trumpNumber === 1) return 'Petit';
    if (card.trumpNumber === 21) return 'Atout 21';
    return `Atout ${card.trumpNumber}`;
  }

  const suitNames = {
    [Suit.SPADE]: 'Pique',
    [Suit.HEART]: 'Cœur',
    [Suit.DIAMOND]: 'Carreau',
    [Suit.CLUB]: 'Trèfle',
    [Suit.TRUMP]: '',
    [Suit.EXCUSE]: '',
  };

  const rankNames = {
    [Rank.ACE]: 'As',
    [Rank.TWO]: '2',
    [Rank.THREE]: '3',
    [Rank.FOUR]: '4',
    [Rank.FIVE]: '5',
    [Rank.SIX]: '6',
    [Rank.SEVEN]: '7',
    [Rank.EIGHT]: '8',
    [Rank.NINE]: '9',
    [Rank.TEN]: '10',
    [Rank.JACK]: 'Valet',
    [Rank.KNIGHT]: 'Cavalier',
    [Rank.QUEEN]: 'Dame',
    [Rank.KING]: 'Roi',
  };

  return `${rankNames[card.rank!]} de ${suitNames[card.suit]}`;
}

/**
 * Obtient le symbole Unicode de la couleur
 */
export function getSuitSymbol(suit: Suit): string {
  switch (suit) {
    case Suit.SPADE:
      return '♠';
    case Suit.HEART:
      return '♥';
    case Suit.DIAMOND:
      return '♦';
    case Suit.CLUB:
      return '♣';
    case Suit.TRUMP:
      return '🃏';
    case Suit.EXCUSE:
      return '★';
    default:
      return '';
  }
}
