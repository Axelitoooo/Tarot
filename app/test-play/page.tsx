'use client';

import { useState, useEffect } from 'react';
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
  calculateFinalScores,
  getBidName,
  getBidMultiplier,
  getCardName,
  getSuitSymbol,
  getDiscardableCards,
  countOudlers,
  calculatePoints,
  getPlayableCardsInTrick,
  calculateFullRoundResult,
  formatScore,
} from '@/lib/game';

export default function TestPlayPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerCount, setPlayerCount] = useState<PlayerCount>(4);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>('');
  const [autoPlay, setAutoPlay] = useState(false);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);

  // Calculer automatiquement les scores quand on arrive en phase SCORING
  useEffect(() => {
    if (gameState && gameState.phase === GamePhase.SCORING && !roundResult) {
      try {
        if (gameState.takerIndex === null || !gameState.currentBid) return;

        const taker = gameState.players[gameState.takerIndex];
        const takerCards = taker.tricksWon.flat();

        // Ajouter le chien si nécessaire
        const { getDogOwner } = require('@/lib/game/bidding');
        const dogOwner = getDogOwner(gameState.currentBid);
        const finalTakerCards = dogOwner === 'taker' ? [...takerCards, ...gameState.dog] : takerCards;

        // Déterminer qui a gagné le Petit au bout
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
    const game = createGame('test-game', playerNames, playerCount);
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

  const handleAutoBid = () => {
    if (!gameState || gameState.phase !== GamePhase.BIDDING) return;

    // Auto-bid: premier joueur prend une Petite, autres passent
    let state = gameState;

    for (let i = 0; i < gameState.playerCount; i++) {
      const currentPlayer = state.players[state.currentPlayerIndex];
      const bidType = i === 0 ? BidType.PETITE : BidType.PASS;

      try {
        state = placeBid(state, currentPlayer.id, bidType);
      } catch (err) {
        setError((err as Error).message);
        return;
      }
    }

    setGameState(state);
  };

  const handleAutoDiscard = () => {
    if (!gameState || gameState.phase !== GamePhase.DISCARDING || gameState.takerIndex === null) return;

    try {
      const taker = gameState.players[gameState.takerIndex];
      const discardable = getDiscardableCards(taker.hand);

      // Écarter les 6 premières cartes écartables
      const toDiscard = discardable.slice(0, 6);

      const newState = makeDiscard(gameState, taker.id, toDiscard);
      setGameState(newState);
      setError('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const getCardColor = (suit: Suit): string => {
    if (suit === Suit.HEART || suit === Suit.DIAMOND) return 'text-red-600';
    return 'text-gray-900';
  };

  const renderCard = (
    card: Card,
    selectable: boolean = false,
    selected: boolean = false,
    playable: boolean = true,
    onClick?: () => void
  ) => (
    <div
      key={card.id}
      onClick={onClick}
      className={`bg-white rounded-lg p-2 shadow-md border-2 ${
        card.isOudler
          ? 'border-yellow-500'
          : selected
          ? 'border-blue-500 ring-2 ring-blue-300'
          : playable
          ? 'border-gray-300'
          : 'border-gray-200 opacity-40'
      } ${selectable || (playable && onClick) ? 'cursor-pointer hover:scale-105' : ''} transition-transform`}
    >
      <div className={`text-center font-bold ${getCardColor(card.suit)}`}>
        <div className="text-xl">{getSuitSymbol(card.suit)}</div>
        <div className="text-xs mt-1 truncate">{getCardName(card)}</div>
      </div>
    </div>
  );

  if (!gameState) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
            🎴 Test Complet - Jouer au Tarot
          </h1>

          <div className="bg-white/90 rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Créer une partie</h2>

            <div className="mb-6">
              <label className="block font-semibold mb-2">Nombre de joueurs:</label>
              <select
                value={playerCount}
                onChange={(e) => setPlayerCount(Number(e.target.value) as PlayerCount)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value={3}>3 joueurs</option>
                <option value={4}>4 joueurs</option>
                <option value={5}>5 joueurs</option>
              </select>
            </div>

            <button
              onClick={handleCreateGame}
              className="w-full bg-green-felt hover:bg-green-felt-dark text-white font-bold py-4 px-8 rounded-lg transition-all"
            >
              Commencer la partie
            </button>

            <div className="mt-6 text-center">
              <a href="/" className="text-blue-600 hover:underline">
                ← Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const taker = gameState.takerIndex !== null ? gameState.players[gameState.takerIndex] : null;
  const isLastTrick = gameState.trickNumber === 18;

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-4 drop-shadow-lg">
          🎴 Test Complet - Jouer au Tarot
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* État du jeu */}
        <div className="bg-white/90 rounded-lg shadow-xl p-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            <div className="bg-blue-600 p-3 rounded-lg text-white text-center">
              <div className="font-bold">{gameState.phase}</div>
              <div className="text-xs">Phase</div>
            </div>
            <div className="bg-green-600 p-3 rounded-lg text-white text-center">
              <div className="font-bold">{currentPlayer.name}</div>
              <div className="text-xs">Joueur actuel</div>
            </div>
            <div className="bg-purple-600 p-3 rounded-lg text-white text-center">
              <div className="font-bold">
                {gameState.currentBid ? getBidName(gameState.currentBid) : 'Aucune'}
              </div>
              <div className="text-xs">Enchère</div>
            </div>
            <div className="bg-orange-600 p-3 rounded-lg text-white text-center">
              <div className="font-bold">{taker ? taker.name : 'Aucun'}</div>
              <div className="text-xs">Preneur</div>
            </div>
            <div className="bg-pink-600 p-3 rounded-lg text-white text-center">
              <div className="font-bold">{gameState.trickNumber}/18</div>
              <div className="text-xs">Pli actuel</div>
            </div>
          </div>
        </div>

        {/* Phase d'enchères */}
        {gameState.phase === GamePhase.BIDDING && (
          <div className="bg-white/90 rounded-lg shadow-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Enchères - {currentPlayer.name}</h2>
              <button
                onClick={handleAutoBid}
                className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold py-2 px-4 rounded-lg"
              >
                Auto-enchères
              </button>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
              <button
                onClick={() => handleBid(BidType.PASS)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-lg text-sm"
              >
                Passe
              </button>
              <button
                onClick={() => handleBid(BidType.PETITE)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg text-sm"
              >
                Petite
              </button>
              <button
                onClick={() => handleBid(BidType.GARDE)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg text-sm"
              >
                Garde
              </button>
              <button
                onClick={() => handleBid(BidType.GARDE_SANS)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded-lg text-sm"
              >
                Sans
              </button>
              <button
                onClick={() => handleBid(BidType.GARDE_CONTRE)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg text-sm"
              >
                Contre
              </button>
            </div>
          </div>
        )}

        {/* Phase de révélation du chien */}
        {gameState.phase === GamePhase.DOG_REVEAL && (
          <div className="bg-white/90 rounded-lg shadow-xl p-4 mb-4">
            <h2 className="text-xl font-bold mb-3">Le Chien</h2>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {gameState.dog.map(card => renderCard(card))}
            </div>
            <button
              onClick={handleRevealDog}
              className="w-full bg-green-felt hover:bg-green-felt-dark text-white font-bold py-2 px-6 rounded-lg"
            >
              Continuer
            </button>
          </div>
        )}

        {/* Phase d'écart */}
        {gameState.phase === GamePhase.DISCARDING && taker && (
          <div className="bg-white/90 rounded-lg shadow-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">
                Écart - {taker.name} ({selectedCards.size}/6)
              </h2>
              <button
                onClick={handleAutoDiscard}
                className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold py-2 px-4 rounded-lg"
              >
                Auto-écart
              </button>
            </div>

            <div className="grid grid-cols-8 md:grid-cols-12 gap-1 mb-3">
              {taker.hand.map(card => {
                const discardable = getDiscardableCards(taker.hand);
                const canSelect = discardable.some(c => c.id === card.id);
                return renderCard(
                  card,
                  canSelect,
                  selectedCards.has(card.id),
                  canSelect,
                  canSelect ? () => handleCardSelection(card.id) : undefined
                );
              })}
            </div>

            <button
              onClick={handleDiscard}
              disabled={selectedCards.size !== 6}
              className={`w-full font-bold py-2 px-6 rounded-lg ${
                selectedCards.size === 6
                  ? 'bg-green-felt hover:bg-green-felt-dark text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Valider l'écart
            </button>
          </div>
        )}

        {/* Phase de jeu */}
        {gameState.phase === GamePhase.PLAYING && (
          <>
            {/* Pli en cours */}
            {gameState.currentTrick.length > 0 && (
              <div className="bg-white/90 rounded-lg shadow-xl p-4 mb-4">
                <h2 className="text-xl font-bold mb-3">
                  Pli en cours ({gameState.currentTrick.length}/{gameState.playerCount})
                </h2>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {gameState.currentTrick.map(card => renderCard(card))}
                </div>
              </div>
            )}

            {/* Main du joueur actuel */}
            <div className="bg-white/90 rounded-lg shadow-xl p-4 mb-4">
              <h2 className="text-xl font-bold mb-3">
                Main de {currentPlayer.name} ({currentPlayer.hand.length} cartes)
              </h2>

              <div className="grid grid-cols-6 md:grid-cols-9 gap-2">
                {currentPlayer.hand.map(card => {
                  const playableCards = getPlayableCardsInTrick(
                    currentPlayer.hand,
                    gameState.currentTrick.map((c, i) => ({
                      card: c,
                      playerId: gameState.players[i].id,
                    })),
                    isLastTrick
                  );
                  const isPlayable = playableCards.some(c => c.id === card.id);

                  return renderCard(
                    card,
                    false,
                    false,
                    isPlayable,
                    isPlayable ? () => handlePlayCard(card) : undefined
                  );
                })}
              </div>
            </div>

            {/* Scores intermédiaires */}
            <div className="bg-white/90 rounded-lg shadow-xl p-4 mb-4">
              <h3 className="text-lg font-bold mb-2">Scores intermédiaires</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {gameState.players.map(player => {
                  const tricksPoints = player.tricksWon.reduce((sum, trick) => {
                    return sum + trick.reduce((s, c) => s + c.points, 0) - trick.length * 0.5;
                  }, 0);

                  return (
                    <div key={player.id} className="bg-gray-100 p-3 rounded-lg">
                      <div className="font-bold">{player.name}</div>
                      <div className="text-sm">
                        {player.tricksWon.length} plis - {Math.round(tricksPoints)} pts
                      </div>
                      {player.isTaker && (
                        <div className="text-xs text-orange-600 font-semibold">Preneur</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Phase de scoring */}
        {gameState.phase === GamePhase.SCORING && roundResult && (
          <div className="bg-white/90 rounded-lg shadow-xl p-6 mb-4">
            <h2 className="text-3xl font-bold mb-6 text-center">🏆 Fin de la manche</h2>

            {/* Résultat du contrat */}
            <div className={`p-6 rounded-lg mb-6 text-center ${
              roundResult.contractMade
                ? 'bg-green-100 border-2 border-green-500'
                : 'bg-red-100 border-2 border-red-500'
            }`}>
              <div className="text-3xl font-bold mb-2">
                {roundResult.contractMade ? '✅ CONTRAT RÉUSSI' : '❌ CONTRAT CHUTÉ'}
              </div>
              <div className="text-xl mb-3">
                {getBidName(roundResult.bid)}
              </div>
              <div className="text-lg">
                <span className="font-bold">{roundResult.takerPoints} points</span>
                {' '}(requis: {roundResult.requiredPoints})
                {' '}avec <span className="font-bold">{roundResult.oudlersCount} Bout(s)</span>
              </div>
            </div>

            {/* Détails du calcul */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-3">📊 Détail du calcul</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Score de base (25 + écart):</span>
                  <span className="font-bold">{Math.round((roundResult.totalPoints - roundResult.chelemBonus - (roundResult.poignee !== 'NONE' ? POIGNEE_POINTS[roundResult.poignee] : 0)) / getBidMultiplier(roundResult.bid))} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Multiplicateur ({getBidName(roundResult.bid)}):</span>
                  <span className="font-bold">x{getBidMultiplier(roundResult.bid)}</span>
                </div>
                {roundResult.petitAuBout && (
                  <div className="flex justify-between text-yellow-700">
                    <span>⭐ Petit au Bout:</span>
                    <span className="font-bold">+10 pts (multipliable)</span>
                  </div>
                )}
                {roundResult.poignee !== 'NONE' && (
                  <div className="flex justify-between text-purple-700">
                    <span>🤚 {roundResult.poignee === 'SIMPLE' ? 'Simple' : roundResult.poignee === 'DOUBLE' ? 'Double' : 'Triple'} Poignée:</span>
                    <span className="font-bold">+{POIGNEE_POINTS[roundResult.poignee]} pts (non multipliable)</span>
                  </div>
                )}
                {roundResult.chelemBonus !== 0 && (
                  <div className="flex justify-between text-blue-700">
                    <span>🏆 Chelem:</span>
                    <span className="font-bold">{formatScore(roundResult.chelemBonus)} pts</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2 mt-2"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Score total:</span>
                  <span className={roundResult.totalPoints >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatScore(roundResult.totalPoints)} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Scores des joueurs */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">📈 Scores des joueurs</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {gameState.players.map(player => {
                  const playerScore = roundResult.playerScores[player.id];
                  const isTaker = player.isTaker;

                  return (
                    <div
                      key={player.id}
                      className={`p-4 rounded-lg ${
                        isTaker
                          ? 'bg-orange-100 border-2 border-orange-500'
                          : 'bg-gray-100 border border-gray-300'
                      }`}
                    >
                      <div className="font-bold mb-1">{player.name}</div>
                      {isTaker && (
                        <div className="text-xs text-orange-600 font-semibold mb-2">PRENEUR</div>
                      )}
                      <div className="text-sm mb-2">
                        {player.tricksWon.length} plis
                      </div>
                      <div className={`text-2xl font-bold ${
                        playerScore >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatScore(playerScore)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note explicative */}
            <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded">
              ℹ️ Le Preneur gagne/perd 3× le score total, chaque Défenseur gagne/perd 1× le score total (signe inversé)
            </div>
          </div>
        )}

        {/* Boutons de contrôle */}
        <div className="text-center">
          <button
            onClick={handleCreateGame}
            className="bg-wood-dark hover:bg-wood-darker text-white font-bold py-3 px-8 rounded-lg mr-4"
          >
            Nouvelle partie
          </button>
          <a
            href="/"
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg"
          >
            ← Retour
          </a>
        </div>
      </div>
    </main>
  );
}
