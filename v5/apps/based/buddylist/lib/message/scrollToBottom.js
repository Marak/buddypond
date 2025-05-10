let scrollTimeout = null;

// Scroll to the last message
export default function scrollToBottom(parent) {
  console.log('scrollToBottom', parent);
  const lastElement = $('.aim-chat-message', parent).last()[0];
  if (lastElement) {
    // Clear any existing timeout or interval
    clearTimeout(scrollTimeout);
    clearInterval(scrollTimeout); // In case it was an interval

    // Function to attempt scrolling
    const tryScroll = () => {
      if (parent.offsetParent !== null) {
        // Chat window is visible, scroll to last element
        lastElement.scrollIntoView({ behavior: 'instant' });
      } else {
        // Not visible, retry every 5ms
        scrollTimeout = setInterval(() => {
          if (parent.offsetParent !== null) {
            clearInterval(scrollTimeout); // Stop retrying
            lastElement.scrollIntoView({ behavior: 'instant' });
          }
        }, 5);
      }
    };
    // Start the scroll attempt
    tryScroll();
  }
}