export default function ensureColorInt(color) {

  if (!color) {
    return color;
  }

  // Mapping of common color names to hex values
  const colorNameToHex = {
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
    black: '#000000',
    white: '#FFFFFF',
    yellow: '#FFFF00',
    purple: '#800080',
    orange: '#FFA500',
    pink: '#FFC0CB',
    indigo: '#4B0082',
    violet: '#EE82EE',
    // Add more common colors as needed
  };

  // If color is already a number, return it as is
  if (typeof color === 'number') {
    return color;
  }

  // If color is a hex string (with #), convert it to an integer
  if (typeof color === 'string' && color.startsWith('#')) {
    return parseInt(color.replace('#', ''), 16);
  }

  // If color is a common color name, convert it using the mapping
  if (typeof color === 'string' && colorNameToHex[color.toLowerCase()]) {
    return parseInt(colorNameToHex[color.toLowerCase()].replace('#', ''), 16);
  }

  // If color format is unrecognized, throw an error or return a default color
  console.error('Unrecognized color format:', color);
  return parseInt('000000', 16); // Default to black
}