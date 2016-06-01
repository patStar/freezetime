function Slot(item, number) {
    this.getText = function () {
        return this.item.getName(this)
    };
    this.item = item;
    this.stackSize = number || 1;
    this.contains = function (item) {
        return this.item.id == item.id;
    };
    this.setItem = function (item, number) {
        var _number = number || 1;
        this.item = item;
        this.stackSize = number;
    };
    this.canBeStacked = function (number) {
        var _number = number || 1;
        return this.stackSize + _number <= this.item.maxStackSize
    };
    this.add = function (number) {
        var _number = number || 1;
        if (this.canBeStacked(_number)) {
            this.stackSize += _number;
        }
    };
    this.clear = function () {
        this.item = Item.all.nothing;
        this.stackSize = 1;
    };
    this.remove = function (n) {
        var removeable = Math.min(n, this.stackSize);
        this.stackSize -= removeable;
        if (this.stackSize == 0) {
            this.clear();
        }
        return removeable;
    }
}
