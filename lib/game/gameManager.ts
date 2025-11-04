import { GameState, GamePhase, Player, BidType, PlayerCount, Bid, PoigneeType } from '@/types/game';
import { Card } from '@/types/card';
import { createDeck } from './deck';
import { dealCards, checkPetitSec } from './shuffle';
import { isValidBid, hasWinningBidder, getDogOwner, shouldTakerTakeDog } from './bidding';
import { validateDiscard } from './discard';
import { sortCards } from './cardUtils';

/**
 * Crée un nouvel état de jeu
 */
export function createGame(
  gameId: string,
  playerNames: string[],
  playerCount: PlayerCount
): GameState {
  if (playerNames.length !== playerCount) {
    throw new Error(`Expected ${playerCount} players, got ${playerNames.length}`);
  }

  // Créer les joueurs
  const players: Player[] = playerNames.map((name, index) => ({
    id: `player-${index}`,
    name,
    hand: [],
    tricksWon: [],
    score: 0,
    isDealer: index === 0, // Le premier joueur est le donneur
    isTaker: false,
  }));

  return {
    id: gameId,
    phase: GamePhase.WAITING,
    playerCount,
    players,
    deck: [],
    dog: [],
    currentTrick: [],
    currentPlayerIndex: 0,
    dealerIndex: 0,
    takerIndex: null,
    bids: [],
    currentBid: null,
    discard: [],
    petitAuBout: false,
    poignee: PoigneeType.NONE,
    chelemAnnounced: false,
    chelemRealized: false,
    trickNumber: 0,
  };
}

/**
 * Démarre une nouvelle manche (distribution des cartes)
 */
export function startNewRound(gameState: GameState): GameState {
  // Créer et mélanger le deck
  const deck = createDeck();
  const { hands, dog } = dealCards(deck, gameState.playerCount);

  // Vérifier le Petit Sec
  const petitSecIndex = checkPetitSec(hands);
  if (petitSecIndex !== -1) {
    // Redistribuer si Petit Sec
    return startNewRound(gameState);
  }

  // Trier les mains
  const sortedHands = hands.map(hand => sortCards(hand));

  // Mettre à jour les mains des joueurs
  const players = gameState.players.map((player, index) => ({
    ...player,
    hand: sortedHands[index],
    tricksWon: [],
    isTaker: false,
  }));

  // Le joueur à droite du donneur commence les enchères
  const firstBidderIndex = (gameState.dealerIndex + 1) % gameState.playerCount;

  return {
    ...gameState,
    phase: GamePhase.BIDDING,
    players,
    deck,
    dog: sortCards(dog),
    currentPlayerIndex: firstBidderIndex,
    bids: [],
    currentBid: null,
    discard: [],
    currentTrick: [],
    petitAuBout: false,
    chelemAnnounced: false,
    chelemRealized: false,
    trickNumber: 0,
    takerIndex: null,
  };
}

/**
 * Place une enchère
 */
