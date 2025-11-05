import { Card, Suit } from '@/types/card';
import { BidType, GameState, Player } from '@/types/game';

/**
 * Évalue la force d'une main pour les enchères
 */
export function evaluateHandStrength(hand: Card[]): number {
  let score = 0;

  // Compter les atouts
  const trumps = hand.filter(c => c.suit === Suit.TRUMP);
  score += trumps.length * 3;

  // Atouts forts (15+)
  const strongTrumps = trumps.filter(c => c.trumpNumber && c.trumpNumber >= 15);
  score += strongTrumps.length * 5;

  // Bouts
  const hasExcuse = hand.some(c => c.suit === Suit.EXCUSE);
  const hasPetit = trumps.some(c => c.trumpNumber === 1);
  const has21 = trumps.some(c => c.trumpNumber === 21);

  if (hasExcuse) score += 8;
  if (hasPetit) score += 5;
  if (has21) score += 8;

  // Figures dans les couleurs
  const figures = hand.filter(c =>
    c.suit !== Suit.TRUMP &&
    c.suit !== Suit.EXCUSE &&
    c.rank &&
    ['KING', 'QUEEN', 'KNIGHT', 'JACK'].includes(c.rank)
  );
  score += figures.length * 4;

  // Couleurs longues (protection)
  const suits = [Suit.HEART, Suit.DIAMOND, Suit.SPADE, Suit.CLUB];
  suits.forEach(suit => {
    const cardsInSuit = hand.filter(c => c.suit === suit).length;
    if (cardsInSuit === 0) score += 3; // Couleur vide = coupe disponible
    if (cardsInSuit === 1) score += 2; // Singleton
    if (cardsInSuit >= 5) score += 2; // Couleur longue
  });

  return score;
}

/**
 * Décide quelle enchère faire selon la main
 */
export function decideBid(hand: Card[], currentHighestBid: BidType | null): BidType {
  const strength = evaluateHandStrength(hand);

  // Thresholds pour chaque type d'enchère
  if (strength >= 80) {
    // Main exceptionnelle
    if (!currentHighestBid || currentHighestBid === BidType.PASS) {
      return Math.random() < 0.3 ? BidType.GARDE : BidType.PETITE;
    }
    if (currentHighestBid === BidType.PETITE) {
      return Math.random() < 0.5 ? BidType.GARDE : BidType.PETITE;
    }
    if (currentHighestBid === BidType.GARDE) {
      return Math.random() < 0.2 ? BidType.GARDE_SANS : BidType.GARDE;
    }
  } else if (strength >= 60) {
    // Bonne main
    if (!currentHighestBid || currentHighestBid === BidType.PASS) {
      return Math.random() < 0.7 ? BidType.PETITE : BidType.GARDE;
    }
    if (currentHighestBid === BidType.PETITE) {
      return Math.random() < 0.3 ? BidType.GARDE : BidType.PASS;
    }
  } else if (strength >= 45) {
    // Main moyenne
    if (!currentHighestBid || currentHighestBid === BidType.PASS) {
      return Math.random() < 0.5 ? BidType.PETITE : BidType.PASS;
    }
  }

  return BidType.PASS;
}

/**
 * Choisit intelligemment quelle carte jouer
 */
