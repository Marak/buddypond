desktop.app.messages = {};
desktop.app.messages.icon = 'folder';

// TODO: move messages scope?
desktop.messages = {};
// messages are processed locally by unique uuid
// processedMessage[] is used to stored message ids which have already been processed by Desktop Client
// TODO: Have the desktop trim desktop.messages._processed if processed messages exceeds MAX_ALLOWED_PROCESSED_MESSAGES
desktop.messages._processed = [];
desktop.messages._processedCards = [];



desktop.app.messages.load = function (params, cb) {
  cb();
};

//
// desktop.messages.process() queries the server for new messages and then
// delegates those messages to any applications which expose an App.processMessages() function
//
// TODO: move to App.Messages
desktop.messages.process = function processMessages (apps) {
  apps = apps || desktop.apps.loaded;
  if (!buddypond.qtokenid) {
    // no session, wait a short tick and try again
    // this most likely indicates login is in progress
    setTimeout(function () {
      desktop.messages.process();
    }, 10);
  } else {

    //
    // calculate list of subscribed buddies and subscribed ponds
    //
    let subscribedBuddies = [];
    let subscribedPonds = [];

    if (desktop.app.buddylist) {
      subscribedBuddies= desktop.app.buddylist.subscribedBuddies;
    }

    if (desktop.app.pond) {
      subscribedPonds = desktop.app.pond.subscribedPonds;
    }

    // TODO: Configure desktop.messages.process() to still check for agent and systems messages here
    if (subscribedBuddies.length === 0 && subscribedPonds.length === 0) {
      setTimeout(function () {
        desktop.messages.process();
      }, 10);
      return;
    }

    let params = {
      buddyname: desktop.app.buddylist.subscribedBuddies.toString(),
      pondname: desktop.app.pond.subscribedPonds.toString(),
      ignoreMessages: desktop.messages._processedCards
    };

    //
    // call buddypond.getMessages() to get buddy messages data
    //
    // console.log('sending params', params)
    // console.log('calling, buddylist.getMessages', params);
    buddypond.getMessages(params, function (err, data) {
      // console.log('calling back, buddylist.getMessages', err, data);
      if (err) {
        console.log('error in getting messages', err);
        // TODO: show disconnect error in UX
        // if an error has occured, give up on processing messages
        // and retry again shortly
        setTimeout(function () {
          desktop.messages.process();
        }, desktop.DEFAULT_AJAX_TIMER);
        return;
      }


      //
      // filter out any messaages which have already been processed by uuid
      // the deskop UX will only process each message once as to not re-render / flicker elements and message events
      let newMessages = [];
      data.messages.forEach(function (message) {
        if (desktop.messages._processed.indexOf(message.uuid) === -1) {
          newMessages.push(message);
        }
      });

      data.messages = newMessages;

      // TODO: replace with EE
      // Remark: might be best to keep processMessage() pattern here since it has a callback
      //         currently no async message processing in desktop, could have it later
      // iterate through every app that is loaded and see if it exports `App.processMessages` function
      // currently we processMessages for: `App.buddylist`, `App.pond`, and `App.automaton`
      let appNameProcessMessagesList = [];
      apps.forEach(function (app) {
        if (typeof desktop.app[app].processMessages === 'function') {
          appNameProcessMessagesList.push(desktop.app[app].processMessages);
        }
      });

      //
      // once we have the message data and know which Apps have `App.processMessages` available...
      // delegate the message data to each App's internal processMessages() function
      //
      desktop.utils.asyncApplyEach(
        appNameProcessMessagesList,
        data,
        function done (err, results) {
          // `App.processMessages` should return `true`
          // ignore all the errors and results for now
          // console.log(err, results);
          //
          // All apps have completed rendering messages, set a timer and try again shortly
          //
          setTimeout(function () {
            desktop.messages.process(desktop.apps.loaded);
          }, desktop.DEFAULT_AJAX_TIMER);
        });
    });
  }
};

