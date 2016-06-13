function FisherHutInteriorCreator(){

    const FURNITURE_WIDTH = 128;
    const OFFSET_LEFT = 32;

    this.createRoom = function () {
        var interior = [];

        var bigFurnitures = [Indoor.stoneHearth, Indoor.shelf];
        var smallFurnituresTop = [Indoor.map, Indoor.window];
        var smallFurnituresBottom = [Indoor.bigTable, Indoor.smallShelf];

        // columns
        for (var n = 0; n < 3; n++) {

            if (w(2)) {
                // big furniture
                var furniture = bigFurnitures.rnd();
                if (furniture == Indoor.stoneHearth) {
                    interior.push(new InteriorPiece(furniture.instantiate(), n * FURNITURE_Config.width + OFFSET_LEFT, 32, InteriorPiece.TYPE.big));
                    arrayRemove(Indoor.stoneHearth, bigFurnitures);
                } else if (furniture == Indoor.shelf) {
                    interior.push(new InteriorPiece(furniture.instantiate(), n * FURNITURE_Config.width + OFFSET_LEFT, 72, InteriorPiece.TYPE.big));
                }
            } else {
                // 2 small furnitures
                var furnitureTop = smallFurnituresTop.rnd();
                var furnitureBottom = smallFurnituresBottom.rnd();

                // top
                if (furnitureTop == Indoor.map) {
                    interior.push(new InteriorPiece(furnitureTop.instantiate(), n * FURNITURE_Config.width + OFFSET_LEFT - 4, 72, InteriorPiece.TYPE.smallTop));
                    arrayRemove(Indoor.map, smallFurnituresTop);
                } else if (furnitureTop == Indoor.window) {
                    interior.push(new InteriorPiece(furnitureTop.instantiate(), n * FURNITURE_Config.width + OFFSET_LEFT - 4, 72, InteriorPiece.TYPE.smallTop));
                }

                // bottom
                if (furnitureBottom == Indoor.bigTable) {
                    interior.push(new InteriorPiece(furnitureBottom.instantiate(), n * FURNITURE_Config.width + OFFSET_LEFT/2, 32 * 5 + 16, InteriorPiece.TYPE.smallBottom));
                    arrayRemove(furnitureBottom, smallFurnituresBottom);
                } else if (furnitureBottom == Indoor.smallShelf) {
                    interior.push(new InteriorPiece(furnitureBottom.instantiate(), n * FURNITURE_Config.width + OFFSET_LEFT, 32 * 5 - 12, InteriorPiece.TYPE.smallBottom));
                }
            }
        }

        return interior;
    }
}
