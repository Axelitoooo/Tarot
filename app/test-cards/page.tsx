'use client';

import { useState } from 'react';
import BeautifulTarotCard from '@/components/BeautifulTarotCard';
import { Card, Suit, Rank } from '@/types/card';

export default function TestCardsPage() {
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showBack, setShowBack] = useState(false);

  // Cartes de démonstration
  const sampleCards: Card[] = [
    // Excuse
    {
      id: 'excuse',
      suit: Suit.EXCUSE,
      points: 4.5,
      isOudler: true,
    },
    // Atouts spéciaux
    {
      id: 'trump-1',
      suit: Suit.TRUMP,
      trumpNumber: 1,
      points: 4.5,
      isOudler: true,
    },
    {
      id: 'trump-10',
      suit: Suit.TRUMP,
      trumpNumber: 10,
      points: 0.5,
      isOudler: false,
    },
    {
      id: 'trump-21',
      suit: Suit.TRUMP,
      trumpNumber: 21,
      points: 4.5,
      isOudler: true,
    },
    // Figures Coeur
    {
      id: 'heart-king',
      suit: Suit.HEART,
      rank: Rank.KING,
      points: 4.5,
      isOudler: false,
    },
    {
      id: 'heart-queen',
      suit: Suit.HEART,
      rank: Rank.QUEEN,
      points: 3.5,
      isOudler: false,
    },
    {
      id: 'heart-knight',
      suit: Suit.HEART,
      rank: Rank.KNIGHT,
      points: 2.5,
      isOudler: false,
    },
    {
      id: 'heart-jack',
      suit: Suit.HEART,
      rank: Rank.JACK,
      points: 1.5,
      isOudler: false,
    },
    // Cartes numériques Coeur
    {
      id: 'heart-ace',
      suit: Suit.HEART,
      rank: Rank.ACE,
      points: 0.5,
      isOudler: false,
    },
    {
      id: 'heart-5',
      suit: Suit.HEART,
      rank: Rank.FIVE,
      points: 0.5,
      isOudler: false,
    },
    // Figures Carreau
    {
      id: 'diamond-king',
      suit: Suit.DIAMOND,
      rank: Rank.KING,
      points: 4.5,
      isOudler: false,
    },
    {
      id: 'diamond-queen',
      suit: Suit.DIAMOND,
      rank: Rank.QUEEN,
      points: 3.5,
      isOudler: false,
    },
    // Figures Pique
    {
      id: 'spade-king',
      suit: Suit.SPADE,
      rank: Rank.KING,
      points: 4.5,
      isOudler: false,
    },
    {
      id: 'spade-queen',
      suit: Suit.SPADE,
      rank: Rank.QUEEN,
      points: 3.5,
      isOudler: false,
    },
    // Figures Trèfle
    {
      id: 'club-king',
      suit: Suit.CLUB,
      rank: Rank.KING,
      points: 4.5,
      isOudler: false,
    },
    {
      id: 'club-ace',
      suit: Suit.CLUB,
      rank: Rank.ACE,
      points: 0.5,
      isOudler: false,
    },
  ];

  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  return (
    <main className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #1a4d2e 0%, #2d5f3f 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white text-center mb-4 drop-shadow-lg">
          🎴 Cartes de Tarot Réalistes
        </h1>
        <p className="text-white/80 text-center mb-8 text-lg">
          Testez et visualisez les nouvelles cartes améliorées
        </p>

        {/* Contrôles */}
        <div className="bg-white/95 rounded-xl shadow-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Taille */}
            <div>
              <label className="block text-lg font-bold mb-3 text-gray-800">
                📏 Taille des cartes
              </label>
              <div className="flex gap-3">
                {(['small', 'medium', 'large'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                      selectedSize === size
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {size === 'small' ? 'Petite' : size === 'medium' ? 'Moyenne' : 'Grande'}
                  </button>
                ))}
              </div>
            </div>

            {/* Face/Dos */}
            <div>
              <label className="block text-lg font-bold mb-3 text-gray-800">
                🔄 Face ou dos
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBack(false)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                    !showBack
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Face
                </button>
                <button
                  onClick={() => setShowBack(true)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                    showBack
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Dos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Bouts */}
        <div className="bg-white/95 rounded-xl shadow-2xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            ⭐ Les Bouts (Oudlers)
          </h2>
          <p className="text-gray-600 mb-6">
            Les trois cartes les plus importantes du jeu, valant 4,5 points chacune
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            {sampleCards.filter(c => c.isOudler).map(card => (
              <div key={card.id} className="text-center">
                <BeautifulTarotCard
                  card={card}
                  size={selectedSize}
                  faceDown={showBack}
                  onClick={() => setSelectedCard(card.id)}
                  isSelected={selectedCard === card.id}
                  isPlayable={true}
                />
                <p className="mt-2 text-sm font-semibold text-white">
                  {card.suit === Suit.EXCUSE ? "L'Excuse" :
                   card.trumpNumber === 1 ? 'Le Petit' : 'Le Monde'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section Atouts */}
        <div className="bg-white/95 rounded-xl shadow-2xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            ★ Les Atouts
          </h2>
          <p className="text-gray-600 mb-6">
            Les 21 cartes d'atout qui battent toutes les autres couleurs
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            {sampleCards.filter(c => c.suit === Suit.TRUMP).map(card => (
              <div key={card.id} className="text-center">
                <BeautifulTarotCard
                  card={card}
                  size={selectedSize}
                  faceDown={showBack}
                  onClick={() => setSelectedCard(card.id)}
                  isSelected={selectedCard === card.id}
                  isPlayable={true}
                />
                <p className="mt-2 text-sm font-semibold text-white">
                  Atout {card.trumpNumber}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section Figures Rouges */}
        <div className="bg-white/95 rounded-xl shadow-2xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            ♥️ ♦️ Couleurs Rouges (Cœur & Carreau)
          </h2>
          <p className="text-gray-600 mb-6">
            Les figures et cartes numériques rouges
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            {sampleCards.filter(c => c.suit === Suit.HEART || c.suit === Suit.DIAMOND).map(card => (
              <div key={card.id} className="text-center">
                <BeautifulTarotCard
                  card={card}
                  size={selectedSize}
                  faceDown={showBack}
                  onClick={() => setSelectedCard(card.id)}
                  isSelected={selectedCard === card.id}
                  isPlayable={true}
                />
                <p className="mt-2 text-sm font-semibold text-white">
                  {card.suit === Suit.HEART ? '♥' : '♦'} {card.rank}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section Figures Noires */}
        <div className="bg-white/95 rounded-xl shadow-2xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            ♠️ ♣️ Couleurs Noires (Pique & Trèfle)
          </h2>
          <p className="text-gray-600 mb-6">
            Les figures et cartes numériques noires
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            {sampleCards.filter(c => c.suit === Suit.SPADE || c.suit === Suit.CLUB).map(card => (
              <div key={card.id} className="text-center">
                <BeautifulTarotCard
                  card={card}
                  size={selectedSize}
                  faceDown={showBack}
                  onClick={() => setSelectedCard(card.id)}
                  isSelected={selectedCard === card.id}
                  isPlayable={true}
                />
                <p className="mt-2 text-sm font-semibold text-white">
                  {card.suit === Suit.SPADE ? '♠' : '♣'} {card.rank}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section États des cartes */}
        <div className="bg-white/95 rounded-xl shadow-2xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            🎭 États des cartes
          </h2>
          <p className="text-gray-600 mb-6">
            Différents états visuels selon le contexte de jeu
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-3 text-gray-700">Normale (Jouable)</h3>
              <div className="flex justify-center">
                <BeautifulTarotCard
                  card={sampleCards[4]}
                  size={selectedSize}
                  faceDown={false}
                  isPlayable={true}
                />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-3 text-gray-700">Sélectionnée</h3>
              <div className="flex justify-center">
                <BeautifulTarotCard
                  card={sampleCards[5]}
                  size={selectedSize}
                  faceDown={false}
                  isSelected={true}
                  isPlayable={true}
                />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-3 text-gray-700">Non Jouable</h3>
              <div className="flex justify-center">
                <BeautifulTarotCard
                  card={sampleCards[6]}
                  size={selectedSize}
                  faceDown={false}
                  isPlayable={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Légende des améliorations */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-2xl p-6 mb-8 border-2 border-amber-300">
          <h2 className="text-3xl font-bold mb-4 text-amber-900 flex items-center gap-2">
            ✨ Améliorations Réalistes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-900">
            <div className="bg-white/50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">🎨 Design Authentique</h3>
              <ul className="text-sm space-y-1">
                <li>• Papier vieilli avec texture de grain</li>
                <li>• Couleurs traditionnelles mat</li>
                <li>• Bordures décoratives multiples</li>
                <li>• Police serif classique</li>
              </ul>
            </div>
            <div className="bg-white/50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">🌟 Effets Visuels</h3>
              <ul className="text-sm space-y-1">
                <li>• Ombres portées réalistes</li>
                <li>• Effet de profondeur 3D</li>
                <li>• Gradients subtils</li>
                <li>• Transitions fluides</li>
              </ul>
            </div>
            <div className="bg-white/50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">🎭 Dos de Carte</h3>
              <ul className="text-sm space-y-1">
                <li>• Texture bois authentique</li>
                <li>• Bordure dorée ornée</li>
                <li>• Motifs décoratifs</li>
                <li>• Or ancien mat</li>
              </ul>
            </div>
            <div className="bg-white/50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">⚡ Interactions</h3>
              <ul className="text-sm space-y-1">
                <li>• Hover avec élévation</li>
                <li>• États visuels clairs</li>
                <li>• Badge "BOUT" animé</li>
                <li>• Sélection distinctive</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </main>
  );
}
