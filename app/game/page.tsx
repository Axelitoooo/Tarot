'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameState, BidType, GamePhase, PlayerCount, RoundResult, POIGNEE_POINTS } from '@/types/game';
import { Card, Suit } from '@/types/card';
import {
  createGame,
  startNewRound,
  placeBid,
  revealDog,
  takeDog,
  makeDiscard,
  playCard,
  getBidName,
  getBidMultiplier,
  getDiscardableCards,
  countOudlers,
  calculatePoints,
  getPlayableCardsInTrick,
  calculateFullRoundResult,
  formatScore,
  getCardName,
} from '@/lib/game';
import { decideBid, chooseCardToPlay, chooseDiscard } from '@/lib/ai/player';
import GameBoard from '@/components/GameBoard';
import PremiumGameBoard from '@/components/PremiumGameBoard';
import PlayerHand from '@/components/PlayerHand';
import PlayerHandFan from '@/components/PlayerHandFan';
import TarotCard from '@/components/TarotCard';
import GameNotification, { Notification } from '@/components/GameNotification';
import GameHistory, { HistoryEntry } from '@/components/GameHistory';

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerCount, setPlayerCount] = useState<PlayerCount>(4);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>('');
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [showBidPanel, setShowBidPanel] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Helper: Ajouter une notification
  const addNotification = (message: string, type: Notification['type']) => {
    const id = `notif-${Date.now()}-${Math.random()}`;
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  // Helper: Supprimer une notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Helper: Ajouter une entrée d'historique
  const addHistory = (player: string, action: string, details?: string, icon: string = '🎴') => {
    const id = `history-${Date.now()}-${Math.random()}`;
    setHistory(prev => [...prev, { id, timestamp: new Date(), player, action, details, icon }]);
  };

  // IA: Enchères automatiques pour les joueurs non-humains (STRATÉGIE AVANCÉE)
  useEffect(() => {
    if (!gameState || gameState.phase !== GamePhase.BIDDING) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isAI = gameState.currentPlayerIndex !== 0; // Joueur 0 = humain

    if (!isAI) return;

    // Délai pour rendre l'IA plus naturelle
    const timer = setTimeout(() => {
      try {
        // Trouver la plus haute enchère actuelle
        const highestBid = gameState.bids.reduce<BidType | null>((highest, bid) => {
          if (!highest || bid.type > highest) return bid.type;
          return highest;
        }, null);

        // Utiliser l'IA stratégique pour décider
        const bidType = decideBid(currentPlayer.hand, highestBid);

        const newState = placeBid(gameState, currentPlayer.id, bidType);
        setGameState(newState);
        setError('');

        // Notification et historique
        const bidName = getBidName(bidType);
        addNotification(`${currentPlayer.name}: ${bidName}`, 'bid');
        addHistory(currentPlayer.name, `Enchère: ${bidName}`, undefined, '💬');
      } catch (err) {
        setError((err as Error).message);
      }
    }, 1000 + Math.random() * 500); // Délai variable pour naturalité

    return () => clearTimeout(timer);
  }, [gameState]);

  // IA: Jouer automatiquement pour les joueurs non-humains (STRATÉGIE AVANCÉE)
  useEffect(() => {
    if (!gameState || gameState.phase !== GamePhase.PLAYING) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isAI = gameState.currentPlayerIndex !== 0; // Joueur 0 = humain

    if (!isAI) return;

    const isLastTrick = gameState.trickNumber === 18;

    // Délai pour rendre l'IA plus naturelle
    const timer = setTimeout(() => {
      try {
        const playableCards = getPlayableCardsInTrick(
          currentPlayer.hand,
          gameState.currentTrick.map((c, i) => ({
            card: c,
            playerId: gameState.players[i].id,
          })),
          isLastTrick
        );

        if (playableCards.length === 0) return;

        // Utiliser l'IA stratégique pour choisir la meilleure carte
        const cardToPlay = chooseCardToPlay(
          currentPlayer.hand,
          playableCards,
          gameState.currentTrick,
          isLastTrick,
          gameState
        );

        const newState = playCard(gameState, currentPlayer.id, cardToPlay);
        setGameState(newState);
        setError('');

        // Notification et historique
        const cardName = getCardName(cardToPlay);
        addNotification(`${currentPlayer.name} joue ${cardName}`, 'play');
        addHistory(currentPlayer.name, `Joue ${cardName}`, undefined, '🎴');
      } catch (err) {
        setError((err as Error).message);
      }
    }, 1200 + Math.random() * 800); // Délai variable pour naturalité

    return () => clearTimeout(timer);
  }, [gameState]);

  // Calculer automatiquement les scores en phase SCORING
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
        setError((err as Error).message);
      }
    }
  }, [gameState, roundResult]);

  const handleCreateGame = () => {
    const playerNames = Array.from({ length: playerCount }, (_, i) => `Joueur ${i + 1}`);
    const game = createGame('game-' + Date.now(), playerNames, playerCount);
    const gameWithCards = startNewRound(game);
    setGameState(gameWithCards);
    setSelectedCards(new Set());
    setError('');
    setRoundResult(null);
  };

  const handleBid = (bidType: BidType) => {
    if (!gameState) return;

    try {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      const newState = placeBid(gameState, currentPlayer.id, bidType);
      setGameState(newState);
      setError('');
      setShowBidPanel(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleRevealDog = () => {
    if (!gameState) return;

    try {
      let newState = revealDog(gameState);

      if (newState.phase === GamePhase.DISCARDING) {
        newState = takeDog(newState);
      }

      setGameState(newState);
      setError('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

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

  const handleDiscard = () => {
    if (!gameState || gameState.takerIndex === null) return;

    try {
      const taker = gameState.players[gameState.takerIndex];
      const discardCards = taker.hand.filter(card => selectedCards.has(card.id));

      const newState = makeDiscard(gameState, taker.id, discardCards);
      setGameState(newState);
      setSelectedCards(new Set());
      setError('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handlePlayCard = (card: Card) => {
    if (!gameState) return;

    try {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      const newState = playCard(gameState, currentPlayer.id, card);
      setGameState(newState);
      setError('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!gameState) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8"
        style={{
          background: 'linear-gradient(135deg, #5C4A32 0%, #3E2F1F 50%, #2A1F14 100%)',
        }}
      >
        <div
          className="max-w-2xl w-full p-8 rounded-2xl"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(245,245,245,0.95))',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.8)',
          }}
        >
          <h1 className="text-5xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 to-yellow-900">
            🃏 Tarot Français
          </h1>

          <div className="mb-8">
            <label className="block font-bold text-lg mb-3 text-gray-800">
              Nombre de joueurs:
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[3, 4, 5].map((count) => (
                <button
                  key={count}
                  onClick={() => setPlayerCount(count as PlayerCount)}
                  className={`
                    py-4 px-6 rounded-xl font-bold text-lg transition-all transform
                    ${playerCount === count
                      ? 'bg-gradient-to-br from-yellow-600 to-yellow-800 text-white scale-105 shadow-xl'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
                    }
                  `}
                >
                  {count} joueurs
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreateGame}
            className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-black text-xl py-6 rounded-xl transition-all transform hover:scale-105 shadow-2xl"
          >
            🎮 LANCER LA PARTIE
          </button>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-gray-600 hover:text-gray-800 underline"
            >
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const taker = gameState.takerIndex !== null ? gameState.players[gameState.takerIndex] : null;
  const isLastTrick = gameState.trickNumber === 18;

  // Joueur humain = joueur 0
  const humanPlayer = gameState.players[0];
  const isHumanTurn = gameState.currentPlayerIndex === 0;

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #5C4A32 0%, #3E2F1F 50%, #2A1F14 100%)',
      }}
    >
      {/* Texture bois */}
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

      {/* Header */}
      <div className="relative z-10 bg-black/30 backdrop-blur-sm border-b border-yellow-900/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black text-yellow-400 drop-shadow-lg">
            🃏 Tarot Français
          </h1>

          <div className="flex gap-4 items-center">
            <div className="bg-black/50 px-4 py-2 rounded-lg text-yellow-200 font-bold">
              Phase: <span className="text-yellow-400">{gameState.phase}</span>
            </div>

            <button
              onClick={handleCreateGame}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Nouvelle partie
            </button>

            <a
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Quitter
            </a>
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="relative z-20 mx-6 mt-4">
          <div className="max-w-7xl mx-auto bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 relative z-10 flex flex-col">
        {/* Zone de jeu centrale */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-6xl aspect-[4/3]">
            <PremiumGameBoard
              players={gameState.players}
              currentPlayerIndex={gameState.currentPlayerIndex}
              currentTrick={gameState.currentTrick}
              trickNumber={gameState.trickNumber}
              dealerIndex={gameState.dealerIndex}
              takerIndex={gameState.takerIndex}
            />
          </div>
        </div>

        {/* Notifications */}
        <GameNotification notifications={notifications} onRemove={removeNotification} />

        {/* Historique */}
        <GameHistory entries={history} />

        {/* Panel d'enchères */}
        {gameState.phase === GamePhase.BIDDING && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
            <div
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border-4 border-yellow-600"
              style={{ minWidth: '500px' }}
            >
              <h2 className="text-3xl font-black text-yellow-400 mb-6 text-center">
                {isHumanTurn ? 'Votre enchère' : `Tour de ${currentPlayer.name}`}
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => handleBid(BidType.PASS)}
                  disabled={!isHumanTurn}
                  className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  Passe
                </button>
                <button
                  onClick={() => handleBid(BidType.PETITE)}
                  disabled={!isHumanTurn}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  Petite
                </button>
                <button
                  onClick={() => handleBid(BidType.GARDE)}
                  disabled={!isHumanTurn}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  Garde
                </button>
                <button
                  onClick={() => handleBid(BidType.GARDE_SANS)}
                  disabled={!isHumanTurn}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  Garde Sans
                </button>
                <button
                  onClick={() => handleBid(BidType.GARDE_CONTRE)}
                  disabled={!isHumanTurn}
                  className="col-span-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  Garde Contre
                </button>
              </div>

              {/* Historique des enchères */}
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
            <div
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border-4 border-yellow-600"
            >
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

              <button
                onClick={handleRevealDog}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Phase d'écart - ÉVENTAIL RÉALISTE */}
        {gameState.phase === GamePhase.DISCARDING && taker && (
          <>
            {/* Overlay avec bouton valider */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
              <motion.div
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border-4 border-yellow-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h2 className="text-3xl font-black text-yellow-400 mb-4 text-center">
                  Écart du Preneur
                </h2>
                <p className="text-gray-300 text-center mb-6">
                  Sélectionnez {6 - selectedCards.size} carte{6 - selectedCards.size > 1 ? 's' : ''} à écarter
                </p>
                <button
                  onClick={handleDiscard}
                  disabled={selectedCards.size !== 6}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-xl"
                >
                  {selectedCards.size === 6 ? '✅ Valider l\'écart' : `📋 ${selectedCards.size}/6 sélectionnées`}
                </button>
              </motion.div>
            </div>

            {/* Main en éventail pour sélection */}
            <PlayerHandFan
              cards={taker.hand}
              playableCards={getDiscardableCards(taker.hand)}
              selectedCards={selectedCards}
              onCardSelect={handleCardSelection}
              maxCards={6}
            />
          </>
        )}

        {/* Panel de scoring */}
        {gameState.phase === GamePhase.SCORING && roundResult && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30 p-8 overflow-auto">
            <div
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border-4 border-yellow-600 max-w-4xl w-full"
            >
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

              <button
                onClick={handleCreateGame}
                className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-black text-xl py-4 rounded-xl transition-all transform hover:scale-105"
              >
                Nouvelle manche
              </button>
            </div>
          </div>
        )}

        {/* Main du joueur (en bas) - ÉVENTAIL RÉALISTE */}
        {gameState.phase === GamePhase.PLAYING && (
          <PlayerHandFan
            cards={humanPlayer.hand}
            playableCards={
              isHumanTurn
                ? getPlayableCardsInTrick(
                    humanPlayer.hand,
                    gameState.currentTrick.map((c, i) => ({
                      card: c,
                      playerId: gameState.players[i].id,
                    })),
                    isLastTrick
                  )
                : []
            }
            onCardClick={isHumanTurn ? handlePlayCard : undefined}
          />
        )}
      </div>
    </div>
  );
}
