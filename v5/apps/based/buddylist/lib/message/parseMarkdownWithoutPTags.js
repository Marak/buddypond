// Function to remove outer <p> tags
export default function parseMarkdownWithoutPTags(markdown) {

    /*
    const customElementExtension = {
      extensions: [{
        name: 'custom-element',
        level: 'inline', // or 'block' depending on your element
        start(src) { return src.match(/::custom::/)?.[0].length; },
        tokenizer(src, tokens) {
          const match = src.match(/::custom::(.*?)::custom::/);
          if (match) {
            return {
              type: 'custom-element',
              raw: match[0],
              text: match[1].trim(),
            };
          }
        },
        renderer(token) {
          return `<h1>${token.text}</h1>`;
        }
      }], 
    };
  
    // Apply the custom tokenizer and renderer
    marked.use(customElementExtension);
    */
  
  
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
    
    let html = marked.parse(markdown);
  
    return html.replace(/^<p>(.*?)<\/p>\s*$/s, '$1');
    // Explanation:
    // ^<p>       → Matches the opening <p> at the start
    // (.*?)      → Captures the content inside (non-greedy)
    // <\/p>\s*$  → Matches the closing </p> with optional trailing whitespace
    // $1         → Returns only the captured content
  }