function renderGeoFlag (message) {
  let geoFlag = '';
  if (message.location) {
    if (message.location !== 'outer space') {
      geoFlag = `<img class="geoFlag" src="desktop/assets/geo-flags/flags/4x3/${message.location}.svg"/>`;
    } else {
      geoFlag = ``;
    }
  }
  return geoFlag;
}


// rendering incoming message object as chat html
desktop.app.messages.renderChatMessage = function renderChatMessage (message, windowId){

  message.text = forbiddenNotes.filter(message.text);

  desktop.app.tts.processMessage(message);

  message.ctime = new Date(message.ctime).toString();
  message.ctime = DateFormat.format.date(message.ctime, 'E MMMM dd, hh:mm:ss a');

  let str = '';
  let geoFlag = renderGeoFlag(message);

  if (message.from === buddypond.me) {
    if (message.from === 'anonymous') {
      let tripcode = message.tripcode || 'tr1pc0d3';
      str += `<span class="datetime">${message.ctime}</span> ${geoFlag}${message.from} (${tripcode}): <span class="message"></span><br/>`;
    } else {
      str += `<span class="datetime">${message.ctime}</span> ${geoFlag}${message.from}: <span class="message"></span><br/>`;
    }
  } else {
    if (message.from === 'anonymous') {
      let tripcode = message.tripcode || 'tr1pc0d3';
      str += `<span class="datetime">${message.ctime}</span> <span class="purple">${geoFlag}${message.from} (${tripcode}): </span><span class="message purple"></span><br/>`;
    } else {
      str += `<span class="datetime">${message.ctime}</span> <span class="purple">${geoFlag}${message.from}: </span><span class="message purple"></span><br/>`;
    }
    let now = new Date().getTime();
    if (message.type === 'pond') {
      if (now - desktop.app.pond.lastNotified > 30000) {
        desktop.app.notifications.notifyBuddy(`${message.to} 🐸 ${message.from}: ${message.text}`);
        desktop.app.pond.lastNotified = now;
      }
    } else {
      if (now - desktop.app.buddylist.lastNotified > 3333) {
        desktop.app.notifications.notifyBuddy(`🐸 ${message.from}: ${message.text}`);
        desktop.app.buddylist.lastNotified = now;
      }
    }
  }

  $('.chat_messages', windowId).append(`<div class="chatMessage">${str}</div>`);
  $('.message', windowId).last().text(message.text);

  let currentlyDisplayedMessages = $('.chatMessage', windowId);
  if (currentlyDisplayedMessages.length > 99) {
    currentlyDisplayedMessages.first().remove();
  }

  // take the clean text that was just rendered for the last message and check for special embed links
  // TODO: smart links for memes
  // TODO: smart links for snaps links
  // TODO: smart links for audio links
  desktop.smartlinks.replaceYoutubeLinks($('.message', windowId).last());

  // TODO: replace with budscript.parse, etc
  let first = message.text.substr(0, 1);
  if (first === '\\') {
    let command = message.text.split(' ');
    command[0] = command[0].substr(1, command[0].length - 1);
    message.text = message.text.replace('\\', '/'); // for now
    desktop.commands.chat.buddyscript(message, windowId, command[0]);
    desktop.messages._processedCards.push(message.uuid);
  }

  // replace cards
  if (message.card) {
    if (message.card.type === 'points') {
      // TODO: switch API to new cards API
      desktop.app.messages.cards.points(message, windowId);
      desktop.messages._processedCards.push(message.uuid);
      return;
    }
    
    if (message.card && message.card.type === 'snaps') {
      desktop.app.messages.cards.snap(message, windowId);
      // don't reply the large media cards ( asks server to ignores them on further getMessages calls)
      desktop.messages._processedCards.push(message.uuid);
      desktop.messages._processed.push(message.uuid);
      return;
    }

    if (message.card && message.card.type === 'meme') {
      desktop.app.messages.cards.meme(message, windowId);
      desktop.messages._processed.push(message.uuid);
      return;
    }

    if (message.card && message.card.type === 'audio') {
      desktop.app.messages.cards.audio(message, windowId);
      //desktop.messages._processed.push(message.uuid);
      //return;
    }

  }
}

// renders various cards sent from buddypond server as html
desktop.app.messages.cards = {};

