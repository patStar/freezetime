function Unit(type, subType, messages, lootable, minSearchTime, maxSearchTime, loot, minItems, maxItems) {
    this.type = type;
    this.subType = subType;
    this.message = messages.rnd();
    this.inventory = new Inventory();
    this.inventory.reset();
    this.isLootable = function () {
        return (lootable && this.searched) || false;
    };
    this.isSearchable = function () {
        return lootable && !this.searched;
    };
    this.canBePickedUp = function () {
        return false
    };
    this.canBeDiggedUp = function () {
        return false
    };
    this.isEventUnit = function () {
        return false;
    };
    this.searchTime = minSearchTime + w(maxSearchTime - minSearchTime) + 1;
    this.searched = false;
    this.onClose = function () {
    };
    this.search = function () {
        if (this.searched) {
            Game.dialog.reset();
            Game.showLootingDialog(this);
        } else if(!Game.search.isSearching()){
            Game.search.start(this, function (unit) {
                unit.searched = true;
                for (var i = 0; i < minItems + w(maxItems - minItems); i++) {
                    unit.rollInventory();
                }
                Game.dialog.reset();
                if (unit.inventory.containsSomething()) {
                    Game.showLootingDialog(unit);
                } else {
                    Game.setMessage(new Message("NOTHING USEFUL HERE."));
                }
            });
        }
    };
    this.rollInventory = function () {
        var looting = getFromProbabilityArray(loot);
        var slot = looting.getSlot();
        this.inventory.addItem(slot.item).stackSize = slot.stackSize;
        looting.item = Item.all.nothing;
        looting.minCount = 1;
        looting.maxCount = 1;
    }
}
