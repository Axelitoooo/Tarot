import { Card } from '@/types/card';
import { PlayerCount } from '@/types/game';

/**
 * Algorithme de mélange Fisher-Yates
 * Mélange un tableau de manière aléatoire et uniforme
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Distribue les cartes selon le nombre de joueurs
 * Retourne les mains de chaque joueur et le chien
 */
export function dealCards(
  deck: Card[],
  playerCount: PlayerCount
): {
  hands: Card[][];
  dog: Card[];
} {
  const shuffled = shuffleDeck(deck);
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);
  const dog: Card[] = [];

  // Cartes par joueur selon le nombre de joueurs
  const cardsPerPlayer = playerCount === 3 ? 24 : playerCount === 4 ? 18 : 15;

  // Distribuer 3 cartes à la fois dans le sens inverse des aiguilles d'une montre
  let currentPlayer = 0;
  let cardIndex = 0;

  // Constituer le chien (6 cartes) et distribuer les autres
  // Le chien est constitué une carte à la fois, pas la première ni la dernière
  const dogPositions = generateDogPositions(78);

  while (cardIndex < shuffled.length) {
    const card = shuffled[cardIndex];

    // Si cette position est pour le chien
    if (dogPositions.includes(cardIndex)) {
      dog.push(card);
    } else {
      // Distribuer au joueur actuel
      hands[currentPlayer].push(card);

      // Passer au joueur suivant tous les 3 cartes (distribution par 3)
      if ((cardIndex + 1 - dog.length) % 3 === 0) {
        currentPlayer = (currentPlayer + 1) % playerCount;
      }
    }

    cardIndex++;
  }

  return { hands, dog };
}

/**
 * Génère les positions pour le chien (6 cartes)
 * Pas la première ni la dernière carte du paquet
 */
function generateDogPositions(deckSize: number): number[] {
  const positions: number[] = [];
  const possiblePositions = Array.from(
    { length: deckSize - 2 },
    (_, i) => i + 1
  );

  // Sélectionner 6 positions aléatoires
  while (positions.length < 6) {
    const randomIndex = Math.floor(Math.random() * possiblePositions.length);
    positions.push(possiblePositions[randomIndex]);
    possiblePositions.splice(randomIndex, 1);
  }

  return positions.sort((a, b) => a - b);
}

/**
 * Vérifie si un joueur a le Petit Sec
 * (Le Petit comme seul atout sans l'Excuse)
 */
export function hasPetitSec(hand: Card[]): boolean {
  const trumps = hand.filter(card => card.suit === 'TRUMP');
  const hasExcuse = hand.some(card => card.suit === 'EXCUSE');

  // Petit Sec = le Petit (atout 1) est le seul atout et pas d'Excuse
  return (
    trumps.length === 1 &&
    trumps[0].trumpNumber === 1 &&
    !hasExcuse
  );
}

/**
 * Vérifie toutes les mains pour le Petit Sec
 * Retourne l'index du joueur avec Petit Sec ou -1
 */
export function checkPetitSec(hands: Card[][]): number {
  for (let i = 0; i < hands.length; i++) {
    if (hasPetitSec(hands[i])) {
      return i;
    }
  }
  return -1;
}
