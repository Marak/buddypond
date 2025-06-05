// TODO: move all this app specific code *outside* of the buddylist / renderMessage
// use the system.addMessageProcessor() API instead

import isValidUrl from './isValidUrl.js';
import isValidYoutubeLink from './isValidYoutubeLink.js';
import isValidGithubLink from './isValidGithubLink.js';

export default function checkForLinksInMessage(message) {
  const text = message.text || '';

  // Basic URL regex — matches http(s) links
  const urlRegex = /https?:\/\/(?:[^\s()<>\[\]{}"']+|\([^\s()]*?\))+/gi;
  let match = text.match(urlRegex);
  // match = [message.text];

  if (match && isValidUrl(match[0])) {
    let contentUrl = match[0];
    // console.log('Found URL in message:', contentUrl);
    message.card = {
      url: contentUrl,
      type: 'website',
    };

    // Determine file type from extension
    let ext = contentUrl.split('.').pop().split(/\#|\?/)[0]; // Strip off hash/query
    if (ext && typeof ext === 'string') {
      if (buddypond.supportedImageTypesExt.includes(ext.toLowerCase())) {
        message.card.type = 'image';
      }
      if (buddypond.supportedAudioTypesExt.includes(ext.toLowerCase())) {
        message.card.type = 'audio';
      }
      if (buddypond.supportedVideoTypesExt.includes(ext.toLowerCase())) {
        message.card.type = 'video';
      }
    }

    // YouTube link handling
    if (isValidYoutubeLink(contentUrl)) {
      const videoId = new URL(contentUrl).searchParams.get('v');
      if (videoId) {
        message.card.type = 'youtube';
        message.card.thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;
        message.card.context = videoId;
      }
    }

    // GitHub link handling
    if (isValidGithubLink(contentUrl)) {
      message.card.type = 'github';
      const githubRegex = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/;
      const match = contentUrl.match(githubRegex);
      if (match) {
        message.card.owner = match[1];
        message.card.repo = match[2];
        message.card.filename = match[4];
      } else {
        console.error("Invalid GitHub URL format.");
      }
    }
  }
}
