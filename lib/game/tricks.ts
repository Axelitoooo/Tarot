import { Card, Suit } from '@/types/card';
import { getWinningCard, compareCards } from './cardUtils';

/**
 * Interface pour une carte jouée avec son joueur
 */
export interface PlayedCard {
  card: Card;
  playerId: string;
}

/**
 * Détermine la couleur demandée (couleur de la première carte)
 */
export function getLeadSuit(trick: PlayedCard[]): Suit | null {
  if (trick.length === 0) return null;

  const firstCard = trick[0].card;

  // Si la première carte est l'Excuse, c'est la deuxième qui détermine la couleur
  if (firstCard.suit === Suit.EXCUSE && trick.length > 1) {
    return trick[1].card.suit;
  }

  return firstCard.suit;
}

/**
 * Détermine qui gagne le pli
 */
export function getTrickWinner(trick: PlayedCard[]): string {
  if (trick.length === 0) {
    throw new Error('Cannot determine winner of empty trick');
  }

  const leadSuit = getLeadSuit(trick);
  const cards = trick.map(pc => pc.card);

  const winningCard = getWinningCard(cards, leadSuit || Suit.CLUB);

  // Trouver le joueur qui a joué cette carte
  const winner = trick.find(pc => pc.card.id === winningCard.id);

  if (!winner) {
    throw new Error('Could not find trick winner');
  }

  return winner.playerId;
}

/**
 * Vérifie si l'Excuse a été jouée dans le pli
 */
export function hasExcuseInTrick(trick: PlayedCard[]): boolean {
  return trick.some(pc => pc.card.suit === Suit.EXCUSE);
}

/**
 * Trouve qui a joué l'Excuse dans le pli
 */
export function getExcusePlayer(trick: PlayedCard[]): string | null {
  const excusePlay = trick.find(pc => pc.card.suit === Suit.EXCUSE);
  return excusePlay ? excusePlay.playerId : null;
}

/**
 * Gère l'échange de l'Excuse selon les règles
 * L'Excuse ne peut jamais être prise sauf au dernier pli
 */
export function handleExcuse(
  trick: PlayedCard[],
  winnerId: string,
  isLastTrick: boolean
): {
  excuseOwnerId: string | null;
  shouldExchangeCard: boolean;
} {
  const excusePlayerId = getExcusePlayer(trick);

  if (!excusePlayerId) {
    return { excuseOwnerId: null, shouldExchangeCard: false };
  }

  // Au dernier pli, l'Excuse change de camp
  if (isLastTrick) {
    return {
      excuseOwnerId: winnerId,
      shouldExchangeCard: false,
    };
  }

  // Sinon, l'Excuse reste à son propriétaire
  // mais il doit donner une carte basse en échange au gagnant
  return {
    excuseOwnerId: excusePlayerId,
    shouldExchangeCard: excusePlayerId !== winnerId,
  };
}

/**
 * Vérifie si le Petit est dans le pli
 */
export function hasPetitInTrick(trick: PlayedCard[]): boolean {
  return trick.some(
    pc => pc.card.suit === Suit.TRUMP && pc.card.trumpNumber === 1
  );
}

/**
 * Trouve qui a joué le Petit dans le pli
 */
export function getPetitPlayer(trick: PlayedCard[]): string | null {
  const petitPlay = trick.find(
    pc => pc.card.suit === Suit.TRUMP && pc.card.trumpNumber === 1
  );
  return petitPlay ? petitPlay.playerId : null;
}

/**
 * Détermine si le Petit au bout est réalisé
 * Le Petit doit être joué au dernier pli (pli 18)
 */
export function checkPetitAuBout(
  trick: PlayedCard[],
  trickNumber: number
): { isPetitAuBout: boolean; winnerId: string | null } {
  // Le Petit au bout ne peut arriver qu'au dernier pli (pli 18)
  if (trickNumber !== 18) {
    return { isPetitAuBout: false, winnerId: null };
  }

  if (!hasPetitInTrick(trick)) {
    return { isPetitAuBout: false, winnerId: null };
  }

  // Déterminer qui gagne le pli
  const winnerId = getTrickWinner(trick);

  return {
    isPetitAuBout: true,
    winnerId,
  };
}

