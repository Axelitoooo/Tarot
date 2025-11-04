import { BidType, Bid, BID_MULTIPLIERS } from '@/types/game';

/**
 * Ordre des enchères (du plus faible au plus fort)
 */
const BID_ORDER = [
  BidType.PASS,
  BidType.PETITE,
  BidType.GARDE,
  BidType.GARDE_SANS,
  BidType.GARDE_CONTRE,
];

/**
 * Vérifie si une enchère est valide
 * Une enchère doit être supérieure à la meilleure enchère actuelle
 */
export function isValidBid(
  newBid: BidType,
  currentHighestBid: BidType | null
): boolean {
  if (newBid === BidType.PASS) {
    return true;
  }

  if (!currentHighestBid || currentHighestBid === BidType.PASS) {
    return true;
  }

  const currentIndex = BID_ORDER.indexOf(currentHighestBid);
  const newIndex = BID_ORDER.indexOf(newBid);

  return newIndex > currentIndex;
}

/**
 * Compare deux enchères
 * Retourne un nombre positif si a > b, négatif si a < b, 0 si égales
 */
export function compareBids(a: BidType, b: BidType): number {
  return BID_ORDER.indexOf(a) - BID_ORDER.indexOf(b);
}

/**
 * Trouve la meilleure enchère parmi une liste
 */
export function getHighestBid(bids: Bid[]): Bid | null {
  if (bids.length === 0) return null;

  return bids.reduce((highest, current) => {
    if (!highest || compareBids(current.type, highest.type) > 0) {
      return current;
    }
    return highest;
  });
}

/**
 * Vérifie si tous les joueurs sauf un ont passé
 */
export function hasWinningBidder(
  bids: Bid[],
  totalPlayers: number
): { hasWinner: boolean; winnerId?: string; winningBid?: BidType } {
  // Il faut que tous les joueurs aient fait leur enchère
  if (bids.length < totalPlayers) {
    return { hasWinner: false };
  }

  // Compter les passes
  const passes = bids.filter(b => b.type === BidType.PASS).length;

  // Si tout le monde passe, pas de gagnant
  if (passes === totalPlayers) {
    return { hasWinner: false };
  }

  // S'il y a au moins une enchère non-pass
  const nonPassBids = bids.filter(b => b.type !== BidType.PASS);

  if (nonPassBids.length > 0) {
    const highestBid = getHighestBid(nonPassBids);
    if (highestBid) {
      return {
        hasWinner: true,
        winnerId: highestBid.playerId,
        winningBid: highestBid.type,
      };
    }
  }

  return { hasWinner: false };
}

/**
 * Obtient le nom français de l'enchère
 */
export function getBidName(bidType: BidType): string {
  switch (bidType) {
    case BidType.PASS:
      return 'Passe';
    case BidType.PETITE:
      return 'Petite (Prise)';
    case BidType.GARDE:
      return 'Garde';
    case BidType.GARDE_SANS:
      return 'Garde Sans le Chien';
    case BidType.GARDE_CONTRE:
      return 'Garde Contre le Chien';
    default:
      return 'Inconnu';
  }
}

/**
 * Obtient le multiplicateur de l'enchère
 */
export function getBidMultiplier(bidType: BidType): number {
  if (bidType === BidType.PASS) return 0;
  return BID_MULTIPLIERS[bidType as Exclude<BidType, BidType.PASS>] || 0;
}

/**
 * Détermine si le chien doit être révélé pour cette enchère
 */
export function shouldRevealDog(bidType: BidType): boolean {
  return bidType === BidType.PETITE || bidType === BidType.GARDE;
}

/**
 * Détermine si le preneur prend le chien dans sa main pour cette enchère
 */
export function shouldTakerTakeDog(bidType: BidType): boolean {
  return bidType === BidType.PETITE || bidType === BidType.GARDE;
}

/**
 * Détermine à qui appartient le chien pour le calcul des points
 */
export function getDogOwner(bidType: BidType): 'taker' | 'defenders' {
  if (bidType === BidType.GARDE_CONTRE) {
    return 'defenders';
  }
  return 'taker';
}
