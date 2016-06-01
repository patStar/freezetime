function UnitPickupItem(name, subType, message) {
    this.name = name;
    this.type = 'item';
    this.subType = subType;
    this.message = message;
    this.inventory = [name];
    this.searchTime = 0;
    this.isSearchable = function () {
        return false;
    };
    this.isLootable = function () {
        return false;
    };
    this.canBePickedUp = function () {
        return true
    };
    this.canBeDiggedUp = function () {
        return false
    };
    this.isEventUnit = function () {
        return false;
    };
    this.onClose = function () {
    };
    this.pickUp = function () {
        if (Game.player.inventory.hasFreeSlotFor(Item.all[Game.currentInterest.unit.subType])) {
            Game.player.inventory.addItem(Item.all[Game.currentInterest.unit.subType]);
            Game.currentInterest.unit = Units.EMPTY;
            if (!w(3)) {
                Game.setMessage([
                    new Message('GOT IT!'),
                    new Message('THAT WILL BE USEFUL'),
                    new Message('MIGHT BE USEFUL'),
                    new Message("THAT'LL COME IN HANDY."),
                    new Message('I CAN USE THAT'),
                    new Message('OKAY.'),
                    new Message('GOOD.')
                ].rnd())
            } else {
                Game.dialog.reset()
            }
        } else {
            Game.setMessage(new Message("I CAN'T CARRY ANY MORE."));
        }
    }
}