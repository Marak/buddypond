export default function handleWorkerMessage(event) {
    // console.log('handleWorkerMessage', event);
    const { type, data } = event;

    switch (type) {
        case 'sseUpdate':
            // console.log('SSE update:', type, data);
            if (data.type === 'pond') {
                this.bp.emit('buddy::messages', { result: { messages: [data] } });
            }
            if (data.type === 'buddy') {
                this.bp.emit('buddy::messages', { result: { messages: [data] } });
            }

            if (data.type === "full_buddy_profile") {
                // console.log(data.buddyprofile.buddylist);
                this.bp.emit('profile::fullBuddyList', data.buddyprofile.buddylist);
            }
            if (data.type === 'buddy_added') {
                this.bp.emit('profile::buddy::in', {
                    name: data.buddyname,
                    profile: data.profile || { ctime: new Date().getTime(), dtime: 0 }
                });
                //console.log('buddy added', data);
            }
            if (data.type === 'buddy_removed') {
                this.bp.emit('profile::buddy::out', { name: data.buddyname });
                //console.log('buddy removed', data);
            }
            break;
        default:
            this.bp.log('Unhandled message type from worker:', type);
    }
}
