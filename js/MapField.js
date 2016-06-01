function MapField(type, x, y) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.unit = Units.EMPTY;
    this.lightFactor = 0;
    this.isPassable = function () {
        return Game.isPassable(this.x, this.y);
    };
    this.neighbor = function (direction) {
        return map.get(this.x + direction.x, this.y + direction.y)
    };
    this.is = function (type) {
        return this.type == type;
    };
    this.isNot = function (type) {
        return this.type != type;
    }
}
