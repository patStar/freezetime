function Type(x, y, id) {
    this.x = x * Config.fieldSize.x;
    this.y = y * Config.fieldSize.y;
    this.coordinate = function(){
        return p(this.x,this.y);
    };
    this.id = id;
    Type.byId[id] = this;
}
Type.byId = [];
