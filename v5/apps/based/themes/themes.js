export default class Themes {
    constructor(bp, options = {}) {
      this.themes = {
        'Light': {
          'wallpaper': {
            'name': 'solid',
            'color': '#E3E3E3'
          },
          'styles': {
            'window_bar_top': {
              'background': '#E3E3E3',
              'color': '#181818'
            },
            'window_top': {
              'background': '#E3E3E3',
              'color': '#181818'
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
            }
          }
        },
        'Dark': {
          'wallpaper': {
            'name': 'solid',
            'color': '#181818'
          },
          'styles': {
            'window_bar_top': {
              'background': '#181818',
              'color': '#E3E3E3'
            },
            'window_top': {
              'background': '#181818',
              'color': '#E3E3E3'
            },
            'window_main': {
              'background': '#181818',
              'color': '#E3E3E3'
            },
            'window_content': {
              'background': '#181818',
              'color': '#E3E3E3'
            },
            'window_bottom': {
              'background': '#181818',
              'color': '#E3E3E3'
            },
            'desktop_text': {
              'color': '#E3E3E3'
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
          'styles': this.createGradientStyles('matrix', 'green')
        },
        'Water': {
          'wallpaper': {
            'name': 'ripples'
          },
          'styles': this.createGradientStyles('ripples', 'white')
        }
      };
      this.themeMappings = {
        'property_name': 'whateverwtf .cssValue',
        'desktop_top_bar': '#bar_top',
        'desktop_bottom_bar': '#bar_bottom',
        'desktop_text': '.desktop-shortcuts-container span.title, .desktop-shortcuts-container-folder a',
        'inputs_text': 'input[type="text"]'
      };
     
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
          'background': gradients[gradientName],
          'color': color
        },
        'window_content': {
          'background': gradients[gradientName],
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
  
      for (const prop in theme.styles) {
        for (const attr in theme.styles[prop]) {
          $(this.themeMappings[prop]).css(attr, theme.styles[prop][attr]);
        }
      }
  
      if (theme.wallpaper) {
        //alert(`wallpaper_name: ${theme.wallpaper.name}`);
        bp.set('wallpaper_name', theme.wallpaper.name);
        if (theme.wallpaper.color) {
          //alert(`wallpaper_color: ${theme.wallpaper.color}`);
          bp.set('wallpaper_color', theme.wallpaper.color);
        }
      }
    }
  }
  
  let gradients = {
    'rainbow': 'linear-gradient(90deg, rgb(255,0,0) 0%, rgb(143,221,53) 25%, rgb(47,201,226) 50%, rgb(140,16,245) 75%, rgb(255,0,0) 100%)',
    'matrix': 'linear-gradient(90deg, rgb(11,30,11) 0%, rgb(20,38,20) 20%, rgb(0,0,0) 50%, rgb(17,40,17) 80%, rgb(11,30,11) 100%)',
    'ripples': 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)'
  };