// please no
export default function castZalgoSpell (timeOut) {
    console.log('tttt', timeOut)
    if (timeOut === 0) {
        timeOut = 9999;
    }
    $('span, label, a').each(function (i, item) {
      //if ($(this).css('display') === 'block') {
        $(this).attr('data-og-zalgo', $(this).html());
        $(this).html(_zalgo($(this).html()));
        $(this).addClass('rainbowFast');
      //}
    });


    setTimeout(function(){
        $('span, label, a').each(function (i, item) {
            //if ($(this).css('display') === 'block') {
              $(this).html($(this).attr('data-og-zalgo'));
              $(this).removeClass('rainbowFast');
            //}
          });
    }, timeOut)

  }; 
  
  // he comes
  let _zalgo = function zalgo (text, options) {
    text = text || '   he is here   ';
    let soul = {
      'up': [
        '̍', '̎', '̄', '̅',
        '̿', '̑', '̆', '̐',
        '͒', '͗', '͑', '̇',
        '̈', '̊', '͂', '̓',
        '̈', '͊', '͋', '͌',
        '̃', '̂', '̌', '͐',
        '̀', '́', '̋', '̏',
        '̒', '̓', '̔', '̽',
        '̉', 'ͣ', 'ͤ', 'ͥ',
        'ͦ', 'ͧ', 'ͨ', 'ͩ',
        'ͪ', 'ͫ', 'ͬ', 'ͭ',
        'ͮ', 'ͯ', '̾', '͛',
        '͆', '̚',
      ],
      'down': [
        '̖', '̗', '̘', '̙',
        '̜', '̝', '̞', '̟',
        '̠', '̤', '̥', '̦',
        '̩', '̪', '̫', '̬',
        '̭', '̮', '̯', '̰',
        '̱', '̲', '̳', '̹',
        '̺', '̻', '̼', 'ͅ',
        '͇', '͈', '͉', '͍',
        '͎', '͓', '͔', '͕',
        '͖', '͙', '͚', '̣',
      ],
      'mid': [
        '̕', '̛', '̀', '́',
        '͘', '̡', '̢', '̧',
        '̨', '̴', '̵', '̶',
        '͜', '͝', '͞',
        '͟', '͠', '͢', '̸',
        '̷', '͡', ' ҉',
      ],
    };
    let all = [].concat(soul.up, soul.down, soul.mid);
  
    function randomNumber (range) {
      let r = Math.floor(Math.random() * range);
      return r;
    }
  
    function isChar (character) {
      let bool = false;
      all.filter(function (i) {
        bool = (i === character);
      });
      return bool;
    }
  
  
    function heComes (text, options) {
      let result = '';
      let counts;
      let l;
      options = options || {};
      options['up'] =
        typeof options['up'] !== 'undefined' ? options['up'] : true;
      options['mid'] =
        typeof options['mid'] !== 'undefined' ? options['mid'] : true;
      options['down'] =
        typeof options['down'] !== 'undefined' ? options['down'] : true;
      options['size'] =
        typeof options['size'] !== 'undefined' ? options['size'] : 'maxi';
      text = text.split('');
      for (l in text) {
        if (isChar(l)) {
          continue;
        }
        result = result + text[l];
        counts = { 'up': 0, 'down': 0, 'mid': 0 };
        switch (options.size) {
        case 'mini':
          counts.up = randomNumber(4);
          counts.mid = randomNumber(2);
          counts.down = randomNumber(4);
          break;
        case 'maxi':
          counts.up = randomNumber(4) + 3;
          counts.mid = randomNumber(4) + 1;
          counts.down = randomNumber(16) + 3;
          break;
        default:
          counts.up = randomNumber(8) + 1;
          counts.mid = randomNumber(6) / 2;
          counts.down = randomNumber(8) + 1;
          break;
        }
  
        let arr = [ 'up', 'mid', 'down' ];
        for (let d in arr) {
          let index = arr[d];
          for (let i = 0; i <= counts[index]; i++) {
            if (options[index]) {
              result = result + soul[index][randomNumber(soul[index].length)];
            }
          }
        }
      }
      return result;
    }
    // don't summon him
    return heComes(text, options);
  };
  