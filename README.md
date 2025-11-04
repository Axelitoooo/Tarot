# 🃏 Tarot Français - Application Multijoueur en Ligne

Une application web complète pour jouer au **Tarot Français** en ligne avec vos amis, développée avec Next.js 16 et Socket.io.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Caractéristiques

### 🎮 Fonctionnalités de Jeu
- **Multijoueur en temps réel** avec Socket.io
- Support pour **3, 4 ou 5 joueurs**
- **Toutes les règles officielles** du Tarot Français
- **Système de rooms** avec codes de partage à 6 caractères
- **Reconnexion automatique** en cas de déconnexion
- **Interface magnifique** avec effet bois authentique

### 🎴 Règles Implémentées
- ✅ Jeu de 78 cartes (21 atouts + Excuse + 56 cartes)
- ✅ Système d'enchères complet (Passe, Petite, Garde, Garde Sans, Garde Contre)
- ✅ Écart du Preneur (6 cartes)
- ✅ Règles de jeu de cartes (obligation de suivre, couper, surcouper)
- ✅ Gestion de l'Excuse
- ✅ Petit au Bout
- ✅ Calcul des scores avec tous les bonus
- ✅ Poignées (Simple, Double, Triple)
- ✅ Chelem

### 🎨 Design
- **Effet bois réaliste** avec textures CSS
- **Animations fluides** et transitions
- **Cartes de Tarot professionnelles** avec design personnalisé
- **Responsive design** pour tous les écrans
- **Thème sombre** avec accents dorés

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ et npm

### Installation

```bash
# Cloner le repository
git clone <votre-repo-url>
cd Tarot

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build de Production

```bash
# Créer le build optimisé
npm run build

# Lancer en production
npm start
```

## 📖 Guide d'Utilisation

### Créer une Partie

1. Cliquez sur **"MULTIJOUEUR EN LIGNE"** sur la page d'accueil
2. Cliquez sur **"CRÉER UNE PARTIE"**
3. Entrez votre nom
4. Choisissez le nombre de joueurs (3, 4 ou 5)
5. Cliquez sur **"CRÉER LA PARTIE"**
6. **Partagez le code** à 6 caractères avec vos amis

### Rejoindre une Partie

1. Cliquez sur **"MULTIJOUEUR EN LIGNE"**
2. Cliquez sur **"REJOINDRE UNE PARTIE"**
3. Entrez votre nom
4. Entrez le **code de la partie** (6 caractères)
5. Cliquez sur **"REJOINDRE"**

### Déroulement d'une Partie

1. **Lobby** : Attendez que tous les joueurs rejoignent
2. **Lancement** : L'hôte démarre la partie quand tout le monde est là
3. **Enchères** : Chaque joueur fait son enchère à tour de rôle
4. **Le Chien** : Le Preneur voit les 6 cartes du chien
5. **Écart** : Le Preneur écarte 6 cartes (selon les règles)
6. **Jeu** : 18 plis, suivez les règles du Tarot
7. **Scores** : Calcul automatique avec tous les bonus
8. **Nouvelle Manche** : L'hôte peut lancer une nouvelle manche

## 🏗️ Architecture Technique

### Stack Technique
- **Frontend** : Next.js 16 (App Router), React, TypeScript
- **Styling** : Tailwind CSS avec configuration personnalisée
- **Temps réel** : Socket.io (client + serveur)
- **État du jeu** : React hooks avec gestion d'état locale

### Structure du Projet

```
Tarot/
├── app/                      # Pages Next.js (App Router)
│   ├── page.tsx             # Page d'accueil
│   ├── multiplayer/         # Lobby multijoueur
│   ├── room/[code]/         # Room de jeu
│   └── game/                # Mode solo
├── components/              # Composants React
│   ├── TarotCard.tsx        # Carte de Tarot
│   ├── GameBoard.tsx        # Plateau de jeu
│   ├── PlayerHand.tsx       # Main du joueur
│   ├── WoodBackground.tsx   # Fond bois
│   └── FeltTable.tsx        # Table feutre
├── lib/                     # Logique métier
│   ├── game/                # Logique de jeu
│   │   ├── deck.ts          # Création du deck
│   │   ├── cardUtils.ts     # Utilitaires cartes
│   │   ├── shuffle.ts       # Mélange et distribution
│   │   ├── bidding.ts       # Enchères
│   │   ├── discard.ts       # Écart
│   │   ├── tricks.ts        # Plis
│   │   ├── scoring.ts       # Scores
│   │   └── gameManager.ts   # Gestionnaire de jeu
│   ├── server/              # Serveur temps réel
│   │   ├── socket.ts        # Serveur Socket.io
│   │   └── roomManager.ts   # Gestion des rooms
│   └── hooks/               # React hooks
│       └── useSocket.ts     # Hook Socket.io
├── types/                   # Types TypeScript
│   ├── card.ts              # Types cartes
│   ├── game.ts              # Types jeu
│   ├── socket.ts            # Types Socket.io
│   └── next.ts              # Types Next.js
├── pages/api/               # API Routes
│   └── socket.ts            # Initialisation Socket.io
└── public/                  # Assets statiques
```

### Fonctionnalités Techniques

#### Socket.io Events

**Client → Serveur**
- `create_room` : Créer une room
- `join_room` : Rejoindre une room
- `leave_room` : Quitter la room
- `start_game` : Démarrer la partie
- `place_bid` : Placer une enchère
- `reveal_dog` : Révéler le chien
- `discard` : Faire l'écart
- `play_card` : Jouer une carte
- `calculate_scores` : Calculer les scores
- `new_round` : Nouvelle manche

**Serveur → Client**
- `room_created` : Room créée
- `room_joined` : Room rejointe
- `player_joined` : Nouveau joueur
- `player_left` : Joueur parti
- `game_started` : Partie démarrée
- `game_state_updated` : État mis à jour
- `error` : Erreur

#### Gestion d'État

Le jeu utilise un `GameState` centralisé qui contient :
- Phase actuelle (WAITING, BIDDING, DOG_REVEAL, etc.)
- Liste des joueurs avec leurs mains
- Pli en cours
- Historique des enchères
- Scores cumulés
- Tous les flags de bonus (Petit au Bout, Poignées, etc.)

## 🎯 Règles du Tarot Français

### Enchères
1. **Passe** : Ne pas jouer (×1)
2. **Petite** : Prendre avec le chien (×1)
3. **Garde** : Prendre avec le chien (×2)
4. **Garde Sans** : Jouer sans le chien (×4)
5. **Garde Contre** : Le chien va aux défenseurs (×6)

### Points Requis
Le Preneur doit faire un certain nombre de points selon les Bouts :
- **3 Bouts** : 36 points
- **2 Bouts** : 41 points
- **1 Bout** : 51 points
- **0 Bout** : 56 points

### Calcul des Points des Cartes
- **Bout** (1, 21, Excuse) : 4.5 points
- **Roi** : 4.5 points
- **Dame** : 3.5 points
- **Cavalier** : 2.5 points
- **Valet** : 1.5 points
- **Autres cartes** : 0.5 point

*Les cartes se comptent par paires : une carte forte + une carte faible = valeur - 1*

### Bonus
- **Petit au Bout** : +10 points (multipliable)
- **Poignée Simple** (10 atouts) : +20 points
- **Poignée Double** (13 atouts) : +30 points
- **Poignée Triple** (15 atouts) : +40 points
- **Chelem annoncé réussi** : +400 points
- **Chelem non annoncé réussi** : +200 points

## 🚀 Déploiement

### Vercel (Recommandé)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push ton code sur GitHub
2. Connecte ton repo à Vercel
3. Vercel détectera automatiquement Next.js
4. Deploy ! 🎉

### Variables d'Environnement

Aucune variable d'environnement n'est requise pour le fonctionnement de base.

### Docker (Optionnel)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t tarot-francais .
docker run -p 3000:3000 tarot-francais
```

