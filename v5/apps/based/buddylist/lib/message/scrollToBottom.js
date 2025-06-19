export default function scrollToBottom(parent, retryDelay = 0, retryCount = 0) {
  if (!parent) return;
  if (retryCount > 5) return;

  const chatArea = $('.aim-chat-area', parent)[0];
  if (!chatArea) return;

  if (retryCount === 0 && chatArea._scrollRetryTimer) {
    clearTimeout(chatArea._scrollRetryTimer);
    chatArea._scrollRetryTimer = null;
  }

  $(chatArea).scrollTop(chatArea.scrollHeight);
  

  requestAnimationFrame(() => {
    const buffer = 10; // tolerate small gap
    const isAtBottom = (chatArea.scrollHeight - chatArea.scrollTop - chatArea.clientHeight) < buffer;

    if (!isAtBottom) {
      retryDelay += 200;
      retryCount++;

      chatArea._scrollRetryTimer = setTimeout(() => {
        scrollToBottom(parent, retryDelay, retryCount);
      }, retryDelay);
    } else {
      chatArea._scrollRetryTimer = null;
    }

    // Final fallback if Safari still misbehaves
    if (retryCount >= 5 && !isAtBottom) {
      chatArea.lastElementChild?.scrollIntoView({ block: 'end' });
    }
  });
}
