//Midi Fighter - Javascript
//by Adam Prinz

//Load soundbank with samples
var sample = [
  new Audio('Samples/bpm150_halftime03_drums.wav'),
  new Audio('Samples/Car%20Lock.wav'),
  new Audio('Samples/fin%20sad%20machine%201.wav'),
  new Audio('Samples/fin%20sad%20machine.wav'),
  new Audio('Samples/Dolphin%20Sound%20Effect.mp3'),
  new Audio('Samples/Freeze%2036-Audio-1.wav'),
  new Audio('Samples/Freeze%2036-Audio-2.wav'),
  new Audio('Samples/Freeze%2036-Audio-3.wav'),
  new Audio('Samples/Freeze%2036-Audio-4.wav'),
  new Audio('Samples/Freeze%2036-Audio-5.wav'),
  new Audio('Samples/Freeze%2036-Audio-6.wav'),
  new Audio('Samples/Freeze%2036-Audio-7.wav'),
  new Audio('Samples/Freeze%2037-Audio.wav'),
  new Audio('Samples/Freeze%20Sad%20Machine%20Riff.wav'),
  new Audio('Samples/High%20Key%20Remade.wav'),
  new Audio('Samples/High%20Test%201%20Ryn.wav'),
  new Audio('Samples/highs%20ryn.wav'),
  new Audio('Samples/isolated%20ohana.wav'),
  new Audio('Samples/Ryn%20Weaver%20-%20OctaHate%20(Pusher%20Flip).mp3'),
  new Audio('Samples/thanksverymach.wav'),
  new Audio('Samples/throw%20some.wav'),
  new Audio('Samples/pikachu.wav'),
  new Audio('Samples/Conga.wav'),
  new Audio('Samples/Triangle.wav'),
  new Audio('Samples/Clap.wav')
];


//Prep the light show
var hue, num, lightshow;


function getRandomColor() {
    hue = Math.floor(Math.random() * (360 - 0)) + 0;
}

function getRandomShow() {
    lightshow = [
      lightshow1,
      lightshow2,
      lightshow3
    ]
    num = Math.floor(Math.random() * (3 - 0) + 0);
    lightshow[num]();
}


function lightshow1() {
  getRandomColor();
  for (var i = event.which - 25; i <= 89; i+= 5) {
    if (i >= 65 && i <= 89) {
      document.getElementById(i).style.background = 'hsl(' + hue + ', 60%, 64%)';
      document.getElementById(i).style.borderColor = 'hsl(' + hue + ', 83%, 64%)';
    }
  }
}

function lightshow2() {
  getRandomColor();
  for (var i = event.which - 1; i <= event.which + 1; i+= 1) {
    if (i >= 65 && i <= 89) {
      document.getElementById(i).style.background = 'hsl(' + hue + ', 60%, 64%)';
      document.getElementById(i).style.borderColor = 'hsl(' + hue + ', 83%, 64%)';
    }
  }

  for (var i = event.which - 5; i <= event.which + 5; i+= 5) {
    if (i >= 65 && i <= 89) {
      document.getElementById(i).style.background = 'hsl(' + hue + ', 60%, 64%)';
      document.getElementById(i).style.borderColor = 'hsl(' + hue + ', 83%, 64%)';
    }
  }
}

function lightshow3() {
  getRandomColor();
  for (var i = event.which - 4; i <= event.which + 4; i+= 4) {
    if (i >= 65 && i <= 89) {
      document.getElementById(i).style.background = 'hsl(' + hue + ', 60%, 64%)';
      document.getElementById(i).style.borderColor = 'hsl(' + hue + ', 83%, 64%)';
    }
  }

  for (var i = event.which - 6; i <= event.which + 6; i+= 6) {
    if (i >= 65 && i <= 89) {
      document.getElementById(i).style.background = 'hsl(' + hue + ', 60%, 64%)';
      document.getElementById(i).style.borderColor = 'hsl(' + hue + ', 83%, 64%)';
    }
  }
}

//Play or stop sample on key action
//Plus lightshow
document.addEventListener('keydown', function(event) {
    if (event.which >= 65 && event.which <= 89) {
      sample[event.which - 65].play();
      getRandomColor();
      document.getElementById(event.which).style.background = 'hsl(' + hue + ', 60%, 64%)';
      document.getElementById(event.which).style.borderColor = 'hsl(' + hue + ', 70%, 64%)';
      getRandomShow();
    }
});

document.addEventListener('keyup', function(event) {
    if (event.which >= 65 && event.which <= 89) {
      sample[event.which - 65].pause();
      sample[event.which - 65].currentTime = 0;
      for(var i = 65; i <= 89; i++) {
        document.getElementById(i).style.background = '#eff8ff';
        document.getElementById(i).style.borderColor = '#bdbdbd';
      }
    }
});
