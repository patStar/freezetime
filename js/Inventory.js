function Inventory(){
    var inventorySlots = [];
    this.maxSize = 6;

    this.containsSomething = function(){
        for(var slot of inventorySlots){
            if(slot.item.id != Item.all.nothing.id){
                return true;
            }
        }
        return false;
    };

    this.reset = function(){
        inventorySlots = [];
        for(var i=0; i<this.maxSize; i++){
            inventorySlots.push(new Slot(Item.all.nothing))
        }
    };
    this.size = function(){
        return inventorySlots.length
    };
    this.addItem = function(item, number){
        var _number = number || 1;
        if(this.canBeStacked(item, _number)){
            return this.stack(item, _number);
        }else if(this.hasSpaceLeft()){
            return this.addToSlot(item, _number);
        }
        return null;
    };
    this.stack = function(item, number){
        var _number = number || 1;
        var slot = this.getSlotByItem(item, _number);
        if(slot) slot.add(_number);
        return slot;
    };
    this.canBeStacked = function(item,number){
        var _number = number || 1;
        var slot = this.getSlotByItem(item, _number);
        return slot ? slot.canBeStacked(_number) : false;
    };
    this.getSlotByItem = function(item, number){
        var _number = number || 1;
        for(var slot of inventorySlots){
            if(slot.contains(item) && slot.canBeStacked(_number)){
                return slot;
            }
        }
        return null;
    };
    this.hasSpaceLeft = function(){
        for(var slot of inventorySlots){
            if(slot.item.id == 'nothing') return true;
        }
        return false
    };
    this.hasItem = function(item, number){
        var _number = number  || 1;
        for(var slot of inventorySlots){
            if(slot.item.id == item.id && slot.stackSize >= _number) return true;
        }
        return false
    };
    this.addToSlot = function(item, number){
        var _number = number || 1;
        for(var slot of inventorySlots){
            if(slot.item.id == 'nothing') {
                slot.setItem(item, _number);
                return slot;
            }
        }
        return null;
    };
    this.remove = function(item,number){
        var unitsLeft = number || 1;
        for(var slot of inventorySlots){
            if(slot.item.id == item.id){
                unitsLeft -= slot.remove(unitsLeft)
            }
            if(unitsLeft == 0){
                break;
            }
        }
    };
    this.hasFreeSlotFor = function(item,number){
        var _number = number || 1;
        for(var slot of inventorySlots){
            if(slot.item.id == 'nothing' || (slot.item.id == item.id && slot.canBeStacked(_number))) return true;
        }
    };
    this.getSlot = function(n){
        return inventorySlots[n];
    }
}