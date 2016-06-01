function Type(x, y, id) {
    this.x = x * fieldSize.x;
    this.y = y * fieldSize.y;
    this.id = id;
    Type.byId[id] = this;
}
Type.byId = [];
