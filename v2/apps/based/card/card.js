// various "cards" for messages
// message is can have a card-type, which gives it special properties
// such as multimedia, audio, video, etc.
// or rendering special UI elements
// messages are usually from chat, but displaying cards can be applied to any text
import CardManager from './CardManager.js';

export default class Card {
  constructor(bp) {
    this.bp = bp;
  }

  async init() {

    this.cardManager = new CardManager(this.bp);
  }

}
 