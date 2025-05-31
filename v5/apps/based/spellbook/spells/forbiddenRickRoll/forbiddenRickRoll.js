// plays the forbidden rick-roll
export default function forbiddenRickRoll () {
    bp.play('desktop/assets/audio/FORBIDDEN_RICKROLL.mp3', { tryHard: Infinity, repeat: true });
    bp.apps.desktop.setWallpaper('desktop/assets/images/misc/forbidden-rickroll.gif');
    //desktop.play('FORBIDDEN_RICKROLL.mp3', true);
    //desktop.app.wallpaper.stop();
    //$('#wallpaper').attr('src', 'desktop/assets/images/misc/forbidden-rickroll.gif');
    //$('#wallpaper').show();
    //$('#c').hide();
  };