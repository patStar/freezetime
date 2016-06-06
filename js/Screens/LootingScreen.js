function LootingScreen(ctx, messagePanel, inventoryBag) {
    this.visible = false;

    this.side = 1;

    this.show = function () {
        this.visible = true;
    };

    this.hide = function () {
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        this.visible = false;
    };

    this.draw = function () {
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        inventoryBag.drawLeft(Game.player.inventory, ctx, this.side == 0);
        inventoryBag.drawRight(Game.looting.unit.inventory, ctx, this.side == 1);

        var slot;

        if (this.side == 1) {
            slot = Game.looting.unit.inventory.getSlot(Game.selectedInventorySlot)
        } else {
            slot = Game.player.inventory.getSlot(Game.selectedInventorySlot)
        }

        var message = null;
        if (Game.looting.pickUpInProgress) {
            if (this.side == 1) {
                message = new Message("I THINK I WILL TAKE _\n< " + Game.looting.currentPickUpNumber + " >");
            } else {
                message = new Message("I WILL STASH _\n< " + Game.looting.currentPickUpNumber + " >");
            }
            drawButton(ctx, 32 * 2, 16 * 32, '(X) CANCEL');
        } else {
            message = new Message(slot.getText());
            drawButton(ctx, 32 * 2, 16 * 32, '(X) CLOSE');
        }

        messagePanel.drawOn(message, ctx, Game.looting.pickUpInProgress);

        if (slot.item.id != Item.all.nothing.id && (!Game.looting.pickUpInProgress || Game.looting.currentPickUpNumber != 0)) drawButton(ctx, 32 * 12, 16 * 32, this.side == 1 ? '(C) PICK UP' : '(C) STASH');
    };

    this.onKeyDown = function (key) {
        if (!this.visible) return;
        if (key == KeyCode.LEFT) {
            if (Game.looting.pickUpInProgress) {
                Game.looting.currentPickUpNumber = Math.max(1, Game.looting.currentPickUpNumber - 1)
            } else if (Game.selectedInventorySlot % 2) {
                Game.selectedInventorySlot -= 1;
            } else if (!(Game.selectedInventorySlot % 2) && this.side == 1) {
                Game.selectedInventorySlot += 1;
                this.side = 0;
            }
        } else if (key == KeyCode.RIGHT) {
            if (Game.looting.pickUpInProgress) {
                var slot = Game.looting.sourceInventory.getSlot(Game.selectedInventorySlot);
                var max = slot.stackSize;
                var playerCanPickUpMore = Game.looting.targetInventory.hasSpaceLeft() || Game.looting.targetInventory.canBeStacked(slot.item, Math.min(max, Game.looting.currentPickUpNumber + 1));
                if (playerCanPickUpMore) {
                    Game.looting.currentPickUpNumber = Math.min(max, Game.looting.currentPickUpNumber + 1)
                }
            } else if (!(Game.selectedInventorySlot % 2)) {
                Game.selectedInventorySlot += 1;
            } else if (Game.selectedInventorySlot % 2 && this.side == 0) {
                Game.selectedInventorySlot -= 1;
                this.side = 1;
            }
        } else if (key == KeyCode.UP) {
            if (Game.selectedInventorySlot > 1) {
                Game.selectedInventorySlot -= 2
            }
        } else if (key == KeyCode.DOWN) {
            if (Game.selectedInventorySlot < 4) {
                Game.selectedInventorySlot += 2
            }
        } else if (key == KeyCode.X) {
            if (Game.looting.pickUpInProgress) {
                Game.stopLooting()
            } else {
                Game.currentInterest.unit.onClose();
                Game.hideLootingDialog()
            }
        } else if (key == KeyCode.C) {
            if (Game.looting.pickUpInProgress) {
                if (Game.looting.currentPickUpNumber > 0) {
                    Game.looting.pickUp();
                    Game.stopLooting()
                }
            } else {
                if (this.side == 1 && Game.looting.unit.inventory.getSlot(Game.selectedInventorySlot).item != Item.all.nothing) {
                    Game.startLootingToInventory(Game.looting.unit.inventory, Game.player.inventory)
                } else if (this.side == 0 && Game.player.inventory.getSlot(Game.selectedInventorySlot).item != Item.all.nothing) {
                    Game.startLootingToInventory(Game.player.inventory, Game.looting.unit.inventory)
                }
            }
        }
    }
}