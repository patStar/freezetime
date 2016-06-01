function DroppingProcess(){
    this.inProgress = false;
    this.slot = null;
    this.currentCount = 0;
    this.raiseCount = function(){
        if(this.currentCount < this.slot.stackSize){
            this.currentCount++;
        }
    };
    this.lowerCount = function(){
        if(this.currentCount > 1){
            this.currentCount--;
        }
    };
    this.drop = function(){
        var unit;
        if(Game.getPlayerOnMap().unit.subType == SubType.DROP){
            unit = Game.getPlayerOnMap().unit;
        }else if(Game.getPlayerOnMap().unit == Units.EMPTY){
            unit = new UnitStash();
            Game.getPlayerOnMap().unit = unit;
        }
        unit.inventory.addItem(this.slot.item,this.currentCount);
        this.slot.remove(this.currentCount);
        this.stop();
    };
    this.start = function(){
        this.inProgress = true;
        this.slot = Game.player.inventory.getSlot(Game.selectedInventorySlot);
        this.currentCount = this.slot.stackSize;
    };
    this.stop = function(){
        this.inProgress = false;
        this.slot = null;
        this.currentCount = 0;
    }
}
