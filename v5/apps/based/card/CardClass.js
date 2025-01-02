export default class Card {
    constructor(bp, cardType, cardData) {
      this.bp = bp;
      this.cardType = cardType;
      this.cardData = cardData;
      this.htmlContent = '';
      this.cssContent = '';
      this.applyData = null; // Initially null, will be set when JS is loaded
    }
  
    async load() {

      // bp loader will not re-load assets if they are already loaded
      const htmlUrl = `/v5/apps/based/card/cards/${this.cardType}/${this.cardType}-card.html`;
      const cssUrl = `/v5/apps/based/card/cards/${this.cardType}/${this.cardType}-card.css`;
      const jsUrl = `/v5/apps/based/card/cards/${this.cardType}/${this.cardType}-card.js`;
      this.htmlContent = await this.bp.load(htmlUrl);
      this.cssContent = await this.bp.load(cssUrl);
      // Load the JS module as a function and assign it to this.applyData
      const applyDataModule = await this.bp.importModule(jsUrl, {}, false); // Assumes this.bp.load can execute and return modules
      console.log(jsUrl, 'applyDataModule', applyDataModule);
      this.applyData = applyDataModule.default.bind(this);
      
      // now we will check eaach property we just set, if any are undefined or null
      // we will default them to render a basic card with JSON.stringify of card data
      if (!this.htmlContent) {
        this.htmlContent = `<div class="card">${JSON.stringify(this.cardData)}</div>`;
      }
      if (!this.cssContent) {
        //maybe remove
        this.cssContent = `.card { border: 1px solid black; padding: 1em; }`;
      }
      if (!this.applyData) {
        this.applyData = (container, cardData) => {
          container.querySelector('.card').textContent = JSON.stringify(cardData);
        };
      }


    }
  
    render(container) {
      const styleTag = document.createElement('style');
      styleTag.textContent = this.cssContent;
      container.appendChild(styleTag);
  
      const cardContainer = document.createElement('div');
      cardContainer.innerHTML = this.htmlContent;
      container.appendChild(cardContainer);
  
      // Execute the dynamically loaded applyData function if available
      if (this.applyData && typeof this.applyData === 'function') {
        this.applyData(cardContainer, this.cardData);
      }
    }
  }
  