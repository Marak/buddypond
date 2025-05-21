// Scroll to the bottom of the chat window
export default function scrollToBottom(parent) {
  if (!parent) {
    console.log('No parent element provided.');
    return;
  }
  $('.aim-chat-area', parent).scrollTop(99999999)
}