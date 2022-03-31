desktop.app.streamsquad = {};
desktop.app.streamsquad.label = 'streamsquad';

desktop.app.streamsquad.streamers = {
  'Marak': {
    'description': 'DJ Sets, Live Coding, Buddy Pond QA',
    'homepage': 'https://www.youtube.com/user/MarakSquires'
  },
  'SkratchBastidTV': {
    'description': 'DJ Sets',
    'homepage': 'https://www.youtube.com/user/SkratchBastidTV'
  },
  'Andrew Potthast': {
    'description': 'DJ Sets',
    'homepage': 'https://soundcloud.com/andrew-potthast'
  }
};

desktop.app.streamsquad.openStream = function (data) {
  if (data && data.link) {
    // TODO: separate function in streamsquad
    //console.log('ddd', data)
    let videoId = data.link.replace('https://www.youtube.com/watch?v=', '');
    //console.log('vvv', videoId)
    desktop.ui.openWindow('interdimensionalcable', { videoId: videoId, title: data.name + ' is LIVE' });
  }
};

desktop.app.streamsquad.renderStreamersList = function (currentStreamer) {
  $('.streamersTable tbody').html('');
  for (let s in desktop.app.streamsquad.streamers) {
    let streamer = desktop.app.streamsquad.streamers[s];
    let onlineStatus = '🟠';
    let onlineStatusText = 'OFFLINE';
    if (s === currentStreamer) {
      onlineStatus = '🟢';
      onlineStatusText = 'ONLINE';
    }
    $('.streamersTable tbody').append(`
      <tr>
        <td>${onlineStatus}</td>
        <td>${onlineStatusText}</td>
        <td>${s}</td>
        <td>${streamer.description}</td>
        <td><a href="${streamer.homepage}" target="_blank">Subscribe</a></td>
      </tr>
    `);
  }
};

desktop.on('streamer-is-offline', 'render-streamer-list', function (data) {
  // console.log('streamer-is-offline')
  if (!desktop.app.streamsquad.offline) {
    desktop.app.streamsquad.offline = true;
    desktop.app.streamsquad.renderStreamersList(null);
    $('.isStreamingNow').hide();
    $('.nextStreamSoon').show();
  } else {
    // do nothing, do not re-render DOM with no new information
  }
});

desktop.on('streamer-is-online', 'open-streamsquad-with-streamer', function (data) {
  // console.log('streamer-is-online')
  // check to see if stream is already open or user already closed the window
  desktop.app.streamsquad.offline = false;
  if (desktop.app.streamsquad.streamers[data.name]) {
    // console.log("EE: stream-is-registered locally", data);
    // check to see if ctime is fresh
    let previousStream = desktop.app.streamsquad.streamers[data.name];
    if (previousStream.ctime !== data.ctime) {
      // console.log("EE: stream-is-online-reconnect", data);
      desktop.app.streamsquad.streamers[data.name] = data;
      desktop.app.streamsquad.openStream(data);
      desktop.app.streamsquad.renderStreamersList(data.name);
      $('.isStreamingNow').show();
      $('.nextStreamSoon').hide();
      let videoId = data.link.replace('https://www.youtube.com/watch?v=', '');
      $('.openIDC', '#window_streamsquad').data('videoid', videoId);
      // update UI to show streamer
    }
    //    console.log('previousStream', previousStream.ctime, 'new stream', data.ctime)
  } else {
    // console.log("EE: stream-is-online", data);
    desktop.app.streamsquad.streamers[data.name] = data;
    desktop.app.streamsquad.openStream(data);
    desktop.app.streamsquad.renderStreamersList(data.name);
    $('.isStreamingNow').show();
    $('.nextStreamSoon').hide();
  }
});

desktop.app.streamsquad.load = function loadstreamsquadGames (params, next) {
  desktop.load.remoteAssets([
    'streamsquad' // this loads the sibling desktop.app.streamsquad.html file into <div id="window_streamsquad"></div>
  ], function (err) {
    $('#window_streamsquad').css('width', 662);
    $('#window_streamsquad').css('height', 495);
    $('#window_streamsquad').css('left', 50);
    $('#window_streamsquad').css('top', 50);
    $('.isStreamingNow').hide();
    desktop.app.streamsquad.renderStreamersList(null);
    next();
  });
};

desktop.app.streamsquad.openWindow = function openWindow () {
  return true;
};

desktop.app.streamsquad.closeWindow = function closeWindow () {
  return true;
};