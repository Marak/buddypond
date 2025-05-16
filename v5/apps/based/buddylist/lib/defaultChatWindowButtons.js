export default function chatWindowButtons(bp) {

    return [{
        text: 'BuddySound',
        image: 'desktop/assets/images/icons/icon_soundrecorder_64.png',
        onclick: (ev) => {
            console.log('BuddySound button clicked', ev);
            let context = ev.target.dataset.context;
            let type = ev.target.dataset.type;
            bp.open('soundrecorder', { type: type || 'buddy', output: type || 'buddy', context: context });

        }
    },
    /* TOOD: add gifstudio back ( with better UX and features )
    {
        text: 'BuddyGif',
        image: 'desktop/assets/images/icons/icon_gifstudio_64.png',
        onclick: (ev) => {
            let context = ev.target.dataset.context;
            let type = ev.target.dataset.type;
            JQDX.openWindow('gifstudio', { type: type || 'buddy', context: context, output: type || 'buddy' });
        }
    },
    */
    {
        text: 'BuddyPaint',
        image: 'desktop/assets/images/icons/icon_paint_64.png',
        onclick: (ev) => {
            let context = ev.target.dataset.context;
            let type = ev.target.dataset.type;
            bp.open('paint', { type: type || 'buddy', output: type || 'buddy', context: context });
        }
    },
    {
        text: 'BuddySnap',
        image: 'desktop/assets/images/icons/svg/1f4f7.svg',
        onclick: (ev) => {
            let context = ev.target.dataset.context;
            let type = ev.target.dataset.type;
            // desktop.ui.openWindow('mirror', { type: type || 'buddy', context: context, output: type || 'buddy' });
            bp.open('camera', { type: type || 'buddy', output: type || 'buddy', context: context });
        }
    },
    {
        text: 'BuddyEmoji',
        image: 'desktop/assets/images/icons/svg/1f600.svg',
        className: 'emojiPicker',
        onclick: async (ev) => {
            // EmojiPicker lazy load is a special case
            // All other BuddyPond deps / lazy imports with await bp.load() are fine to work as expected
            // We usually don't need to check existence of the app before loading it
            // For EmojiPicker we need to recall the original click event with same parameters
            // This could be resolved by using a new EmojiPicker library or patching the current one
            if (!bp.apps['emoji-picker']) { // this is not a normal practice for user in await bp.load()
                await bp.load('emoji-picker');
                // Create a new MouseEvent with the original event's coordinates
                const newEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    clientX: ev.clientX, // Preserve original x coordinate
                    clientY: ev.clientY, // Preserve original y coordinate
                    // Include other relevant properties if needed
                    button: ev.button,
                    target: ev.target
                });
                // Dispatch the new event on the original target
                ev.target.dispatchEvent(newEvent);
                return;
            }
            // now that the emoji-picker is loaded, we can open it as normal

            // focus on the .emojiPicker input
            $('.emojiPicker').focus();

            // we need to add class activeTextArea to the active textarea
            // so we can append the emoji to the correct textarea
            // remove the activeTextArea from all other textareas
            $('.activeTextArea').removeClass('activeTextArea');

            let messageControls = $(ev.target).closest('.aim-message-controls');
            // find the closest textarea to the ev.target
            $('.aim-input', messageControls).addClass('activeTextArea');

        }
    },
    {
        text: 'BuddyCall',
        type: 'buddy-only',
        image: 'desktop/assets/images/icons/icon_phone_64.png',
        onclick: (ev) => {
            let context = ev.target.dataset.context;
            let type = ev.target.dataset.type;
            // desktop.ui.openWindow('mirror', { type: type || 'buddy', context: context, output: type || 'buddy' });
            bp.open('videochat', { type: type || 'buddy', output: type || 'buddy', context: context, isHost: true });

            // should send message to buddy that will open the videocall window on receiving end
            let message = {
                from: bp.me,
                to: context,
                text: 'Let\'s have a video call',
                type: 'buddy',
                card: {
                    type: 'videochat'
                }
            }


            console.log('BuddyCall message', message);
            // send message to buddy
            buddypond.sendCardMessage(message, function(err, response){
                if (err) {
                    console.error('Error sending message', err);
                } else {
                    console.log('Message sent', response);
                }
            });


        }
    },
    // spellbook
    {
        text: 'BuddySpellbook',
        image: 'desktop/assets/images/icons/icon_spellbook_64.png',
        onclick: (ev) => {
            let context = ev.target.dataset.context;
            let type = ev.target.dataset.type;
            // desktop.ui.openWindow('spellbook', { type: type || 'buddy', context: context, output: type || 'buddy' });
            bp.open('spellbook', { type: type || 'buddy', output: type || 'buddy', context: context });
        }
    }
    /* // TODO: add Dictate with improved UX
    {
        text: 'Dictate',
        image: 'desktop/assets/images/icons/icon_dictate_64.png',
        onclick: async (ev) => {
            let context = ev.target.dataset.context;
            let type = ev.target.dataset.type;
            let targetEl = $('.aim-input', $(ev.target).parent().parent());
            await bp.open('dictate', { type: type || 'buddy', output: type || 'buddy', context: context, targetEl: targetEl });
        }
    },
    */

    /*
    {
        text: 'BuddyHelp',
        image: 'desktop/assets/images/icons/svg/1f9ae.svg',
        align: 'right',
        onclick: (ev) => {
            let win = $(ev.target).closest('.aim-window');
            let windowId = '#' + win.attr('id');
            //alert(windowId)
            help({ windowId: windowId });

        }
    }
    */    
    ]
}