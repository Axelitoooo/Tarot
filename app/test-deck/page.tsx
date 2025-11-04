'use client';

import { useState, useEffect } from 'react';
import { Card, Suit } from '@/types/card';
import { createDeck, validateDeck, countOudlers, calculatePoints } from '@/lib/game/deck';
import { sortCards, getCardName, getSuitSymbol } from '@/lib/game/cardUtils';
import { dealCards, checkPetitSec } from '@/lib/game/shuffle';
import { PlayerCount } from '@/types/game';

export default function TestDeckPage() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [hands, setHands] = useState<Card[][]>([]);
  const [dog, setDog] = useState<Card[]>([]);
  const [playerCount, setPlayerCount] = useState<PlayerCount>(4);
  const [selectedHand, setSelectedHand] = useState(0);

  useEffect(() => {
    // Créer le deck au chargement
    const newDeck = createDeck();
    setDeck(newDeck);
  }, []);

  const handleDeal = () => {
    const { hands: newHands, dog: newDog } = dealCards(deck, playerCount);

    // Trier les mains
    const sortedHands = newHands.map(hand => sortCards(hand));
    setHands(sortedHands);
    setDog(sortCards(newDog));

    // Vérifier le Petit Sec
    const petitSecIndex = checkPetitSec(sortedHands);
    if (petitSecIndex !== -1) {
      alert(`Joueur ${petitSecIndex + 1} a le Petit Sec ! Redistribution nécessaire.`);
    }
  };

  const getCardColor = (suit: Suit): string => {
    if (suit === Suit.HEART || suit === Suit.DIAMOND) {
      return 'text-red-600';
    }
    return 'text-gray-900';
  };

  const renderCard = (card: Card) => (
    <div
      key={card.id}
      className={`bg-white rounded-lg p-3 shadow-md border-2 ${
        card.isOudler ? 'border-yellow-500 ring-2 ring-yellow-300' : 'border-gray-300'
      } card-shadow hover:scale-105 transition-transform`}
    >
      <div className={`text-center font-bold ${getCardColor(card.suit)}`}>
        <div className="text-2xl">{getSuitSymbol(card.suit)}</div>
        <div className="text-xs mt-1">{getCardName(card)}</div>
        <div className="text-xs text-gray-500 mt-1">{card.points} pts</div>
      </div>
    </div>
  );

  const isValid = validateDeck(deck);
  const oudlersCount = countOudlers(deck);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
          🃏 Test du Deck de Tarot
        </h1>

        {/* Statistiques du deck */}
        <div className="bg-white/90 rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Statistiques du Deck</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-felt p-4 rounded-lg text-white text-center">
              <div className="text-3xl font-bold">{deck.length}</div>
              <div className="text-sm">Cartes totales</div>
            </div>
            <div className="bg-wood-dark p-4 rounded-lg text-white text-center">
              <div className="text-3xl font-bold">{oudlersCount}</div>
              <div className="text-sm">Oudlers (Bouts)</div>
            </div>
            <div className="bg-blue-600 p-4 rounded-lg text-white text-center">
              <div className="text-3xl font-bold">{calculatePoints(deck)}</div>
              <div className="text-sm">Points totaux</div>
            </div>
            <div className={`${isValid ? 'bg-green-600' : 'bg-red-600'} p-4 rounded-lg text-white text-center`}>
              <div className="text-3xl font-bold">{isValid ? '✓' : '✗'}</div>
              <div className="text-sm">Deck valide</div>
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="bg-white/90 rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Distribution des cartes</h2>

          <div className="flex items-center gap-4 mb-4">
            <label className="font-semibold">Nombre de joueurs:</label>
            <select
              value={playerCount}
              onChange={(e) => setPlayerCount(Number(e.target.value) as PlayerCount)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value={3}>3 joueurs (24 cartes chacun)</option>
              <option value={4}>4 joueurs (18 cartes chacun)</option>
              <option value={5}>5 joueurs (15 cartes chacun)</option>
            </select>
            <button
              onClick={handleDeal}
              className="bg-green-felt hover:bg-green-felt-dark text-white font-bold py-2 px-6 rounded-lg transition-all"
            >
              Distribuer
            </button>
          </div>

          {hands.length > 0 && (
            <>
              {/* Sélection de la main à afficher */}
              <div className="flex gap-2 mb-4">
                {hands.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedHand(index)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedHand === index
                        ? 'bg-wood-dark text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Joueur {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedHand(-1)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedHand === -1
                      ? 'bg-wood-dark text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Chien
                </button>
              </div>

              {/* Affichage de la main sélectionnée */}
              {selectedHand === -1 ? (
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    Le Chien ({dog.length} cartes) - {calculatePoints(dog)} points
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {dog.map(card => renderCard(card))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    Main du Joueur {selectedHand + 1} ({hands[selectedHand].length} cartes) -
                    {' '}{countOudlers(hands[selectedHand])} Bout(s) -
                    {' '}{calculatePoints(hands[selectedHand])} points
                  </h3>
                  <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2">
                    {hands[selectedHand].map(card => renderCard(card))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Retour à l'accueil */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block bg-wood-dark hover:bg-wood-darker text-white font-bold py-3 px-8 rounded-lg transition-all"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </main>
  );
}
