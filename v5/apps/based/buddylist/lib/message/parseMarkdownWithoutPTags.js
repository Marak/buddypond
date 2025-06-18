// Function to remove outer <p> tags
export default function parseMarkdownWithoutPTags(markdown) {
  if (!markdown) return ''; // empty text


  if (isEmojiOnly(markdown)) {
    return renderBigEmojiHTML(markdown);
  }

  // Supported colors and styles
  const supportedColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'white', 'gray', 'cyan', 'magenta', 'pink'];
  const supportedStyles = ['bold', 'italic', 'underline', 'strike', 'blink', 'reverse', 'hidden', 'dim', 'rainbow'];

  // Custom renderer for links to add target="_blank"
  const linkExtension = {
    name: 'link',
    level: 'inline',
    renderer(token) {
      // Ensure href is properly encoded
      const href = token.href.replace(/"/g, '&quot;');
      // Add target="_blank" and rel="noopener" for security
      return `<a href="${href}" target="_blank" rel="noopener">${this.parser.parseInline(token.tokens)}</a>`;
    }
  };


  const styleExtension = {
    name: 'style',
    level: 'inline',

    tokenizer(src) {
      const match = /^((?:\w+\.)*\w+)\(\s*([\s\S]+?)\s*\)/.exec(src);
      if (match) {
        const raw = match[0];
        const modifiers = match[1].split('.');
        const text = match[2];

        const isValid = modifiers.every(mod => supportedColors.includes(mod) || supportedStyles.includes(mod));
        if (!isValid) return;

        return {
          type: 'style',
          raw,
          modifiers,
          text,
          tokens: this.lexer.inlineTokens(text)
        };
      }
    },

    renderer(token) {
      let content = this.parser.parseInline(token.tokens);

      // Apply modifiers in reverse order to maintain proper nesting
      token.modifiers.reverse().forEach(mod => {
        if (supportedColors.includes(mod)) {
          content = `<span style="color: ${mod};">${content}</span>`;
        } else if (mod === 'bold') {
          content = `<strong>${content}</strong>`;
        } else if (mod === 'italic') {
          content = `<em>${content}</em>`;
        } else if (mod === 'underline') {
          content = `<u>${content}</u>`;
        } else if (mod === 'strike') {
          content = `<s>${content}</s>`;
        } else if (mod === 'blink') {
          // Using CSS animation instead of deprecated <blink> tag
          content = `<span style="animation: blink 1s step-start infinite;">${content}</span>`;
        } else if (mod === 'reverse') {
          content = content.split('').reverse().join('');
        } else if (mod === 'hidden') {
          content = `<span style="visibility: hidden;" onmouseover="this.style.visibility='visible'" onmouseout="this.style.visibility='hidden'">${content}</span>`;
        } else if (mod === 'dim') {
          content = `<span style="opacity: 0.5;">${content}</span>`;
        } else if (mod === 'rainbow') {
          content = content
            .split('')
            .map((char, i) => `<span style="color: hsl(${(i * 360) / content.length}, 100%, 50%);">${char}</span>`)
            .join('');
        }
      });

      return content;
    },

    walkTokens(token) {
      if (token.type === 'style') {
        console.log(`Detected style token: ${token.modifiers.join('.')}`);
      }
    }
  };

  marked.use({ extensions: [styleExtension, linkExtension] });

  let html;
  try {
    html = marked.parse(markdown);
  } catch (error) {
    html = markdown;
  }

  return html.replace(/^<p>(.*?)<\/p>\s*$/s, '$1');
  // Explanation:
  // ^<p>       → Matches the opening <p> at the start
  // (.*?)      → Captures the content inside (non-greedy)
  // <\/p>\s*$  → Matches the closing </p> with optional trailing whitespace
  // $1         → Returns only the captured content
}

// Shared helper: Split emoji-aware graphemes
function splitEmojiGraphemes(text) {
  const splitter = new GraphemeSplitter();
  return splitter.splitGraphemes(text.trim());
}

// Strip variation selector (U+FE0F) for matching against EMOJIS
function normalizeEmoji(str) {
  return str.replace(/\uFE0F/g, '');
}

function isEmojiOnly(text) {
  if (!text) return false;

  const graphemes = splitEmojiGraphemes(text);
  const emojiList = new Set(Object.keys(EMOJIS));

  const emojis = graphemes.filter(g => 
    emojiList.has(g) || emojiList.has(normalizeEmoji(g))
  );

  return emojis.length > 0 &&
    emojis.length <= 7 &&
    emojis.join('') === text.trim();
}

// Render big emoji HTML
function renderBigEmojiHTML(text) {
  const graphemes = splitEmojiGraphemes(text);
  return `<div class="emoji-only">` +
    graphemes.map(g => `<span class="big-emoji">${g}</span>`).join('') +
    `</div>`;
}