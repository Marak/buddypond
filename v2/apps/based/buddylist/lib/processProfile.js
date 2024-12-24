

export default async function processProfile(profileState) {
  console.log('processBuddylist', profileState);


  // if the client hasn't seen the buddylist yet, we start from empty state
  if (!this.data.buddylist) {
    this.data.buddylist = {};
  }
  if (!this.data.buddyrequests) {
    this.data.buddyrequests = {};
  }

  // profileState is a JSON document representing entire user profile
  // we will process the profileState as if it was a differential state update
  let buddylist = profileState.buddylist;
  _processBuddylistData(this, buddylist);

  let buddyrequests = profileState.buddyrequests;
  _processBuddyRequestsData(this, buddyrequests);
  
}

function _processBuddyRequestsData(buddylist, buddyrequests) {
  console.log('_processBuddyRequestsData', buddyrequests);
  if (buddyrequests) {
    buddylist.renderBuddyRequests(buddyrequests);
  }
}

function _processBuddylistData(buddylist, buddylistData) {

  if (buddylist) {
    for (let b in buddylistData) {
      let buddy = buddylistData[b];
      let buddyName = b.replace('buddies/', '');
      console.log('buddy', buddy);
      // check to see if the buddy is already in the local buddylist
      // if not, render the buddy in the buddylist
      if (!buddylist.data.buddylist[b]) {
        if (buddy.isConnected) {
          buddylist.bp.emit('profile::buddy::in', {
            name: buddyName,
            buddydata: buddy
          });
        } else {
          buddylist.bp.emit('profile::buddy::out', {
            name: buddyName,
            buddydata: buddy,
            wasOnline: false
          });
        }




      }


      // check if this buddy has sent newMessages
      // if so, open a new window
      // the process of opening a new chat window will connect websocket ( if not already connected )
      // then messages will flow through the websocket
      if (buddy.newMessages) {
        this.bp.emit('profile::buddy::newmessage', {
          name: buddyName
        });
      }
    }
  }
}




function fudge() {
  buddypond.getBuddyProfile(desktop.app.buddylist.profileState, function (err, data) {
    if (err || typeof data !== 'object') {
      desktop.log(err);
      // TODO: show disconnect error in UX
      setTimeout(function () {
        desktop.app.buddylist.updateBuddyList();
      }, desktop.DEFAULT_AJAX_TIMER); // TODO: expotential backoff algo
      return;
    }

    desktop.buddyListData = data;
    checkForNewStreamers(data);
    updateLocalDesktopProfile(data);

    desktop.buddylist = desktop.buddylist || {};

    if (data.buddylist) {
      // incoming buddy list, see if it is diff
      for (let b in data.buddylist) {

        let incoming = data.buddylist[b];
        let buddyName = b.replace('buddies/', '');

        // emit new messages event
        if (incoming && incoming.newMessages) {
          desktop.emit('profile::buddy::newmessage', {
            name: buddyName
          });
        }

        if (incoming && incoming.isCalling) {
          desktop.emit('profile::buddy::calling', {
            name: buddyName
          });
        }

        // the desktop has not seen this buddy yet, render it
        if (!desktop.buddylist[b]) {
          if (data.buddylist[b].isConnected) {
            desktop.emit('profile::buddy::in', {
              name: buddyName,
              buddydata: data.buddylist[b]
            });
          } else {
            desktop.emit('profile::buddy::out', {
              name: buddyName,
              buddydata: data.buddylist[b],
              wasOnline: false
            });
          }
          desktop.buddylist[b] = data.buddylist[b];
        } else {
          // check for diff in profile, if incoming profile fresh, re-render in buddylist
          let prev = desktop.buddylist[b];
          let buddyName = b.replace('buddies/', '');
          if (JSON.stringify(prev) !== JSON.stringify(incoming)) {
            /*
            console.log('diff detected')
            console.log('prev', prev);
            console.log('incoming', incoming);
            */
            if (incoming.isConnected) {
              if (incoming.isConnected !== prev.isConnected) {
                desktop.emit('profile::buddy::in', {
                  name: buddyName,
                  buddydata: incoming
                });
              }
            } else {
              desktop.emit('profile::buddy::out', {
                name: buddyName,
                buddydata: incoming,
                wasOnline: true
              });
            }
            desktop.buddylist[b] = incoming;
          }
        }
      }
    }

    // there are new buddy requests ( either incoming or outgoing ) since last update, re-render the buddy requests
    if (data.buddyrequests) {
      let prev = desktop.buddyrequests;
      let incoming = data.buddyrequests;
      if (JSON.stringify(prev) !== JSON.stringify(incoming)) {
        renderBuddyRequests(data);
        desktop.buddyrequests = data.buddyrequests;
      }
    }

    // since new data has been rendered ensure that buddy list is showing
    // TODO: can we remove these hide() / show() statements?
    $('.loggedIn').show();
    $('.buddy_list_not_connected').hide();
    // TODO: move this to buddy pond scope
    $('.buddy_pond_not_connected').hide();
    $('.buddyListHolder').show();

    setTimeout(function () {
      desktop.app.buddylist.updateBuddyList();
    }, desktop.DEFAULT_AJAX_TIMER);
  });

}
