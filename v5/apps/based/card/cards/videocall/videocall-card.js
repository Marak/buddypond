export default function applyData(el, data) {

    const $el = $(el);

    // opens the videocall app
    console.log('opening videocall app', el, data);

    // click to open the videocall app
    $el.find('.accept-call').click(() => {
        this.bp.open('videocall', { type: 'buddy', context: data.from, accepted: true });
    });

    const now = new Date();
    const messageDate = new Date(data.message.ctime);
    const timeDiff = (now.getTime() - messageDate.getTime()) / 1000;
    console.log('timeDiff', timeDiff);
    if (timeDiff > 10) {
        // console.log('Message is too old to be processed for TTS.');
        return;
    }




    this.bp.open('videocall', { type: 'buddy', context: data.from });

}