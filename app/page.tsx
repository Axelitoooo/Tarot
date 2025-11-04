import WoodBackground from '@/components/WoodBackground';
import Link from 'next/link';

export default function Home() {
  return (
    <WoodBackground className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Lumière d'ambiance */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/20 via-transparent to-black/40 pointer-events-none" />

      <div className="relative z-10 max-w-5xl w-full">
        {/* Titre principal avec animation */}
        <div className="text-center mb-12">
          <h1 className="text-7xl font-black text-gold-light drop-shadow-2xl mb-4 animate-float">
            🃏 TAROT FRANÇAIS
          </h1>
          <div className="w-48 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
          <p className="text-2xl text-wood-lightest font-light tracking-wide">
            L'art du jeu authentique
          </p>
        </div>

        {/* Carte principale avec effet bois */}
        <div
          className="bg-gradient-to-br from-wood-darker/95 to-wood-darkest/95 backdrop-blur-sm rounded-3xl shadow-wood p-10 border-4 border-wood-dark relative overflow-hidden"
        >
          {/* Décoration interne - Grain de bois */}
          <div className="absolute inset-0 bg-wood-grain opacity-20 pointer-events-none" />

          <div className="relative z-10">
            <p className="text-xl text-center text-wood-lightest mb-8 font-light">
              Jouez au Tarot Français dans les règles de l'art
            </p>

            <div className="flex flex-col gap-5">
              {/* Bouton Multijoueur - Primaire */}
              <Link
                href="/multiplayer"
                className="group relative bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white font-black text-3xl py-8 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-card hover:shadow-card-hover text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="relative">
                  🌐 MULTIJOUEUR EN LIGNE
                </div>
              </Link>
              <p className="text-center text-sm text-wood-light -mt-3 italic">
                ⚡ Créez une partie et invitez vos amis en temps réel !
              </p>

              {/* Bouton Mode Solo */}
              <Link
                href="/game"
                className="group relative bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold hover:via-gold-light hover:to-yellow-300 text-wood-darkest font-black text-2xl py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-card hover:shadow-card-hover text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="relative">
                  🎮 MODE SOLO
                </div>
              </Link>

              {/* Séparateur décoratif */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-wood-dark" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-wood-darkest text-wood-light text-sm font-semibold">
                    PAGES DE DÉVELOPPEMENT
                  </span>
                </div>
              </div>

              {/* Boutons de test - Design sobre */}
              <div className="grid grid-cols-3 gap-3">
                <Link
                  href="/test-deck"
                  className="bg-wood-dark/50 hover:bg-wood-dark text-wood-lightest font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg text-center text-sm"
                >
                  🧪 Deck
                </Link>
                <Link
                  href="/test-game"
                  className="bg-wood-dark/50 hover:bg-wood-dark text-wood-lightest font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg text-center text-sm"
                >
                  🎮 Enchères
                </Link>
                <Link
                  href="/test-play"
                  className="bg-wood-dark/50 hover:bg-wood-dark text-wood-lightest font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg text-center text-sm"
                >
                  🎴 Jouer
                </Link>
              </div>
            </div>
          </div>

          {/* Coins décoratifs dorés */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-gold opacity-50" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-gold opacity-50" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-gold opacity-50" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-gold opacity-50" />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-wood-light text-sm">
            Fait avec passion • Tarot Français traditionnel
          </p>
        </div>
      </div>
    </WoodBackground>
  );
}
