import { Card, Suit, Rank, CARD_POINTS } from '@/types/card';

/**
 * Crée une carte avec ses propriétés
 */
function createCard(
  suit: Suit,
  rank?: Rank,
  trumpNumber?: number
): Card {
  let points = CARD_POINTS.NORMAL;
  let isOudler = false;

  // Déterminer les points selon le type de carte
  if (suit === Suit.EXCUSE) {
    points = CARD_POINTS.OUDLER;
    isOudler = true;
  } else if (suit === Suit.TRUMP) {
    if (trumpNumber === 21 || trumpNumber === 1) {
      points = CARD_POINTS.OUDLER;
      isOudler = true;
    } else {
      points = CARD_POINTS.NORMAL;
    }
  } else if (rank) {
    switch (rank) {
      case Rank.KING:
        points = CARD_POINTS.KING;
        break;
      case Rank.QUEEN:
        points = CARD_POINTS.QUEEN;
        break;
      case Rank.KNIGHT:
        points = CARD_POINTS.KNIGHT;
        break;
      case Rank.JACK:
        points = CARD_POINTS.JACK;
        break;
      default:
        points = CARD_POINTS.NORMAL;
    }
  }

  // Créer un ID unique pour la carte
  const id = suit === Suit.EXCUSE
    ? 'EXCUSE'
    : suit === Suit.TRUMP
    ? `TRUMP-${trumpNumber}`
    : `${suit}-${rank}`;

  return {
    id,
    suit,
    rank,
    trumpNumber,
    points,
    isOudler,
  };
}

/**
 * Crée un deck complet de 78 cartes de tarot français
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];

  // 1. Ajouter les 4 couleurs (14 cartes chacune = 56 cartes)
  const suits = [Suit.SPADE, Suit.HEART, Suit.DIAMOND, Suit.CLUB];
  const ranks = [
    Rank.ACE,
    Rank.TWO,
    Rank.THREE,
    Rank.FOUR,
    Rank.FIVE,
    Rank.SIX,
    Rank.SEVEN,
    Rank.EIGHT,
    Rank.NINE,
    Rank.TEN,
    Rank.JACK,
    Rank.KNIGHT,
    Rank.QUEEN,
    Rank.KING,
  ];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(createCard(suit, rank));
    }
  }

  // 2. Ajouter les 21 atouts (21 cartes)
  for (let i = 1; i <= 21; i++) {
    deck.push(createCard(Suit.TRUMP, undefined, i));
  }

  // 3. Ajouter l'Excuse (1 carte)
  deck.push(createCard(Suit.EXCUSE));

  return deck;
}

/**
 * Vérifie qu'un deck est complet et valide
 */
export function validateDeck(deck: Card[]): boolean {
  if (deck.length !== 78) {
    return false;
  }

  // Vérifier qu'il y a bien 3 oudlers
  const oudlers = deck.filter(card => card.isOudler);
  if (oudlers.length !== 3) {
    return false;
  }

  // Vérifier la somme des points (doit être 91)
  const totalPoints = deck.reduce((sum, card) => sum + card.points, 0);
  // On vérifie avec une petite marge d'erreur pour les flottants
  if (Math.abs(totalPoints - 91) > 0.1) {
    return false;
  }

  return true;
}

/**
 * Compte les oudlers dans une liste de cartes
 */
export function countOudlers(cards: Card[]): number {
  return cards.filter(card => card.isOudler).length;
}

/**
 * Calcule les points d'une liste de cartes
 * Les cartes sont comptées par paires selon les règles officielles
 */
export function calculatePoints(cards: Card[]): number {
  let points = 0;

  // Selon les règles, on compte 2 cartes à la fois
  // Une carte "forte" (Bout, Roi, Dame, Cavalier, Valet) + une carte basse
  // Deux cartes basses = 1 point

  // Pour simplifier le calcul, on additionne tous les points et on soustrait 0.5 par carte
  // Car chaque carte a 0.5 point de "base" mais on ne compte qu'une fois par paire
  for (const card of cards) {
    points += card.points;
  }

  // Retirer 0.5 * nombre de cartes (car comptées par paire)
  points -= (cards.length * 0.5);

  return Math.round(points);
}
