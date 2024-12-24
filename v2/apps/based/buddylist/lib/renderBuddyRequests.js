export default function renderBuddyRequests (buddyrequests) {
    console.log("renderBuddyRequests", buddyrequests);
    $('.you_have_no_buddies').hide();
    let api = this.bp.apps.client.api;

    if (buddyrequests) {
  
      $('.pendingIncomingBuddyRequests').html('');
      $('.pendingOutgoingBuddyRequests').html('');
      $('.loading').remove();
  
      for (let buddy in buddyrequests) {
        let buddyrequest = buddyrequests[buddy];
        buddyrequest = JSON.parse(buddyrequest);
        console.log("buddyrequest", buddyrequest, this.bp.me);
        // TODO: top list is buddies, button list is requests ( with buttons )
        if (buddyrequest.to === this.bp.me) {
          $('.pendingIncomingBuddyRequests').append('<li>' + buddyrequest.from + ' - <a href="#" class="approveBuddyRequest pointer" data-buddyname="' + buddyrequest.from +'">Approve</a> / <a href="#" class="denyBuddyRequest pointer" data-buddyname="' + buddyrequest.from +'">Remove</a> </li>');
        } else {
          $('.pendingOutgoingBuddyRequests').append('<li>' + buddyrequest.to + ' - <a href="#" class="denyBuddyRequest pointer" data-buddyname="' + buddyrequest.to +'">Remove</a></li>');
        }
      }
  
      $('.apiResult').val(JSON.stringify(buddyrequests, true, 2));
  
      // desktop.app.buddylist.pendingIncomingBuddyRequests = desktop.app.buddylist.pendingIncomingBuddyRequests || 0;
      this.data.pendingIncomingBuddyRequests = this.data.pendingIncomingBuddyRequests || 0;

      let totalIncomingBuddyRequests = $('.pendingIncomingBuddyRequests li').length;
  
      if (totalIncomingBuddyRequests > this.data.pendingIncomingBuddyRequests) {
        this.data.pendingIncomingBuddyRequests = totalIncomingBuddyRequests;
  
        // Remark: short delay is used here to provide nice login experience if Buddy has requests
        //         allows WELCOME sound to play
        //         A better solution here is to here priority option for playing sound with queue
        setTimeout(function () {
          // this.bp.apps.play('YOUVEGOTMAIL.wav'); // TODO add 'play' app
        }, 2222);
      }
  
      if (totalIncomingBuddyRequests === 0) {
        $('.pendingIncomingBuddyRequestsHolder').hide();
      } else {
        $('.pendingIncomingBuddyRequestsHolder').show();
      }
  
      if ($('.pendingOutgoingBuddyRequests li').length == 0) {
        $('.pendingOutgoingBuddyRequestsHolder').hide();
      } else {
        $('.pendingOutgoingBuddyRequestsHolder').show();
      }
  
      // TODO: remove links in real-time from client for approve / deny ( no lags or double clicks )
      //  '.pendingIncomingBuddyRequests'
      $('.denyBuddyRequest').on('click', function () {
        $(this).parent().hide();
        api.denyBuddy($(this).attr('data-buddyname'), function (err, data) {
          $('.apiResult').val(JSON.stringify(data, true, 2));
        });
        return false;
      });
  
      $('.approveBuddyRequest', '.pendingIncomingBuddyRequests').on('click', function () {
        $(this).parent().hide();
        let buddyName = $(this).attr('data-buddyname');
        api.approveBuddy(buddyName, function (err, data) {
          $('.apiResult').val(JSON.stringify(data, true, 2));
        });
        return false;
      });
    }
  
  }