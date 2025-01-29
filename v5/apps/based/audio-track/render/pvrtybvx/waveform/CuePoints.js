function renderCuePoints(waveform, track, color = '#8a2be2', barWidth = 1, style = null) {
    //console.log('showCuePoint', waveform, track);
    let cuePoints = track.metadata.cuePoints || []; // could autofill here
    // console.log('found cuePoints:', cuePoints);
  
    if (!cuePoints.length) {
      // is {}?? could be old data...
      return;
    }
  
    cuePoints.forEach((cue, i) => {
  
      renderCuePoint(i, waveform, track, cue, style, color, barWidth);
    });
  }
  
  function renderCuePoint(i, waveform, track, cue, style = null, color = '#8a2be2', barWidth = 1) {
    //console.log('showCuePoint', waveform, track);
    //console.log('found cuePoints:', cuePoints);
  
    if (!style) {
      // create default style
      style = {
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid white',
        borderRadius: '5px',
        paddingLeft: '5px',
        paddingRight: '5px',
        marginLeft: '5px',
        // marginTop: '5px',
  
        lineHeight: '1em',
      }
    }
  
    barWidth = track.metadata.beatLength / 8;
  
    if (!cue || typeof cue.time !== 'number') {
      console.error('Invalid cue point:', cue);
      return
    }
  
    let cueTime = cue.time;
    let cuePoint = cue.point || (i + 1).toString();
    // let cuePoint = cue.point 
  
    let regionLabel = document.createElement('span');
    regionLabel.classList.add('region-label');
  
    // on click cueTo region
    regionLabel.addEventListener('click', function (ev) {
      let target = ev.target;
      let value = target.textContent;
      api.track.cueTo(track.id, value);
      ev.preventDefault();
      ev.stopPropagation();
      return false;
      //alert(value)
    });
  
    // apply custom style to regionLabel
    for (let key in style) {
      regionLabel.style[key] = style[key];
    }
  
    regionLabel.textContent = cuePoint;
  
    // let adjustedCueTime = cueTime - track.metadata.firstBeatOffset;
    let adjustedCueTime = cueTime;
  
    waveform.regions.addRegion({
      start: adjustedCueTime,
      end: adjustedCueTime + barWidth,  // Short duration to mark the snap point
      content: regionLabel,
      color: color,
      drag: false,
      resize: false,
    });
  }
  

  const CuePoints = {
    renderCuePoints,
    renderCuePoint
  };

  export default CuePoints;