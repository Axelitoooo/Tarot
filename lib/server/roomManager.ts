import { GameState, PlayerCount } from '@/types/game';
import { RoomData, RoomPlayerInfo } from '@/types/socket';
import { createGame, startNewRound } from '@/lib/game';

/**
 * Gestionnaire de salles de jeu ULTRA PUISSANT
 * Gère toutes les rooms, les joueurs, et les états de jeu
 */
export class RoomManager {
  private rooms: Map<string, RoomData> = new Map();
  private playerToRoom: Map<string, string> = new Map();
  private codeToRoom: Map<string, string> = new Map();

  /**
   * Génère un code unique à 6 caractères
   */
  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sans I, O, 0, 1 pour éviter confusion
    let code = '';
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.codeToRoom.has(code));
    return code;
  }

  /**
   * Génère un ID unique de room
   */
  private generateRoomId(): string {
    return `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Génère un ID unique de joueur
   */
  private generatePlayerId(): string {
    return `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Crée une nouvelle room
   */
  createRoom(hostName: string, playerCount: PlayerCount): { roomId: string; code: string; playerId: string } {
    const roomId = this.generateRoomId();
    const code = this.generateRoomCode();
    const playerId = this.generatePlayerId();

    const hostPlayer: RoomPlayerInfo = {
      id: playerId,
      name: hostName,
      connected: true,
    };

    const room: RoomData = {
      id: roomId,
      code,
      hostId: playerId,
      playerCount,
      players: new Map([[playerId, hostPlayer]]),
      gameState: null,
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.rooms.set(roomId, room);
    this.playerToRoom.set(playerId, roomId);
    this.codeToRoom.set(code, roomId);

    console.log(`✅ Room créée: ${code} (${roomId}) par ${hostName}`);

    return { roomId, code, playerId };
  }

  /**
   * Rejoint une room existante
   */
  joinRoom(code: string, playerName: string): {
    roomId: string;
    playerId: string;
    playerIndex: number;
    gameState: GameState | null;
  } | null {
    const roomId = this.codeToRoom.get(code);
    if (!roomId) {
      console.log(`❌ Room non trouvée avec le code: ${code}`);
      return null;
    }

    const room = this.rooms.get(roomId);
    if (!room) return null;

    // Vérifier si la room est pleine
    if (room.players.size >= room.playerCount) {
      console.log(`❌ Room ${code} est pleine`);
      return null;
    }

    // Vérifier si la partie a déjà commencé
    if (room.gameState && room.gameState.phase !== 'WAITING') {
      console.log(`❌ Room ${code} a déjà commencé`);
      return null;
    }

    const playerId = this.generatePlayerId();
    const player: RoomPlayerInfo = {
      id: playerId,
      name: playerName,
      connected: true,
    };

    room.players.set(playerId, player);
    this.playerToRoom.set(playerId, roomId);
    room.lastActivity = new Date();

    const playerIndex = room.players.size - 1;

    console.log(`✅ ${playerName} a rejoint la room ${code} (${playerIndex + 1}/${room.playerCount})`);

    return { roomId, playerId, playerIndex, gameState: room.gameState };
  }

  /**
   * Un joueur quitte la room
   */
  leaveRoom(playerId: string): { roomId: string; shouldDeleteRoom: boolean } | null {
    const roomId = this.playerToRoom.get(playerId);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.players.delete(playerId);
    this.playerToRoom.delete(playerId);

    // Si la room est vide ou si l'host part, supprimer la room
    const shouldDeleteRoom = room.players.size === 0 || playerId === room.hostId;

    if (shouldDeleteRoom) {
      this.codeToRoom.delete(room.code);
      this.rooms.delete(roomId);
      console.log(`🗑️ Room ${room.code} supprimée`);
    } else {
      console.log(`👋 Joueur quitté: ${playerId} de la room ${room.code}`);
    }

    return { roomId, shouldDeleteRoom };
  }

  /**
   * Marque un joueur comme déconnecté
   */
  disconnectPlayer(playerId: string): { roomId: string; room: RoomData } | null {
    const roomId = this.playerToRoom.get(playerId);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (!room) return null;

    const player = room.players.get(playerId);
    if (player) {
      player.connected = false;
      console.log(`🔌 Joueur déconnecté: ${player.name} (${playerId})`);
    }

    return { roomId, room };
  }

  /**
   * Reconnecte un joueur
   */
  reconnectPlayer(playerId: string, socketId: string): { roomId: string; room: RoomData } | null {
    const roomId = this.playerToRoom.get(playerId);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (!room) return null;

    const player = room.players.get(playerId);
    if (player) {
      player.connected = true;
      player.socketId = socketId;
      console.log(`🔄 Joueur reconnecté: ${player.name} (${playerId})`);
    }

    return { roomId, room };
  }

  /**
   * Démarre la partie dans une room
   */
  startGame(roomId: string): GameState | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    // Vérifier qu'on a le bon nombre de joueurs
    if (room.players.size !== room.playerCount) {
      console.log(`❌ Impossible de démarrer: ${room.players.size}/${room.playerCount} joueurs`);
      return null;
    }

    // Créer l'état de jeu initial
    const playerNames = Array.from(room.players.values()).map(p => p.name);
    const playerIds = Array.from(room.players.keys());

    const gameState = createGame(roomId, playerNames, room.playerCount);

    // Mettre les bons IDs de joueurs
    gameState.players = gameState.players.map((player, index) => ({
      ...player,
      id: playerIds[index],
    }));

    // Distribuer les cartes
    const gameWithCards = startNewRound(gameState);
    room.gameState = gameWithCards;
    room.lastActivity = new Date();

    console.log(`🎮 Partie démarrée dans la room ${room.code}`);

    return gameWithCards;
  }

  /**
   * Met à jour l'état du jeu dans une room
   */
  updateGameState(roomId: string, gameState: GameState): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.gameState = gameState;
    room.lastActivity = new Date();

    return true;
  }

  /**
   * Récupère une room par son ID
   */
  getRoom(roomId: string): RoomData | null {
    return this.rooms.get(roomId) || null;
  }

  /**
   * Récupère une room par le code
   */
  getRoomByCode(code: string): RoomData | null {
    const roomId = this.codeToRoom.get(code);
    if (!roomId) return null;
    return this.rooms.get(roomId) || null;
  }

  /**
   * Récupère la room d'un joueur
   */
  getPlayerRoom(playerId: string): RoomData | null {
    const roomId = this.playerToRoom.get(playerId);
    if (!roomId) return null;
    return this.rooms.get(roomId) || null;
  }

  /**
   * Liste toutes les rooms actives
   */
  getAllRooms(): RoomData[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Nettoie les rooms inactives (plus de 2h sans activité)
   */
  cleanupInactiveRooms(): number {
    const now = new Date();
    const maxInactivity = 2 * 60 * 60 * 1000; // 2 heures
    let cleaned = 0;

    for (const [roomId, room] of this.rooms.entries()) {
      if (now.getTime() - room.lastActivity.getTime() > maxInactivity) {
        // Supprimer la room
        this.codeToRoom.delete(room.code);
        this.rooms.delete(roomId);

        // Supprimer les joueurs
        for (const playerId of room.players.keys()) {
          this.playerToRoom.delete(playerId);
        }

        cleaned++;
        console.log(`🧹 Room inactive nettoyée: ${room.code}`);
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 ${cleaned} room(s) inactive(s) nettoyée(s)`);
    }

    return cleaned;
  }

  /**
   * Statistiques du serveur
   */
  getStats(): {
    totalRooms: number;
    totalPlayers: number;
    activeGames: number;
  } {
    let activeGames = 0;
    for (const room of this.rooms.values()) {
      if (room.gameState && room.gameState.phase !== 'WAITING') {
        activeGames++;
      }
    }

    return {
      totalRooms: this.rooms.size,
      totalPlayers: this.playerToRoom.size,
      activeGames,
    };
  }
}

// Instance singleton
export const roomManager = new RoomManager();
