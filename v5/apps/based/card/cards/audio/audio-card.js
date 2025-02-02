export default function applyData(el, data) {
    let soundUrl = data.url;
    console.log("APplying data to audio card", data, soundUrl);
    let audioCardEl = $(el).find('.audio-card');
    audioCardEl.attr('data-url', soundUrl);
    audioCardEl.attr('data-uuid', data.message.uuid);
    audioCardEl.attr('data-to', data.message.to);
    audioCardEl.attr('data-from', data.message.from);
    audioCardEl.attr('data-context', data.message.context);


    // Assuming data has properties like `title` and `soundURL`
    $(el).find('.card-title').text(data.title);
    $(el).find('.audio-player').attr('src', soundUrl);

    // add click event to class=audioPlayer
    $(el).find('.openAudioPlayer').click(async (e) => {
        console.log('audio-player clicked', soundUrl);
        // play audio


        // create the track
        let t = bp.apps['audio-track'].createAudioTrack({
            fileName: soundUrl,
            url: soundUrl
        });
        console.log('created audio track', t);

        // render the track
        let trackElement = t.render();
        console.log('rendered audio track', trackElement);

        // append the track to the body
        document.body.appendChild(trackElement);

        // load the track
        await t.load();
        console.log("loaded audio track", t);
        
        await t.play();


        //$(el).find('.audio-player')[0].play();
    });

}