desktop.app.messages.cards.audio = function renderAudioCard (message, windowId) {
  message.card.soundURL = desktop.filesEndpoint + '/' + message.card.soundURL;
  $('.message', windowId).last().append(`
    <strong><a href="#openSound" class="openSound" data-soundurl="${message.card.soundURL}">Play <img class="playSoundIcon" src="desktop/assets/images/icons/icon_soundrecorder_64.png"/></a></strong>
  `);
}

desktop.app.messages.cards.meme = function renderMemeCard (message, windowId) {
  message.card.filename = buddypond.memePath + '/memes/' + message.card.filename;
  $('.chat_messages', windowId).append(`
    <div class="message memeCard">
      <strong>${message.card.title}</strong><br/><em>Levenshtein: ${message.card.levenshtein} Jaro Winkler: ${message.card.winkler}</em>
      <br/>
      <img class="remixGif" title="Remix in GIF Studio" data-output="${message.type}" data-context="${message.to}" src="desktop/assets/images/icons/icon_gifstudio_64.png"/>
      <img class="remixPaint" title="Remix in Paint" data-output="${message.type}" data-context="${message.to}" src="desktop/assets/images/icons/icon_paint_64.png"/>
      <img class="card-meme image" src="${message.card.filename}"/>
    </div>
    <br/>
  `);
};

desktop.app.messages.cards.snap = function renderSnapCard (message, windowId) {
  message.card.snapURL = desktop.filesEndpoint + '/' + message.card.snapURL;
  let context = message.to;
  if (message.type === 'buddy') {
    if (message.from !== buddypond.me) {
      context = message.from;
    }
  }
  let arr = message.card.snapURL.split('.');
  let ext = arr[arr.length -1];
  if (ext === 'gif') {
    $('.chat_messages', windowId).append(`
     <div class="message">
      <img class="remixGif" title="Remix in GIF Studio" data-output="${message.type}" data-context="${context}" src="desktop/assets/images/icons/icon_gifstudio_64.png"/>
      <img class="remixPaint" title="Remix in Paint" data-output="${message.type}" data-context="${context}" src="desktop/assets/images/icons/icon_paint_64.png"/>
      <img id="${message.uuid}" class="snapsImage image" src="${message.card.snapURL}"/>
    </div>
    <br/>
    `);
  } else {
    $('.chat_messages', windowId).append(`
     <div class="message">
      <img class="remixGif" title="Remix in GIF Studio" data-output="${message.type}" data-context="${context}" src="desktop/assets/images/icons/icon_gifstudio_64.png"/>
      <img class="remixPaint" title="Remix this Paint" data-output="${message.type}" data-context="${context}" src="desktop/assets/images/icons/icon_paint_64.png"/>
      <img id="${message.uuid}" class="paintsImage image" src="${message.card.snapURL}"/>
     </div>
     <br/>
    `);
  }
}

desktop.app.messages.cards.points = function renderPointsCard (message, windowId) {
  let currentValue = 'NO VALUE';
  if (message.card.value) {
    currentValue = `<em>ESTIMATED VALUE: ${desktop.utils.usdFormatSmall.format(message.card.value)}</em><br/>`;
  }
  if (message.card.action === 'got') {
    $('.chat_messages', windowId).append(`
      <div class="message pointsCard">
        <strong>${message.card.from} gave Good Buddy Points to ${message.card.to}</strong><br/>
        <strong>${desktop.utils.numberFormat.format(message.card.amount)} GOOD BUDDY POINTS</strong><br/>
        ${currentValue}
      </div>
      <br/>
    `);
  } else {
    let balance = desktop.utils.numberFormat.format(message.card.balance);
    if (message.card.balance === 0) {
      balance = 'ZERO';
    }
    $('.chat_messages', windowId).append(`
      <div class="message pointsCard">
        <strong>${message.card.buddyname}</strong><br/>
        <strong>${balance} GOOD BUDDY POINTS</strong><br/>
        ${currentValue}
      </div>
      <br/>
    `);
  }
}

