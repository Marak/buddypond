export default function isValidUrl(messageText) {
    if (!messageText) return false;
  
    messageText = messageText.trim(); // Trim whitespace from both ends
  
    try {
      const url = new URL(messageText);
  
      // Ensure the URL has http or https protocol
      if (url.protocol === "http:" || url.protocol === "https:") {
        // console.log('This is a valid URL:', url.href);
        return true;
      }
  
      return false; // Invalid if protocol is not http or https
    } catch (error) {
      return false; // If an error is thrown, it's not a valid URL
    }
  }