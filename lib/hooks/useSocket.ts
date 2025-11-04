import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  CreateRoomResponse,
  JoinRoomResponse,
} from '@/types/socket';
import { GameState, BidType, PlayerCount } from '@/types/game';
import { Card } from '@/types/card';

type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * Hook Socket.io ULTRA PUISSANT 💪
 * Gère toute la communication temps réel avec le serveur
 */
export function useSocket() {
  const [socket, setSocket] = useState<SocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<SocketClient | null>(null);

  /**
   * Initialise la connexion Socket.io
   */
  useEffect(() => {
    // Initialiser Socket.io
    const initSocket = async () => {
      // D'abord appeler l'API pour initialiser Socket.io côté serveur
      await fetch('/api/socket');

      const socketClient: SocketClient = io({
        path: '/api/socket',
        addTrailingSlash: false,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = socketClient;

      socketClient.on('connect', () => {
        console.log('✅ Connecté au serveur Socket.io');
        setIsConnected(true);
        setError(null);

        // Tentative de reconnexion
        const savedPlayerId = localStorage.getItem('tarot_player_id');
        const savedRoomId = localStorage.getItem('tarot_room_id');

        if (savedPlayerId && savedRoomId) {
          socketClient.emit('reconnect:attempt', {
            playerId: savedPlayerId,
            roomId: savedRoomId,
          });
        }
      });

      socketClient.on('disconnect', () => {
        console.log('🔌 Déconnecté du serveur');
        setIsConnected(false);
      });

      socketClient.on('connect_error', (err) => {
        console.error('❌ Erreur de connexion:', err);
        setError('Erreur de connexion au serveur');
      });

      // Événements de room
      socketClient.on('room:created', ({ roomId, code }) => {
        console.log(`✅ Room créée: ${code}`);
        setRoomId(roomId);
        localStorage.setItem('tarot_room_id', roomId);
      });

      socketClient.on('room:joined', ({ roomId, playerId: pId }) => {
        console.log('✅ Room rejointe');
        setRoomId(roomId);
        setPlayerId(pId);
        localStorage.setItem('tarot_room_id', roomId);
        localStorage.setItem('tarot_player_id', pId);
      });

      socketClient.on('room:player-joined', ({ playerName }) => {
        console.log(`👤 ${playerName} a rejoint la partie`);
      });

      socketClient.on('room:player-left', ({ playerId: leftPlayerId }) => {
        console.log(`👋 Joueur ${leftPlayerId} a quitté`);
      });

      // Événements de jeu
      socketClient.on('game:started', (state) => {
        console.log('🎮 Partie démarrée !');
        setGameState(state);
      });

      socketClient.on('game:state-update', (state) => {
        setGameState(state);
      });

      socketClient.on('game:player-action', ({ playerId: actorId, action }) => {
        console.log(`🎯 Joueur ${actorId}: ${action}`);
      });

      // Événements de reconnexion
      socketClient.on('reconnected', ({ playerId: reconPlayerId, state }) => {
        console.log('🔄 Reconnecté !');
        setPlayerId(reconPlayerId);
        setGameState(state);
        setError(null);
      });

      // Erreurs
      socketClient.on('error', (message) => {
        console.error('❌ Erreur:', message);
        setError(message);
      });

      socketClient.on('action:error', ({ action, error: actionError }) => {
        console.error(`❌ Erreur ${action}:`, actionError);
        setError(actionError);
      });

      setSocket(socketClient);
    };

    initSocket();

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  /**
   * Créer une room
   */
  const createRoom = useCallback(
    async (playerName: string, playerCount: PlayerCount): Promise<CreateRoomResponse> => {
      return new Promise((resolve) => {
        if (!socket) {
          resolve({ success: false, error: 'Socket non connecté' });
          return;
        }

        socket.emit('room:create', { playerName, playerCount }, (response) => {
          if (response.success && response.playerId) {
            setPlayerId(response.playerId);
            localStorage.setItem('tarot_player_id', response.playerId);
          }
          resolve(response);
        });
      });
    },
    [socket]
  );

  /**
   * Rejoindre une room
   */
  const joinRoom = useCallback(
    async (code: string, playerName: string): Promise<JoinRoomResponse> => {
      return new Promise((resolve) => {
        if (!socket) {
          resolve({ success: false, error: 'Socket non connecté' });
          return;
        }

        socket.emit('room:join', { code, playerName }, (response) => {
          if (response.success && response.playerId) {
            setPlayerId(response.playerId);
            if (response.gameState) {
              setGameState(response.gameState);
            }
            localStorage.setItem('tarot_player_id', response.playerId);
          }
          resolve(response);
        });
      });
    },
    [socket]
  );

  /**
   * Quitter une room
   */
  const leaveRoom = useCallback(() => {
    if (!socket) return;

    socket.emit('room:leave');
    setRoomId(null);
    setPlayerId(null);
    setGameState(null);
    localStorage.removeItem('tarot_room_id');
    localStorage.removeItem('tarot_player_id');
  }, [socket]);

  /**
   * Démarrer la partie
   */
  const startGame = useCallback(() => {
    if (!socket) return;
    socket.emit('room:start-game');
  }, [socket]);

  /**
   * Enchérir
   */
  const placeBidAction = useCallback(
    (bidType: BidType) => {
      if (!socket) return;
      socket.emit('game:bid', { bidType });
    },
    [socket]
  );

  /**
   * Révéler le chien
   */
  const revealDogAction = useCallback(() => {
    if (!socket) return;
    socket.emit('game:reveal-dog');
  }, [socket]);

  /**
   * Écarter
   */
  const discardAction = useCallback(
    (cards: Card[]) => {
      if (!socket) return;
      socket.emit('game:discard', { cards });
    },
    [socket]
  );

  /**
   * Jouer une carte
   */
  const playCardAction = useCallback(
    (card: Card) => {
      if (!socket) return;
      socket.emit('game:play-card', { card });
    },
    [socket]
  );

  /**
   * Calculer les scores
   */
  const calculateScoresAction = useCallback(() => {
    if (!socket) return;
    socket.emit('game:calculate-scores');
  }, [socket]);

  /**
   * Nouvelle manche
   */
  const newRoundAction = useCallback(() => {
    if (!socket) return;
    socket.emit('game:new-round');
  }, [socket]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    socket,
    isConnected,
    gameState,
    roomId,
    playerId,
    error,

    // Actions
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    placeBid: placeBidAction,
    revealDog: revealDogAction,
    discard: discardAction,
    playCard: playCardAction,
    calculateScores: calculateScoresAction,
    newRound: newRoundAction,
    clearError,
  };
}
