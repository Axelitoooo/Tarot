'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GamePhase, BidType, POIGNEE_POINTS } from '@/types/game';
import { Card } from '@/types/card';
import { useSocket } from '@/lib/hooks/useSocket';
import GameBoard from '@/components/GameBoard';
import PlayerHand from '@/components/PlayerHand';
import TarotCard from '@/components/TarotCard';
import {
  getBidName,
  getBidMultiplier,
  getDiscardableCards,
  countOudlers,
  calculatePoints,
  getPlayableCardsInTrick,
  calculateFullRoundResult,
  formatScore,
} from '@/lib/game';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params?.code as string) || '';

  const {
    isConnected,
    gameState,
    roomId,
    playerId,
    error: socketError,
    startGame,
    placeBid,
    revealDog,
    discard,
    playCard,
    calculateScores,
    newRound,
    leaveRoom,
    clearError,
  } = useSocket();

  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [roundResult, setRoundResult] = useState<any>(null);

  // Calculer les scores automatiquement en phase SCORING
  useEffect(() => {
    if (gameState && gameState.phase === GamePhase.SCORING && !roundResult) {
      try {
        if (gameState.takerIndex === null || !gameState.currentBid) return;

        const taker = gameState.players[gameState.takerIndex];
        const takerCards = taker.tricksWon.flat();

        const { getDogOwner } = require('@/lib/game/bidding');
        const dogOwner = getDogOwner(gameState.currentBid);
        const finalTakerCards = dogOwner === 'taker' ? [...takerCards, ...gameState.dog] : takerCards;

        let petitAuBoutWinner: 'taker' | 'defenders' = 'taker';
        if (gameState.petitAuBout) {
          const petitInTakerCards = finalTakerCards.some(
            c => c.suit === 'TRUMP' && c.trumpNumber === 1
          );
          petitAuBoutWinner = petitInTakerCards ? 'taker' : 'defenders';
        }

        const result = calculateFullRoundResult(
          finalTakerCards,
          gameState.discard,
          taker.id,
          gameState.players.map(p => p.id),
          gameState.currentBid,
          gameState.petitAuBout,
          petitAuBoutWinner,
          gameState.poignee || 'NONE',
          'taker',
          gameState.chelemAnnounced,
          gameState.chelemRealized
        );

        setRoundResult(result);
      } catch (err) {
        console.error('Erreur calcul scores:', err);
      }
    }
  }, [gameState, roundResult]);

  // Copier le code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quitter la room
  const handleLeaveRoom = () => {
    leaveRoom();
    router.push('/');
  };

  // Gérer la sélection de cartes pour l'écart
  const handleCardSelection = (cardId: string) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      if (newSelected.size < 6) {
        newSelected.add(cardId);
      }
    }
    setSelectedCards(newSelected);
  };

  // Faire l'écart
  const handleDiscard = () => {
    if (!gameState || gameState.takerIndex === null || !playerId) return;

    const taker = gameState.players[gameState.takerIndex];
    if (taker.id !== playerId) return;

    const discardCards = taker.hand.filter(card => selectedCards.has(card.id));
    discard(discardCards);
    setSelectedCards(new Set());
  };

  // Trouver le joueur local
  const localPlayer = gameState?.players.find(p => p.id === playerId);
  const isLocalPlayerTurn = gameState && localPlayer && gameState.currentPlayerIndex === gameState.players.findIndex(p => p.id === playerId);
  const isHost = gameState?.players[0]?.id === playerId;
  const isTaker = gameState?.takerIndex !== null && gameState?.takerIndex !== undefined && gameState?.players[gameState.takerIndex]?.id === playerId;

  // Lobby - En attente de joueurs
  if (!gameState || gameState.phase === GamePhase.WAITING) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8"
        style={{
          background: 'linear-gradient(135deg, #5C4A32 0%, #3E2F1F 50%, #2A1F14 100%)',
        }}
      >
        <div className="relative z-10 max-w-4xl w-full">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border-4 border-yellow-600">
            <h1 className="text-5xl font-black text-yellow-400 mb-4 text-center">
              🎴 Salon d'attente
            </h1>

            {/* Code de la room */}
            <div className="bg-black/50 p-6 rounded-xl mb-6 text-center">
              <p className="text-gray-400 mb-2">Code de la partie :</p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-6xl font-black text-yellow-400 tracking-widest">
                  {code.toUpperCase()}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  {copied ? '✅ Copié !' : '📋 Copier'}
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Partagez ce code à vos amis !
              </p>
            </div>

            {/* Statut de connexion */}
            <div className="text-center mb-6">
              {isConnected ? (
                <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Connecté
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Déconnecté
                </div>
              )}
            </div>

            {/* Liste des joueurs */}
            {gameState && (
              <div className="bg-black/30 p-6 rounded-xl mb-6">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                  Joueurs ({gameState.players.length}/{gameState.playerCount})
                </h2>
                <div className="space-y-3">
                  {gameState.players.map((player, index) => (
                    <div
                      key={player.id}
                      className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {index === 0 ? '👑' : '👤'}
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            {player.name}
                            {player.id === playerId && ' (Vous)'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {index === 0 && 'Hôte'}
                          </div>
                        </div>
                      </div>
                      <div className="text-green-400 font-bold">
                        ● En ligne
                      </div>
                    </div>
                  ))}

                  {/* Slots vides */}
                  {Array.from({ length: gameState.playerCount - gameState.players.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 opacity-50"
                    >
                      <div className="text-2xl">⏳</div>
                      <div className="text-gray-500">
                        En attente d'un joueur...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Erreurs */}
            {socketError && (
              <div className="bg-red-500 text-white px-4 py-3 rounded-lg mb-4">
                ⚠️ {socketError}
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-4">
              {isHost && gameState && gameState.players.length === gameState.playerCount && (
                <button
                  onClick={startGame}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-black text-xl py-4 rounded-xl transition-all transform hover:scale-105"
                >
                  🎮 LANCER LA PARTIE
                </button>
              )}

              <button
                onClick={handleLeaveRoom}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all"
              >
                👋 Quitter
              </button>
            </div>

            {isHost && gameState && gameState.players.length < gameState.playerCount && (
              <p className="text-center text-gray-400 mt-4">
                En attente de {gameState.playerCount - gameState.players.length} joueur(s)...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Jeu en cours
  if (!localPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">⏳ Connexion...</div>
      </div>
    );
  }

  const isLastTrick = gameState.trickNumber === 18;

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #5C4A32 0%, #3E2F1F 50%, #2A1F14 100%)',
      }}
    >
      {/* Header */}
      <div className="relative z-10 bg-black/30 backdrop-blur-sm border-b border-yellow-900/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-yellow-400 drop-shadow-lg">
              🃏 Room {code.toUpperCase()}
            </h1>
            {isConnected ? (
              <span className="text-green-400 text-sm">● En ligne</span>
            ) : (
              <span className="text-red-400 text-sm">● Déconnecté</span>
            )}
          </div>

          <div className="flex gap-4 items-center">
            <div className="bg-black/50 px-4 py-2 rounded-lg text-yellow-200 font-bold">
              Phase: <span className="text-yellow-400">{gameState.phase}</span>
            </div>

            <button
              onClick={handleLeaveRoom}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Quitter
            </button>
          </div>
        </div>
      </div>

      {/* Erreurs */}
      {socketError && (
        <div className="relative z-20 mx-6 mt-4">
          <div className="max-w-7xl mx-auto bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            ⚠️ {socketError}
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 relative z-10 flex flex-col">
        {/* Zone de jeu centrale */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-6xl aspect-[4/3]">
            <GameBoard
              players={gameState.players}
              currentPlayerIndex={gameState.currentPlayerIndex}
              currentTrick={gameState.currentTrick}
              trickNumber={gameState.trickNumber}
              dealerIndex={gameState.dealerIndex}
              takerIndex={gameState.takerIndex}
            />
          </div>
        </div>

        {/* Panel d'enchères */}
        {gameState.phase === GamePhase.BIDDING && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
            <div
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border-4 border-yellow-600"
              style={{ minWidth: '500px' }}
            >
              <h2 className="text-3xl font-black text-yellow-400 mb-6 text-center">
                {isLocalPlayerTurn ? 'Votre enchère' : `Tour de ${gameState.players[gameState.currentPlayerIndex].name}`}
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => placeBid(BidType.PASS)}
                  disabled={!isLocalPlayerTurn}
                  className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  Passe
                </button>
                <button
                  onClick={() => placeBid(BidType.PETITE)}
                  disabled={!isLocalPlayerTurn}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  Petite
                </button>
                <button
                  onClick={() => placeBid(BidType.GARDE)}
                  disabled={!isLocalPlayerTurn}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  Garde
                </button>
                <button
                  onClick={() => placeBid(BidType.GARDE_SANS)}
                  disabled={!isLocalPlayerTurn}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  Garde Sans
                </button>
                <button
                  onClick={() => placeBid(BidType.GARDE_CONTRE)}
                  disabled={!isLocalPlayerTurn}
                  className="col-span-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  Garde Contre
                </button>
              </div>

              {/* Historique */}
              {gameState.bids.length > 0 && (
                <div className="bg-black/50 p-4 rounded-lg">
                  <h3 className="text-yellow-400 font-bold mb-2">Historique:</h3>
                  <div className="space-y-1 text-sm text-gray-300">
                    {gameState.bids.map((bid, i) => {
                      const player = gameState.players.find(p => p.id === bid.playerId);
                      return (
                        <div key={i}>
                          <span className="font-bold">{player?.name}:</span> {getBidName(bid.type)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Panel du chien */}
        {gameState.phase === GamePhase.DOG_REVEAL && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border-4 border-yellow-600">
              <h2 className="text-3xl font-black text-yellow-400 mb-6 text-center">
                🎴 Le Chien
              </h2>

              <div className="flex gap-4 justify-center mb-6">
                {gameState.dog.map(card => (
                  <TarotCard key={card.id} card={card} size="large" isPlayable={false} />
                ))}
              </div>

              <div className="text-center mb-6 text-gray-300">
                <div className="text-lg">
                  {calculatePoints(gameState.dog)} points - {countOudlers(gameState.dog)} Bout(s)
                </div>
              </div>

              {isTaker && (
                <button
                  onClick={() => revealDog()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
                >
                  Continuer
                </button>
              )}

              {!isTaker && (
                <p className="text-center text-gray-400">
                  En attente du preneur...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Panel d'écart */}
        {gameState.phase === GamePhase.DISCARDING && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border-4 border-yellow-600 max-w-6xl w-full mx-8">
              <h2 className="text-3xl font-black text-yellow-400 mb-6 text-center">
                {isTaker ? `Écart du Preneur (${selectedCards.size}/6)` : 'En attente de l\'écart...'}
              </h2>

              {isTaker && (
                <>
                  <div className="grid grid-cols-12 gap-2 mb-6">
                    {localPlayer.hand.map(card => {
                      const discardable = getDiscardableCards(localPlayer.hand);
                      const canSelect = discardable.some(c => c.id === card.id);
                      return (
                        <TarotCard
                          key={card.id}
                          card={card}
                          onClick={() => canSelect && handleCardSelection(card.id)}
                          isPlayable={canSelect}
                          isSelected={selectedCards.has(card.id)}
                          size="small"
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={handleDiscard}
                    disabled={selectedCards.size !== 6}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
                  >
                    Valider l'écart
                  </button>
                </>
              )}

              {!isTaker && (
                <p className="text-center text-gray-300 text-xl">
                  Le preneur est en train d'écarter...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Panel de scoring */}
        {gameState.phase === GamePhase.SCORING && roundResult && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30 p-8 overflow-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border-4 border-yellow-600 max-w-4xl w-full">
              <h2 className="text-4xl font-black text-yellow-400 mb-8 text-center">
                🏆 Fin de la manche
              </h2>

              {/* Résultat */}
              <div className={`p-6 rounded-xl mb-6 text-center text-2xl font-black ${
                roundResult.contractMade
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}>
                {roundResult.contractMade ? '✅ CONTRAT RÉUSSI' : '❌ CONTRAT CHUTÉ'}
              </div>

              <div className="text-white text-center mb-6 space-y-2">
                <div className="text-xl">
                  <span className="font-bold">{roundResult.takerPoints} points</span>
                  {' '}(requis: {roundResult.requiredPoints})
                  {' '}avec <span className="font-bold">{roundResult.oudlersCount} Bout(s)</span>
                </div>
                <div className="text-lg text-yellow-400">
                  {getBidName(roundResult.bid)} (×{getBidMultiplier(roundResult.bid)})
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {gameState.players.map(player => {
                  const playerScore = roundResult.playerScores[player.id];
                  return (
                    <div
                      key={player.id}
                      className={`p-4 rounded-xl ${
                        player.isTaker
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      <div className="font-bold mb-2">{player.name}</div>
                      <div className="text-3xl font-black">
                        {formatScore(playerScore)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {isHost && (
                <button
                  onClick={() => newRound()}
                  className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-black text-xl py-4 rounded-xl transition-all transform hover:scale-105"
                >
                  Nouvelle manche
                </button>
              )}

              {!isHost && (
                <p className="text-center text-gray-400">
                  En attente que l'hôte lance une nouvelle manche...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main du joueur (en bas) */}
        {gameState.phase === GamePhase.PLAYING && (
          <div className="relative z-20">
            <PlayerHand
              cards={localPlayer.hand}
              playableCards={
                isLocalPlayerTurn
                  ? getPlayableCardsInTrick(
                      localPlayer.hand,
                      gameState.currentTrick.map((c, i) => ({
                        card: c,
                        playerId: gameState.players[i].id,
                      })),
                      isLastTrick
                    )
                  : []
              }
              onCardClick={isLocalPlayerTurn ? (card) => playCard(card) : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}
