export default function createGif (delay) {
    let gif = new GIF({
      workers: 2,
      quality: 3,
      width: 320,
      height: 240
    });
  
    gif.on('finished', function (blob) {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        let base64data = reader.result;
        // console.log('base64data', base64data);
        $('#snapsPreview').attr('src', base64data);
      };
    });
  
    // TODO: closer ref?
    $('.gifFrames img', this.cameraWindow.content).each(function (i, e) {
      // console.log("adding frames to gif", e, delay);
      gif.addFrame(e, { delay: delay });
    });
  
    gif.render();
  };