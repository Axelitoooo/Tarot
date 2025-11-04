// Export all game logic functions
export {
  createDeck,
  validateDeck,
  countOudlers,
  calculatePoints,
} from './deck';

export {
  sortCards,
  compareCards,
  getWinningCard,
  isCardPlayable,
  getPlayableCards,
  getCardName,
  getSuitSymbol,
} from './cardUtils';

export {
  shuffleDeck,
  dealCards,
  hasPetitSec,
  checkPetitSec,
} from './shuffle';

export {
  isValidBid,
  compareBids,
  getHighestBid,
  hasWinningBidder,
  getBidName,
  getBidMultiplier,
  shouldRevealDog,
  shouldTakerTakeDog,
  getDogOwner,
} from './bidding';

export {
  canDiscardCard,
  validateDiscard,
  getDiscardableCards,
  suggestDiscard,
  calculateDiscardPoints,
} from './discard';

export {
  createGame,
  startNewRound,
  placeBid,
  revealDog,
  takeDog,
  makeDiscard,
  nextDealer,
  getCurrentPlayer,
  getTaker,
  getDefenders,
  playCard,
} from './gameManager';

export {
  getLeadSuit,
  getTrickWinner,
  hasExcuseInTrick,
  getExcusePlayer,
  handleExcuse,
  hasPetitInTrick,
  getPetitPlayer,
  checkPetitAuBout,
  calculateTrickPoints,
  canPlayCard,
  getPlayableCardsInTrick,
} from './tricks';

export type { PlayedCard } from './tricks';
