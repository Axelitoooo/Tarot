import { Server as HTTPServer } from 'http';
import { Socket as NetSocket } from 'net';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from '@/types/socket';
import { roomManager } from './roomManager';
import {
  placeBid,
  revealDog,
  takeDog,
  makeDiscard,
  playCard,
  calculateFinalScores,
  startNewRound,
} from '@/lib/game';

// Type pour le serveur Socket.io
export type SocketServer = SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

// Étendre les types Next.js
interface SocketServer extends HTTPServer {
  io?: SocketServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

/**
 * Initialise le serveur Socket.io - ULTRA PUISSANT 💪
 */
export function initSocketServer(server: HTTPServer): SocketServer {
  const io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  console.log('🚀 Serveur Socket.io initialisé');

  // Nettoyage périodique des rooms inactives (toutes les 30 minutes)
  setInterval(() => {
    roomManager.cleanupInactiveRooms();
  }, 30 * 60 * 1000);

  io.on('connection', (socket) => {
    console.log(`🔌 Nouvelle connexion: ${socket.id}`);

    socket.emit('connected', { socketId: socket.id });

    // ===== GESTION DES ROOMS =====

    /**
     * Créer une room
     */
    socket.on('room:create', ({ playerName, playerCount }, callback) => {
      try {
        const { roomId, code, playerId } = roomManager.createRoom(playerName, playerCount);

        socket.data.playerId = playerId;
        socket.data.roomId = roomId;
        socket.data.playerName = playerName;

        socket.join(roomId);

        console.log(`✅ Room créée: ${code} par ${playerName}`);

        callback({ success: true, roomId, code, playerId });
        socket.emit('room:created', { roomId, code });
      } catch (error) {
        console.error('❌ Erreur création room:', error);
        callback({ success: false, error: 'Erreur lors de la création de la room' });
      }
    });

    /**
     * Rejoindre une room
     */
    socket.on('room:join', ({ code, playerName }, callback) => {
      try {
        const result = roomManager.joinRoom(code, playerName);

        if (!result) {
          callback({
            success: false,
            error: 'Room non trouvée, pleine ou déjà démarrée',
          });
          return;
        }

        const { roomId, playerId, playerIndex, gameState } = result;

        socket.data.playerId = playerId;
        socket.data.roomId = roomId;
        socket.data.playerName = playerName;

        socket.join(roomId);

        console.log(`✅ ${playerName} a rejoint ${code}`);

        callback({
          success: true,
          roomId,
          playerId,
          playerIndex,
          gameState: gameState || undefined,
        });

        socket.emit('room:joined', { roomId, playerId, playerName });

        // Notifier les autres joueurs
        const room = roomManager.getRoom(roomId);
        if (room) {
          const players = Array.from(room.players.values());
          io.to(roomId).emit('room:player-joined', {
            playerId,
            playerName,
            players,
          });
        }
      } catch (error) {
        console.error('❌ Erreur rejoindre room:', error);
        callback({ success: false, error: 'Erreur lors de la connexion à la room' });
      }
    });

    /**
     * Quitter une room
     */
    socket.on('room:leave', () => {
      const { playerId, roomId } = socket.data;
      if (!playerId || !roomId) return;

      const result = roomManager.leaveRoom(playerId);
      if (!result) return;

      socket.leave(roomId);

      if (!result.shouldDeleteRoom) {
        const room = roomManager.getRoom(roomId);
        if (room) {
          const players = Array.from(room.players.values());
          io.to(roomId).emit('room:player-left', { playerId, players });
        }
      }

      socket.data.playerId = undefined;
      socket.data.roomId = undefined;

      console.log(`👋 Joueur quitté: ${playerId}`);
    });

    /**
     * Démarrer la partie
     */
    socket.on('room:start-game', () => {
      const { roomId, playerId } = socket.data;
      if (!roomId || !playerId) return;

      const room = roomManager.getRoom(roomId);
      if (!room || room.hostId !== playerId) {
        socket.emit('error', 'Seul l\'hôte peut démarrer la partie');
        return;
      }

      const gameState = roomManager.startGame(roomId);
      if (!gameState) {
        socket.emit('error', 'Impossible de démarrer la partie');
        return;
      }

      io.to(roomId).emit('game:started', gameState);
      io.to(roomId).emit('game:state-update', gameState);

      console.log(`🎮 Partie démarrée dans ${room.code}`);
    });

    // ===== ACTIONS DE JEU =====

    /**
     * Enchérir
     */
    socket.on('game:bid', ({ bidType }) => {
      const { roomId, playerId } = socket.data;
      if (!roomId || !playerId) return;

      try {
        const room = roomManager.getRoom(roomId);
        if (!room || !room.gameState) return;

        const newState = placeBid(room.gameState, playerId, bidType);
        roomManager.updateGameState(roomId, newState);

        io.to(roomId).emit('game:state-update', newState);
        io.to(roomId).emit('game:player-action', {
          playerId,
          action: `a enchéri ${bidType}`,
        });

        console.log(`🎯 ${socket.data.playerName} enchère ${bidType}`);
      } catch (error: any) {
        socket.emit('action:error', {
          action: 'bid',
          error: error.message,
        });
      }
    });

    /**
     * Révéler le chien
     */
    socket.on('game:reveal-dog', () => {
      const { roomId, playerId } = socket.data;
      if (!roomId || !playerId) return;

      try {
        const room = roomManager.getRoom(roomId);
        if (!room || !room.gameState) return;

        let newState = revealDog(room.gameState);

        if (newState.phase === 'DISCARDING') {
          newState = takeDog(newState);
        }

        roomManager.updateGameState(roomId, newState);

        io.to(roomId).emit('game:state-update', newState);

        console.log(`🎴 Chien révélé dans ${room.code}`);
      } catch (error: any) {
        socket.emit('action:error', {
          action: 'reveal-dog',
          error: error.message,
        });
      }
    });

    /**
     * Écarter
     */
    socket.on('game:discard', ({ cards }) => {
      const { roomId, playerId } = socket.data;
      if (!roomId || !playerId) return;

      try {
        const room = roomManager.getRoom(roomId);
        if (!room || !room.gameState) return;

        const newState = makeDiscard(room.gameState, playerId, cards);
        roomManager.updateGameState(roomId, newState);

        io.to(roomId).emit('game:state-update', newState);

        console.log(`🗂️ ${socket.data.playerName} a écarté 6 cartes`);
      } catch (error: any) {
        socket.emit('action:error', {
          action: 'discard',
          error: error.message,
        });
      }
    });

    /**
     * Jouer une carte
     */
    socket.on('game:play-card', ({ card }) => {
      const { roomId, playerId } = socket.data;
      if (!roomId || !playerId) return;

      try {
        const room = roomManager.getRoom(roomId);
        if (!room || !room.gameState) return;

        const newState = playCard(room.gameState, playerId, card);
        roomManager.updateGameState(roomId, newState);

        io.to(roomId).emit('game:state-update', newState);

        console.log(`🃏 ${socket.data.playerName} joue une carte`);
      } catch (error: any) {
        socket.emit('action:error', {
          action: 'play-card',
          error: error.message,
        });
      }
    });

    /**
     * Calculer les scores
     */
    socket.on('game:calculate-scores', () => {
      const { roomId } = socket.data;
      if (!roomId) return;

      try {
        const room = roomManager.getRoom(roomId);
        if (!room || !room.gameState) return;

        const newState = calculateFinalScores(room.gameState);
        roomManager.updateGameState(roomId, newState);

        io.to(roomId).emit('game:state-update', newState);

        console.log(`🏆 Scores calculés dans ${room.code}`);
      } catch (error: any) {
        socket.emit('action:error', {
          action: 'calculate-scores',
          error: error.message,
        });
      }
    });

    /**
     * Nouvelle manche
     */
    socket.on('game:new-round', () => {
      const { roomId, playerId } = socket.data;
      if (!roomId || !playerId) return;

      try {
        const room = roomManager.getRoom(roomId);
        if (!room || !room.gameState) return;

        // Seulement l'hôte peut démarrer une nouvelle manche
        if (room.hostId !== playerId) {
          socket.emit('error', 'Seul l\'hôte peut démarrer une nouvelle manche');
          return;
        }

        const newState = startNewRound(room.gameState);
        roomManager.updateGameState(roomId, newState);

        io.to(roomId).emit('game:state-update', newState);

        console.log(`🔄 Nouvelle manche dans ${room.code}`);
      } catch (error: any) {
        socket.emit('action:error', {
          action: 'new-round',
          error: error.message,
        });
      }
    });

    // ===== RECONNEXION =====

    /**
     * Tentative de reconnexion
     */
    socket.on('reconnect:attempt', ({ playerId, roomId }) => {
      const result = roomManager.reconnectPlayer(playerId, socket.id);
      if (!result) {
        socket.emit('error', 'Impossible de se reconnecter');
        return;
      }

      socket.data.playerId = playerId;
      socket.data.roomId = roomId;

      socket.join(roomId);

      if (result.room.gameState) {
        socket.emit('reconnected', {
          playerId,
          roomId,
          state: result.room.gameState,
        });
      }

      console.log(`🔄 Joueur reconnecté: ${playerId}`);
    });

    // ===== DÉCONNEXION =====

    socket.on('disconnect', () => {
      const { playerId, roomId, playerName } = socket.data;

      if (playerId) {
        roomManager.disconnectPlayer(playerId);

        if (roomId) {
          const room = roomManager.getRoom(roomId);
          if (room) {
            const players = Array.from(room.players.values());
            io.to(roomId).emit('room:player-left', { playerId, players });
          }
        }

        console.log(`🔌 Déconnexion: ${playerName || playerId}`);
      }
    });
  });

  // Afficher les stats toutes les 5 minutes
  setInterval(() => {
    const stats = roomManager.getStats();
    console.log(`📊 Stats: ${stats.totalRooms} rooms, ${stats.totalPlayers} joueurs, ${stats.activeGames} parties actives`);
  }, 5 * 60 * 1000);

  return io;
}

export default initSocketServer;
