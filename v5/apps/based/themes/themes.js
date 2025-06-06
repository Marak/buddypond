export default class Themes {
  constructor(bp, options = {}) {
    this.bp = bp;

    // TODO: complete nyan and matrix themes
    // TODO: complete water theme
    this.themes = {
      'Light': {
        'wallpaper': {
          'name': 'solid',
          'color': '#000000'
        },
        'styles': {
          'window_top': {
            'background': 'linear-gradient(180deg, #666666, #353535)', /* Mac-like gradient */
            'color': '#e0e0e0'
          },
          'window_main': {
            'background': 'white',
            'color': '#181818'
          },
          'window_content': {
            'background': 'white',
            'color': '#181818'
          },
          'window_bottom': {
            'background': 'white',
            'color': '#181818'
          },
          'desktop_text': {
            'color': '#181818',
            'text-shadow': 'none'
          },
          'desktop_section': {
            'background': '#f9f9f9'
          },
          'desktop_headers': {
            'color': '#181818',
            'text-shadow': 'none'
          },
          'desktop_links': {
            'color': '#181818',
            'text-decoration': 'none'
          },
          'desktop_links_hover': {
            'color': '#181818',
            'text-decoration': 'underline'
          }
        }
      },
      'Dark': {
        'wallpaper': {
          'name': 'solid',
          'color': '#070709'
        },
        'styles': {
          'window_top': {
            'background': '#231c2f',
            'color': '#E3E3E3'
          },
          'window_main': {
            'background': '#1a1a1e',
            'color': '#E3E3E3'
          },
          'window_content': {
            'background': '#1a1a1e',
            'color': '#E3E3E3'
          },
          'window_bottom': {
            'background': '#181818',
            'color': '#E3E3E3'
          },
          'desktop_divider': {
            'background': '#242429',
          },
          'desktop_input': {
            'background': '#222327',
            'color': '#E3E3E3'
          },
          'desktop_text': {
            'color': '#ececed'
          },
          "desktop_element_hover": {
            'background': '#242428'
          },
          'desktop_section': {
            'background': '#242429',
            'color': '#E3E3E3'
          },
          'desktop_headers': {
            'color': '#E3E3E3',
            'text-shadow': 'none'
          },
          'desktop_links': {
            'color': '#E3E3E3',
            'text-decoration': 'none'
          },
          'desktop_links_hover': {
            'color': '#E3E3E3',
            'text-decoration': 'underline'
          }

        }
      },
      'Nyan': {
        'wallpaper': {
          'name': 'nyancat'
        },
        'styles': this.createGradientStyles('rainbow', 'hotpink')
      },
      'Hacker': {
        'wallpaper': {
          'name': 'matrix',
          'color': 'green'
        },
        'styles': {
          ...this.createGradientStyles('matrix', 'green'),
          'window_main': {
            'background': '#1a1a1e',
            'color': '#E3E3E3'
          },

          'desktop_input': {
            'background': '#222327',
            'color': 'green'
          },
          'desktop_text': {
            'color': 'green'
          },
          "desktop_element_hover": {
            'background': '#242428'
          }
        },
      },
      'Water': {
        'wallpaper': {
          'name': 'ripples'
        },
        'styles': this.createGradientStyles('ripples', 'white')
      }
    };

    // TODO: decide on theme mappings names for entire application
    this.themeMappings = {
      // maps abritary theme properties to css selector groups
      'property_name': 'whateverwtf .cssValue',
      // main window holder
      // TODO: try using generic elements at top-level for styles, etc, div, span, input, etc
      // then add more specific selectors for each UI element
      // create new CSS classes for UI theme properties instead of application specific selectors ( like buddyListHolder )
      // add support for minimal application specific selectors if needed
      'window_content': 'mainOverlay.div, .bp-window-content, .window-main, .buddyListHolder',
      'window_top': '.window-title-bar',
      'window_main': '.aim-window ',
      //'window_title_bar': '.window-title-bar',
      'desktop_top_bar': '#bar_top',
      'desktop_bottom_bar': '#bar_bottom',
      'desktop_input': 'input, textarea, select, label',
      'desktop_divider': '.aim-message-controls', // TODO: .desktop_divider
      'desktop_text': 'p .desktop-shortcuts-container span.title, .desktop-shortcuts-container-folder a, .buddyListHolder a',
      'desktop_headers': 'h1, h2, h3, h4, h5, h6',
      'desktop_element_hover': '.aim-chat-message:hover',
      'desktop_section': '.desktop-section',
      'inputs_text': 'input[type="text"]',
      'desktop_links': 'a',
      'desktop_links_hover': 'a:hover'
    };

  }

  init () {
      if (this.bp.settings.active_theme) {
        this.applyTheme(this.bp.settings.active_theme);
      }
  }

  createGradientStyles(gradientName, color) {
    return {
      'window_bar_top': {
        'background': '#181818',
        'color': '#E3E3E3'
      },
      'window_top': {
        'background': gradients[gradientName],
        'color': color
      },
      'window_main': {
        // 'background': gradients[gradientName],
        'color': color
      },
      'window_content': {
        // 'background': gradients[gradientName],
        'color': color
      },
      'window_bottom': {
        'background': gradients[gradientName],
        'color': color
      },
      'desktop_text': {
        'color': color
      },
      'background': {
        'background': '#0D1730'
      }
    };
  }

  applyTheme(themeName) {
    const theme = this.themes[themeName];
    if (!theme) return;

    // Remove any existing theme styles to prevent duplication
    const existingStyle = document.getElementById('dynamic-theme');
    if (existingStyle) existingStyle.remove();

    // Create a new <style> element
    const styleElement = document.createElement('style');
    styleElement.id = 'dynamic-theme';
    document.head.appendChild(styleElement);

    // Build CSS rules
    let cssRules = '';
    for (const prop in theme.styles) {
      const selector = this.themeMappings[prop];
      if (!selector) {
        console.log(`No mapping found for property: ${prop}`);
        continue;
      }

      // Handle regular styles
      const styles = theme.styles[prop];
      let styleString = '';
      for (const attr in styles) {
        // Convert camelCase to kebab-case (e.g., backgroundColor -> background-color)
        const cssAttr = attr.replace(/([A-Z])/g, '-$1').toLowerCase();
        styleString += `${cssAttr}: ${styles[attr]}; `;
      }

      // all styleString should be !important
      // this is important since theme CSS may be injected *before* the app CSS
      // this would mean the default app CSS would override the theme styles, which is not desired
      styleString = styleString.replace(/;/g, ' !important;');

      // Add regular selector styles
      cssRules += `${selector} { ${styleString} }\n`;

      // Handle hover styles for specific properties (e.g., desktop_element_hover)
      if (prop === 'desktop_element_hover') {
        cssRules += `${selector} { ${styleString} }\n`;
      }
    }

    // Apply wallpaper styles if present
    // Remark: Jun 5th, 2025 - Wallpapers are not part of theme styles anymore
    /*
    if (theme.wallpaper) {
      let wallPaperUrl = this.bp.get('wallpaper_url');
      if (!wallPaperUrl) {
        cssRules += `body { background: ${theme.wallpaper.color || ''}; }\n`; // Adjust based on your wallpaper logic
        this.bp.set('wallpaper_name', theme.wallpaper.name);
        if (theme.wallpaper.color) {
          this.bp.set('wallpaper_color', theme.wallpaper.color);
        }
      }
    }
    */

    // Inject CSS rules into the style element
    styleElement.textContent = cssRules;

    // Store the active theme
    this.bp.set('active_theme', themeName);
    //console.log('Applied theme:', themeName, cssRules);
  }

}

let gradients = {
  'rainbow': 'linear-gradient(90deg, rgb(255,0,0) 0%, rgb(143,221,53) 25%, rgb(47,201,226) 50%, rgb(140,16,245) 75%, rgb(255,0,0) 100%)',
  'matrix': 'linear-gradient(90deg, rgb(11,30,11) 0%, rgb(20,38,20) 20%, rgb(0,0,0) 50%, rgb(17,40,17) 80%, rgb(11,30,11) 100%)',
  'ripples': 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)'
};