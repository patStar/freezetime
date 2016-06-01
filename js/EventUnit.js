function EventUnit(type, subType, message, event) {
    this.type = type;
    this.subType = subType;
    this.message = message;
    this.isEventUnit = function () {
        return true;
    };
    this.isSearchable = function () {
        return false;
    };
    this.isLootable = function () {
        return false;
    };
    this.canBePickedUp = function () {
        return false
    };
    this.canBeDiggedUp = function () {
        return false
    };
    this.onClose = function () {
    };
    this.event = event;
}
