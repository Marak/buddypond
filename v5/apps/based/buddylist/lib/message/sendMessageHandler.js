export default async function sendMessageHandler(e, chatWindow, windowType, contextName) {

  const message = $('.aim-input', chatWindow.content).val();

  const _data = {
    to: $('.aim-to', chatWindow.content).val(),
    replyto: $('.aim-replyto', chatWindow.content).val(),
    type: windowType,
    from: this.bp.me,
    message,
    ctime: Date.now(),
    text: message,
    files: [],
  };

  // TODO: move file upload code to separate function
  // Get file previews
  const filePreviews = $('.file-preview', chatWindow.content);
  const files = [];

  if ((!message || message.length === 0) && filePreviews.length === 0) {
    console.log('No message to send');
    return;
  }

  // Collect all files first
  filePreviews.each((_, filePreview) => {
    $('.file-content', filePreview).each((_, fileContent) => {
      const file = this.bp.apps['file-viewer'].getFile(fileContent);
      if (file) {
        files.push({
          file,
          element: fileContent
        });
      }
    });
  });

  // Create status indicators for each file
  files.forEach(({ file, element }) => {
    const statusDiv = $('<div>', {
      class: 'upload-status',
      css: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }
    }).text('Waiting...');

    $(element).css('position', 'relative').append(statusDiv);
  });

  // Process files sequentially
  try {
    for (const { file, element } of files) {
      const statusDiv = $(element).find('.upload-status');
      statusDiv.text('Uploading...');

      try {
        console.log('is there a filepath?', file.filePath);
        console.log('this is the file', file);
        file.filePath = file.filePath || file.name;

        // we are going to perform some basic file organization and routing here
        // when the user uploads files via the chat window, we are going to store them
        // in the user's directory on the CDN
        // to help out the user, will perform mime type / file ext detection here in order to upload
        // the file to the appropriate directory such as images, audio, videos, etc
        let supportedImageTypesExt = ['jpeg', 'png', 'gif', 'webp', 'svg']; // same as server ( for now )
        let supportedAudioTypesExt = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];

        // check to see if the file.name has an extension included in the supportedImageTypesExt array
        let fileExt = file.name.split('.').pop().toLowerCase();
        if (supportedImageTypesExt.includes(fileExt)) {
          file.filePath = 'images/' + file.filePath;
        }
        if (supportedAudioTypesExt.includes(fileExt)) {
          file.filePath = 'audio/' + file.filePath;
        }

        console.log('assigning file path', file.filePath);
        let fileUrl = await this.bp.apps.client.api.uploadFile(file, (progress) => {
          statusDiv.text('Uploading: ' + progress + '%');

        });

        // now that we have the url, just send a regular message with the url
        // the card type should automatically be detected by the server
        // the the body of the message will be the url with extension of image, video, etc
        let message = {
          to: _data.to,
          from: _data.from,
          type: _data.type,
          replyto: _data.replyto,
          text: fileUrl
        };
        // TODO: replyto
        console.log("sending multimedia message", message);
        this.bp.emit('buddy::sendMessage', message);

        // Fade out and remove the uploaded file preview
        await $(element).fadeOut(300);
        $(element).remove();

      } catch (error) {
        console.error('Error uploading file:', error);
        statusDiv.text('Failed: ' + error.message)
          .css('background', 'rgba(255, 0, 0, 0.7)');

        // Keep failed uploads visible for 2 seconds then fade out
        await new Promise(resolve => setTimeout(resolve, 8000));
        await $(element).fadeOut(300);
        $(element).remove();
      }
    }
  } catch (error) {
    console.error('Error in file upload process:', error);
  }

  // Remove empty file preview containers
  filePreviews.each((_, container) => {
    if ($(container).children().length === 0) {
      $(container).remove();
    }
  });

  $('.file-preview', chatWindow.content).remove();

  // Send the regular message
  if (windowType === 'pond') {
    _data.type = 'pond';
  } else {
    _data.type = 'buddy';
  }

  // TODO: move all message preprocessing to a separate function
  if (_data.text.startsWith('/image')) {
    _data.text = await this.bp.searchImage(_data.text.replace('/image', ''));
    _data.card = {
      type: 'image',
      url: _data.text
    };
  }


  // TODO: move to buddyscript processor
  if (_data.text.startsWith('/help')) {
    // show the help card and do not send the message
    await this.showCard({ chatWindow, cardName: 'help' });
    return;
  }

  if (_data.text.startsWith('/markdown')) {
    // show the help card and do not send the message
    await this.showCard({ chatWindow, cardName: 'markdown' });
    return;
  }

  // TODO: move to buddyscript processor
  if (_data.text.startsWith('/bs')) {
    // show the help card and do not send the message
    await this.showCard({ chatWindow, cardName: 'bs-commands' });
    return;
  }


  // shows all apps
  if (_data.text.startsWith('/apps')) {
    // show the help card and do not send the message
    await this.showCard({ chatWindow, cardName: 'apps' });
    return;
  }

  // if this is a buddyscript command, but not a /say command
  // say has a special meaning in the context of the chat window
  // as it should be sent as regular text message ( should be a card later, click to repeat )
  if (_data.text.startsWith('/') 
        && !_data.text.startsWith('/say')
        && !_data.text.startsWith('/roll')
    ) {
    // TODO: process the card locall here
    /*
    _data.card = {
     type: 'bs'
   };
   */
    // runs local BS script command
    // alert('bs card')

    let bs = this.bp.apps.buddyscript.parseCommand(_data.text);

    if (bs.pipe) {
      //if (now - messageTime < 10000) {
        // pipeable / immediate run commands should only persist for 10 seconds
        bs.pipe();
        // clear the input
        $('.aim-input', chatWindow.content).val('');
        return false;

      // }
    }

    console.log('buddyscript command', bs);
    if (bs.type === 'show-card') {
      // show the bs card
      let cardData = bs.data;
      this.showCard({
        chatWindow,
        cardName: 'bs',
        context: {
          ...bs
        }
      });
    }
    $('.aim-input', chatWindow.content).val('');

    return false;
  }

  if (_data.text.startsWith('\\')) {
    // let bs = this.bp.apps.buddyscript.parseCommand(_data.text);
    // console.log('backwards command', bs);
    _data.card = {
      type: 'bs',
      command: _data.text.replace('\\', '/').trim(),
      //commandData: bs
    };

  }


  // TODO: check if this is a valid BS command
  // if so, we need to construct a card to show the command

  // TODO: add support for sending /bs commands with \ instead of /
  /*
  if (_data.text.startsWith('\\')) {
    // the command is a /foo style command
    // extract the command from the text
    let command = _data.text.split(' ')[0].replace('\\', '');
    alert(command)
    _data.text = 'Sent app using `\\' + command + '` command'; // TODO: better UX message
    _data.card = {
      type: 'app', // coould also be a "bs" card, might need distinction between app and bs commands
      context: command
    };
  }
  */

  console.log('emitting message', _data);
  this.bp.emit('buddy::sendMessage', _data);

  // Clear input
  $('.aim-input', chatWindow.content).val('');

  // Hide the aim-reply-box
  $('.aim-reply-box', chatWindow.content).remove();

  // clear the replyTo input value
  $('.aim-replyto', chatWindow.content).val('');
  /*
  const replyBox = target.closest('.aim-reply-box');
  if (replyBox) {
    replyBox.remove();
    this.activeReplyBox = null;
    this.bp.replyMode = false;
    this.bp.replyData = null;
  }
  */

  let $sendButton = $('.aim-send-btn', chatWindow.content);
  $sendButton.css('opacity', 0.5);


}