// TODO: move each card to appropiate app context
desktop.ui.cards = {}
desktop.ui.cards.renderGbpCard = function renderGbpCard (message) {
  let currentValue = 'NO VALUE';
  if (message.card.value) {
    currentValue = `<em>ESTIMATED VALUE: ${desktop.utils.usdFormatSmall.format(message.card.value)}</em><br/>`;
  }
  if (message.card.action === 'got') {
    return `
      <div class="message pointsCard">
        <strong>${message.card.from} gave Good Buddy Points to ${message.card.to}</strong><br/>
        <strong>${desktop.utils.numberFormat.format(message.card.amount)} GOOD BUDDY POINTS</strong><br/>
        ${currentValue}
      </div>
      <br/>
    `;
  } else {
    let balance = desktop.utils.numberFormat.format(message.card.balance);
    if (message.card.balance === 0) {
      balance = 'ZERO';
    }
    return `
      <div class="message pointsCard">
        <strong>${message.card.buddyname}</strong><br/>
        <strong>${balance} GOOD BUDDY POINTS</strong><br/>
        ${currentValue}
      </div>
      <br/>
    `;
  }

};


// TODO: Move all commands.* HTML rendering functions to desktop.x.js ( not core desktop.js file )
desktop.commands = {};
desktop.commands.chat = {}

desktop.commands.chat.points = function chatPoints (message, windowId) {
  buddypond.getGbpBalance({ buddyname: buddypond.me}, function (err, balance){
    let points = 0;
    let value = 0;
    if (!balance.error) {
      points = balance.gbp;
      value = balance.expectedValue;
    }
    const pointsText = `
      <div class="help">
        <h3>Your current Good Buddy Points</h3>
        <span><a class="openApp" data-app="gbp" href="#openGBP">Show Market Data</a> | <a class="openApp" data-app="gbp" href="#openGBP">Show Balance</a> | <a class="openApp" data-app="gbp" href="#openGBP">Show Recent Transactions</a></span>
        <p>
          Current Good Buddy Points: ${desktop.utils.numberFormat.format(points)}
        </p
        <p>
          Estimated Value: ${desktop.utils.usdFormatSmall.format(value)}
        </p
      <div>
    `;

    $('.chat_messages', windowId).append(`<div class="chatMessage">${pointsText}</div>`);
    $('.no_chat_messages', windowId).hide();

    let el = $('.pond_message_main', windowId);
    $(el).scrollTop(999999);
  });
};

// TODO: move this out of desktop.js
desktop.commands.chat.buddyscript = function chatConsole (message, windowId, command) {
  if (!desktop.app.console._allowCommands[command]) {
    return false;
  }
  let icon = desktop.app.console._allowCommands[command].icon;
  let src = desktop.app.console._allowCommands[command].img || `desktop/assets/images/icons/icon_${icon}_64.png`;

  const consoleEvalText = `
    <div class="">
      <h3 class="lightMatrixGreen">🤖 Incoming BuddyScript 🤖</h3>
      <p>> Static Code Analysis: <span title="Safe to run">🟢</span> </p>
      <p>
       > ${message.from} has asked you to run a BuddyScript
      </p
      <br/>
      <p>
        <code title="Click to Run" class="buddyScript">${message.text}</code>
      </p
      <br/>
      <br/>
      <div>
        ${desktop.app.console._allowCommands[command].description || ''}
        <br/>
        <br/>
        <button class="runBuddyScript">🟣 Run ${message.text} <img src="${src}"/></button> <span class="description"></span>
      </div>
    <div>
  `;

  $('.chat_messages', windowId).append(`<div class="message incomingBuddyScript">${consoleEvalText}</div>`);
  $('.no_chat_messages', windowId).hide();

  let el = $('.pond_message_main', windowId);
  $(el).scrollTop(999999);
};

desktop.commands.chat.give = function givePoints (message, windowId) {
  let to = message.text.split(' ')[1];
  let amount = message.text.split(' ')[2];
  let text = message.text.split(' ')[3] || '';
  let yorn = confirm(`Give ${amount} to ${to}?\nPlease double check name and amount`);
  if (!yorn) {
    return true;
  }
  buddypond.giveGbp({ buddyname: to, amount: amount, text: text, messageType: message.type, messageTo: message.to }, function (err, transfer){
    let points = 0;
    if (transfer.error) {
      alert(transfer.message);
      return;
    }
  });
};

