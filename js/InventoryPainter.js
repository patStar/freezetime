function InventoryPainter() {
    this.drawOn = function (inventory, ctx, position, selectable) {
        ctx.drawImage(sprites, 28, 64, 37, 54, position.x - 16, position.y - 16, 37 * 4, 54 * 4);
        for (var i = 0; i < inventory.size(); i++) {
            var item = inventory.getSlot(i).item;
            if (selectable && i == Game.selectedInventorySlot) ctx.drawImage(sprites, 0, 64, 14, 14, position.x + (i % 2) * 64, position.y + 64 * (Math.floor(i / 2)), 14 * 4, 14 * 4);
            if (item.id == 'nothing') continue;
            item.drawOn(ctx, box(position.x + (i % 2) * 64 + 12, position.y + 64 * (Math.floor(i / 2)) + 12, 32, 32));

            ctx.drawImage(sprites, 0, 78, 11, 9, position.x + (i % 2) * 64 + (i % 2 ? (+13 * 4) : (-10 * 4)), position.y + 64 * (Math.floor(i / 2)) + 12, 11 * 4, 9 * 4);
            var num = " " + inventory.getSlot(i).stackSize;
            num = num.substr(num.length - 2, 2);

            textPainter.drawText(num, ctx, 4 + position.x + (i % 2) * 64 + (i % 2 ? (+12 * 4) : (-10 * 4)), 4 + position.y + 64 * (Math.floor(i / 2)) + 12);
        }
    };

    this.drawLeft = function (inventory, ctx, selectable, dx, dy) {
        var _dx = dx || 0;
        var _dy = dy || 0;
        this.drawOn(inventory, ctx, p(32 * 3 + 10 + _dx, 6 * 32 + _dy), selectable)
    };
    this.drawRight = function (inventory, ctx, selectable, dx, dy) {
        var _dx = dx || 0;
        var _dy = dy || 0;
        this.drawOn(inventory, ctx, p(32 * 13 + 10 + _dx, 6 * 32 + _dy), selectable)
    }
}
