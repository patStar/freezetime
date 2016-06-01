function DayTime(){
    var MINUTES_PER_DAY = 1440;

    this.minutes = 0;
    this.lastUpdate = Date.now();
    this.minutesPerSecond = 1;

    this.next = function(seconds){
        var _seconds = seconds || 1;
        this.minutes = (this.minutes + this.minutesPerSecond * _seconds) % MINUTES_PER_DAY;
    };
}
