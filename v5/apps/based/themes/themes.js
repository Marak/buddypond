import dark from './themes/dark.js';
import light from './themes/light.js';

console.log('Themes module loaded', dark);
export default class Themes {
  constructor(bp, options = {}) {
    this.bp = bp;

    this.themes = {
      'Light': light,
      'Dark': dark
    };

    // Mapping of theme property names to logical selectors
    this.themeMappings = {
      'window_content': 'mainOverlay.div, .bp-window-content, .window-main, .buddyListHolder',
      'window_top': '.window-title-bar',
      /* 'window_main': '.aim-window ', */
      'desktop_top_bar': '#bar_top',
      'desktop_bottom_bar': '#bar_bottom',
      'desktop_input': 'input, textarea, select, label',
      'desktop_button': 'button',
      'desktop_divider': '.aim-message-controls',
      'desktop_text': 'p .desktop-shortcuts-container span.title, .desktop-shortcuts-container-folder a, .buddyListHolder a',
      'desktop_headers': 'h1, h2, h3, h4, h5, h6',
      'desktop_element': '.aim-hover-menu, .desktop-element',
      'desktop_element_hover': '.aim-chat-message:hover, .aim-hover-menu:hover',
      'desktop_section': '.desktop-section',
      'desktop_menu_bar': '.desktop-menu-bar',
      'inputs_text': 'input[type="text"]',
      'desktop_links': 'a',
      'desktop_links_hover': 'a:hover',
      'desktop_overlay': '.desktop-overlay, .bp-file-explorer-drag-upload',
      'ui_table': 'table',
      'ui_table_row_even': 'table tr:nth-child(even)'
    };
  }

  init() {
    const themePref = this.bp.settings.active_theme || 'Light';
    if (themePref) {
      const customTheme = this.bp.settings.custom_theme;
      const theme = themePref === 'Custom' ? customTheme : this.themes[themePref];
      if (theme) {
        console.log('Applying theme:', theme.name || themePref);
        this.applyTheme(theme);
      }
    }
  }

  applyTheme(themeInput) {
    const theme = typeof themeInput === 'object' ? themeInput : this.themes[themeInput];
    const themeName = typeof themeInput === 'object' ? themeInput.name || 'Custom' : themeInput;

    if (!theme) return;

    if (themeName === 'Custom') {
      this.bp.set('custom_theme', theme);
    }

    this.bp.set('active_theme', themeName);

    // Remove existing <style> elements
    document.getElementById('dynamic-theme')?.remove();

    // Create and inject CSS variables as :root
    const css = this.generateThemeCSSVariables(theme);
    console.log('Generated CSS for theme:', themeName, css);
    const styleEl = document.createElement('style');
    styleEl.id = 'dynamic-theme';
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    console.log(`Applied theme "${themeName}" using CSS variables.`);
  }

  generateThemeCSSVariables(theme) {
    let css = `:root {\n`;
    for (const prop in theme.styles) {
      const styleObj = theme.styles[prop];
      for (const key in styleObj) {
        const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        const cssVar = `--${prop}-${kebabKey}`;
        css += `  ${cssVar}: ${styleObj[key]};\n`;
      }
    }
    css += `}`;
    return css;
  }
}

let gradients = {
  'rainbow': 'linear-gradient(90deg, rgb(255,0,0) 0%, rgb(143,221,53) 25%, rgb(47,201,226) 50%, rgb(140,16,245) 75%, rgb(255,0,0) 100%)',
  'matrix': 'linear-gradient(90deg, rgb(11,30,11) 0%, rgb(20,38,20) 20%, rgb(0,0,0) 50%, rgb(17,40,17) 80%, rgb(11,30,11) 100%)',
  'ripples': 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)'
};