export function chooseCardToPlay(
  hand: Card[],
  playableCards: Card[],
  currentTrick: Card[],
  isLastTrick: boolean,
  gameState: GameState
): Card {
  if (playableCards.length === 0) {
    throw new Error('Aucune carte jouable');
  }

  if (playableCards.length === 1) {
    return playableCards[0];
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isTaker = currentPlayer.isTaker;

  // Premier de la pli
  if (currentTrick.length === 0) {
    return chooseLeadCard(playableCards, hand, isTaker, isLastTrick);
  }

  // Suivre la pli
  return chooseFollowCard(playableCards, currentTrick, hand, isTaker, isLastTrick, gameState);
}

/**
 * Choisit la carte à jouer en premier
 */
function chooseLeadCard(playableCards: Card[], hand: Card[], isTaker: boolean, isLastTrick: boolean): Card {
  const trumps = playableCards.filter(c => c.suit === Suit.TRUMP);
  const suited = playableCards.filter(c => c.suit !== Suit.TRUMP && c.suit !== Suit.EXCUSE);

  // Dernier pli : jouer le Petit si on l'a pour le bout
  if (isLastTrick) {
    const petit = playableCards.find(c => c.suit === Suit.TRUMP && c.trumpNumber === 1);
    if (petit && isTaker) return petit;
  }

  // Jouer une couleur où on a peu de cartes
  if (suited.length > 0) {
    const suitCounts = new Map<Suit, number>();
    [Suit.HEART, Suit.DIAMOND, Suit.SPADE, Suit.CLUB].forEach(suit => {
      suitCounts.set(suit, hand.filter(c => c.suit === suit).length);
    });

    // Trouver la couleur la plus courte
    const shortestSuit = Array.from(suitCounts.entries())
      .filter(([suit, count]) => count > 0 && suited.some(c => c.suit === suit))
      .sort((a, b) => a[1] - b[1])[0];

    if (shortestSuit) {
      const cardsInShortSuit = suited.filter(c => c.suit === shortestSuit[0]);
      if (cardsInShortSuit.length > 0) {
        // Jouer la plus petite carte de cette couleur
        return cardsInShortSuit.sort((a, b) => a.points - b.points)[0];
      }
    }
  }

  // Sinon jouer un atout moyen
  if (trumps.length > 0) {
    const mediumTrumps = trumps.filter(c => c.trumpNumber && c.trumpNumber >= 5 && c.trumpNumber <= 15);
    if (mediumTrumps.length > 0) {
      return mediumTrumps[0];
    }
    return trumps[0];
  }

  // Par défaut, la première carte
  return playableCards[0];
}

/**
 * Choisit la carte pour suivre un pli
 */
function chooseFollowCard(
  playableCards: Card[],
  currentTrick: Card[],
  hand: Card[],
  isTaker: boolean,
  isLastTrick: boolean,
  gameState: GameState
): Card {
  // Analyser qui gagne actuellement
  const leadCard = currentTrick[0];
  let winningCard = leadCard;
  let winningIndex = 0;

  for (let i = 1; i < currentTrick.length; i++) {
    if (doesCardWin(currentTrick[i], winningCard, leadCard)) {
      winningCard = currentTrick[i];
      winningIndex = i;
    }
  }

  const winningPlayer = gameState.players[winningIndex];
  const isPartnerWinning = winningPlayer.isTaker === isTaker;

  // Si notre partenaire gagne et on n'est pas preneur
  if (isPartnerWinning && !isTaker) {
    // Défausser une petite carte
    const lowCards = playableCards.sort((a, b) => a.points - b.points);
    return lowCards[0];
  }

  // Si adversaire gagne, essayer de reprendre
  if (!isPartnerWinning) {
    const winningCards = playableCards.filter(c => doesCardWin(c, winningCard, leadCard));
    if (winningCards.length > 0) {
      // Prendre avec la plus petite carte possible
      return winningCards.sort((a, b) => {
        if (a.suit === Suit.TRUMP && b.suit === Suit.TRUMP) {
          return (a.trumpNumber || 0) - (b.trumpNumber || 0);
        }
        return a.points - b.points;
      })[0];
    }
  }

  // Si on ne peut pas gagner, défausser les petites cartes
  const sorted = playableCards.sort((a, b) => a.points - b.points);
  return sorted[0];
}

/**
 * Détermine si une carte bat une autre
 */
function doesCardWin(card: Card, currentWinner: Card, leadCard: Card): boolean {
  // Excuse ne gagne jamais
  if (card.suit === Suit.EXCUSE) return false;
  if (currentWinner.suit === Suit.EXCUSE) return true;

  // Atout bat toujours une couleur
  if (card.suit === Suit.TRUMP && currentWinner.suit !== Suit.TRUMP) return true;
  if (card.suit !== Suit.TRUMP && currentWinner.suit === Suit.TRUMP) return false;

  // Deux atouts : le plus fort gagne
  if (card.suit === Suit.TRUMP && currentWinner.suit === Suit.TRUMP) {
    return (card.trumpNumber || 0) > (currentWinner.trumpNumber || 0);
  }

  // Couleur demandée : plus forte gagne
  if (card.suit === leadCard.suit && currentWinner.suit === leadCard.suit) {
    const order = ['7', '8', '9', '10', 'JACK', 'KNIGHT', 'QUEEN', 'KING'];
    return order.indexOf(card.rank || '') > order.indexOf(currentWinner.rank || '');
  }

  // Carte hors couleur ne gagne pas
  if (card.suit !== leadCard.suit && currentWinner.suit === leadCard.suit) return false;
  if (card.suit === leadCard.suit && currentWinner.suit !== leadCard.suit) return true;

  return false;
}

/**
 * Choisit intelligemment l'écart pour le preneur
 */
export function chooseDiscard(hand: Card[], dog: Card[]): Card[] {
  const allCards = [...hand, ...dog];

  // Ne jamais écarter : atouts, bouts, rois
  const cannotDiscard = allCards.filter(c =>
    c.suit === Suit.TRUMP ||
    c.suit === Suit.EXCUSE ||
    c.rank === 'KING'
  );

  const canDiscard = allCards.filter(c => !cannotDiscard.includes(c));

  // Trier par points (écarter les plus petites)
  const sorted = canDiscard.sort((a, b) => a.points - b.points);

  // Prendre les 6 plus petites cartes
  return sorted.slice(0, 6);
}
