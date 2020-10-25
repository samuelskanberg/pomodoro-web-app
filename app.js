$(document).ready(function() {
    console.log("Page loaded");   

    var timer;
    var limit;
    var count;
    var timer_done;

    function add_seconds() {
        count++;
        console.log("Add second, count: "+count);
        if (count >= limit) {
            clearInterval(timer);
            timer_done();
        } 
    }

    function long_timer_done() {
        console.log("Long timer done");
        $("div#timer-info").html("Long timer is done"); 
    }

    function short_timer_done() {
        console.log("Short timer done");
        $("div#timer-info").html("Short timer is done"); 
    }

    function start_timer() {
        count = 0;
        clearInterval(timer);
        timer = setInterval(function() {
            add_seconds();
        }, 1000);
    }

    $('#long-timer-button').click(function() {
        console.log("Clicked long timer");
        $("div#timer-info").html("Long timer is running...");
        limit = 25*60;
        timer_done = long_timer_done;
        start_timer();
    });

    $('#short-timer-button').click(function() {
        console.log("Clicked short timer");
        $("div#timer-info").html("Short timer is running...");
        limit = 5*60;
        timer_done = short_timer_done;
        start_timer();
    });

    $('#stop-timer-button').click(function() {
        console.log("Clicked stop timer");
        $("div#timer-info").html("Timer is stopped"); 
        clearInterval(timer);
    });
});
