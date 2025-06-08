export default function resizeFullVideo() {
    $('#snapsPreview').css('width', $('#window_mirror').css('width'));
    $('#snapsPreview').css('height', $('#window_mirror').css('height'));
  
    //$('#mirrorCanvasMe').css('width', $('#window_mirror').css('width'));
    //$('#mirrorCanvasMe').css('height', $('#window_mirror').css('height'));
  
    $('#mirrorCanvasMe').css('position', 'absolute');
    $('#mirrorCanvasMe').css('top', 0);
    $('#mirrorCanvasMe').css('left', 0);
  };