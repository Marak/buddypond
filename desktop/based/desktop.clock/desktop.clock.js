desktop.app.clock = {};
desktop.app.clock.icon = 'folder';
desktop.app.clock.load = function loadclock (params, next) {
  desktop.setClock();
  next();
};

// TODO: move this into separate app with timezones and better clock / date format / calendar
desktop.setClock = function setClock () {
  const clock = $('#clock');

  if (!clock.length) {
    return;
  }

  let format;

  if (desktop.app.localstorage) {
    format = desktop.app.localstorage.get('clock');
  }


  // Date variables.
  const date_obj = new Date();
  let hour = date_obj.getHours();
  let minute = date_obj.getMinutes();
  const day = date_obj.getDate();
  const year = date_obj.getFullYear();

  // Array for weekday.
  let weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  // Array for month.
  let month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  // Assign weekday, month, date, year.
  weekday = weekday[date_obj.getDay()];
  month = month[date_obj.getMonth()];

  // Leading zero, if needed.
  if (minute < 10) {
    minute = '0' + minute;
  }

  if (!format || format === 'mm-dd-yyyy') {
    let suffix = 'AM';
    // default to US time format with 12h

    // AM or PM?
    if (hour >= 12) {
      suffix = 'PM';
    }

    // Convert to 12-hour.
    if (hour > 12) {
      hour = hour - 12;
    }
    else if (hour === 0) {
    // Display 12:XX instead of 0:XX.
      hour = 12;
    }

    // Build two HTML strings.
    const clock_time = weekday + ' ' + hour + ':' + minute + ' ' + suffix;
    const clock_date = month + ' ' + day + ', ' + year;

    // Shove in the HTML.
    clock.html(clock_time).attr('title', clock_date);

    // Update every 60 seconds.
    desktop.clockTimeout = setTimeout(desktop.setClock, 60000);
  } else {
    if (hour < 12) {
      hour = '0' + hour;
    }

    // Build two HTML strings.
    const clock_time = weekday + ' ' + hour + ':' + minute;
    const clock_date = day + ' ' + month + ', ' + year;

    // Shove in the HTML.
    clock.html(clock_time).attr('title', clock_date);

    // Update every 60 seconds.
    desktop.clockTimeout = setTimeout(desktop.setClock, 60000);
  }
};
