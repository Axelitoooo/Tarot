import { Card, Suit } from '@/types/card';

/**
 * Vérifie si une carte peut être écartée
 */
export function canDiscardCard(card: Card): { canDiscard: boolean; reason?: string } {
  // Les Bouts ne peuvent jamais être écartés
  if (card.isOudler) {
    return {
      canDiscard: false,
      reason: 'Les Bouts (Oudlers) ne peuvent pas être écartés'
    };
  }

  // Les Rois ne peuvent jamais être écartés
  if (card.rank === 'KING') {
    return {
      canDiscard: false,
      reason: 'Les Rois ne peuvent pas être écartés'
    };
  }

  // Les atouts peuvent être écartés seulement si on n'a que des Bouts, Rois et Atouts
  // Cette vérification doit être faite au niveau de la main complète
  // Pour l'instant, on indique que les atouts peuvent potentiellement être écartés
  if (card.suit === Suit.TRUMP) {
    return {
      canDiscard: true,
      reason: 'Les atouts peuvent être écartés seulement si vous n\'avez que des Bouts, Rois et Atouts'
    };
  }

  // Les cartes normales peuvent toujours être écartées
  return { canDiscard: true };
}

/**
 * Vérifie si un écart est valide
 */
export function validateDiscard(
  discard: Card[],
  hand: Card[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // L'écart doit contenir exactement 6 cartes
  if (discard.length !== 6) {
    errors.push(`L'écart doit contenir exactement 6 cartes (actuellement ${discard.length})`);
    return { valid: false, errors };
  }

  // Vérifier que toutes les cartes de l'écart sont dans la main
  for (const card of discard) {
    if (!hand.find(c => c.id === card.id)) {
      errors.push(`La carte ${card.id} n'est pas dans votre main`);
    }
  }

  // Vérifier qu'il n'y a pas de Bouts
  const oudlers = discard.filter(card => card.isOudler);
  if (oudlers.length > 0) {
    errors.push('Vous ne pouvez pas écarter de Bouts (21, Petit, Excuse)');
  }

  // Vérifier qu'il n'y a pas de Rois
  const kings = discard.filter(card => card.rank === 'KING');
  if (kings.length > 0) {
    errors.push('Vous ne pouvez pas écarter de Rois');
  }

  // Vérifier les atouts
  const trumpsInDiscard = discard.filter(card => card.suit === Suit.TRUMP);
  if (trumpsInDiscard.length > 0) {
    // Les atouts peuvent être écartés seulement si on n'a que des Bouts, Rois et Atouts
    const nonTrumpNonOudlerNonKing = hand.filter(
      card =>
        card.suit !== Suit.TRUMP &&
        !card.isOudler &&
        card.rank !== 'KING'
    );

    if (nonTrumpNonOudlerNonKing.length >= 6) {
      errors.push(
        'Vous ne pouvez écarter des atouts que si vous n\'avez que des Bouts, Rois et Atouts'
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Obtient les cartes qui peuvent être écartées d'une main
 */
export function getDiscardableCards(hand: Card[]): Card[] {
  // Retirer les Bouts et les Rois
  const basicDiscardable = hand.filter(
    card => !card.isOudler && card.rank !== 'KING'
  );

  // Vérifier si on peut écarter des atouts
  const nonTrumpNonOudlerNonKing = hand.filter(
    card =>
      card.suit !== Suit.TRUMP &&
      !card.isOudler &&
      card.rank !== 'KING'
  );

  // Si on a moins de 6 cartes non-atout (hors Bouts et Rois),
  // on peut écarter des atouts
  if (nonTrumpNonOudlerNonKing.length < 6) {
    return basicDiscardable;
  }

  // Sinon, on ne peut écarter que les cartes non-atout
  return basicDiscardable.filter(card => card.suit !== Suit.TRUMP);
}

/**
 * Suggère un écart automatique (pour l'IA ou l'aide au joueur)
 * Écarte les cartes les plus faibles en gardant les figures
 */
export function suggestDiscard(hand: Card[]): Card[] {
  const discardable = getDiscardableCards(hand);

  if (discardable.length < 6) {
    throw new Error('Pas assez de cartes à écarter');
  }

  // Trier par valeur (les plus faibles d'abord)
  const sorted = [...discardable].sort((a, b) => {
    // Prioriser l'écart des cartes non-atout
    if (a.suit === Suit.TRUMP && b.suit !== Suit.TRUMP) return 1;
    if (b.suit === Suit.TRUMP && a.suit !== Suit.TRUMP) return -1;

    // Ensuite par points (écarter les plus faibles)
    return a.points - b.points;
  });

  return sorted.slice(0, 6);
}

/**
 * Calcule les points de l'écart pour le Preneur
 * L'écart compte dans les plis du Preneur
 */
export function calculateDiscardPoints(discard: Card[]): number {
  return discard.reduce((sum, card) => sum + card.points, 0);
}
