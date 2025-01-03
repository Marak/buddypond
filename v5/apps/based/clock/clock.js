export default class Clock {
    constructor(bp, options = {}) {
        options.format = options.format || 'mm-dd-yyyy';
        options.updateInterval = options.updateInterval || 60000;

        if (typeof options.selector !== 'string') {
            options.selector = '#clock'; // Default selector
        }
        this.selector = options.selector;
        this.options = options;
        this.init();
    }

    async init() {
        this.updateTime();
    }

    updateTime() {
        const element = $(this.selector);
        if (!element.length) {
            setTimeout(() => this.updateTime(), 200);
            return; // Element not found
        }
        const dateObj = new Date();
        let hour = dateObj.getHours();
        let minute = dateObj.getMinutes();
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const weekday = weekdayNames[dateObj.getDay()];
        const month = monthNames[dateObj.getMonth()];

        // Leading zero for minutes if needed
        if (minute < 10) {
            minute = '0' + minute;
        }

        let clockTime, clockDate;

        if (this.options.format === 'mm-dd-yyyy') {
            let suffix = 'AM';
            if (hour >= 12) {
                suffix = 'PM';
            }
            if (hour > 12) {
                hour -= 12;
            } else if (hour === 0) {
                hour = 12; // Convert "0" hour to "12" for 12AM
            }

            clockTime = `${weekday} ${hour}:${minute} ${suffix}`;
            clockDate = `${month} ${day}, ${year}`;
        } else {
            // Leading zero for hour if needed (24-hour format)
            if (hour < 10) {
                hour = '0' + hour;
            }

            clockTime = `${weekday} ${hour}:${minute}`;
            clockDate = `${day} ${month}, ${year}`;
        }
        // Update HTML content and title
        element.html(clockTime).attr('title', clockDate);

        // Schedule the next update
        setTimeout(() => this.updateTime(), this.options.updateInterval);
    }
}
