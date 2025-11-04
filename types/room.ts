import { GameState, PlayerCount } from './game';

// Salle de jeu (lobby)
export interface Room {
  id: string;
  name: string;
  code: string;           // Code à 6 caractères pour rejoindre
  hostId: string;
  playerCount: PlayerCount;
  maxPlayers: PlayerCount;
  players: RoomPlayer[];
  gameState: GameState | null;
  isPrivate: boolean;
  createdAt: Date;
}

// Joueur dans une salle
export interface RoomPlayer {
  id: string;
  name: string;
  isReady: boolean;
  isHost: boolean;
}
