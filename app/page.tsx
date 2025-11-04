export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-6xl font-bold text-center mb-8 text-white drop-shadow-lg">
          🃏 Tarot Français
        </h1>
        <div className="bg-white/90 rounded-lg shadow-2xl p-8 backdrop-blur-sm">
          <p className="text-xl text-center text-gray-800 mb-6">
            Bienvenue sur l'application de Tarot Français en ligne
          </p>
          <div className="flex flex-col gap-4">
            <a
              href="/multiplayer"
              className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-black text-2xl py-6 px-8 rounded-lg transition-all transform hover:scale-105 shadow-2xl text-center"
            >
              🌐 MULTIJOUEUR EN LIGNE
            </a>
            <p className="text-center text-sm text-gray-500 -mt-2">Jouez avec vos amis en temps réel !</p>

            <a
              href="/game"
              className="bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-white font-black text-xl py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-xl text-center"
            >
              🎮 Mode Solo
            </a>

            <div className="border-t border-gray-300 my-2"></div>
            <p className="text-sm text-gray-600 text-center">Pages de développement</p>
            <a
              href="/test-deck"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg text-center"
            >
              🧪 Test du Deck
            </a>
            <a
              href="/test-game"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg text-center"
            >
              🎮 Test Enchères & Écart
            </a>
            <a
              href="/test-play"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg text-center"
            >
              🎴 Test Complet - Jouer
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
