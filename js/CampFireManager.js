function CampFireManager(){

    this.campFireBuildingMode = false;
    this.campFireLightRadius = 10;

    this.canBuildCampFire = function(campFireField){
        return (arrayContains(campFireField.type,campFireTypes) && campFireField.unit == Units.EMPTY)
    };

    this.startCampFire = function(){
        this.campFireBuildingMode = DIRECTION.N;
        this.showScreen(game.screens.campFire);
    };

    this.addCampFire = function(field){
        field.unit = Units.camp_fire.camp_fire();
        field.unit.startTime = Date.now();
        if(	Game.player.isNearCampFire()){
            Game.player.status.timeNearCampFire = Date.now();
        }

        for(var ys = -this.campFireLightRadius; ys<=this.campFireLightRadius; ys++){
            for(var xs = -this.campFireLightRadius; xs<=this.campFireLightRadius; xs++){
                var factor = 1 - Math.min(1,Math.sqrt((Math.pow(xs,2)+Math.pow(ys,2))/Math.sqrt(2*Math.pow(this.campFireLightRadius,2))));
                field.neighbor(p(xs,ys)).lightFactor += factor;
            }
        }
    };

    this.putOutCampFire = function(field){
        if(field.unit.subType != 'camp_fire') return;
        field.unit = Units.EMPTY;
        if(	!Game.player.isNearCampFire()){
            Game.player.status.timeNearCampFire = 0;
        }

        for(var ys = -this.campFireLightRadius; ys<=this.campFireLightRadius; ys++){
            for(var xs = -this.campFireLightRadius; xs<=this.campFireLightRadius; xs++){
                var factor = 1 - Math.min(1,Math.sqrt((Math.pow(xs,2)+Math.pow(ys,2))/Math.sqrt(2*Math.pow(this.campFireLightRadius,2))));
                field.neighbor(p(xs,ys)).lightFactor -= factor;
            }
        }
    };

    this.setCampFireBuildingMode = function(direction){
        this.campFireBuildingMode = direction;
        Game.dialog.reset();
    };

    this.stopCampFireBuildingMode = function(){
        this.campFireBuildingMode = false;
        Game.dialog.reset();
        Game.hideCurrentScreen();
    }
}
