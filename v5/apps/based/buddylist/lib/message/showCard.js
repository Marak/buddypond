export default async function showCard({chatWindow, cardName}) {
    // render the help card and do not send the message
    let cardManager = this.bp.apps.card.cardManager;
    // console.log('cardManager.loadCard', cardData);
    const _card = await cardManager.loadCard(cardName, {});
    let container = document.createElement('div');
    container.classList.add('cardContainer');
    let d = await _card.render(container, chatWindow);

    const aimMessages = chatWindow.content.querySelector('.aim-messages');
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
    container.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    });


    console.log('container', container);
    return d;
  }
