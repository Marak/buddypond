// Scroll to the bottom of the chat window
export default function scrollToBottom(parent, retryDelay = 0, retryCount = 0) {
  // console.log('scrollToBottom', parent, retryDelay, retryCount);
  if (!parent) {
    console.log('No parent element provided.');
    return;
  }
  if (retryCount > 5) {
    console.log('Max retry count reached. Stopping scroll attempt.');
    return;
  }
  $('.aim-chat-area', parent).scrollTop(99999999)

  // check if the scroll is still at 0
  const scrollTop = $('.aim-chat-area', parent).scrollTop();

  if (scrollTop === 0) {
    // scroll to the bottom
    retryDelay += 200;
    retryCount++;
    setTimeout(() => {
      scrollToBottom(parent, retryDelay, retryCount);
    }, retryDelay);
  }
}