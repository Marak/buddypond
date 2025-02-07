export default function defaultMenuBar (bp) {

    // Ported from Legacy bp v4
    let selectMusicPlaylist = `
    <select name="selectPlaylist" class="selectPlaylist float_right">
    <option>Select music playlist...</option>
    <option value="1397230333">Buddy House 0 ( 33 Tracks )</option>
    <option value="1397493787">Buddy House 1 ( 10 Tracks )</option>
    <option value="1427128612">Buddy House 2 ( 10 Tracks )</option>
    </select>
    `;
    
    let selectTheme = `
    <select name="selectTheme" class="selectTheme float_right">
    <option value="Light">Light Theme</option>
    <option value="Dark">Dark Theme</option>
    <option value="Nyan">Nyan Theme</option>
    <option value="Hacker">Hacker Theme</option>
    <option value="Water">Water Theme</option>
    <option value="Customize">Customize Theme</option>
    <!--
    <option value="Customize">EPIC MODE ( my poor browser ) </option>
    <option value="Customize">Comic Theme</option> 
    -->
    </select>
    
    `;
    
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
                  label: 'We are stoked to be your Buddy', 
                  click: () => api.ui.toggleDeviceSettings() 
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
                    if(bp.logout) {

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
              }
          ]
      },
      { label: selectMusicPlaylist, flex: 1 },
      { label: selectTheme },
      { label: networkStatsStr },
      { label: volumeStr },
      { label: clockStr }
  ];
  

    return menuTemplate;

}