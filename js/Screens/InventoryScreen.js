function InventoryScreen(ctx, messagePanel, inventoryBag, conditionPanel) {

    this.visible = false;

    this.show = function () {
        this.visible = true;
    };

    this.hide = function () {
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        this.visible = false;
    };

    this.draw = function () {
        ctx.clearRect(0, 0, ctx.width, ctx.height);

        conditionPanel.drawPanel(ctx);

        inventoryBag.drawLeft(Game.player.inventory, ctx, true);

        if (Game.dropping.inProgress) {
            var message = new Message("HOW MANY SHOULD I DROP?\n< " + Game.dropping.currentCount + " >");
            messagePanel.drawOn(message, ctx);

            drawButton(ctx, 32 * 2 - 16, 16 * 32, '(X) CANCEL');
            drawButton(ctx, 32 * 9, 16 * 32, '(D) DROP');
        } else {
            var slot = Game.player.inventory.getSlot(Game.selectedInventorySlot);
            var message = new Message(slot.getText());
            messagePanel.drawOn(message, ctx);

            drawButton(ctx, 32 * 2 - 16, 16 * 32, '(I,X) CLOSE');
            if (slot.item != Item.all.nothing) drawButton(ctx, 32 * 9, 16 * 32, '(D) DROP');
            if (slot.item.canBeUsed()) {
                drawButton(ctx, 32 * 14 + 16, 16 * 32, '(C) USE');
            }
            if (Game.player.isNearCampFire()) {
                drawButton(ctx, 32 * 4, 18 * 32, '(S) BOIL SNOW TO WATER');
            } else if (Game.canStartCampFire()) {
                drawButton(ctx, 32 * 4, 18 * 32, '(S) START CAMP FIRE');
            }
        }
    };

    this.onKeyDown = function (key) {
        if (!this.visible) return;

        if (Game.dropping.inProgress) {
            if (key == KeyCode.LEFT) {
                Game.dropping.lowerCount();
            } else if (key == KeyCode.RIGHT) {
                Game.dropping.raiseCount();
            } else if (key == KeyCode.D) {
                Game.dropping.drop();
            } else if (key == KeyCode.X) {
                Game.dropping.stop()
            }
        } else {
            if (key == KeyCode.LEFT) {
                if (Game.selectedInventorySlot % 2) {
                    Game.selectedInventorySlot -= 1;
                }
            } else if (key == KeyCode.RIGHT) {
                if (!(Game.selectedInventorySlot % 2)) {
                    Game.selectedInventorySlot += 1;
                }
            } else if (key == KeyCode.UP) {
                if (Game.selectedInventorySlot > 1) {
                    Game.selectedInventorySlot -= 2
                }
            } else if (key == KeyCode.DOWN) {
                if (Game.selectedInventorySlot < 4) {
                    Game.selectedInventorySlot += 2
                }
            } else if (key == KeyCode.S) {
                if (Game.player.isNearCampFire()) {
                    Game.hideInventory();
                    Game.dialog.reset();
                    Game.showScreen(Game.screens.boilingWater);
                } else if (Game.canStartCampFire()) {
                    Game.hideInventory();
                    Game.dialog.reset();
                    Game.campFireManager.startCampFire();
                }
            } else if (key == KeyCode.I) {
                Game.hideInventory();
            } else if (key == KeyCode.D) {
                Game.dropping.start()
            } else if (key == KeyCode.C) {
                if (Game.player.inventory.getSlot(Game.selectedInventorySlot).item.canBeUsed()) {
                    Game.player.inventory.getSlot(Game.selectedInventorySlot).item.use(Game.player.inventory.getSlot(Game.selectedInventorySlot));
                }
            } else if (key == KeyCode.X) {
                Game.hideInventory();
            }
        }
    }
}