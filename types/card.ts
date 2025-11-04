// Couleurs (suits) du tarot
export enum Suit {
  SPADE = 'SPADE',     // Pique
  HEART = 'HEART',     // Coeur
  DIAMOND = 'DIAMOND', // Carreau
  CLUB = 'CLUB',       // Trèfle
  TRUMP = 'TRUMP',     // Atout
  EXCUSE = 'EXCUSE',   // Excuse
}

// Rangs des cartes normales
export enum Rank {
  ACE = 'ACE',         // As (1)
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
  SEVEN = 'SEVEN',
  EIGHT = 'EIGHT',
  NINE = 'NINE',
  TEN = 'TEN',
  JACK = 'JACK',       // Valet (11)
  KNIGHT = 'KNIGHT',   // Cavalier (12)
  QUEEN = 'QUEEN',     // Dame (13)
  KING = 'KING',       // Roi (14)
}

// Interface pour une carte
export interface Card {
  id: string;
  suit: Suit;
  rank?: Rank;         // Pour les cartes normales
  trumpNumber?: number; // Pour les atouts (1-21)
  points: number;       // Valeur en points de la carte
  isOudler: boolean;    // Est-ce un Bout (21, 1, Excuse)
}

// Fonctions helper pour les cartes
export const CARD_POINTS = {
  OUDLER: 4.5,    // Les Bouts valent 4.5 points
  KING: 4.5,      // Roi vaut 4.5 points
  QUEEN: 3.5,     // Dame vaut 3.5 points
  KNIGHT: 2.5,    // Cavalier vaut 2.5 points
  JACK: 1.5,      // Valet vaut 1.5 points
  NORMAL: 0.5,    // Carte normale vaut 0.5 points
};
