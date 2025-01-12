export default function defaultMenuBar (bp) {

    // Ported from Legacy bp v4
    let selectMusicPlaylist = `
    <select name="selectPlaylist" class="selectPlaylist float_right">
    <option>Select music playlist...</option>
    <option value="1427128612">Buddy House 2 ( 10 Tracks )</option>
    <option value="1397493787">Buddy House 1 ( 10 Tracks )</option>
    <option value="1397230333">Buddy House 0 ( 33 Tracks )</option>
    <option value="942151069">Andrew Potthast: Bangas</option>
    <option value="938848927">Andrew Potthast: Burning Man Set</option>
    <option value="839091662">Featured Buddy: Andrew Potthast</option>
    <option value="1427279635">Featured Buddy: ioqpvs</option>
    </select>
    `;
    
    let selectTheme = `
    <select name="selectTheme" class="selectTheme float_right">
    <option value="Light">Light Theme</option>
    <option value="Dark">Dark Theme</option>
    <option value="Nyan">Nyan Theme</option>
    <option value="Hacker">Hacker Theme</option>
    <option value="Water">Water Theme</option>
    <!-- <option value="Customize">Customize Theme</option> -->
    <!--
    <option value="Customize">EPIC MODE ( my poor browser ) </option>
    <option value="Customize">Comic Theme</option> 
    -->
    </select>
    
    `;
    
    let networkStatsStr = `
      <span class="totalConnected loggedIn">
        <span class="totalConnectedCount">0</span> Buddies Online</span>
        <span class="totalOnlineCount">0</span><!--Buddies Online--></span>
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
        { label: 'We are stoked to be your Buddy', click: () => api.ui.toggleDeviceSettings() },
    
        {
          label: `
                <a class="editProfileLink" title="Login to Edit Profile" href="#">Edit Profile</a>
    
            `, click: () => {
            bp.open('profile');
          }
        },
        {
          label: `
                  <li class="loggedOut">
                    <span class="loginLink">Login</span>
                  </li>
                  <li class="loggedIn">
                    <span class="logoutLink">Logout</span>
                  </li>
    
                
                `, click: () => {
            bp.apps.client.logout();
            // close all chat windows and ponds
            bp.apps.ui.windowManager.windows.forEach((window) => {
              //console.log("window", window);
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
        { label: 'Full Screen', click: () => JQDX.openFullscreen($('body').get(0)) }, // legacy API
        {
          label: 'Hide All Windows', click: () => {
    
            // Legacy API
            desktop.ui.displayMode = 'min';
            // If any windows are visible, hide all.
            $('div.window').hide();
    
            // New API
            bp.apps.ui.windowManager.minimizeAllWindows();
    
          }
        },
        {
          label: 'Set Active Window to Wallpaper', disabled: true, click: () => {
    
            // legacy API
            if (!desktop.ui.wallpaperWindow) {
              desktop.ui.wallpaperWindow = true;
              desktop.ui.removeWindowWallpaper()
              desktop.ui.setActiveWindowAsWallpaper();
              $('.setWindowAsWallpaper').html('Remove Window as Wallpaper');
            } else {
              desktop.ui.wallpaperWindow = false;
              desktop.ui.removeWindowWallpaper();
              $('.setWindowAsWallpaper').html('Set Active Window to Wallpaper');
            }
            return false;
    
    
          }
        }
      ]
    },
    {
      label: selectMusicPlaylist,
      flex: 1
    },
    {
      label: selectTheme
    },
    
    {
      label: networkStatsStr
    },
    {
      label: volumeStr
    },
    
    {
      label: clockStr
    }
    
    ];

    return menuTemplate;

}