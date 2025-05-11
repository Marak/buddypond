

export default async function processProfile(profileState) {
  // console.log('processBuddylist', profileState);

  // if the client hasn't seen the buddylist yet, we start from empty state
  if (!this.data.buddylist) {
    this.data.buddylist = {};
  }
  if (!this.data.buddyrequests) {
    this.data.buddyrequests = {};
  }

  //console.log('processProfile', profileState);
  //console.log('this.data.profileState', this.data.profileState);
  if (this.data.profileState &&
    (
      Number(profileState.powerlevel) > Number(this.data.profileState.powerlevel)
    )
  ) {

    // Assuming there's a container with ID 'powerLevelContainer' in your HTML
    const powerLevel = bp.apps.powerlevel.popup;

    // Example of increasing to level 4
    powerLevel.show(profileState.powerlevel, {
      duration: 7777
    });
  }

  // merge the profile state, don't overwrite
  this.data.profileState = { ...profileState };
  // profileState is a JSON document representing entire user profile
  // console.log('profileState', profileState);
  if (profileState.system) {
    $('.totalConnectedCount').html(profileState.system.totalIsConnected);
    $('.totalOnlineCount').html(profileState.system.totalIsOnline);
  }

  // metadata about ponds users is joined or ponds of interest ( such as viewing popular ponds list )
  if (profileState.ponds && profileState.ponds.ponds) {
    profileState.ponds.ponds.forEach(function (pond) {
      // check to see if we have an open window with data-app="buddylist" data-type="pond" and data-context="${pondName}"
      let win = $('#pond_message_-' + pond.name);
      // update the window-title-text with the number of connected users
      if (win) {
        $('.window-title-text', win).html(pond.name + ' Pond (' + pond.connected + ')');
      }
    });
  }

  // we will process the profileState as if it was a differential state update
  let buddylist = profileState.buddylist;
  let profileNeedsUpdate = _processBuddylistData(this, buddylist);

  let buddyrequests = profileState.buddyrequests;
  _processBuddyRequestsData(this, buddyrequests);

  // once we have completed processing all the buddylist profile data
  // we will want to send back the updated document to awk that we have processed the profile
  // and set newMessages flags to false
  let api = this.bp.apps.client.api;
  // console.log('getBuddyProfile', api, profileState);
  profileState.updates = profileState.updates || {};

}

function _processBuddyRequestsData(buddylist, buddyrequests) {
  if (buddyrequests) {
    buddylist.renderBuddyRequests(buddyrequests);
  }
}

function _processBuddylistData(buddylist, buddylistData) {

  let profileNeedsUpdate = false;
  if (buddylist) {
    for (let b in buddylistData) {
      let buddy = buddylistData[b];
      let buddyName = b.replace('buddies/', '');
      // check to see if the buddy is already in the local buddylist
      // if not, render the buddy in the buddylist
      /*
      if (!buddylist.data.buddylist[b]) {
        if (buddy.isConnected) {
          buddylist.bp.emit('profile::buddy::in', {
            name: buddyName,
            buddydata: buddy
          });
        }
        buddylist.data.buddylist[b] = buddy;
      } else {
        // check to see if buddy was connected and is no longer
        if (!buddy.isConnected && buddylist.data.buddylist[b].isConnected) {
          buddylist.bp.emit('profile::buddy::out', {
            name: buddyName,
            buddydata: buddy,
            wasOnline: false
          });
        }
      }*/


      buddylist.renderOrUpdateBuddyInBuddyList({
        name: buddyName,
        buddydata: buddy,
        wasOnline: false
      });

      // check if this buddy has sent newMessages
      // if so, open a new window
      // the process of opening a new chat window will connect websocket ( if not already connected )
      // then messages will flow through the websocket
      if (buddy.newMessages) {
        buddylist.bp.emit('profile::buddy::newmessage', {
          name: buddyName
        });
        // console.log('updaitng local profile state', buddylist.data.profileState, buddyName)
        buddylist.data.profileState.buddylist['buddies/' + buddyName] = {
          newMessages: false
        };
        profileNeedsUpdate = true;
      }


      if (buddy.isCalling) {
        buddylist.bp.emit('profile::buddy::calling', {
          name: buddyName
        });
      }

    }
  }
  return profileNeedsUpdate;
}