## 🧪 Tests

### Tests Manuels

L'application inclut des pages de test pour vérifier chaque fonctionnalité :

- `/test-deck` : Visualiser le deck de 78 cartes
- `/test-game` : Tester le système d'enchères et d'écart
- `/test-play` : Tester une partie complète

### Build de Production

```bash
npm run build
```

Vérifie que le build passe sans erreurs TypeScript.

## 🐛 Debugging

### Socket.io ne se connecte pas

1. Vérifiez que le serveur est bien lancé
2. Ouvrez la console navigateur pour voir les logs Socket.io
3. Vérifiez que `/api/socket` est accessible

### Les joueurs ne se synchronisent pas

1. Vérifiez que tous les joueurs sont sur la même version
2. Vérifiez la console pour les erreurs Socket.io
3. Essayez de rafraîchir la page

### Reconnexion après déconnexion

L'app utilise `localStorage` pour sauvegarder :
- `tarot_player_id` : ID du joueur
- `tarot_room_id` : ID de la room
- `tarot_player_name` : Nom du joueur

## 📝 TODO / Améliorations Futures

- [ ] Mode spectateur
- [ ] Chat intégré
- [ ] Historique des parties
- [ ] Statistiques des joueurs
- [ ] Tournois
- [ ] Mode IA pour jouer seul
- [ ] Sons et effets sonores
- [ ] Tutoriel interactif
- [ ] Support mobile amélioré
- [ ] Avatars personnalisables

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésite pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit tes changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📜 Phases de Développement

- ✅ Phase 1 : Setup initial du projet
- ✅ Phase 2 : Modélisation des cartes et logique de base
- ✅ Phase 3 : Logique du jeu (distribution, enchères, écart)
- ✅ Phase 4 : Logique des plis et règles de jeu
- ✅ Phase 5 : Calcul des scores et primes
- ✅ Phase 6 : Interface utilisateur PUTAIN
- ✅ Phase 7 : Backend multijoueur PUISSANT
- ✅ Phase 8 : Système de rooms avec page complète
- ✅ Phase 9 : Design polish et effet bois premium
- ✅ Phase 10 : Tests finaux et déploiement

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👏 Remerciements

- Règles officielles du Tarot Français
- Communauté Next.js et React
- Socket.io pour le temps réel
- Tailwind CSS pour le styling

---

**Fait avec ❤️ et beaucoup de ☕**

Bon jeu ! 🃏🎴✨
