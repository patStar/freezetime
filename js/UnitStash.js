function UnitStash(messages) {
    this.type = 'item';
    this.subType = 'drop';
    this.name = 'DROPPED ITEMS';
    this.message = new Message(null, new Option('C', 'PICK UP DROPPED ITEMS'));
    this.inventory = new Inventory();
    this.inventory.reset();
    this.onClose = function () {
        if (!this.inventory.containsSomething()) {
            Game.currentInterest.unit = Units.EMPTY
        }
    };
    this.isEventUnit = function () {
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
    this.isSearchable = function () {
        return false
    };
    this.pickUp = function () {
        Game.dialog.reset();
        Game.showLootingDialog(this);
    }
}