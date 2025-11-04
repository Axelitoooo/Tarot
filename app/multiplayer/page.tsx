'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlayerCount } from '@/types/game';
import { useSocket } from '@/lib/hooks/useSocket';
import WoodBackground from '@/components/WoodBackground';
import Link from 'next/link';

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
    <WoodBackground className="min-h-screen flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/50 pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full">
        <div
          className="bg-gradient-to-br from-wood-darker/95 to-wood-darkest/95 backdrop-blur-sm p-10 rounded-3xl shadow-wood border-4 border-wood-dark relative overflow-hidden"
        >
          {/* Grain de bois décoratif */}
          <div className="absolute inset-0 bg-wood-grain opacity-10 pointer-events-none" />

          {/* Coins décoratifs */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold/50" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold/50" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold/50" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold/50" />

          <div className="relative z-10">
            <h1 className="text-5xl font-black text-gold-light mb-2 text-center drop-shadow-lg">
              🌐 MULTIJOUEUR
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />

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
            <div className="bg-red-600/90 text-white px-5 py-4 rounded-xl mb-6 shadow-lg border-2 border-red-700">
              <span className="font-bold">⚠️ {error || socketError}</span>
            </div>
          )}

          {/* Menu principal */}
          {mode === 'menu' && (
            <div className="space-y-5">
              <button
                onClick={() => setMode('create')}
                disabled={!isConnected}
                className="group w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-500 hover:via-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-2xl py-7 rounded-2xl transition-all transform hover:scale-105 hover:-translate-y-1 shadow-card hover:shadow-card-hover relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative">🎮 CRÉER UNE PARTIE</span>
              </button>

              <button
                onClick={() => setMode('join')}
                disabled={!isConnected}
                className="group w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-2xl py-7 rounded-2xl transition-all transform hover:scale-105 hover:-translate-y-1 shadow-card hover:shadow-card-hover relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative">🔗 REJOINDRE UNE PARTIE</span>
              </button>

              <Link
                href="/"
                className="block text-center text-wood-light hover:text-gold-light underline mt-8 transition-colors font-semibold"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          )}

          {/* Créer une partie */}
          {mode === 'create' && (
            <div className="space-y-6">
              <div>
                <label className="block text-gold-light font-bold mb-3">
                  Votre nom:
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Entrez votre nom..."
                  maxLength={20}
                  className="w-full px-5 py-4 rounded-xl bg-wood-dark/50 text-white border-2 border-wood-dark focus:border-gold-light outline-none transition-colors shadow-inner text-lg font-semibold placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-gold-light font-bold mb-3">
                  Nombre de joueurs:
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[3, 4, 5].map((count) => (
                    <button
                      key={count}
                      onClick={() => setPlayerCount(count as PlayerCount)}
                      className={`py-5 px-6 rounded-2xl font-black text-2xl transition-all transform hover:scale-110 shadow-md ${
                        playerCount === count
                          ? 'bg-gradient-to-br from-gold to-gold-dark text-wood-darkest scale-110 shadow-card'
                          : 'bg-wood-dark/50 text-wood-lightest hover:bg-wood-dark'
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
                className="w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-500 hover:via-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xl py-5 rounded-2xl transition-all transform hover:scale-105 hover:-translate-y-1 shadow-card hover:shadow-card-hover"
              >
                {loading ? '⏳ Création...' : '✅ CRÉER LA PARTIE'}
              </button>

              <button
                onClick={() => setMode('menu')}
                className="w-full bg-wood-dark/50 hover:bg-wood-dark text-wood-lightest font-bold py-3 rounded-xl transition-all"
              >
                ← Retour
              </button>
            </div>
          )}

          {/* Rejoindre une partie */}
          {mode === 'join' && (
            <div className="space-y-6">
              <div>
                <label className="block text-gold-light font-bold mb-3">
                  Votre nom:
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Entrez votre nom..."
                  maxLength={20}
                  className="w-full px-5 py-4 rounded-xl bg-wood-dark/50 text-white border-2 border-wood-dark focus:border-gold-light outline-none transition-colors shadow-inner text-lg font-semibold placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-gold-light font-bold mb-3">
                  Code de la partie:
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={6}
                  className="w-full px-4 py-5 rounded-xl bg-wood-dark/50 text-white border-3 border-gold-dark focus:border-gold-light outline-none text-center text-3xl font-black tracking-widest shadow-inner transition-colors"
                />
                <p className="text-wood-light text-sm mt-2 text-center italic">
                  Code à 6 caractères fourni par l'hôte
                </p>
              </div>

              <button
                onClick={handleJoinRoom}
                disabled={loading || !isConnected}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xl py-5 rounded-2xl transition-all transform hover:scale-105 hover:-translate-y-1 shadow-card hover:shadow-card-hover"
              >
                {loading ? '⏳ Connexion...' : '✅ REJOINDRE'}
              </button>

              <button
                onClick={() => setMode('menu')}
                className="w-full bg-wood-dark/50 hover:bg-wood-dark text-wood-lightest font-bold py-3 rounded-xl transition-all"
              >
                ← Retour
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </WoodBackground>
  );
}