desktop.commands.chat.welcome = function welcomeMessage (params) {
  let windowId = params.windowId;

  let freshUserText = '';

  if (buddypond.me === 'anonymous') {
    freshUserText = `
    <br/>
    Hello new <strong>anonymous</strong> Buddy!
    You are currently logged in as the shared <em>anonymous account</em>.
    To logout of anonymous and get your own account <a href="#logout" class="logoutLink">click the key</a><a class="logoutLink" href="#logout"><img class="pointer" height="24" width="24" src="desktop/assets/images/icons/icon_login_64.png" /></a>
    <br/>`;
  }

  const welcomeText = `
    <div class="help">
      <h2 class="hidesHelp" title="Click To Hide">Welcome To Buddy Pond My Good Buddy</h2>
      <em>Cloud OS and Instant Messenger - Alpha Edition</em>
      <br/>
      <br/>
      <h3>What is this place?</h3>
      <p>Buddy Pond is the entire Desktop Experience ready right now in your browser. We are building a singular destination for making the Internet fun again.<br/>
</p>
      <br/>
      <h3>What can I do here?</h3>
      <p>
        Create, Play, Produce, Relax, Work, Learn, Teach, or just chill out and watch <a href="#" class="openApp" data-app="interdimensionalcable">Interdimensional Cable</a>. There is a lot you can do here. Click around a bit and see what you can discover.
        <br/>
        <br/>
      </p>
      <h3>Why do I already have Buddies?</h3>
      <p>In the Alpha, our good Buddy @Chris will automatically send Buddy Requests to nearby Buddies whenever you join a Pond. Have fun!</p>
      <br/>
      <h3><a href="#" class="openApp" data-app="faq">Check out our Frequently Asked Questions</a></h3>
      <a href="#" class="hidesHelp">Hide this message</a>
      <br/>
      To get chat help type: <code>/help</code> <br/>
      To see available BuddyScript commands type: <code>/bs</code> <br/>
      ${freshUserText}
      <br/>
    <div>
  `;

  $('.chat_messages', windowId).append(`<div class="message">${welcomeText}</div>`);
  $('.no_chat_messages', windowId).hide();
  let el = $('.message_main', windowId);
  $(el).scrollTop(999999);

}

desktop.commands.chat.help = function helpCommands (params) {
  let windowId = params.windowId;
  const commandSet = [
    {
      command: '/bs',
      additional: '',
      helpText: '- shows all available BuddyScript Commands'
    },
    {
      command: '/meme',
      helpText: '- sends Mnemosyne A.I. Powered meme'
    },
    {
      command: '/meme',
      additional: ' cool',
      helpText: '- A.I. Powered meme search'
    },
    {
      command: '/say',
      additional: ' hello world',
      helpText: '- speaks "hello world" to the chat'
    },
    {
      command: '/say',
      additional: ' 😇',
      helpText: '- speaks localized "smiling face with halo"'
    },
    {
      command: '/points',
      additional: '',
      helpText: '- your current amount of Good Buddy Points'
    },
    {
      command: '/points',
      additional: ' Randolph',
      helpText: '- shows how many Good Buddy Points Randolph has'
    },
    {
      command: '/give',
      additional: ' Randolph 10',
      helpText: '- gives Randolph 10 Good Buddy Points'
    },
    {
      command: '/roll',
      additional: ' 20',
      helpText: '- Rolls a d20 dice'
    },
    {
      command: '/quit',
      additional: ' message',
      
      helpText: '- logout of Buddy Pond Desktop'
    },
    {
      command: '/help',
      helpText: '- shows this help message'
    },
  ];

  const helpText = `
    <div class="help">
      <h2 class="hidesHelp" title="Click To Hide">Let's Help You My Good Buddy</h2>
      <br/>
      <p>
        The following chat text commands are available:
      </p>
      ${commandSet.map(item => `
        <div class="help-text">
          <div class="help-command">
            <i>${item.command}</i>${item.additional || ''}
          </div>
          <span class="help-description">&nbsp;${item.helpText}</span>
        </div>
      `).join('')}
      <br/>
    <div>
  `;

  $('.chat_messages', windowId).append(`<div class="message">${helpText}</div>`);
  $('.no_chat_messages', windowId).hide();
  let el = $('.message_main', windowId);
  $(el).scrollTop(999999);
  // desktop.play('WOOFWOOF-J.wav');
}

