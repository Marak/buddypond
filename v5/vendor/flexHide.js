$(document).ready(function () {


    $.fn.flexShow = function () {
        return this.each(function () {
            var $this = $(this);
            // Store the current display value only if it's not 'none' and no previous storage exists
            if (!$this.data('original-display') && $this.css('display') !== 'none') {
                $this.data('original-display', $this.css('display'));
            }
            // Use the stored display value or default to 'block' if nothing stored
            $this.show().css('display', $this.data('original-display') || 'flex');
        });
    };

    $.fn.flexHide = function () {
        return this.each(function () {
            var $this = $(this);
            // Ensure the original display is stored before hiding
            if (!$this.data('original-display') && $this.css('display') !== 'none') {
                $this.data('original-display', $this.css('display'));
            }
            $this.hide();
        });
    };

});
