
export default class EmojiPickerClass {
    constructor(bp) {
        this.bp = bp;
    }

    async init() {
        await this.bp.appendScript('/v5/apps/based/buddylist/vendor/emoji.min.js');
        await this.bp.appendScript('/v5/apps/based/emoji-picker/vendor/grapheme-splitter.min.js')
        this.jQueryPlugin();
        return 'loaded emoji picker';
    }

    jQueryPlugin() {

        $.fn.emojiPicker = function (options) {
            const settings = $.extend({
                onSelect: (emoji) => { },
                categories: ['people', 'nature', 'food', 'activity', 'travel', 'objects', 'symbols', 'flags'],
                emojiData: EMOJIS,
            }, options);

            const emojiList = Object.entries(settings.emojiData).map(([emoji, keywords]) => {
                return {
                    emoji,
                    keywords,
                    name: keywords[0] || '',
                    search: keywords.join(' ') + ' ' + emoji
                };
            });
            const createPicker = () => {
                const $picker = $(`
                <div class="emoji-picker-popup" style="position: absolute; z-index: 9999; display: none; width: 260px; border: 1px solid #ccc; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); background: var(--desktop_element-background);">
                    <input type="text" class="emoji-search" placeholder="Search..." style="width: 100%; padding: 6px; border: none; border-bottom: 1px solid #eee; box-sizing: border-box;" />
                <div class="emoji-grid" style="max-height: 200px; min-height: 200px; overflow-y: auto; padding: 6px; display: flex; flex-wrap: wrap; align-items: start; gap: 6px; font-size: 20px;"></div>
                </div>
            `);

                const $search = $picker.find('.emoji-search');
                const $grid = $picker.find('.emoji-grid');

                const render = (filter = '') => {
                    $grid.empty();
                    const results = emojiList.filter(e =>
                        e.search.toLowerCase().includes(filter.toLowerCase())
                    ).slice(0, 200);

                    results.forEach(e => {
                        const $item = $(`<button class="emoji-btn" style="border: none; background: none; cursor: pointer;">${e.emoji}</button>`);
                        // set the title attribute to show the name on hover
                        $item.attr('title', e.name || e.keywords.join(', '));
                        $item.on('click', () => {
                            settings.onSelect(e.emoji);
                            // $picker.hide();
                        });
                        $grid.append($item);
                    });
                };

                $search.on('input', () => {
                    render($search.val());
                });

                render();
                return $picker;
            };

            return this.each(function () {
                const $trigger = $(this);
                const $picker = createPicker();
                $('body').append($picker);

                // Shared function to show the picker
                const showPicker = () => {
                    $picker.css({ left: -9999, top: -9999, display: 'block' });

                    const triggerOffset = $trigger.offset();
                    const triggerHeight = $trigger.outerHeight();
                    const pickerHeight = $picker.outerHeight();

                    const left = triggerOffset.left;
                    const top = triggerOffset.top - pickerHeight - 8;

                    $picker.css({
                        left: left,
                        top: top < 0 ? triggerOffset.top + triggerHeight + 8 : top,
                        display: 'block'
                    });
                };

                // Option 1: Trigger from normal click
                $trigger.on('click', function (e) {
                    e.stopPropagation();
                    showPicker();
                });

                // Option 2: Allow manual triggering
                $trigger.data('emojiPicker_show', showPicker);

                // Hide picker on outside click
                $(document).on('click', function (e) {
                    if (!$(e.target).closest('.emoji-picker-popup').length &&
                        !$(e.target).is($trigger)) {
                        $picker.hide();
                    }
                });
            });
        };


    }

}