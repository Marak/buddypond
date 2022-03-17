desktop.app.alarm = {};
desktop.app.alarm.label = "Alarm";

desktop.app.alarm.load = function loadDesktopLogin() {
  desktop.load.remoteAssets(
    [
      "alarm", // this loads the sibling desktop.app.alarm.html file into <div id="window_alarm"></div>
    ],
    function () {
      // if user clicks on top right menu, focus on alarm form
      $(".alarmLink").on("click", function () {
        $("#window_alarm").show();
      });

      // set our variables
      var time,
        alarm,
        activeAlarm = false,
        buddyStop = false;
      /*
        audio sound source: https://freesound.org/people/SieuAmThanh/sounds/397787/
      */

      function loopAlarm () {
        if(buddyStop === false) {
          return desktop.play("alarm.mp3", false, loopAlarm);
        }
      }

      // define a function to display the current time
      function displayTime() {
        var now = new Date();
        time = now.toLocaleTimeString();
        clock.textContent = time;
        // time = "1:00:00 AM";
        // watch for alarm
        if (time === alarm) {
          desktop.play(
            "alarm.mp3"
          , false, loopAlarm);
        }
        setTimeout(displayTime, 1000);
      }
      displayTime();

      // add option values relative towards time
      function addMinSecVals(id) {
        var select = id;
        var min = 59;

        for (i = 0; i <= min; i++) {
          // defined as new Option(text, value)
          select.options[select.options.length] = new Option(
            i < 10 ? "0" + i : i,
            i < 10 ? "0" + i : i
          );
        }
      }
      function addHours(id) {
        var select = id;
        var hour = 12;

        for (i = 1; i <= hour; i++) {
          // defined as new Option(text, value)
          select.options[select.options.length] = new Option(
            i < 10 ? "0" + i : i,
            i
          );
        }
      }
      addMinSecVals(minutes);
      addMinSecVals(seconds);
      addHours(hours);

      // set and clear alarm
      startstop.onclick = function () {
        // set the alarm
        if (activeAlarm === false) {
          hours.disabled = true;
          minutes.disabled = true;
          seconds.disabled = true;
          ampm.disabled = true;

          alarm =
            hours.value +
            ":" +
            minutes.value +
            ":" +
            seconds.value +
            " " +
            ampm.value;
          this.textContent = "Clear Alarm";
          activeAlarm = true;
          buddyStop = false;
        } else {
          // clear the alarm
          hours.disabled = false;
          minutes.disabled = false;
          seconds.disabled = false;
          ampm.disabled = false;

          sound.pause();
          alarm = "01:00:00 AM";
          this.textContent = "Set Alarm";
          activeAlarm = false;
          buddyStop = true;
        }
      };
    }
  );
};