desktop.commands.preProcessMessage = function processInternalMessage (message, windowId) {

  // If the Pond is in Meme Mode only, it will take all text and convert them to memes!
  // TODO: 'Memes' is the hard-coded pond name, replace this with pond configuration settings property
  //       This will allow any pond to have 'Meme Mode' enabled or disabled
  if (message.to === 'Memes' && message.type === 'pond') {
    message.text = '/meme ' + message.text;
  }
  // TODO: 'Say' is the hard-coded pond name, replace this with pond configuration settings property
  //       This will allow any pond to have 'Say Mode' enabled or disabled
  if (message.to === 'Say' && message.type === 'pond') {
    message.text = '/say ' + message.text;
  }


  // don't process the message on the server if it's the help command
  // instead capture it and send back the immediate response text
  let command = message.text.split(' ');
  let first = message.text.substr(0, 1);
  command[0] = command[0].substr(1, command[0].length - 1);

  if (first === '\\') {
    if (desktop.app.console.isValidBuddyScript(command[0])) {
      // command is valid, do nothing, allow message to continue processing
    } else {
      alert('Invalid BuddScript. Will not send.');
      return true;
    }
  }

  if (first === '/') {
    // TODO: move pipe parsing logic to BuddyScript.parser(), etc
    let pipes = message.text.split('|');
    let output, context;
    // get current context of where buddyscript was run
    // Remark It's not code yet, it's "coode"
    // TODO: use win.data('type') and win.data('context')
    let arr = windowId.split('_');
    output = arr[1];
    context = arr[2];
    if (pipes.length && pipes.length > 1) {
      // TODO: allow N pipes
      let pipeCommandA =  pipes[1].split(' ');
      output = escape(pipeCommandA[1]);
      context = escape(pipeCommandA[2]);
    }
    let result = desktop.app.console.evalCoode(command[0], { message: message, windowId: windowId, output: output || '', context: context || '' })
    if (result) {
      return true;
    }
  }

  // don't allow buddies to send these commands out as executable
  if (command[0] === 'give') {
    desktop.commands.chat.give(message, windowId);
    return false;
  }

  if (command[0] === 'points' && command.length === 1) {
    desktop.commands.chat.points(message, windowId);
    // Remark: Must return true or /points message will get sent to server
    return true;
  }

  return false;
};

// processes a message which was just sent for any potential local desktop commands ( such as /quit )
desktop.commands.postProcessMessage = function postProcessMessage (message) {
  // Check if user wants to quit then log the user out
  const text = message.text.split(' ')[0];
  if (text === '/quit') {
    desktop.app.login.logoutDesktop();
  }
};