export function placeBid(
  gameState: GameState,
  playerId: string,
  bidType: BidType
): GameState {
  if (gameState.phase !== GamePhase.BIDDING) {
    throw new Error('Not in bidding phase');
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  if (currentPlayer.id !== playerId) {
    throw new Error('Not your turn to bid');
  }

  // Vérifier que l'enchère est valide
  if (!isValidBid(bidType, gameState.currentBid)) {
    throw new Error('Invalid bid');
  }

  // Ajouter l'enchère
  const newBid: Bid = { playerId, type: bidType };
  const bids = [...gameState.bids, newBid];

  // Mettre à jour la meilleure enchère
  const currentBid = bidType !== BidType.PASS ? bidType : gameState.currentBid;

  // Passer au joueur suivant
  const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.playerCount;

  // Vérifier si les enchères sont terminées
  const { hasWinner, winnerId, winningBid } = hasWinningBidder(
    bids,
    gameState.playerCount
  );

  let newState: GameState = {
    ...gameState,
    bids,
    currentBid,
    currentPlayerIndex: nextPlayerIndex,
  };

  if (hasWinner) {
    if (!winnerId || !winningBid) {
      // Tout le monde a passé - redistribuer
      return startNewRound(gameState);
    }

    // Trouver l'index du preneur
    const takerIndex = gameState.players.findIndex(p => p.id === winnerId);

    // Marquer le preneur
    const players = gameState.players.map((p, i) => ({
      ...p,
      isTaker: i === takerIndex,
    }));

    newState = {
      ...newState,
      players,
      takerIndex,
      phase: GamePhase.DOG_REVEAL,
      currentPlayerIndex: takerIndex,
    };
  }

  return newState;
}

/**
 * Révèle le chien (pour Petite et Garde)
 */
export function revealDog(gameState: GameState): GameState {
  if (gameState.phase !== GamePhase.DOG_REVEAL) {
    throw new Error('Not in dog reveal phase');
  }

  if (!gameState.currentBid || !shouldTakerTakeDog(gameState.currentBid)) {
    // Pour Garde Sans et Garde Contre, passer directement au jeu
    return {
      ...gameState,
      phase: GamePhase.PLAYING,
      currentPlayerIndex: (gameState.dealerIndex + 1) % gameState.playerCount,
      trickNumber: 1,
    };
  }

  // Le preneur prend le chien dans sa main
  return {
    ...gameState,
    phase: GamePhase.DISCARDING,
  };
}

/**
 * Le preneur intègre le chien dans sa main
 */
export function takeDog(gameState: GameState): GameState {
  if (gameState.phase !== GamePhase.DISCARDING) {
    throw new Error('Not in discarding phase');
  }

  if (gameState.takerIndex === null) {
    throw new Error('No taker');
  }

  const taker = gameState.players[gameState.takerIndex];

  // Ajouter le chien à la main du preneur
  const newHand = sortCards([...taker.hand, ...gameState.dog]);

  const players = gameState.players.map((p, i) =>
    i === gameState.takerIndex ? { ...p, hand: newHand } : p
  );

  return {
    ...gameState,
    players,
  };
}

/**
 * Le preneur fait son écart
 */
export function makeDiscard(
  gameState: GameState,
  playerId: string,
  discardCards: Card[]
): GameState {
  if (gameState.phase !== GamePhase.DISCARDING) {
    throw new Error('Not in discarding phase');
  }

  if (gameState.takerIndex === null) {
    throw new Error('No taker');
  }

  const taker = gameState.players[gameState.takerIndex];
  if (taker.id !== playerId) {
    throw new Error('Only the taker can discard');
  }

  // Valider l'écart
  const { valid, errors } = validateDiscard(discardCards, taker.hand);
  if (!valid) {
    throw new Error(`Invalid discard: ${errors.join(', ')}`);
  }

  // Retirer les cartes écartées de la main du preneur
  const newHand = taker.hand.filter(
    card => !discardCards.find(dc => dc.id === card.id)
  );

  const players = gameState.players.map((p, i) =>
    i === gameState.takerIndex ? { ...p, hand: sortCards(newHand) } : p
  );

  // Passer à la phase de jeu
  // Le joueur à droite du donneur entame
  const firstPlayerIndex = (gameState.dealerIndex + 1) % gameState.playerCount;

  return {
    ...gameState,
    players,
    discard: discardCards,
    phase: GamePhase.PLAYING,
    currentPlayerIndex: firstPlayerIndex,
    trickNumber: 1,
  };
}

/**
 * Passe au donneur suivant pour la prochaine manche
 */
export function nextDealer(gameState: GameState): GameState {
  const nextDealerIndex = (gameState.dealerIndex + 1) % gameState.playerCount;

  const players = gameState.players.map((p, i) => ({
    ...p,
    isDealer: i === nextDealerIndex,
  }));

  return {
    ...gameState,
    dealerIndex: nextDealerIndex,
    players,
  };
}

/**
 * Obtient le joueur actuel
 */
export function getCurrentPlayer(gameState: GameState): Player {
  return gameState.players[gameState.currentPlayerIndex];
}

/**
 * Obtient le preneur
 */
export function getTaker(gameState: GameState): Player | null {
  if (gameState.takerIndex === null) return null;
  return gameState.players[gameState.takerIndex];
}

/**
 * Obtient les défenseurs
 */
export function getDefenders(gameState: GameState): Player[] {
  if (gameState.takerIndex === null) return [];
  return gameState.players.filter((_, i) => i !== gameState.takerIndex);
}

/**
 * Interface pour les cartes jouées avec le joueur
 */
interface PlayedCard {
  card: Card;
  playerId: string;
  playerIndex: number;
}

/**
 * Joue une carte
 */
export function playCard(
  gameState: GameState,
  playerId: string,
  card: Card
): GameState {
  if (gameState.phase !== GamePhase.PLAYING) {
    throw new Error('Not in playing phase');
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  if (currentPlayer.id !== playerId) {
    throw new Error('Not your turn');
  }

  // Vérifier que le joueur a cette carte
  const hasCard = currentPlayer.hand.some(c => c.id === card.id);
  if (!hasCard) {
    throw new Error('You do not have this card');
  }

  // Vérifier que la carte peut être jouée
  // Import des fonctions de tricks
  const { canPlayCard } = require('./tricks');
  const { canPlay, reason } = canPlayCard(
    card,
    currentPlayer.hand,
    gameState.currentTrick.map((c, i) => ({
      card: c,
      playerId: gameState.players[i].id,
    }))
  );

  if (!canPlay) {
    throw new Error(reason || 'Cannot play this card');
  }

  // Retirer la carte de la main du joueur
  const newHand = currentPlayer.hand.filter(c => c.id !== card.id);

  const players = gameState.players.map((p, i) =>
    i === gameState.currentPlayerIndex ? { ...p, hand: sortCards(newHand) } : p
  );

  // Ajouter la carte au pli actuel
  const currentTrick = [...gameState.currentTrick, card];

  // Si le pli est complet, le résoudre
  if (currentTrick.length === gameState.playerCount) {
    return resolveTrick({ ...gameState, players, currentTrick });
  }

  // Sinon, passer au joueur suivant
  const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.playerCount;

  return {
    ...gameState,
    players,
    currentTrick,
    currentPlayerIndex: nextPlayerIndex,
  };
}

/**
 * Résout un pli complet
 */
function resolveTrick(gameState: GameState): GameState {
  const { getTrickWinner, hasPetitInTrick, checkPetitAuBout, hasExcuseInTrick, getExcusePlayer, handleExcuse } = require('./tricks');

  // Créer les cartes jouées avec leurs joueurs
  const playedCards: PlayedCard[] = gameState.currentTrick.map((card, offset) => {
    // Le premier joueur du pli est celui qui a entamé
    // On doit calculer l'index correct
    const startIndex = gameState.currentPlayerIndex - gameState.currentTrick.length + 1;
    const playerIndex = (startIndex + offset + gameState.playerCount) % gameState.playerCount;
    return {
      card,
      playerId: gameState.players[playerIndex].id,
      playerIndex,
    };
  });

  // Déterminer le gagnant
  const winnerId = getTrickWinner(playedCards);
  const winnerIndex = gameState.players.findIndex(p => p.id === winnerId);

  // Vérifier le Petit au bout
  const isLastTrick = gameState.trickNumber === 18;
  let petitAuBout = gameState.petitAuBout;

  if (isLastTrick && hasPetitInTrick(playedCards)) {
    const { isPetitAuBout } = checkPetitAuBout(playedCards, gameState.trickNumber);
    petitAuBout = isPetitAuBout;
  }

  // Gérer l'Excuse
  let trickCards = [...gameState.currentTrick];
  let excuseCard: Card | null = null;

  if (hasExcuseInTrick(playedCards)) {
    const { excuseOwnerId, shouldExchangeCard } = handleExcuse(
      playedCards,
      winnerId,
      isLastTrick
    );

    excuseCard = gameState.currentTrick.find(c => c.suit === 'EXCUSE') || null;

    if (excuseOwnerId !== winnerId && !isLastTrick) {
      // L'Excuse reste à son propriétaire
      // Retirer l'Excuse du pli
      trickCards = trickCards.filter(c => c.suit !== 'EXCUSE');

      // Ajouter l'Excuse aux plis du propriétaire
      const excuseOwnerIndex = gameState.players.findIndex(p => p.id === excuseOwnerId);
      if (excuseOwnerIndex !== -1 && excuseCard) {
        const excuseCardNonNull = excuseCard; // TypeScript type narrowing
        const players = gameState.players.map((p, i) =>
          i === excuseOwnerIndex
            ? { ...p, tricksWon: [...p.tricksWon, [excuseCardNonNull]] }
            : p
        );
        gameState = { ...gameState, players };
      }
    }
  }

  // Ajouter le pli aux plis gagnés du gagnant
  const players = gameState.players.map((p, i) =>
    i === winnerIndex
      ? { ...p, tricksWon: [...p.tricksWon, trickCards] }
      : p
  );

  // Vérifier si c'était le dernier pli
  if (isLastTrick) {
    return {
      ...gameState,
      players,
      currentTrick: [],
      phase: GamePhase.SCORING,
      petitAuBout,
    };
  }

  // Passer au pli suivant
  // Le gagnant du pli entame le suivant
  return {
    ...gameState,
    players,
    currentTrick: [],
    currentPlayerIndex: winnerIndex,
    trickNumber: gameState.trickNumber + 1,
    petitAuBout,
  };
}

/**
 * Calcule les scores à la fin de la manche
 */
export function calculateFinalScores(gameState: GameState): GameState {
  if (gameState.phase !== GamePhase.SCORING) {
    throw new Error('Not in scoring phase');
  }

  if (gameState.takerIndex === null || !gameState.currentBid) {
    throw new Error('No taker or bid');
  }

  const { calculateFullRoundResult } = require('./scoring');
  const { getDogOwner } = require('./bidding');

  const taker = gameState.players[gameState.takerIndex];

  // Récupérer toutes les cartes du preneur
  const takerCards = taker.tricksWon.flat();

  // Ajouter le chien au camp approprié selon l'enchère
  const dogOwner = getDogOwner(gameState.currentBid);
  let finalTakerCards = takerCards;

  if (dogOwner === 'taker') {
    // Pour Petite, Garde, et Garde Sans : le chien appartient au preneur
    finalTakerCards = [...takerCards, ...gameState.dog];
  }

  // L'écart est toujours pour le preneur
  const takerDiscard = gameState.discard;

  // Déterminer qui a gagné le Petit au bout
  let petitAuBoutWinner: 'taker' | 'defenders' = 'taker';
  if (gameState.petitAuBout) {
    // Vérifier dans quel camp se trouve le Petit
    const petitInTakerCards = finalTakerCards.some(
      c => c.suit === 'TRUMP' && c.trumpNumber === 1
    );
    petitAuBoutWinner = petitInTakerCards ? 'taker' : 'defenders';
  }

  // Pour l'instant, pas de poignée ni chelem (sera ajouté plus tard si nécessaire)
  const poignee = gameState.poignee || 'NONE';
  const poigneeWinner: 'taker' | 'defenders' = 'taker'; // Simplifié pour l'instant

  // Calculer les scores
  const result = calculateFullRoundResult(
    finalTakerCards,
    takerDiscard,
    taker.id,
    gameState.players.map(p => p.id),
    gameState.currentBid,
    gameState.petitAuBout,
    petitAuBoutWinner,
    poignee,
    poigneeWinner,
    gameState.chelemAnnounced,
    gameState.chelemRealized
  );

  // Mettre à jour les scores des joueurs
  const players = gameState.players.map(player => ({
    ...player,
    score: player.score + result.playerScores[player.id],
  }));

  return {
    ...gameState,
    players,
    phase: GamePhase.FINISHED,
  };
}
