export default function defaultChatWindowButtons(bp) {

    return [

        {
            text: 'Image Search',
            image: 'desktop/assets/images/icons/icon_image-search_64.png',
            onclick: async (ev) => {
                let context = ev.target.dataset.context;
                let type = ev.target.dataset.type;
                // Open the image search window
                bp.open('image-search', {
                    output: type || 'buddy',
                    context: context,
                    provider: 'giphy-stickers'
                });
                return false;
            }
        },

        {
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

                let $target = $(ev.target);

                // ensure that we don't already have an emoji-picker-popup in document
                if ($('.emoji-picker-popup').length > 0) {
                    $('.emoji-picker-popup').remove();
                }

                $target.emojiPicker({
                    onSelect: (emoji) => {
                        console.log("Selected:", emoji);
                        let messageControls = $target.closest('.aim-message-controls');
                        $('.aim-input', messageControls).val((i, val) => val + emoji).trigger('input').focus();
                    }
                });

                // Immediately show the picker (bypasses internal click)
                $target.data('emojiPicker_show')?.();

                // focus on .emoji-search input
                if ($('.emoji-picker-popup').length > 0) {
                    $('.emoji-search').focus();
                }
                return;

                // Replaced: Jun 17, 2025
                // Legacy EmojiPicker code below, can be removed once we confirm new code above works well
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
                buddypond.sendCardMessage(message, function (err, response) {
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
            text: 'Spellbook',
            image: 'desktop/assets/images/icons/icon_spellbook_64.png',
            onclick: (ev) => {
                ev.preventDefault();
                ev.stopPropagation();

                let context = ev.target.dataset.context;
                let type = ev.target.dataset.type;
                // desktop.ui.openWindow('spellbook', { type: type || 'buddy', context: context, output: type || 'buddy' });
                bp.open('spellbook', { type: type || 'buddy', output: type || 'buddy', context: context });
            }
        },
        // buddycoins
        {
            text: 'BuddyCoins',
            image: 'desktop/assets/images/icons/icon_coin_64.png',
            onclick: (ev) => {
                let context = ev.target.dataset.context;
                let type = ev.target.dataset.type;
                // desktop.ui.openWindow('coin', { type: type || 'buddy', context: context, output: type || 'buddy' });
                bp.open('portfolio', { type: type || 'buddy', output: context, context: '#portfolio-transfer' });
            }
        },
        /* // TODO: add Dictate with improved UX */
        {
            text: 'Dictate',
            env: 'desktop-only',
            image: 'desktop/assets/images/icons/icon_dictate_64.png',
            onclick: async (ev) => {
                let context = ev.target.dataset.context;
                let type = ev.target.dataset.type;
                let targetEl = $('.aim-input', $(ev.target).parent().parent());
                await bp.open('dictate', { type: type || 'buddy', output: type || 'buddy', context: context, targetEl: targetEl });
            }
        },
        {
            text: 'BuddyHelp',
            image: 'desktop/assets/images/icons/icon_help_64.png',
            align: 'right',
            onclick: (ev) => {
                let context = ev.target.dataset.context;
                let type = ev.target.dataset.type;
                // TODO: better way to get the windowId
                // TODO: instead just use context on the button, like how all the other buttons work
                let windowIdPrefix = type === 'pond' ? 'pond_message_-' : 'messages/';
                let windowId = windowIdPrefix + context;
                if (type === 'pond') {
                    windowId = 'pond-chat';
                }
                // console.log('opening chat window ', windowId)
                let chatWindow = bp.apps.ui.windowManager.getWindow(windowId);
                console.log('chatWindow', chatWindow);
                // bp.apps.buddylist.showCard({ chatWindow, cardName: 'help' });

                let aimInput = chatWindow.content.querySelector('.aim-input');
                let sendButton = chatWindow.content.querySelector('.aim-send-btn');
                if (aimInput) {
                    aimInput.value = '/help';
                    aimInput.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
                }
                if (sendButton) {
                    sendButton.click(); // Simulate button click
                }




            }
        }
    ]
}