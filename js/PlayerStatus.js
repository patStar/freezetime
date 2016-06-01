function PlayerStatus() {
    this.dead = false;
    this.condition = 100;
    this.fatigue = 0;
    this.hunger = 0;
    this.thirst = 0;
    this.temperature = 0;
    this.timeNearCampFire = 0;
    this.thresholds = {
        hunger : [1000, 2100, 2600, 2880], // eating reduces hunger by 800
        thirst : [250, 375, 440, 500], // drinking 250ml reduces thirst by 170
        fatigue : [1440, 2100, 2600, 2880], // sleep reduces fatigue by 230/hour
        temperature : [800, 1600, 2000, 2200]
    };
    this.penalties = {
        hunger : 1/60,
        thirst : 3/60,
        fatigue : 1/60,
        temperature : 0.3
    };
    this.temperatureRaiseNearFire = 50;

    this.isDead = function () {
        return this.dead;
    };
    this.isAlive = function () {
        return !this.dead;
    };

    this.isComfortable = function(){
        return this.hunger < this.thresholds.hunger.min() && this.thirst < this.thresholds.thirst.min() && this.temperature < this.thresholds.temperature.min() && this.fatigue < this.thresholds.fatigue.min()
    };

    this.isHungry = function(){
        return this.hunger >= this.thresholds.hunger.min();
    };
    this.isCold = function(){
        return this.temperature >= this.thresholds.temperature.min();
    };
    this.isThirsty = function(){
        return this.thirst >= this.thresholds.thirst.min();
    };
    this.isTired = function(){
        return this.fatigue >= this.thresholds.fatigue.min();
    };

    this.getNextTemperatureThreshold = function(){
        return getNextThreshold('temperature')
    };
    this.getNextHungerThreshold = function(){
        return getNextThreshold('hunger')
    };
    this.getNextThirstThreshold = function(){
        return getNextThreshold('thirst')
    };
    this.getNextFatigueThreshold = function(){
        return getNextThreshold('fatigue')
    };

    this.getNextThreshold = function(condition){
        for(var i of Object.getOwnPropertyNames(this.thresholds[condition])){
            if(this.thresholds[condition][i] > this[condition]){
                return i+1;
            }
        }
        return 0;
    };

    this.updateConditions = function(){
        this.updateCondition("hunger");
        this.updateCondition("thirst");
        this.updateCondition("fatigue");

        if(this.timeNearCampFire > 0){
            this.warmUpNearFire();
        }else if(Game.currentScreen.isIndoors){
            this.temperature = Math.max(0,Math.min(this.temperature-Game.currentTemperatureModifier,this.thresholds.temperature.max()));
        }else if(this.temperature < this.thresholds.temperature.max()){
            this.temperature = Math.max(0,Math.min(this.temperature+Game.currentTemperatureModifier,this.thresholds.temperature.max()));
        }else if(this.temperature >= this.thresholds.temperature.max()){
            this.condition = Math.max(0,this.condition-this.penalties.temperature)
        }
    };

    this.updateCondition = function(condition) {
        if(this[condition] < this.thresholds[condition].max()){
            this[condition]++
        }else{
            this.condition = Math.max(0,this.condition-this.penalties[[condition]])
        }
    };

    this.warmUpNearFire = function(){
        this.temperature = Math.max(0,this.temperature-this.temperatureRaiseNearFire)
    };
}
