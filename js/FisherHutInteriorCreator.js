function FisherHutInteriorCreator(){

    this.createRoom = function () {
        var interior = [];

        var bigFurnitures = [Indoor.shelf];
        var smallFurnituresTop = [Indoor.map, Indoor.upperShelf];
        var smallFurnituresBottom = [Indoor.table, Indoor.smallShelf];

        if (w(2)) {
            // big furniture
            var furniture = bigFurnitures.rnd();
            if (furniture == Indoor.shelf) {
                interior.push(new InteriorPiece(furniture.instantiate(), FisherHutInteriorCreator.OFFSET_LEFT, 64, InteriorPiece.TYPE.big));
            }
        } else {
            // 1 small furniture
            var furnitureTop = smallFurnituresTop.rnd();
            var furnitureBottom = smallFurnituresBottom.rnd();

            if (w(2)) {
                // top
                if (furnitureTop == Indoor.map) {
                    interior.push(new InteriorPiece(furnitureTop.instantiate(), FisherHutInteriorCreator.OFFSET_LEFT-8, 64, InteriorPiece.TYPE.smallTop));
                    arrayRemove(Indoor.map, smallFurnituresTop);
                } else if (furnitureTop == Indoor.upperShelf) {
                    interior.push(new InteriorPiece(furnitureTop.instantiate(), FisherHutInteriorCreator.OFFSET_LEFT, 64, InteriorPiece.TYPE.smallTop));
                }
            } else {
                // bottom
                if (furnitureBottom == Indoor.table) {
                    interior.push(new InteriorPiece(furnitureBottom.instantiate(), FisherHutInteriorCreator.OFFSET_LEFT, 32 * 5, InteriorPiece.TYPE.smallBottom));
                    arrayRemove(furnitureBottom, smallFurnituresBottom);
                } else if (furnitureBottom == Indoor.smallShelf) {
                    interior.push(new InteriorPiece(furnitureBottom.instantiate(), FisherHutInteriorCreator.OFFSET_LEFT, 32 * 5 -16, InteriorPiece.TYPE.smallBottom));
                }
            }
        }

        interior.push(FisherHutInteriorCreator.createFishingHole());
        interior.push(new InteriorPiece(Indoor.stove.instantiate(), FisherHutInteriorCreator.OFFSET_LEFT + 184, 12, InteriorPiece.TYPE.big));


        return interior;
    }
}
FisherHutInteriorCreator.OFFSET_LEFT = 72;
FisherHutInteriorCreator.createFishingHole = function(){
    return new InteriorPiece(Indoor.fishingHoleClosed.instantiate(), FisherHutInteriorCreator.OFFSET_LEFT + 96, 228, InteriorPiece.TYPE.smallBottom);
};
FisherHutInteriorCreator.createOpenFishingHole = function(){
    return new InteriorPiece(Indoor.fishingHole.instantiate(), FisherHutInteriorCreator.OFFSET_LEFT + 96, 228, InteriorPiece.TYPE.smallBottom);
};
