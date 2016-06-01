function InteriorPiece(interior, x, y, type) {
    this.type = type;
    this.interior = interior;
    this.x = x;
    this.y = y;
    this.draw = function (ctx, shift) {
        this.interior.draw(ctx, shift.add(this.x, this.y))
    }
}
InteriorPiece.TYPE = {
    big: 1,
    smallTop: 2,
    smallBottom: 3
};
