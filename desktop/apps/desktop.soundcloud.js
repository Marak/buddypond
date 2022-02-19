desktop.soundcloud = {};

desktop.soundcloud.load = function loadSoundcloud () {
  $('.ponderSoundcloud').on('click', function(){
    desktop.soundcloud.widget.play();
    desktop.soundcloud.widget.next();
  });
  $('.selectPlaylist').on('change', function(){
    $('#soundcloudiframe').remove();
    $('#soundcloudplayer').html('');
    desktop.soundcloud.embeded = false;
    $('#window_soundcloud').show();
    desktop.soundcloud.openWindow($(this).val());
  })
  return true;
}

desktop.soundcloud.embeded = false;

desktop.soundcloud.openWindow = function openWindow (playlistID) {
  playlistID = playlistID || "1397493787"
  if (!desktop.soundcloud.embeded) {
    desktop.soundcloud.embeded = true;
    let str = `
      <iframe id="soundcloudiframe" width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/${playlistID}&color=%23df23e4&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/marak" title="marak" target="_blank" style="color: #cccccc; text-decoration: none;">marak</a> · <a href="https://soundcloud.com/marak/sets/buddy-pond-0" title="Buddy Pond 0" target="_blank" style="color: #cccccc; text-decoration: none;">Buddy Pond 0</a></div>
      `;
    $('#soundcloudplayer').append(str);
    $('#soundcloudiframe').on("load", function() {
      var tag = document.createElement('script');
      tag.onload = function() {
        var iframeElement   = document.querySelector('#soundcloudiframe');
        var iframeElementID = iframeElement.id;
        desktop.soundcloud.widget = SC.Widget(iframeElement);
        desktop.log('Soundcloud App', 'Embed Loaded');
        desktop.soundcloud.widget.play();
      };
      tag.src = "desktop/assets/js/soundcloud.js";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });
  }
}

desktop.soundcloud.closeWindow = function closeWindow () {
  desktop.soundcloud.widget.pause();
}