/**
 * Calcule les points d'un pli
 */
export function calculateTrickPoints(trick: PlayedCard[]): number {
  const cards = trick.map(pc => pc.card);
  let points = 0;

  // Compter par paires selon les règles
  for (const card of cards) {
    points += card.points;
  }

  // Retirer 0.5 par carte (car comptées par paire)
  points -= cards.length * 0.5;

  return Math.round(points);
}

/**
 * Valide qu'une carte peut être jouée dans le contexte du pli actuel
 */
export function canPlayCard(
  card: Card,
  hand: Card[],
  trick: PlayedCard[]
): { canPlay: boolean; reason?: string } {
  // L'Excuse peut toujours être jouée (sauf au dernier pli, géré ailleurs)
  if (card.suit === Suit.EXCUSE) {
    return { canPlay: true };
  }

  // Si on entame, toute carte peut être jouée
  if (trick.length === 0) {
    return { canPlay: true };
  }

  const leadSuit = getLeadSuit(trick);

  if (!leadSuit) {
    return { canPlay: true };
  }

  // Si on a la couleur demandée, on doit la fournir
  if (card.suit !== leadSuit) {
    const hasLeadSuit = hand.some(c => c.suit === leadSuit);
    if (hasLeadSuit) {
      return {
        canPlay: false,
        reason: 'Vous devez fournir la couleur demandée',
      };
    }
  }

  // Si la couleur demandée est atout
  if (leadSuit === Suit.TRUMP) {
    if (card.suit === Suit.TRUMP) {
      // On doit monter (surcouper) si possible
      const trumpsInTrick = trick
        .map(pc => pc.card)
        .filter(c => c.suit === Suit.TRUMP);

      if (trumpsInTrick.length > 0) {
        const highestTrump = Math.max(
          ...trumpsInTrick.map(c => c.trumpNumber || 0)
        );

        const canSurcut = hand.some(
          c => c.suit === Suit.TRUMP && (c.trumpNumber || 0) > highestTrump
        );

        if (canSurcut && (card.trumpNumber || 0) <= highestTrump) {
          return {
            canPlay: false,
            reason: 'Vous devez surcouper si possible',
          };
        }
      }

      return { canPlay: true };
    }
  }

  // Si on n'a pas la couleur demandée, on doit couper
  if (leadSuit && card.suit !== leadSuit) {
    const hasTrump = hand.some(c => c.suit === Suit.TRUMP);

    if (hasTrump && card.suit !== Suit.TRUMP) {
      return {
        canPlay: false,
        reason: 'Vous devez couper (jouer un atout)',
      };
    }

    // Si on coupe, on doit surcouper si possible
    if (card.suit === Suit.TRUMP) {
      const trumpsInTrick = trick
        .map(pc => pc.card)
        .filter(c => c.suit === Suit.TRUMP);

      if (trumpsInTrick.length > 0) {
        const highestTrump = Math.max(
          ...trumpsInTrick.map(c => c.trumpNumber || 0)
        );

        const canSurcut = hand.some(
          c => c.suit === Suit.TRUMP && (c.trumpNumber || 0) > highestTrump
        );

        if (canSurcut && (card.trumpNumber || 0) <= highestTrump) {
          return {
            canPlay: false,
            reason: 'Vous devez surcouper si possible',
          };
        }
      }

      return { canPlay: true };
    }
  }

  return { canPlay: true };
}

/**
 * Obtient les cartes jouables d'une main dans le contexte du pli actuel
 */
export function getPlayableCardsInTrick(
  hand: Card[],
  trick: PlayedCard[],
  isLastTrick: boolean
): Card[] {
  return hand.filter(card => {
    // L'Excuse ne peut pas être jouée au dernier pli (sauf pour tenter un Chelem)
    if (card.suit === Suit.EXCUSE && isLastTrick) {
      // On ne peut jouer l'Excuse au dernier pli que si on a déjà gagné tous les autres
      return false;
    }

    return canPlayCard(card, hand, trick).canPlay;
  });
}
