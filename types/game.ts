import { Card } from './card';

// Nombre de joueurs possibles
export type PlayerCount = 3 | 4 | 5;

// Types d'enchères
export enum BidType {
  PASS = 'PASS',
  PETITE = 'PETITE',           // Prise
  GARDE = 'GARDE',
  GARDE_SANS = 'GARDE_SANS',   // Garde Sans le Chien
  GARDE_CONTRE = 'GARDE_CONTRE', // Garde Contre le Chien
}

// Multiplicateurs pour chaque enchère
export const BID_MULTIPLIERS = {
  [BidType.PETITE]: 1,
  [BidType.GARDE]: 2,
  [BidType.GARDE_SANS]: 4,
  [BidType.GARDE_CONTRE]: 6,
};

// Enchère d'un joueur
export interface Bid {
  playerId: string;
  type: BidType;
}

// Poignée
export enum PoigneeType {
  NONE = 'NONE',
  SIMPLE = 'SIMPLE',   // 10 atouts
  DOUBLE = 'DOUBLE',   // 13 atouts
  TRIPLE = 'TRIPLE',   // 15 atouts
}

export const POIGNEE_POINTS = {
  [PoigneeType.SIMPLE]: 20,
  [PoigneeType.DOUBLE]: 30,
  [PoigneeType.TRIPLE]: 40,
};

// Joueur
export interface Player {
  id: string;
  name: string;
  hand: Card[];
  tricksWon: Card[][];  // Plis gagnés
  score: number;
  isDealer: boolean;
  isTaker: boolean;     // Est le Preneur
}

// État du jeu
export enum GamePhase {
  WAITING = 'WAITING',           // En attente de joueurs
  DEALING = 'DEALING',           // Distribution des cartes
  BIDDING = 'BIDDING',           // Enchères
  DOG_REVEAL = 'DOG_REVEAL',     // Révélation du Chien
  DISCARDING = 'DISCARDING',     // Écart du Preneur
  PLAYING = 'PLAYING',           // Jeu des cartes
  SCORING = 'SCORING',           // Calcul des scores
  FINISHED = 'FINISHED',         // Partie terminée
}

// Points requis selon le nombre de Bouts
export const REQUIRED_POINTS = {
  0: 56,
  1: 51,
  2: 41,
  3: 36,
};

// État d'une partie
export interface GameState {
  id: string;
  phase: GamePhase;
  playerCount: PlayerCount;
  players: Player[];
  deck: Card[];
  dog: Card[];              // Le Chien (6 cartes)
  currentTrick: Card[];     // Pli en cours
  currentPlayerIndex: number;
  dealerIndex: number;
  takerIndex: number | null; // Index du Preneur
  bids: Bid[];
  currentBid: BidType | null;
  discard: Card[];          // Écart du Preneur
  petitAuBout: boolean;     // Le Petit au bout
  poignee: PoigneeType;
  chelemAnnounced: boolean;
  chelemRealized: boolean;
  trickNumber: number;      // Numéro du pli (1-18)
}

// Résultat d'une manche
export interface RoundResult {
  takerId: string;
  bid: BidType;
  takerPoints: number;
  oudlersCount: number;
  requiredPoints: number;
  contractMade: boolean;
  petitAuBout: boolean;
  poignee: PoigneeType;
  chelemBonus: number;
  totalPoints: number;      // Points gagnés/perdus
  playerScores: Record<string, number>; // Score de chaque joueur
}
