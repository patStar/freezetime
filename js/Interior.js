function Interior(name, image, coords, unit) {
    this.name = name;
    this.bounding = coords;
    this.draw = function (ctx, screen) {
        drawBox(ctx, image, coords, screen);
    };
    this.unit = null;
    this.instantiate = function () {
        var instance = new Interior(name, image, coords, unit);
        instance.init();
        return instance
    };
    this.init = function () {
        this.unit = unit ? unit() : null;
    };
    this.search = function () {
        if (this.unit && this.unit.isSearchable()) this.unit.search();
    }
}
