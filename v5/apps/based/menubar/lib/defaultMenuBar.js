export default function defaultMenuBar(bp) {

  // Ported from Legacy bp v4
  let selectMusicPlaylist2 = `
    <select name="selectPlaylist" class="selectPlaylist float_right">
    <option>Select music playlist...</option>
    <option value="1397230333">Buddy House 0 ( 33 Tracks )</option>
    <option value="1397493787">Buddy House 1 ( 10 Tracks )</option>
    <option value="1427128612">Buddy House 2 ( 10 Tracks )</option>
    </select>
    `;


      let selectMusicPlaylist = `
<div class="dropdown-wrapper float_right select-playlist-dropdown-menu">
  <span class="icon trigger" title="Select Music Playlist">
    <i class="fa-duotone fa-regular fa-music"></i> Select Music Playlist
  </span>
  <ul class="dropdown-menu" style="display: none;">
    <li data-value="1397230333">Buddy House 0 (33 Tracks)</li>
    <li data-value="1397493787">Buddy House 1 (10 Tracks)</li>
    <li data-value="1427128612">Buddy House 2 (10 Tracks)</li>
  </ul>
</div>
    `;

  // change to select background / wallpaper / customize theme
  let selectTheme = `
    <select name="selectTheme" class="selectTheme float_right">
    <option value="Light">Light Theme</option>
    <option value="Dark">Dark Theme</option>
    <option value="Nyan">Nyan Theme</option>
    <option value="Hacker">Hacker Theme</option>
    <option value="Water">Water Theme</option>
    <option value="Customize">Customize...</option>
    <!--
    <option value="Customize">EPIC MODE ( my poor browser ) </option>
    <option value="Customize">Comic Theme</option> 
    -->
    </select>
    `;



  //        <span class="personalizeDesktop float_right"><i class="fa-duotone fa-regular fa-desktop" title="Desktop Settings"></i>Desktop Settings</span>

  let selectDesktopSettings = `
<div class="dropdown-wrapper desktop-settings-dropdown-menu">
  <span class="icon trigger" title="Desktop Settings">
    <i class="fa-duotone fa-regular fa-desktop"></i> Desktop Settings
  </span>
  <ul class="dropdown-menu" style="display: none;">
    <li data-value="open">Open Desktop Settings</li>
    <li data-value="matrix">Matrix Wallpaper</li>
    <li data-value="nyancat">Nyan Cat Wallpaper</li>
    <li data-value="ripples">Ripples Wallpaper</li>
    <li data-value="urlWallpaper">Set Wallpaper to Url</li>
  </ul>
</div>
    `;


  let sourceCodeStr = `<span title="View Source Code">
    <i class="fa-duotone fa-regular fa-code"></i> Source Code
  </span>`;
  // use fonr-awesome sun and moon icons
  let selectLightMode = '<span class="selectLightMode float_right"><i class="fa-duotone fa-regular fa-sun" data-mode="Light" title="Light Mode"></i><i class="fa-duotone fa-regular fa-moon" data-mode="Dark" title="Dark Mode"></i></span>';

  let networkStatsStr = `
      <span class="totalConnected loggedIn">
        <!-- <span class="totalConnectedCount">0</span> Buddies Online</span> -->
        <span class="desktopDisconnected loggedOut">Disconnected</span>
            
    `;

  let volumeStr = `
    <div class="volume">
    <span class="volumeIcon volumeToggle volumeFull">🔊</span>
    <span class="volumeIcon volumeToggle volumeMuted">🔇</span>
    
    <!-- <input type="range" min="0" max="100" value="100" class="volumeSlider"> -->
    </div>
    `;

  let clockStr = `
    <span class="" id="clock"></span>
    `;

  let menuTemplate = [
    {
      label: '<span id="me_title" class="me_title">Welcome - You look nice today!</span>',
      submenu: [
        {
          label: 'We are stoked to be your Buddy'
          // click: () => api.ui.toggleDeviceSettings() 
        },
        {
          label: 'Edit Profile',
          click: () => bp.open('profile')
        },
        {
          label: '<span class="loggedOut">Login</span>',
          //visible: !bp.apps.client.isLoggedIn(), // Only show if logged out
          click: () => bp.open('buddylist')
        },
        {
          label: '<span class="loggedIn">Logout</span>',
          //visible: bp.apps.client.isLoggedIn(), // Only show if logged in
          click: () => {
            if (bp.logout) {

              bp.logout();
            }
            //bp.apps.client.logout();
            // Close all chat windows and ponds
            bp.apps.ui.windowManager.windows.forEach((window) => {
              if (window.app === 'buddylist' && (window.type === 'buddy' || window.type === 'pond')) {
                window.close();
              }
              if (window.app === 'pond') {
                window.close();
              }
            });
          }
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Full Screen', click: () => bp.apps.ui.toggleFullScreen() },
        {
          label: 'Hide All Windows',
          click: () => bp.apps.ui.windowManager.minimizeAllWindows()
        },
        /*
        {
            label: 'Set Active Window to Wallpaper',
            disabled: true,
            click: () => {
                if (!desktop.ui.wallpaperWindow) {
                    desktop.ui.wallpaperWindow = true;
                    desktop.ui.removeWindowWallpaper();
                    desktop.ui.setActiveWindowAsWallpaper();
                    $('.setWindowAsWallpaper').html('Remove Window as Wallpaper');
                } else {
                    desktop.ui.wallpaperWindow = false;
                    desktop.ui.removeWindowWallpaper();
                    $('.setWindowAsWallpaper').html('Set Active Window to Wallpaper');
                }
                return false;
            }
        } */

      ]
    },
    {
      label: '<span style="display:flex;">$GBP Coin Balance: <span id="menu-bar-coin-balance" class="odometer">0</span></span>',
      submenu: [
        {
          label: 'View Coin Balance',
          click: () => bp.open('portfolio')
        },
        /*
        {
          label: 'Buy Coins',
          click: () => bp.open('buycoins')
        },
        */
        {
          label: 'Send Coins',
          click: () => bp.open('portfolio', { context: '#portfolio-transfer' })
        }
      ]
    },
    {
      label: `
              <span class="loggedIn">Next Reward in: <span id="menu-bar-coin-reward-coindown" class="countdown-date">0:59</span></span>
              <!-- <span class="loggedOut">Login to get Coin Rewards</span> -->
            `,
    },
    /*
    {
      label: 'Help',
      click: () => bp.open('help')
    },
    */

    { label: '', flex: 1 }, // empty space


    { label: selectMusicPlaylist },

    // { label: selectTheme },
    // { label: desktopSettings },
    {
      label: selectDesktopSettings,
      /*
      click: () => {
        // open the personalize desktop window
        bp.open('profile', { context: 'themes' });
      }
      */
    },

    // { label: networkStatsStr },
    {
      label: sourceCodeStr,
      click: () => {
        // open a new window to https://github.com/marak/buddypond
        let url = 'https://github.com/marak/buddypond';
        window.open(url, '_blank');
      }
    },
    { label: selectLightMode },

    {
      label: volumeStr,
      click: () => {
        console.log('Volume toggle clicked');
        bp.apps.desktop.toggleMute();
      }

    },
    { label: clockStr }
  ];


  return menuTemplate;

}