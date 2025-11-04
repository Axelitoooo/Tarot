# Tarot Français - Application en ligne

Application web pour jouer au tarot français en ligne avec vos amis.

## Fonctionnalités

- 🎴 Jeu de tarot français complet (règles officielles)
- 👥 Parties à 3, 4 ou 5 joueurs
- 🔒 Salles privées avec code d'accès
- 🎯 Système de score automatique
- 🎨 Interface sobre avec effet bois
- ⚡ Temps réel avec Socket.io

## Technologies

- **Next.js 16** avec App Router
- **TypeScript** pour la sécurité du typage
- **Tailwind CSS** pour le style
- **Socket.io** pour le multijoueur en temps réel

## Démarrage

```bash
# Installation des dépendances
npm install

# Lancement en développement
npm run dev

# Build de production
npm run build

# Démarrage en production
npm start
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du projet

```
.
├── app/              # Pages Next.js (App Router)
├── components/       # Composants React réutilisables
├── lib/             # Logique métier du jeu
│   ├── game/        # Logique du tarot
│   └── utils/       # Fonctions utilitaires
├── types/           # Types TypeScript
└── public/          # Assets statiques
```

## Règles du Tarot

L'application implémente les règles officielles du tarot français à 3, 4 ou 5 joueurs.

## Développement

Ce projet est en cours de développement par phases :

- ✅ Phase 1 : Setup initial du projet
- 🔄 Phase 2 : Modélisation des cartes et logique de base
- ⏳ Phase 3 : Logique du jeu (distribution, enchères, écart)
- ⏳ Phase 4 : Logique des plis et règles de jeu
- ⏳ Phase 5 : Calcul des scores et primes
- ⏳ Phase 6 : Interface utilisateur
- ⏳ Phase 7 : Backend multijoueur
- ⏳ Phase 8 : Système de lobbies/salles privées
- ⏳ Phase 9 : Design et polish UI
- ⏳ Phase 10 : Tests et déploiement

## Licence

ISC