// TODO: move to messages.js file
desktop.smartlinks = {};
// TODO: Refactor youtube replacement logic, should be much smaller. single regex + query parser for ?t variable,
//       remove magic numbers and hardcoded variables
desktop.smartlinks.replaceYoutubeLinks = function (el) {
  let cleanText = el.html();

  if (cleanText) {
    let searchYouTubeLongLink = cleanText.search('https://www.youtube.com/watch?');
    let searchYouTubeShortLink = cleanText.search('https://youtu.be/');
    let youtubeLinkWithTime = '0';

    // if a youtube link was found, replace it with a link to open IDC with the video id
    if (searchYouTubeLongLink !== -1) {
      //If the youtube link is a Long link i.e., https://www.youtube.com/watch?
      let youtubeId = cleanText.substr(searchYouTubeLongLink + 32, 11);
      let youtubeVideoTime = cleanText.substr(searchYouTubeLongLink + 43, 13).split(' ')[0];
      let isValidYoutubeId = desktop.utils.isValidYoutubeID(youtubeId);
      let isValidYoutubeTime = desktop.utils.isValidYoutubeTime(youtubeVideoTime);

      if (isValidYoutubeTime) {
        /*
        if there is a time t. Format it to extract the numbers only. And fuse it in youtubeLinkWithTime
        >>> &amp;t=345s
        >  345
        */
        youtubeLinkWithTime = youtubeId + youtubeVideoTime;
        youtubeVideoTime = youtubeVideoTime.slice(7,-2);
      } else {
        youtubeLinkWithTime = youtubeId;
      }
      
      if (isValidYoutubeId) {
        /*
        replace the youtube URL by a hyperlink that open IDC.
        >>> https://www.youtube.com/watch?v1K4EAXe2oo&t=345s
        > youtube: v1K4EAXe2oo@345
        */
        let str = 'https://www.youtube.com/watch?v=' + youtubeLinkWithTime;
        cleanText = cleanText.replace(str, `<a title="Open Youtube IDC" class="openIDC youtubeSmartLink" href="#open_IDC" data-videoid="${youtubeId}" data-videot="${youtubeVideoTime}"><img alt="Youtube" title="Youtube" src="desktop/assets/images/icons/youtube-logo.png"/>${youtubeId}@${youtubeVideoTime}</a>`);
        el.last().html(cleanText);
      }
      return;
    }

    
    if (searchYouTubeShortLink !== -1) {
      //If the youtube link is Short i.e, https://youtu.be
      /*
      check if there is a time (t)
      and replace it with a link to open IDC with the video id and the start time t
      https://youtu.be/v1K4EAXe2oo?t=26
      */
      let youtubeId = cleanText.substr(searchYouTubeShortLink + 17, 11);
      let youtubeVideoTime = cleanText.substr(searchYouTubeShortLink + 28, 10).replace(/[\n\r]+/g, '').split(' ')[0];
      let isValidYoutubeId = desktop.utils.isValidYoutubeID(youtubeId);
      let isValidYoutubeTime = desktop.utils.isValidYoutubeTime(youtubeVideoTime);

      if (isValidYoutubeTime) {
        /*
        if there is a time t. Format it to extract the numbers only. And fuse it in youtubeLinkWithTime
        >>> ?=t345
        >  345
        */
        youtubeLinkWithTime = youtubeId + youtubeVideoTime;
        youtubeVideoTime = youtubeVideoTime.substring(3);
      } else {
        youtubeLinkWithTime = youtubeId;
      }
      if (isValidYoutubeId) {
        /*
        Replace the youtube URL by a hypelink that open IDC instead.
        >>> https://youtu.be/v1K4EAXe2oo?t=26
        > youtube: v1K4EAXe2oo 26
        */
        let str = 'https://youtu.be/' + youtubeLinkWithTime;
        cleanText = cleanText.replace(str, `<a title="Open Youtube IDC" class="openIDC youtubeSmartLink" href="#open_IDC" data-videoid="${youtubeId}" data-videot="${youtubeVideoTime}"><img alt="Youtube" title="Youtube" src="desktop/assets/images/icons/youtube-logo.png"/>${youtubeId}@${youtubeVideoTime}</a>`);
        el.last().html(cleanText);
      }
    }
  }
};

desktop.utils.isValidYoutubeID  = function isValidYoutubeID (str) {
  /* 
    youtube id can only have: 
    - Lowercase Letters (a-z) 
    - Uppercase Letters (a-z) 
    - Numbers (0-9)
    - Underscores (_)
    - Dashes (-)
  */
  const res = /^[a-zA-Z0-9_\-]+$/.exec(str);
  const valid = !!res;
  return valid;
};

desktop.utils.isValidYoutubeTime  = function isValidYoutubeTime (str) {
  /* 
    youtube time (T) can only: 
    - Start by "?t=" or by "&t="
    - Be followed by Numbers (0-9)
    - Finish by "s"
  */
  const res = /^&amp;t=\d+s|\?t=\d+$/.exec(str);
  const valid = !!res;
  return valid;
};
