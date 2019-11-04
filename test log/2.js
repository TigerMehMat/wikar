
var cr = {"bs":{"h":{"b":200,"w":40,"t":5.4},"s":{"b":150,"w":15,"t":10},"o":{"b":150,"w":15,"t":10},"f":{"b":1200,"w":120,"t":10},"w":{"b":140,"w":2.8,"t":4},"d":{"b":100,"w":5,"t":2,"a":[{"b":15}]},"m":{"b":100,"w":null,"t":3,"a":{"w":{"b":480,"sw":993.6,"st":1104},"s":{"b":300}}},"t":{"b":180,"w":10.8,"t":null}},"tDPS0":0.3}


var lowbeep = new Audio('/media/audio/lowbeep.mp3');
var eat = new Audio('/media/audio/eat.mp3?3');
var dododeath = new Audio('/media/audio/dododeath.mp3');
var dodo = new Audio('/media/audio/dodo.mp3');

var level, rate, maxUnits, totalUnits, constantSeconds, totalSeconds, narcoticsUsed, narcoticsTorporQueue, narcoberriesUsed, narcoberriesTorporQueue, biotoxinsUsed, biotoxinsTorporQueue, ttRunning, alarm, alarmSecs, ttHasAlarmed;

function init() {
    level = parseFloat($("#level").val());
    if(isNaN(level)){
        level = 20;
    }
    if(level <= 0){
        level = 1;
    }
    rate = cr.tDPS0+Math.pow(level-1,0.800403041)/(22.39671632/cr.tDPS0);
    maxUnits = cr.bs.t.b + (cr.bs.t.w * (level-1));
    maxUnits = parseFloat(maxUnits.toFixed(3))
    totalUnits = maxUnits;
    constantSeconds = (totalUnits / rate);
    totalSeconds = constantSeconds;

    biotoxinsUsed = 0;
    biotoxinsTorporQueue = 0;
    narcoticsUsed = 0;
    narcoticsTorporQueue = 0;
    narcoberriesUsed = 0;
    narcoberriesTorporQueue = 0;

    ttRunning = false;

    alarm = parseFloat($("#ttAlarm").val());
    alarmSecs = ((alarm * 60)+1);
    ttHasAlarmed = false;

    //Initialize the timer
    $('#ttRate').text(Math.round(rate*100)/100);
    $('#ttTimeRemaining').html(timeFormat(totalSeconds, true));
    $('#ttMaxUnits').text(maxUnits);
    $('#ttUnits').val(totalUnits);
}

init();

var narcotics = {
    biotoxins:{
        torpor:80,
        secs:16
    },
    narcotics:{
        torpor:40,
        secs:8
    },
    narcoberries:{
        torpor:7.5,
        secs:3
    }
}

function decreaseTimer() {
    if(totalSeconds <= alarmSecs && !ttHasAlarmed) {
        ttHasAlarmed = true;
        $('.tt').addClass('alarming');
        dodo.play();
    } else if (totalSeconds > alarmSecs && ttHasAlarmed) {
        ttHasAlarmed = false;
        $('.tt').removeClass('alarming');
    }

    // Deplete timer
    if(biotoxinsTorporQueue > 0){
        var torpIncPerSec = narcotics.biotoxins.torpor/narcotics.biotoxins.secs;
        var torpToInc = Math.min(torpIncPerSec,biotoxinsTorporQueue);
        biotoxinsTorporQueue = biotoxinsTorporQueue - torpIncPerSec;
        totalUnits = totalUnits+torpToInc;
        totalSeconds = (totalUnits / rate);
    } else if(narcoticsTorporQueue > 0){
        var torpIncPerSec = narcotics.narcotics.torpor/narcotics.narcotics.secs;
        var torpToInc = Math.min(torpIncPerSec,narcoticsTorporQueue);
        narcoticsTorporQueue = narcoticsTorporQueue - torpIncPerSec;
        totalUnits = totalUnits+torpToInc;
        totalSeconds = (totalUnits / rate);
    } else if(narcoberriesTorporQueue > 0){
        var torpIncPerSec = narcotics.narcoberries.torpor/narcotics.narcoberries.secs;
        var torpToInc = Math.min(torpIncPerSec,narcoberriesTorporQueue);
        narcoberriesTorporQueue = narcoberriesTorporQueue - torpIncPerSec;
        totalUnits = totalUnits+torpToInc;
        totalSeconds = (totalUnits / rate);
    } else {
        // totalUnits = $("#ttUnits").val(); //.toFixed(2)
        totalSeconds = totalSeconds - 1;
        totalUnits = totalUnits - rate;
    }

    validateData();
    // Update timer
    totalSeconds = (totalUnits / rate); // Make sure time is synced.
    $("#ttUnits").val(totalUnits.toFixed(1)); //.toFixed(2)
    renderUpdate();
}

