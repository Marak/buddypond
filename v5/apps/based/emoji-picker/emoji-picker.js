
export default class EmojiPickerClass {
    constructor(bp) {
        this.bp = bp;
    }

    async init() {

        await this.bp.appendScript('/v5/apps/based/emoji-picker/vendor/emojipicker.js');
        const emojiTriggers = [
            {
                selector: '.emojiPicker',
                insertInto: '.activeTextArea'
            }
        ];
        new EmojiPicker({
            trigger: emojiTriggers,
            closeButton: true,
            //specialButtons: green
        });

   }

}