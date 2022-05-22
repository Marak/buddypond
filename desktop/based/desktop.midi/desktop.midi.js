desktop.app.midi = {};
desktop.app.midi.label = 'Midi Setup';

desktop.app.midi.devices = {};
desktop.app.midi.currentInput = null;

desktop.app.midi.load = function loadmidiGames (params, next) {
  desktop.load.remoteAssets([
    'midi' // this loads the sibling desktop.app.midi.html file into <div id="window_midi"></div>
  ], function (err) {
    $('#window_midi').css('width', 777);
    $('#window_midi').css('height', 495);
    $('#window_midi').css('left', 50);
    $('#window_midi').css('top', 50);
    
    $('.midiInputDevice').on('change', function(){
      alert('new midi')
      alert($(this).val())
    });

    desktop.on('midi-message', "log-midi-data-to-console" , function(event){
      desktop.log('MIDI:', event)
    })

    var midi;
    var log = document.getElementById("midi-log");
    init();

    function init() {
      logText("Initializing MIDI...");
      if (!navigator.requestMIDIAccess) {
        alert('Could not connect to Web MIDI API.\nTry Opera or Chrome?\n')
      } else {
        navigator.requestMIDIAccess().then( onSuccess, onFailure ); //get midi access
      }
    }

    function onSuccess( access ) { 

      midi = access;
      var inputs = midi.inputs;

      logText("Found " + inputs.size + " MIDI input(s)");

      //connect to first device found
      if(inputs.size > 0) {
        var iterator = inputs.values(); // returns an iterator that loops over all inputs
        // console.log('iterator', iterator)
        for (let i = 0; i < inputs.size; i++) {
          var input = iterator.next().value; // get the first input
          logText("listing input: " + input.name);
          input.onmidimessage = handleMIDIMessage;
          desktop.app.midi.devices[input.name] = input;
          logText("Connected input: " + input.name);
          // desktop.app.midi.currentInput.onmidimessage = handleMIDIMessage;
          $('.midiInputDevice').append(`<li>✅ ${input.name}</li>`)
        }
      }
    }

    function onFailure( err ) {
      logText("MIDI Init Error. Error code: " + err.code);
      alert('Web MIDI Initialization error. Please see console logs.')
    }

    function handleMIDIMessage(event){

      desktop.emit('midi-message', event.data)
      //event.data & event.receivedTime are populated
      //event.data has 3 components:
      //0) The device id
      //1) The controller id
      //2) The controller value (typically in the range 0 - 127)

      if (event.data.length === 3) {
        logText('controller id: ' + event.data[1] +  ', value: ' + event.data[2]);
      }
    }

    function logText(str){
      log.innerHTML = str;
      //log.innerHTML += "<br>";
      //log.scrollTop = log.scrollHeight;
    }

    next();
  });
  
};

desktop.app.midi.openWindow = function openWindow () {
  return true;
};

desktop.app.midi.closeWindow = function closeWindow () {
  return true;
};