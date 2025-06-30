export default async function showCard({chatWindow, cardName, context = {}}) {

  // render the help card and do not send the message
    let cardManager = this.bp.apps.card.cardManager;
    // console.log('cardManager.loadCard', cardData);
    const _card = await cardManager.loadCard(cardName, context, chatWindow);
    let container = document.createElement('div');
    container.classList.add('cardContainer');
    let d = await _card.render(container, chatWindow);
    if (!chatWindow || !chatWindow.content) {
      console.error('chatWindow not found. user most likely not in the chat window');
      throw new Error('chatWindow.content not found. user most likely not in the chat window');
      return;
    }

    let aimMessagesContainer = chatWindow.content.querySelector(`.aim-messages-container`);

    // find the correct aim-messages-container ( if pond / or buddy i guess )
    // find the .aim-messages-container inside the chatWindow.content with data-context attribute
    if (context.type === 'pond') {
      // console.log('Inserting message into pond chat window', message);
      aimMessagesContainer = chatWindow.content.querySelector(`.aim-messages-container[data-context="${context.context}"]`);
    }

    const aimMessages = aimMessagesContainer.querySelector('.aim-messages');
    if (!aimMessages) {
      console.error('aim-messages not found. user most likely not in the chat window');
      return;
    }

    // append container to the aim-messages at the end
    aimMessages.appendChild(container);

    // empty the aim-input
    $('.aim-input', chatWindow.content).val('');

    // scroll to the bottom of the chat window
    // aimMessages.scrollTop = aimMessages.scrollHeight;
    if (!this.bp.isMobile()) {
      container.scrollIntoView({
        behavior: 'instant'
      });

    }

    return d;
  }
