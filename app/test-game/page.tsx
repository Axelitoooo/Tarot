'use client';

import { useState } from 'react';
import { GameState, BidType, GamePhase, PlayerCount } from '@/types/game';
import { Card } from '@/types/card';
import {
  createGame,
  startNewRound,
  placeBid,
  revealDog,
  takeDog,
  makeDiscard,
  getBidName,
  getCardName,
  getSuitSymbol,
  getDiscardableCards,
  validateDiscard,
  countOudlers,
  calculatePoints,
} from '@/lib/game';

export default function TestGamePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerCount, setPlayerCount] = useState<PlayerCount>(4);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>('');

  const handleCreateGame = () => {
    const playerNames = Array.from({ length: playerCount }, (_, i) => `Joueur ${i + 1}`);
    const game = createGame('test-game', playerNames, playerCount);
    const gameWithCards = startNewRound(game);
    setGameState(gameWithCards);
    setSelectedCards(new Set());
    setError('');
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

      // Si on passe à la phase DISCARDING, intégrer le chien
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

  const getCardColor = (suit: string): string => {
    if (suit === 'HEART' || suit === 'DIAMOND') return 'text-red-600';
    return 'text-gray-900';
  };

  const renderCard = (card: Card, selectable: boolean = false, selected: boolean = false) => (
    <div
      key={card.id}
      onClick={() => selectable && handleCardSelection(card.id)}
      className={`bg-white rounded-lg p-2 shadow-md border-2 ${
        card.isOudler ? 'border-yellow-500' : selected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'
      } ${selectable ? 'cursor-pointer hover:scale-105' : ''} transition-transform`}
    >
      <div className={`text-center font-bold ${getCardColor(card.suit)}`}>
        <div className="text-xl">{getSuitSymbol(card.suit)}</div>
        <div className="text-xs mt-1">{getCardName(card)}</div>
      </div>
    </div>
  );

  if (!gameState) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
            🎮 Test du Jeu - Enchères et Écart
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
              <a
                href="/"
                className="text-blue-600 hover:underline"
              >
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

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
          🎮 Test du Jeu - Enchères et Écart
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* État du jeu */}
        <div className="bg-white/90 rounded-lg shadow-xl p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-600 p-4 rounded-lg text-white text-center">
              <div className="text-2xl font-bold">{gameState.phase}</div>
              <div className="text-sm">Phase</div>
            </div>
            <div className="bg-green-600 p-4 rounded-lg text-white text-center">
              <div className="text-2xl font-bold">{currentPlayer.name}</div>
              <div className="text-sm">Joueur actuel</div>
            </div>
            <div className="bg-purple-600 p-4 rounded-lg text-white text-center">
              <div className="text-2xl font-bold">
                {gameState.currentBid ? getBidName(gameState.currentBid) : 'Aucune'}
              </div>
              <div className="text-sm">Meilleure enchère</div>
            </div>
            <div className="bg-orange-600 p-4 rounded-lg text-white text-center">
              <div className="text-2xl font-bold">
                {taker ? taker.name : 'Aucun'}
              </div>
              <div className="text-sm">Preneur</div>
            </div>
          </div>
        </div>

        {/* Phase d'enchères */}
        {gameState.phase === GamePhase.BIDDING && (
          <div className="bg-white/90 rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              Enchères - Tour de {currentPlayer.name}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <button
                onClick={() => handleBid(BidType.PASS)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                Passe
              </button>
              <button
                onClick={() => handleBid(BidType.PETITE)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                Petite
              </button>
              <button
                onClick={() => handleBid(BidType.GARDE)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                Garde
              </button>
              <button
                onClick={() => handleBid(BidType.GARDE_SANS)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                Garde Sans
              </button>
              <button
                onClick={() => handleBid(BidType.GARDE_CONTRE)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                Garde Contre
              </button>
            </div>

            {/* Historique des enchères */}
            <div className="mt-4">
              <h3 className="font-bold mb-2">Historique des enchères:</h3>
              <div className="space-y-1">
                {gameState.bids.map((bid, index) => {
                  const player = gameState.players.find(p => p.id === bid.playerId);
                  return (
                    <div key={index} className="text-sm">
                      <span className="font-semibold">{player?.name}</span>: {getBidName(bid.type)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Phase de révélation du chien */}
        {gameState.phase === GamePhase.DOG_REVEAL && (
          <div className="bg-white/90 rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Le Chien</h2>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              {gameState.dog.map(card => renderCard(card))}
            </div>

            <div className="text-center">
              <p className="mb-4">
                Points dans le chien: {calculatePoints(gameState.dog)} |
                Bouts: {countOudlers(gameState.dog)}
              </p>

              <button
                onClick={handleRevealDog}
                className="bg-green-felt hover:bg-green-felt-dark text-white font-bold py-3 px-8 rounded-lg transition-all"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Phase d'écart */}
        {gameState.phase === GamePhase.DISCARDING && taker && (
          <div className="bg-white/90 rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              Écart - {taker.name} doit écarter 6 cartes
            </h2>

            <p className="mb-4 text-sm text-gray-600">
              Sélectionnez 6 cartes à écarter ({selectedCards.size}/6 sélectionnées)
              <br />
              ⚠️ Vous ne pouvez pas écarter de Bouts (21, Petit, Excuse) ni de Rois
            </p>

            <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-4">
              {taker.hand.map(card => {
                const discardable = getDiscardableCards(taker.hand);
                const canSelect = discardable.some(c => c.id === card.id);
                return renderCard(card, canSelect, selectedCards.has(card.id));
              })}
            </div>

            <button
              onClick={handleDiscard}
              disabled={selectedCards.size !== 6}
              className={`w-full font-bold py-3 px-8 rounded-lg transition-all ${
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
          <div className="bg-white/90 rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Phase de jeu</h2>
            <p className="text-center text-lg">
              ✅ La distribution, les enchères et l'écart sont terminés !
              <br />
              La Phase 4 implémentera la logique des plis.
            </p>

            {gameState.discard.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">Écart du preneur:</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {gameState.discard.map(card => renderCard(card))}
                </div>
                <p className="mt-2 text-sm">
                  Points écartés: {calculatePoints(gameState.discard)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bouton pour recommencer */}
        <div className="text-center">
          <button
            onClick={handleCreateGame}
            className="bg-wood-dark hover:bg-wood-darker text-white font-bold py-3 px-8 rounded-lg transition-all mr-4"
          >
            Nouvelle partie
          </button>
          <a
            href="/"
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-all"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </main>
  );
}