function renderUpdate() {
    miniBarPerc = ((totalUnits / maxUnits)* 100);
    if(miniBarPerc > 100) {
        miniBarPerc = 100;
    }
    $(".miniBar").css('width', miniBarPerc + '%');
    $("#ttTimeRemaining").html(timeFormat(totalSeconds, true));
}


function validateData() {
    //If user (or narcs) increased past max;
    if(totalUnits > maxUnits){
        totalUnits = maxUnits;
        biotoxinsTorporQueue = 0;
        narcoticsTorporQueue = 0;
        narcoberriesTorporQueue = 0;
    }

    if(totalSeconds <= 1){
        totalSeconds = 0;
        totalUnits = 0;
        stopTimer();
        dododeath.play();
    }
}

function useNarcotics(narcType) {
    var numToUse = 1;
    if(narcType == 'narcotics'){
        narcoticsUsed = narcoticsUsed + numToUse;
        narcoticsTorporQueue = narcoticsTorporQueue + (numToUse * narcotics.narcotics.torpor);
        $("#narcoticsUsed").html("<b>" + narcoticsUsed + "</b> used");
    } else if(narcType == 'narcoberries'){
        narcoberriesUsed = narcoberriesUsed + numToUse;
        narcoberriesTorporQueue = narcoberriesTorporQueue + (numToUse * narcotics.narcoberries.torpor);
        $("#narcoberriesUsed").html("<b>" + narcoberriesUsed + "</b> used");
    } else if(narcType == 'biotoxins'){
        biotoxinsUsed = biotoxinsUsed + numToUse;
        biotoxinsTorporQueue = biotoxinsTorporQueue + (numToUse * narcotics.biotoxins.torpor);
        $("#biotoxinsUsed").html("<b>" + biotoxinsUsed + "</b> used");
    }
    eat.play();
}

function startTimer() {
    if(!ttRunning){
        lowbeep.play();
        totalUnits = parseFloat($("#ttUnits").val());
        ttRunning = true;
        interval = setInterval( decreaseTimer , 1000);
        $('#ttStart').html('Pause Timer');
    } else {
        lowbeep.play();
        ttRunning = false;
        stopTimer()
        $('#ttStart').html('Start Timer');
    }
}


function stopTimer() {
    clearInterval(interval);
}

$("#ttUnits").on("change keyup paste", function(){
    totalUnits = parseFloat($("#ttUnits").val());
    if(totalUnits > maxUnits){
        totalUnits = maxUnits;
    }
    if(totalUnits < 0){
        totalUnits = 0;
    }
    totalSeconds = (totalUnits / rate); // Make sure time is synced.
    renderUpdate()
});

$("#ttAlarm").on("change keyup paste", function(){
    var alarm = parseFloat($("#ttAlarm").val());
    var alarmSecs = ((alarm * 60)+1);
});

$("#ttStart").click(function( event ) {
    startTimer();
});
$("#useNarcotics").click(function( event ) {
    useNarcotics('narcotics');
});
$("#useNarcoberries").click(function( event ) {
    useNarcotics('narcoberries');
});
$("#useBiotoxins").click(function( event ) {
    useNarcotics('biotoxins');
});

$( "#statCalcSearch" ).autocomplete({
    source: function (request, response) {
        var res = crs.filter(function(item) {
            return item.n.toUpperCase().includes(request.term.toUpperCase());
        });
        if(res.length > 0){
            return response(res);
        } else {
            return null;
        }
    },
    minLength: 1,
    select: function( event, r ) {
        console.log(r);
        // theURL = theURL.replace('taming','stat-calculator');
        location.replace('/torpor-timer/' + r.item.i)
        // console.log(r.item.u)
        // console.log(event)
    }
})
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
    return $( "<li>" )
        .append( "<span>" + item.n + "</span>" )
        .appendTo( ul );
};

$('#level').select();

$("#level").on("change keyup paste", function(){
    init();
})
