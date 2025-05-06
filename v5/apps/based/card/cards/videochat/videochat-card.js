export default function applyData(el, data) {
    const $el = $(el);

    console.log('opening videocall app', el, data);

    let headerEl = $el.find('.card-videocall-header');
    let acceptEl = $el.find('.accept-call');
    let declineEl = $el.find('.decline-call');

    if (data.message.from === this.bp.me) {
        headerEl.text('Outgoing call to ' + data.message.to);
        acceptEl.text('Open videocall');
        declineEl.hide(); // Hide decline button for outgoing calls
    } else {
        headerEl.text('Incoming call from ' + data.message.from);
        acceptEl.text('Accept call');
        declineEl.text('Decline');
    }

    // Handle accept button click
    $el.find('.accept-call').click(() => {
        if (data.message.from === this.bp.me) {
            this.bp.open('videochat', { type: 'buddy', context: data.message.to, isHost: true });
        } else {
            this.bp.open('videochat', { type: 'buddy', context: data.message.from, acceptedCall: true });
        }
    });

    // Handle decline button click
    $el.find('.decline-call').click(() => {
        // Optionally notify the caller or perform cleanup
        console.log('Call declined');
        //$el.remove(); // Remove the card from the chat
        return false;
    });

    const now = new Date();
    const messageDate = new Date(data.message.ctime);
    const timeDiff = (now.getTime() - messageDate.getTime()) / 1000;
    console.log('timeDiff', timeDiff);

    if (timeDiff > 10 || data.message.from === this.bp.me) {
        return;
    }

    this.bp.open('videochat', { type: 'buddy', context: data.message.from });
}