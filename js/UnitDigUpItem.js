function UnitDigUpItem(subType, messages, minSearchTime, maxSearchTime, loot) {

    this.loot = getFromProbabilityArray(loot);
    this.type = 'item';
    this.subType = subType;
    this.message = new Message(messages.rnd(), new Option('C', 'DIG UP'));
    this.inventory = [name];
    this.searchTime = this.loot.min + w(this.loot.max - this.loot.min) + 1;

    this.isLootable = function () {
        return false;
    };
    this.canBePickedUp = function () {
        return false
    };
    this.canBeDiggedUp = function () {
        return true
    };
    this.isEventUnit = function () {
        return false;
    };
    this.isSearchable = function () {
        return true
    };
    this.digUp = function () {
        return this.loot.unit();
    };
    this.onClose = function () {
    };
    this.search = function () {
        Game.search.start(this, function (unit) {
            var newUnit = unit.digUp();
            Game.currentInterest.unit = newUnit;
            Game.search.unit = newUnit;
            Game.dialog.reset();
            Game.setMessageByField(Game.currentInterest);
        }, "WHAT HAVE WE HERE?");
    }
}