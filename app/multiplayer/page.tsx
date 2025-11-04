'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlayerCount } from '@/types/game';
import { useSocket } from '@/lib/hooks/useSocket';

export default function MultiplayerPage() {
  const router = useRouter();
  const {
    isConnected,
    error: socketError,
    createRoom,
    joinRoom,
    clearError,
  } = useSocket();

  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [playerName, setPlayerName] = useState('');
  const [playerCount, setPlayerCount] = useState<PlayerCount>(4);
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger le nom du joueur depuis localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('tarot_player_name');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  /**
   * Créer une room
   */
  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setError('Veuillez entrer votre nom');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await createRoom(playerName.trim(), playerCount);

      if (response.success && response.code) {
        localStorage.setItem('tarot_player_name', playerName.trim());
        // Rediriger vers la room
        router.push(`/room/${response.code}`);
      } else {
        setError(response.error || 'Erreur lors de la création');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Rejoindre une room
   */
  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      setError('Veuillez entrer votre nom');
      return;
    }

    if (!roomCode.trim() || roomCode.length !== 6) {
      setError('Veuillez entrer un code valide (6 caractères)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await joinRoom(roomCode.toUpperCase(), playerName.trim());

      if (response.success) {
        localStorage.setItem('tarot_player_name', playerName.trim());
        // Rediriger vers la room
        router.push(`/room/${roomCode.toUpperCase()}`);
      } else {
        setError(response.error || 'Impossible de rejoindre la room');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: 'linear-gradient(135deg, #5C4A32 0%, #3E2F1F 50%, #2A1F14 100%)',
      }}
    >
      {/* Texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.1) 2px,
            rgba(0,0,0,0.1) 4px
          )`,
        }}
      />

      <div className="relative z-10 max-w-2xl w-full">
        <div
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border-4 border-yellow-600"
        >
          <h1 className="text-5xl font-black text-yellow-400 mb-2 text-center">
            🌐 Multijoueur
          </h1>

          {/* Indicateur de connexion */}
          <div className="text-center mb-8">
            {isConnected ? (
              <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Connecté
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Déconnecté
              </div>
            )}
          </div>

          {/* Erreurs */}
          {(error || socketError) && (
            <div className="bg-red-500 text-white px-4 py-3 rounded-lg mb-6">
              ⚠️ {error || socketError}
            </div>
          )}

          {/* Menu principal */}
          {mode === 'menu' && (
            <div className="space-y-4">
              <button
                onClick={() => setMode('create')}
                disabled={!isConnected}
                className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-2xl py-6 rounded-xl transition-all transform hover:scale-105"
              >
                🎮 CRÉER UNE PARTIE
              </button>

              <button
                onClick={() => setMode('join')}
                disabled={!isConnected}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-2xl py-6 rounded-xl transition-all transform hover:scale-105"
              >
                🔗 REJOINDRE UNE PARTIE
              </button>

              <a
                href="/"
                className="block text-center text-gray-400 hover:text-gray-200 underline mt-6"
              >
                ← Retour à l'accueil
              </a>
            </div>
          )}

          {/* Créer une partie */}
          {mode === 'create' && (
            <div className="space-y-6">
              <div>
                <label className="block text-yellow-400 font-bold mb-2">
                  Votre nom:
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Entrez votre nom..."
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-yellow-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-yellow-400 font-bold mb-2">
                  Nombre de joueurs:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[3, 4, 5].map((count) => (
                    <button
                      key={count}
                      onClick={() => setPlayerCount(count as PlayerCount)}
                      className={`py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                        playerCount === count
                          ? 'bg-yellow-600 text-white scale-105'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateRoom}
                disabled={loading || !isConnected}
                className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xl py-4 rounded-xl transition-all transform hover:scale-105"
              >
                {loading ? '⏳ Création...' : '✅ CRÉER LA PARTIE'}
              </button>

              <button
                onClick={() => setMode('menu')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all"
              >
                ← Retour
              </button>
            </div>
          )}

          {/* Rejoindre une partie */}
          {mode === 'join' && (
            <div className="space-y-6">
              <div>
                <label className="block text-yellow-400 font-bold mb-2">
                  Votre nom:
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Entrez votre nom..."
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-yellow-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-yellow-400 font-bold mb-2">
                  Code de la partie:
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Ex: ABC123"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-yellow-500 outline-none text-center text-2xl font-black tracking-widest"
                />
                <p className="text-gray-400 text-sm mt-1">
                  Entrez le code à 6 caractères
                </p>
              </div>

              <button
                onClick={handleJoinRoom}
                disabled={loading || !isConnected}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xl py-4 rounded-xl transition-all transform hover:scale-105"
              >
                {loading ? '⏳ Connexion...' : '✅ REJOINDRE'}
              </button>

              <button
                onClick={() => setMode('menu')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all"
              >
                ← Retour
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
