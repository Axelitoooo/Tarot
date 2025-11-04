import { Card } from '@/types/card';
import { BidType, PoigneeType, RoundResult, REQUIRED_POINTS, POIGNEE_POINTS } from '@/types/game';
import { calculatePoints, countOudlers } from './deck';
import { getBidMultiplier } from './bidding';

/**
 * Calcule le score d'une manche
 */
export function calculateRoundScore(
  takerCards: Card[],
  takerDiscard: Card[],
  bid: BidType,
  petitAuBout: boolean,
  petitAuBoutWinner: 'taker' | 'defenders',
  poignee: PoigneeType,
  poigneeWinner: 'taker' | 'defenders',
  chelemAnnounced: boolean,
  chelemRealized: boolean
): {
  takerPoints: number;
  oudlersCount: number;
  requiredPoints: number;
  contractMade: boolean;
  baseScore: number;
  petitAuBoutBonus: number;
  poigneeBonus: number;
  chelemBonus: number;
  multiplier: number;
  totalScore: number;
} {
  // 1. Calculer les points du preneur (cartes + écart)
  const allTakerCards = [...takerCards, ...takerDiscard];
  const takerPoints = calculatePoints(allTakerCards);
  const oudlersCount = countOudlers(allTakerCards);

  // 2. Déterminer les points requis selon le nombre de Bouts
  const requiredPoints = REQUIRED_POINTS[oudlersCount as 0 | 1 | 2 | 3];

  // 3. Vérifier si le contrat est réalisé
  const contractMade = takerPoints >= requiredPoints;

  // 4. Calculer le score de base
  // Score de base = 25 + écart de points
  const pointDifference = Math.abs(takerPoints - requiredPoints);
  let baseScore = 25 + pointDifference;

  // Si le contrat est chuté, le score est négatif
  if (!contractMade) {
    baseScore = -baseScore;
  }

  // 5. Ajouter le Petit au Bout (multipliable)
  let petitAuBoutBonus = 0;
  if (petitAuBout) {
    petitAuBoutBonus = 10;
    if (petitAuBoutWinner === 'defenders') {
      petitAuBoutBonus = -10;
    }
    // Le petit au bout s'ajoute au score de base avant multiplication
    baseScore += petitAuBoutBonus;
  }

  // 6. Appliquer le multiplicateur selon l'enchère
  const multiplier = getBidMultiplier(bid);
  let totalScore = baseScore * multiplier;

  // 7. Ajouter la prime de Poignée (non multipliable)
  let poigneeBonus = 0;
  if (poignee !== PoigneeType.NONE) {
    poigneeBonus = POIGNEE_POINTS[poignee];
    if (poigneeWinner === 'defenders') {
      poigneeBonus = -poigneeBonus;
    }
    totalScore += poigneeBonus;
  }

  // 8. Ajouter la prime de Chelem (non multipliable)
  let chelemBonus = 0;
  if (chelemAnnounced && chelemRealized) {
    chelemBonus = 400; // Chelem annoncé et réalisé
  } else if (!chelemAnnounced && chelemRealized) {
    chelemBonus = 200; // Chelem non annoncé mais réalisé
  } else if (chelemAnnounced && !chelemRealized) {
    chelemBonus = -200; // Chelem annoncé mais non réalisé
  }
  totalScore += chelemBonus;

  return {
    takerPoints,
    oudlersCount,
    requiredPoints,
    contractMade,
    baseScore: baseScore / multiplier, // Score avant multiplication
    petitAuBoutBonus,
    poigneeBonus,
    chelemBonus,
    multiplier,
    totalScore,
  };
}

/**
 * Répartit les scores entre les joueurs
 * Le preneur gagne/perd 3x le score
 * Chaque défenseur gagne/perd 1x le score
 */
export function distributeScores(
  totalScore: number,
  playerIds: string[],
  takerId: string
): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const playerId of playerIds) {
    if (playerId === takerId) {
      // Le preneur gagne/perd 3 fois le score
      scores[playerId] = totalScore * 3;
    } else {
      // Chaque défenseur gagne/perd l'opposé du score
      scores[playerId] = -totalScore;
    }
  }

  return scores;
}

