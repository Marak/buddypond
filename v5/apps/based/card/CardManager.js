import Card from './CardClass.js';

export default class CardManager {
    constructor(bp) {
      this.bp = bp;
      this.cards = [];
    }
  
    async loadCard(cardType, cardData) {
      const card = new Card(this.bp, cardType, cardData);
      await card.load();
      this.cards.push(card);
      return card;
    }
  
    renderAll(container) {
      this.cards.forEach(card => {

        if (typeof card.render === 'function') {
          card.render(container)
        }

      });
    }
  }
  