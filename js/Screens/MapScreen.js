function MapScreen(inputListener, mapDrawer, stepTime, language) {

    this.lastTime = 0;
    this.visible = false;

    this.show = function () {
        this.visible = true;
    };

    this.hide = function () {
        this.visible = false;
    };

    this.draw = function () {
        if(Game.time-this.lastTime > stepTime){
            this.lastTime = Game.time;
            mapDrawer.draw();
        }
    };

    this.onKeyDown = function (keyCode) {
        if(keyCode == KeyCode.I && Game.player.status.isAlive() && Game.currentScreen != Game.screens.inventory){
            Game.dialog.reset();
            Game.showScreen(Game.screens.inventory);
        } else if(keyCode == KeyCode.C && Game.player.status.isAlive()){
            if(Game.currentInterest){
                if(Game.currentInterest.unit.canBePickedUp()){
                    // PICK UP current interest
                    Game.currentInterest.unit.pickUp();
                }else if(Game.currentInterest.unit.isSearchable()){
                    Game.currentInterest.unit.search();
                }else if(Game.currentInterest.unit.isEventUnit()){
                    Game.currentInterest.unit.event();
                }else{
                    Game.dialog.reset();
                }
            }else{
                Game.dialog.reset();
            }
        } else if(keyCode == KeyCode.X && Game.player.isAlive()){
            // ... Random talking
            if(Game.dialog.message) {
                Game.dialog.reset();
            }else{
                var messages = [];

                if(Game.player.isComfortable() ){
                    messages = messages.concat(GameMessages.defaultConditionMessages[language].map(x => new Message(x)));
                }else{
                    var stats = [];

                    if(Game.player.isHungry()){stats.push("HUNGRY")}
                    if(Game.player.isThirsty()){stats.push("THIRSTY")}
                    if(Game.player.isCold()){stats.push("COLD")}
                    if(Game.player.isTired()){stats.push("TIRED")}

                    messages.push(new Message("I'M SO "+stats.rnd()+".\nBUT AT LEAST I'M ALIVE."))
                }

                var houseNear = false;
                for(var ys=-8; ys<9 && !houseNear; ys++){
                    for(var xs=-8; xs<9; xs++){
                        if(map.get(Game.player.movement.position.x+xs, Game.player.movement.position.y+ys).unit.subType == SubType.HOUSE){
                            houseNear = true;
                            break;
                        }
                    }
                }
                if(houseNear){
                    messages = messages.concat(GameMessages.nearHouse[language].map(x => new Message(x)));
                }
                Game.dialog.message = messages.rnd()
            }
        }
    };

    this.onKeyUp = function (key) {
        inputListener.releaseKey(code)
    }
}
