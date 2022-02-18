desktop.soundcloud = {};

desktop.soundcloud.load = function loadSoundcloud () {
  var tag = document.createElement('script');
  // Remark: Do we need to use onload event here for more reliable embed?
  tag.onload = function() {
    var iframeElement   = document.querySelector('#soundcloudiframe');
    var iframeElementID = iframeElement.id;
    desktop.soundcloud.widget = SC.Widget(iframeElement);
    desktop.log('Soundcloud App', 'Embed Loaded');
  };
  tag.src = "desktop/assets/js/soundcloud.js";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  $('.ponderSoundcloud').on('click', function(){
    desktop.soundcloud.widget.play();
    desktop.soundcloud.widget.next();
  });
}

desktop.soundcloud.openWindow = function openWindow () {
  desktop.soundcloud.widget.play();
}

desktop.soundcloud.closeWindow = function closeWindow () {
  desktop.soundcloud.widget.pause();
}