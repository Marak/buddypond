export default function renderGeoFlag(message) {
    if (message.location === 'outer space' || !message.location) {
      // Set Antarctica to the default flag when the location is 'outer space'
      message.location = 'AQ';
    }
  
    if (!message.location || message.location === 'outer space') {
      return document.createElement('span');  // Return an empty span if no flag should be displayed
    }
  
    // Create an image element for the flag
    let img = document.createElement('img');
    img.className = 'geoFlag';
    img.src = `desktop/assets/geo-flags/flags/4x3/${message.location.toLowerCase()}.svg`;
    return img;
  }
  