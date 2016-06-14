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
    this.interact = function (screen) {
        if (this.unit){
            if(this.unit.isSearchable()) this.unit.search();
            else if(this.unit.isEventUnit()) {
                this.unit.event(screen);
            }
        }
    };

    this.getText = function() {
        if (this.unit){
            if(this.unit.isSearchable()) return '(C) SEARCH';
            else if(this.unit.isEventUnit()) return this.unit.message.option.getText();
        }
        return '(?) ???';
    }
}