/**
 * Calcule le résultat complet d'une manche
 */
export function calculateFullRoundResult(
  takerCards: Card[],
  takerDiscard: Card[],
  takerId: string,
  playerIds: string[],
  bid: BidType,
  petitAuBout: boolean,
  petitAuBoutWinner: 'taker' | 'defenders',
  poignee: PoigneeType = PoigneeType.NONE,
  poigneeWinner: 'taker' | 'defenders' = 'taker',
  chelemAnnounced: boolean = false,
  chelemRealized: boolean = false
): RoundResult {
  const scoring = calculateRoundScore(
    takerCards,
    takerDiscard,
    bid,
    petitAuBout,
    petitAuBoutWinner,
    poignee,
    poigneeWinner,
    chelemAnnounced,
    chelemRealized
  );

  const playerScores = distributeScores(scoring.totalScore, playerIds, takerId);

  return {
    takerId,
    bid,
    takerPoints: scoring.takerPoints,
    oudlersCount: scoring.oudlersCount,
    requiredPoints: scoring.requiredPoints,
    contractMade: scoring.contractMade,
    petitAuBout,
    poignee,
    chelemBonus: scoring.chelemBonus,
    totalPoints: scoring.totalScore,
    playerScores,
  };
}

/**
 * Détecte si un joueur a une Poignée
 */
export function detectPoignee(hand: Card[]): PoigneeType {
  const trumps = hand.filter(card => card.suit === 'TRUMP');
  const hasExcuse = hand.some(card => card.suit === 'EXCUSE');

  // L'Excuse compte comme atout pour la Poignée seulement si le joueur n'a pas d'autre atout
  const trumpCount = hasExcuse && trumps.length === 0 ? 1 : trumps.length;

  if (trumpCount >= 15) {
    return PoigneeType.TRIPLE;
  } else if (trumpCount >= 13) {
    return PoigneeType.DOUBLE;
  } else if (trumpCount >= 10) {
    return PoigneeType.SIMPLE;
  }

  return PoigneeType.NONE;
}

/**
 * Vérifie si un Chelem a été réalisé
 * (Le joueur/équipe a gagné tous les 18 plis)
 */
export function checkChelemRealized(
  playerTricks: number,
  totalTricks: number
): boolean {
  return playerTricks === totalTricks;
}

/**
 * Obtient une description textuelle du résultat
 */
export function getResultDescription(result: RoundResult): string {
  const parts: string[] = [];

  if (result.contractMade) {
    parts.push(`✅ Contrat RÉUSSI`);
  } else {
    parts.push(`❌ Contrat CHUTÉ`);
  }

  parts.push(
    `${result.takerPoints} pts (requis: ${result.requiredPoints}) avec ${result.oudlersCount} Bout(s)`
  );

  if (result.petitAuBout) {
    parts.push(`🎯 Petit au Bout (+10 pts)`);
  }

  if (result.poignee !== PoigneeType.NONE) {
    const poigneeNames = {
      [PoigneeType.SIMPLE]: 'Simple Poignée',
      [PoigneeType.DOUBLE]: 'Double Poignée',
      [PoigneeType.TRIPLE]: 'Triple Poignée',
      [PoigneeType.NONE]: '',
    };
    parts.push(`🤚 ${poigneeNames[result.poignee]} (+${POIGNEE_POINTS[result.poignee]} pts)`);
  }

  if (result.chelemBonus !== 0) {
    if (result.chelemBonus === 400) {
      parts.push(`🏆 Chelem annoncé et réalisé (+400 pts)`);
    } else if (result.chelemBonus === 200) {
      parts.push(`🏆 Chelem réalisé (+200 pts)`);
    } else if (result.chelemBonus === -200) {
      parts.push(`💥 Chelem annoncé mais échoué (-200 pts)`);
    }
  }

  return parts.join(' | ');
}

/**
 * Formate un score pour l'affichage
 */
export function formatScore(score: number): string {
  if (score > 0) {
    return `+${score}`;
  } else if (score === 0) {
    return '0';
  }
  return `${score}`;
}
