// TODO: add the castSymbol to each item
// the following symbols are available: B.wepb, R.webp, W.webp, U.webp, G.webp
// the cast symbols follow magic the gathering card game type logic ( black, red, white, blue, green )
// each spell should uss the appropriate symbol for the spell, or combination of symbols
// ensure each item in spells, curses, memes has a castSymbol
export default {
    // Define spells and curses as objects with name, description, cost, costText, and config
    spells: [
      {
        name: 'zalgo',
        label: '👹 Zalgo',
        description: 'Corrupts text with chaotic glyphs.',
        cost: 10, // Low impact, simple text corruption
        costText: '🪙3',
        costSymbol: 'B.webp,B.webp',
        config: { targets: ['self', 'buddy'], intensity: { type: 'number', label: 'Intensity', value: 10, min: 1, max: 50 } },
      },
      /*
      {
        name: 'ebublio',
        description: 'Traps target in a bubble.',
        cost: 60, // Moderate impact, temporary containment
        costText: '🪙2',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 30, min: 10, max: 300 } },
      },
      */
      {
        name: 'cure',
        label: '💊 Cure',
        description: 'Removes a curse from the target.',
        cost: 20, // Moderate impact, beneficial effect
        costText: '🪙4',
        costSymbol: 'W.webp',
        config: { targets: ['self'] },
      },
      {
        name: 'rickroll',
        label: '🎵 Rickroll',
        description: 'Plays a classic prank video.',
        cost: 10, // Minimal impact, humorous
        costText: '🪙1',
        costSymbol: 'U.webp',

        config: { targets: ['self'], url: { type: 'text', label: 'Video URL', value: 'https://youtu.be/dQw4w9WgXcQ' } },
      },
      {
        name: 'forbiddenRickRoll',
        label: '🔒 Forbidden Rickroll',
        description: 'An inescapable prank video.',
        cost: 30, // Slightly higher due to "inescapable" nature
        costText: '🪙2',
        costSymbol: 'B.webp,U.webp,G.webp',

        config: { targets: ['self'] },
      },
      /*
      {
        name: 'passwordisusername',
        description: 'Forces a weak password reset.',
        cost: 150, // Significant system-level impact
        costText: '🪙3',
        config: {},
      },
      */
      {
        name: 'lightning',
        label: '⚡️ Lightning',
        description: 'Strikes with a dazzling bolt.',
        cost: 80, // Moderate impact, visually intense
        costText: '🪙3',
          costSymbol: 'R.webp',

        config: { targets: ['self', 'buddy', 'pond'], intensity: { type: 'number', label: 'Intensity', value: 5, min: 1, max: 10 } },
      },
      {
        name: 'fireball',
        label: '🔥 Fireball',
        description: 'Hurls a fiery projectile.',
        cost: 80, // Moderate impact, similar to lightning
        costText: '🪙3',
        costSymbol: 'R.webp',
        config: { targets: ['self', 'buddy', 'pond'], power: { type: 'number', label: 'Power', value: 5, min: 1, max: 10 } },
      },
      {
        name: 'earthquake',
        label: '🌍 Earthquake',
        description: 'Shakes the ground beneath.',
        cost: 80, // Moderate impact, similar to lightning
        costText: '🪙3',
        costSymbol: 'R.webp',
              costSymbol: 'R.webp,G.webp',

        config: { targets: ['self', 'buddy', 'pond'], magnitude: { type: 'number', label: 'Magnitude', value: 5, min: 1, max: 10 } }
      },
      {
        name: 'flood',
        label: '🌊 Flood',
        description: 'Covers the area in water.',
        cost: 80, // Moderate impact, similar to lightning
        costText: '🪙3',
              costSymbol: 'U.webp',

        config: { targets: ['self', 'buddy', 'pond'], depth: { type: 'number', label: 'Depth', value: 5, min: 1, max: 10 } }
      },
      // lightning, fireball, flood, vortex
      {
        name: 'vortex',
        label: '🌪️ Vortex',
        description: 'Creates a swirling wind.',
        cost: 80, // Moderate impact, similar to lightning
        costText: '🪙3',
              costSymbol: 'U.webp,R.webp',

        config: { targets: ['self', 'buddy', 'pond'], strength: { type: 'number', label: 'Strength', value: 5, min: 1, max: 10 } }
      },
      {
        name: 'barrelRoll',
        label: '🎢 Barrel Roll',
        description: 'Performs a barrel roll.',
        cost: 10, // Minimal impact, humorous
        costText: '🪙1',
              costSymbol: 'U.webp, R.webp',

        config: { targets: ['self', 'buddy', 'pond'] },
      },
      {
        name: 'alert',
        label: '📢 Alert',
        description: 'Displays a custom message.',
        cost: 10, // Minimal impact, simple message
        costText: '🪙1',
              costSymbol: 'W.webp',

        config: { targets: ['self', 'buddy'], text: { type: 'text', label: 'Message', value: 'You have been cursed!' } },
      },
      {
        name: 'logout',
        label: '🚪 Logout',
        description: 'Forces the target to log out.',
        cost: 250, // High impact, disrupts user session
        costText: '🪙5',
              costSymbol: 'B.webp',

        config: { targets: ['self'] }
      },
    ],
  
    curses: [
      /*
      {
        name: 'zalgo',
        description: 'Corrupts text with chaotic glyphs for a duration.',
        cost: 100, // Moderate impact, longer duration
        costText: '🪙3',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 60, min: 10, max: 300 } },
      },
      */
      {
        name: 'babel',
        label: '🗣️ Babel.js',
        description: 'Scrambles communication.',
        cost: 120, // Moderate impact, disrupts chat
        costText: '🪙3',
        costSymbol: 'B.webp,U.webp',
        config: { targets: ['self'], duration: { type: 'number', label: 'Curse Duration', value: 1, min: 1, max: 5 } },
      },
      {
        name: 'riddikulus',
        label: '😂 Riddikulus',
        description: 'Turns fears into something funny.',
        cost: 60, // Moderate impact, temporary and humorous
        costText: '🪙2',
      costSymbol: 'U.webp',
        config: {  targets: ['self'], duration: { type: 'number', label: 'Duration (seconds)', value: 1, min: 1, max: 5 } },
      },
      {
        name: 'antimagic-field',
        label: '🛡️ Antimagic Field',
        description: 'Blocks all magic for a duration.',
        cost: 200, // High impact, blocks all magic
        costText: '🪙5',
              costSymbol: 'W.webp',

        config: {}
      },
      /*
      {
        name: 'ebublio',
        description: 'Traps target in a bubble for a duration.',
        cost: 60, // Moderate impact, temporary containment
        costText: '🪙2',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 30, min: 10, max: 300 } },
      },
      {
        name: 'episkey',
        description: 'Heals minor injuries over time.',
        cost: 80, // Moderate impact, beneficial but timed
        costText: '🪙2',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 60, min: 10, max: 300 } },
      },
      {
        name: 'rickroll',
        description: 'Plays a prank video repeatedly.',
        cost: 50, // Low impact, repetitive prank
        costText: '🪙1',
        config: { url: { type: 'text', label: 'Video URL', value: 'https://youtu.be/dQw4w9WgXcQ' } },
      },
      {
        name: 'forbiddenRickRoll',
        description: 'An inescapable prank video for a duration.',
        cost: 80, // Moderate impact, timed prank
        costText: '🪙2',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 60, min: 10, max: 300 } },
      },
      {
        name: 'passwordisusername',
        description: 'Forces a weak password for a duration.',
        cost: 200, // High impact, security-related
        costText: '🪙3',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 300, min: 60, max: 3600 } },
      },
      {
        name: 'logout',
        description: 'Forces logout for a duration.',
        cost: 300, // High impact, timed session disruption
        costText: '🪙5',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 300, min: 60, max: 3600 } },
      },
      */
      {
        name: 'banhammer',
        label: '🔨 Banhammer',
        description: 'Temporarily bans the target.',
        cost: 1000, // Most powerful, severe impact
        costText: '🪙10',
              costSymbol: 'W.webp,B.webp',

        config: { duration: { type: 'number', label: 'Ban Duration (seconds)', value: 600, min: 300, max: 86400 } },
      },
    ],
  
    memes: [
      {
        name: 'chicken-jockey',
        label: '🐔 Chicken Jockey',
        description: 'Summons a chicken jockey.',
        cost: 10, // Minimal impact, humorous
        costText: '🪙1',
              costSymbol: 'G.webp',

        config: { targets: ['self', 'buddy', 'pond'], duration: { type: 'number', label: 'Duration (seconds)', value: 5, min: 1, max: 10 } },
      },
      {
        name: 'hamster-dance',
        label: '🐹 Hamster Dance',
        description: 'Plays a funny hamster dance sound.',
        cost: 10, // Minimal impact, humorous sound
        costText: '🪙1',
              costSymbol: 'G.webp',

        config: { targets: ['self', 'buddy', 'pond'], volume: { type: 'number', label: 'Volume', value: 5, min: 1, max: 10 } },
      },
      {
        name: 'cappuccino-assassino',
        label: '☕ Cappuccino Assassino',
        description: 'Summons a cappuccino assassin.',
        cost: 10, // Minimal impact, humorous
        costText: '🪙1',
              costSymbol: 'B.webp, R.webp',

        config: { targets: ['self', 'buddy', 'pond'], duration: { type: 'number', label: 'Duration (seconds)', value: 5, min: 1, max: 10 } },
      },
      {
        name: 'peanut-butter-jelly-time',
        label: '🍞 Peanut Butter Jelly Time',
        description: 'Plays a funny peanut butter jelly time sound.',
        cost: 10, // Minimal impact, humorous sound
        costText: '🪙1',
              costSymbol: 'R.webp, G.webp',

        config: { targets: ['self', 'buddy', 'pond'], volume: { type: 'number', label: 'Volume', value: 5, min: 1, max: 10 } },
      },
      /*
      {
        name: 'helicopter',
        label: '🚁 Helicopter',
        description: 'Plays a funny helicopter meme sound.',
        cost: 10, // Minimal impact, humorous sound
        costText: '🪙1',
        config: { targets: ['self', 'buddy', 'pond'], volume: { type: 'number', label: 'Volume', value: 5, min: 1, max: 10 } },
      },
      {
        name: 'price-is-wrong',
        label: '🎺 Price is Wrong',
        description: 'Plays a sad trombone sound.',
        cost: 10, // Minimal impact, humorous sound
        costText: '🪙1',
        config: { targets: ['self', 'buddy', 'pond'], volume: { type: 'number', label: 'Volume', value: 5, min: 1, max: 10 } },
      },
      {
        name: 'airhorn',
        label: '📣 Airhorn',
        description: 'Plays an airhorn sound.',
        cost: 10, // Minimal impact, humorous sound
        costText: '🪙1',
        config: { targets: ['self', 'buddy', 'pond'], volume: { type: 'number', label: 'Volume', value: 5, min: 1, max: 10 } },
      },
      {
        name: 'doge',
        label: '🐶 Doge',
        description: 'Plays a funny doge meme sound.',
        cost: 10, // Minimal impact, humorous sound
        costText: '🪙1',
        config: { targets: ['self', 'buddy', 'pond'], volume: { type: 'number', label: 'Volume', value: 5, min: 1, max: 10 } },
      },
      */
    ],
  };