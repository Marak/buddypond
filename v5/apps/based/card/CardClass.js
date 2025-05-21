export default class Card {
    constructor(bp, cardType, cardData, parent) {
        this.bp = bp;
        this.cardType = cardType;
        this.cardData = cardData;
        this.parent = parent;
        this.htmlContent = '';
        this.cssContent = '';
        this.applyData = null; // Initially null, will be set when JS is loaded
    }

    async load() {

        if (!this.cardType) {
            console.error('Card type is not defined');
            return;
        }

        const htmlUrl = `/v5/apps/based/card/cards/${this.cardType}/${this.cardType}-card.html`;
        const cssUrl = `/v5/apps/based/card/cards/${this.cardType}/${this.cardType}-card.css`;
        const jsUrl = `/v5/apps/based/card/cards/${this.cardType}/${this.cardType}-card.js`;
        this.htmlContent = await this.bp.load(htmlUrl);
        this.cssContent = await this.bp.load(cssUrl);
        const applyDataModule = await this.bp.importModule(jsUrl, {}, false);

        if (applyDataModule && typeof applyDataModule.default === 'function') {
            this.applyData = applyDataModule.default.bind(this);
        }

        if (!this.htmlContent) {
            this.htmlContent = `<div class="card">${JSON.stringify(this.cardData)}</div>`;
        }
        if (!this.cssContent) {
            this.cssContent = `.card { border: 1px solid black; padding: 1em; }`;
        }
        if (!this.applyData) {
            this.applyData = (container, cardData) => {
                // cardData.message is circular, so remove it for default stringify
                if (cardData.message) {
                    delete cardData.message;
                }
                container.querySelector('.card').textContent = JSON.stringify(cardData);
            };
        }
    }

    render(container, parent) {
        // console.log('calling rendering card', container, this.cardType, this.cardData);
        const styleTag = document.createElement('style');
        styleTag.textContent = this.cssContent;
        container.appendChild(styleTag);

        const cardContainer = document.createElement('div');
        cardContainer.style.position = 'relative';
        cardContainer.innerHTML = this.htmlContent;
        container.appendChild(cardContainer);
        /*
        // on mouse over show / ide the reaction buttons
        cardContainer.addEventListener('mouseenter', () => {
            cardContainer.querySelector('.reaction-container').classList.add('show');
        });
        cardContainer.addEventListener('mouseleave', () => {
            cardContainer.querySelector('.reaction-container').classList.remove('show');
        });
        */

        // Add reaction UI
        //this.addReactionsUI(cardContainer);
        // console.log('what is this.applyData', this.applyData);
        if (this.applyData && typeof this.applyData === 'function') {
            try {
                return this.applyData(cardContainer, this.cardData, this, this.parent);
            } catch (err) {
                console.error('Error in applyData function:', err);
            }
        }
    }

    // TODO: move all reactions code to reaction.js
    addReactionsUI(cardContainer) {
        const reactions = ['👍', '❤️', '😂', '😮', '😢', '🔥']; // Example reaction emojis
        const reactionContainer = document.createElement('div');
        reactionContainer.classList.add('reaction-container');

        reactions.forEach(emoji => {
            const button = document.createElement('button');
            button.textContent = emoji;
            button.classList.add('reaction-button');
            button.addEventListener('click', () => this.handleReaction(emoji));
            reactionContainer.appendChild(button);
        });

        cardContainer.appendChild(reactionContainer);
    }

    handleReaction(emoji) {
        const newMessage = {
            uuid: this.cardData.message.uuid, // Ensure this exists in cardData
            reaction: emoji,
            user: this.bp.me
        };
        // TODO: send to server
        // let api = this.bp.apps.client.api;
        //api.messageReact(newMessage);
        this.renderReaction(newMessage);
    }

    renderReaction(newMessage) {
        console.log('Reaction added:', newMessage);
        const message = $(`.chatMessage[data-uuid='${newMessage.uuid}']`);
        console.log('`found message:', message);
        if (!message) return;

        let card = message.find('.cardContainer');
        console.log('found card:', card);
        let reactionSummary = card.find('.reaction-summary');
        if (!reactionSummary.length) {
            console.log('did not find reaction summary');
            reactionSummary = document.createElement('div');
            reactionSummary.classList.add('reaction-summary');
            console.log('created reaction summary:', reactionSummary);
            card.append(reactionSummary);
        }
        console.log("appending reaction", newMessage.reaction);
        reactionSummary.textContent += ` ${newMessage.reaction}`;
    }
}
