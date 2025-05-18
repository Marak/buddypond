import isValidUrl from './isValidUrl.js';
import isValidYoutubeLink from './isValidYoutubeLink.js';
import isValidGithubLink from './isValidGithubLink.js';

export default function checkForLinksInMessage(message) {
  if (isValidUrl(message.text)) {
    let contentUrl = message.text;
    // This is a URL, process it as such
    message.card = {
      url: message.text,
      type: 'url',
    };
    message.text = 'I sent a link:';
    // check to see if file extention is supportedImageTypes, if so it's data.card.type = 'image'
    if (contentUrl) {
      let ext = contentUrl.split('.').pop();
      if (ext && typeof ext === 'string') {
        if (buddypond.supportedImageTypesExt.includes(ext.toLowerCase())) {
          message.card.type = 'image';
          message.text = 'I sent an image:';
        }
        if (buddypond.supportedAudioTypesExt.includes(ext.toLowerCase())) {
          message.card.type = 'audio';
          message.text = 'I sent audio:';
        }
        if (buddypond.supportedVideoTypes.includes(ext)) {
          //data.card.type = 'video'; // soon TODO
        }
      }
    }

    // TODO: move all this app specific code *outside* of the buddylist / renderMessage
    // use the system.addMessageProcessor() API instead
    if (isValidYoutubeLink(contentUrl)) {
      message.card.type = 'youtube';
      message.card.thumbnail = `https://img.youtube.com/vi/${contentUrl.split('v=')[1]}/0.jpg`;
      message.card.context = contentUrl.split('v=')[1];
      message.text = 'I sent a youtube link:';
      message.text = '';
    }

    if (isValidGithubLink(contentUrl)) {
      message.card.type = 'github';
      message.text = 'I sent a github link:';

      // TODO: Extract owner, repo, and filename from the URL
      const githubRegex = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/;
      const match = contentUrl.match(githubRegex);
      if (match) {
        message.card.owner = match[1]; // "Marak"
        message.card.repo = match[2]; // "buddypond"
        message.card.filename = match[4]; // "v5/apps/based/client/lib/api.js"
      } else {
        console.error("Invalid GitHub URL format.");
      }
    }

  }
}