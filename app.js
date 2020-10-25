$(document).ready(function() {
    console.log("Page loaded");   

    // Check if we should show a warning that the user has not yet accepted notifications
    if ("Notification" in window) {
        if (Notification.permission === "default") {
            $("div#notifications-not-activated-warning").css("display", "block");
        }
    }

    // Make sure we get permissions for notifications before running the timer :)
    // We only ask if we haven't already asked
    $('a#accept-notifications').click(function(event) {
        console.log("notification");
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

    function add_seconds() {
        count++;
        var seconds_left = limit-count;
        var minutes = Math.floor(seconds_left/60);
        var seconds = seconds_left % 60;
        var time_string = ("0"+minutes).slice(-2)+":"+("0"+seconds).slice(-2);
        $('#time').html(time_string);
        if (count >= limit) {
            clearInterval(timer);
            timer_done();
        } 
    }

    function long_timer_done() {
        console.log("Long timer done");
        $("div#timer-info").html("Long timer is done"); 
        notifyUser("Long timer is done");
    }

    function short_timer_done() {
        console.log("Short timer done");
        $("div#timer-info").html("Short timer is done"); 
        notifyUser("Short timer is done");
    }

    function start_timer() {
        count = 0;
        clearInterval(timer);
        timer = setInterval(function() {
            add_seconds();
        }, 1000);
    }

    $('#long-timer-button').click(function(event) {
        event.preventDefault();
        console.log("Clicked long timer");
        $("div#timer-info").html("Long timer is running...");
        limit = 25*60;
        timer_done = long_timer_done;
        start_timer();
    });

    $('#short-timer-button').click(function(event) {
        event.preventDefault();
        console.log("Clicked short timer");
        $("div#timer-info").html("Short timer is running...");
        limit = 5*60;
        timer_done = short_timer_done;
        start_timer();
    });

    $('#stop-timer-button').click(function(event) {
        event.preventDefault();
        console.log("Clicked stop timer");
        $("div#timer-info").html("Timer is stopped"); 
        clearInterval(timer);
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
