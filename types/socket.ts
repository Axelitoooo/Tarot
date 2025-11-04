import { GameState, BidType, PlayerCount } from './game';
import { Card } from './card';

// Types d'événements Socket.io
export interface ServerToClientEvents {
  // Room events
  'room:created': (data: { roomId: string; code: string }) => void;
  'room:joined': (data: { roomId: string; playerId: string; playerName: string }) => void;
  'room:player-joined': (data: { playerId: string; playerName: string; players: RoomPlayerInfo[] }) => void;
  'room:player-left': (data: { playerId: string; players: RoomPlayerInfo[] }) => void;
  'room:full': () => void;
  'room:not-found': () => void;
  'room:already-started': () => void;

  // Game state events
  'game:state-update': (state: GameState) => void;
  'game:started': (state: GameState) => void;
  'game:player-action': (data: { playerId: string; action: string }) => void;

  // Action results
  'action:success': (data: { action: string; state: GameState }) => void;
  'action:error': (data: { action: string; error: string }) => void;

  // Connection events
  'connected': (data: { socketId: string }) => void;
  'reconnected': (data: { playerId: string; roomId: string; state: GameState }) => void;

  // Error events
  'error': (message: string) => void;
}

export interface ClientToServerEvents {
  // Room management
  'room:create': (data: { playerName: string; playerCount: PlayerCount }, callback: (response: CreateRoomResponse) => void) => void;
  'room:join': (data: { code: string; playerName: string }, callback: (response: JoinRoomResponse) => void) => void;
  'room:leave': () => void;
  'room:start-game': () => void;

  // Game actions
  'game:bid': (data: { bidType: BidType }) => void;
  'game:reveal-dog': () => void;
  'game:discard': (data: { cards: Card[] }) => void;
  'game:play-card': (data: { card: Card }) => void;
  'game:calculate-scores': () => void;
  'game:new-round': () => void;

  // Reconnection
  'reconnect:attempt': (data: { playerId: string; roomId: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  playerId?: string;
  roomId?: string;
  playerName?: string;
}

// Response types
export interface CreateRoomResponse {
  success: boolean;
  roomId?: string;
  code?: string;
  playerId?: string;
  error?: string;
}

export interface JoinRoomResponse {
  success: boolean;
  roomId?: string;
  playerId?: string;
  playerIndex?: number;
  gameState?: GameState;
  error?: string;
}

// Room player info
export interface RoomPlayerInfo {
  id: string;
  name: string;
  connected: boolean;
  socketId?: string;
}

// Room data structure
export interface RoomData {
  id: string;
  code: string;
  hostId: string;
  playerCount: PlayerCount;
  players: Map<string, RoomPlayerInfo>;
  gameState: GameState | null;
  createdAt: Date;
  lastActivity: Date;
}
