$(document).ready(function() {
    // Check if we should show a warning that the user has not yet accepted notifications
    if ("Notification" in window) {
        if (Notification.permission === "default") {
            $("div#notifications-not-activated-warning").css("display", "block");
        }
    }

    // Make sure we get permissions for notifications before running the timer :)
    // We only ask if we haven't already asked
    $('a#accept-notifications').click(function(event) {
        event.preventDefault();
        if ("Notification" in window) {
            if (Notification.permission === "default") {
                Notification.requestPermission().then(function(p) {
                    if(p === 'granted') {
                        $("div#notifications-not-activated-warning").css("display", "none");
                        var notification = new Notification("Notifications activated");
                    } else {
                        console.log('User blocked notifications.');
                    }
                }).catch(function(err) {
                    console.error(err);
                });
            }
        }
    });

    function notifyUser(message) {
      // Let's check if the browser supports notifications
      if (!("Notification" in window)) {
	console.log("This browser does not support desktop notification");
      }

      // Let's check whether notification permissions have already been granted
      else if (Notification.permission === "granted") {
	// If it's okay let's create a notification
	var notification = new Notification(message);
      }

      // Otherwise, we need to ask the user for permission
      // This should not be needed since we have already asked in the beginning
      else if (Notification.permission !== "denied") {
	Notification.requestPermission().then(function (permission) {
	  // If the user accepts, let's create a notification
	  if (permission === "granted") {
	    var notification = new Notification(message);
	  }
	});
      }
    }

    var timer;
    var limit;
    var count;
    var timer_done;

    function update_time() {
        var seconds_left = limit-count;
        var minutes = Math.floor(seconds_left/60);
        var seconds = seconds_left % 60;
        var time_string = ("0"+minutes).slice(-2)+":"+("0"+seconds).slice(-2);
        $('#time').html(time_string);
    }

    function add_seconds() {
        count++;
        update_time();
        if (count >= limit) {
            clearInterval(timer);
            timer_done();
        } 
    }

    function call_webhook(message) {
        if ("slack_webhook" in localStorage) {
            // On the format https://hooks.slack.com/services/AAAAA/BBBBB/CCCCC
            // The only thing that has to be set is the webhook
            var webhook = localStorage["slack_webhook"];
            var channel = localStorage["slack_channel"] || "#general";
            var username = localStorage["slack_username"] || "Pomodoro";
            var icon_emoji = localStorage["slack_icon_emoji"] || ":tomato:";

            console.log("Calling webhook");
            $.ajax({
                data: 'payload=' + JSON.stringify({
                    "text": message,
                    "channel": channel,
                    "username": username,
                    "icon_emoji": icon_emoji
                }),
                dataType: 'json',
                processData: false,
                type: 'POST',
                url: webhook
            });
        }
    }

    function long_timer_done() {
        console.log("Long timer done");
        $("div#timer-info").html("Long timer is done"); 
        notifyUser("Long timer is done");
        call_webhook("Long timer is done");

        var audio_element = document.getElementById("timer-sound");
        audio_element.play();
    }

    function medium_timer_done() {
        console.log("Medium timer done");
        $("div#timer-info").html("Medium timer is done");
        notifyUser("Medium timer is done");
        call_webhook("Medium timer is done");

        var audio_element = document.getElementById("timer-sound");
        audio_element.play();
    }

    function short_timer_done() {
        console.log("Short timer done");
        $("div#timer-info").html("Short timer is done"); 
        notifyUser("Short timer is done");
        call_webhook("Short timer is done");

        var audio_element = document.getElementById("timer-sound");
        audio_element.play();
    }

    function very_short_timer_done() {
        console.log("Very short timer done");
        $("div#timer-info").html("Very short timer is done");
        notifyUser("Very short timer is done");
        call_webhook("Very short timer is done");

        var audio_element = document.getElementById("timer-sound");
        audio_element.play();
    }

    function start_timer() {
        count = 0;
        clearInterval(timer);
        update_time();
        timer = setInterval(function() {
            add_seconds();
        }, 1000);
    }

    $('#long-timer-button').click(function(event) {
        event.preventDefault();
        $("div#timer-info").html("Long timer is running...");
        limit = 25*60;
        timer_done = long_timer_done;
        start_timer();
    });

    $('#medium-timer-button').click(function(event) {
        event.preventDefault();
        $("div#timer-info").html("Medium timer is running...");
        limit = 15*60;
        timer_done = medium_timer_done;
        start_timer();
    });

    $('#short-timer-button').click(function(event) {
        event.preventDefault();
        $("div#timer-info").html("Short timer is running...");
        limit = 5*60;
        timer_done = short_timer_done;
        start_timer();

    });

    $('#very-short-timer-button').click(function(event) {
        event.preventDefault();
        $("div#timer-info").html("Very short timer is running...");
        limit = 10;
        timer_done = very_short_timer_done;
        start_timer();
    });

    $('#stop-timer-button').click(function(event) {
        event.preventDefault();
        $("div#timer-info").html("Timer is stopped"); 
        clearInterval(timer);
        count = limit;
        update_time();
    });

    $('#show-time-button').click(function(event) {
        event.preventDefault();
        if ($('#time').css('display') == "none") {
            $(this).text("Hide time");
            $("#time").css("display", "block");
        } else {
            $(this).text("Show time");
            $("#time").css("display", "none");
        }
    });
});
