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
            <button className="bg-wood-dark hover:bg-wood-darker text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg">
              Créer une partie
            </button>
            <button className="bg-green-felt hover:bg-green-felt-dark text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg">
              Rejoindre une partie
            </button>
            <div className="border-t border-gray-300 my-2"></div>
            <p className="text-sm text-gray-600 text-center">Pages de test</p>
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
