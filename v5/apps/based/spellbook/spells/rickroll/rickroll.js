export default function rickroll (url) {
  // better to launch youtube app with videoID instead of redirecting to a URL
  this.bp.open('youtube', {
    // had to switch to kung-fu fighting because rick roll video "QiTXz6fALGc" won't embed...special case
    // can always use "forbiddenRickRoll" spell
    context: 'bmfudW7rbG0',
    autoplay: true,
    fullscreen: true
  });
}