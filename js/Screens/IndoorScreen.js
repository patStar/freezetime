function IndoorScreen(ctx, messagePanel, inventoryBag, conditionPanel) {
    this.visible = false;
    this.timeStatus = 0;

    this.currentlySelected = null;

    this.interior = [];

    this.initRoom = function (interior) {
        this.interior = interior
    };

    this.show = function () {
        this.visible = true;
        this.currentlySelected = 0;
    };

    this.hide = function () {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.visible = false;
    };

    this.isIndoors = true;
    this.side = 1;

    this.draw = function () {
        this.timeStatus = (this.timeStatus + 1) % 40;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        conditionPanel.drawPanel(ctx);

        inventoryBag.drawLeft(Game.player.inventory, ctx, this.side == 0, -56, -32);

        if (Game.looting.unit) {
            inventoryBag.drawRight(Game.looting.unit.inventory, ctx, this.side == 1, +56, -32);

            var message = new Message("_");
            messagePanel.drawOn(message, ctx);

            var currentInterior = this.interior[this.currentlySelected];
            currentInterior.interior.draw(ctx, p(330 - Math.floor(currentInterior.interior.bounding.width / 2) * 4, 260 - Math.floor(currentInterior.interior.bounding.height / 2) * 4));

            var slot;

            if (this.side == 1) {
                slot = Game.looting.unit.inventory.getSlot(Game.selectedInventorySlot)
            } else {
                slot = Game.player.inventory.getSlot(Game.selectedInventorySlot)
            }

            message = null;
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
        } else {
            var interiorViewField = p(7 * 32 + 8, 4 * 32 - 16);
            Indoor.viewField.draw(ctx, interiorViewField);
            for (var interiorPiece of
            this.interior
        )
            {
                interiorPiece.draw(ctx, interiorViewField)
            }
            var currentInterior = this.interior[this.currentlySelected];
            Indoor.pointer.draw(ctx, interiorViewField.add(currentInterior.x + Math.floor(this.timeStatus / 20), currentInterior.y + 4 * Math.floor(currentInterior.interior.bounding.height / 3)));

            var message = new Message(currentInterior.interior.name);
            messagePanel.drawOn(message, ctx);

            drawButton(ctx, 32 * 2 - 16, 16 * 32, '(X) EXIT');
            drawButton(ctx, 32 * 13, 16 * 32, '(C) SEARCH');
            //drawButton(ctx,32*5,18*32,'(S) SWITCH ROOM');
        }
    };


    this.onKeyDown = function (key) {
        if (!this.visible) return;

        if (Game.looting.unit) {
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
                    Game.hideLootingDialog();
                    this.side = 1;
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
        } else {
            var currentInterior = this.interior[this.currentlySelected];
            var shift = 1;
            if (key == KeyCode.LEFT) {
                if (currentInterior.type == InteriorPiece.TYPE.smallTop) {
                    shift = 1;
                } else if (currentInterior.type == InteriorPiece.TYPE.smallBottom) {
                    shift = 2;
                }

                if (this.interior[(this.interior.length + this.currentlySelected - shift) % this.interior.length].type == InteriorPiece.TYPE.smallBottom) {
                    shift = 2;
                }

                this.currentlySelected = (this.interior.length + this.currentlySelected - shift) % this.interior.length;
            } else if (key == KeyCode.RIGHT) {
                if (currentInterior.type == InteriorPiece.TYPE.smallTop) {
                    shift = 2;
                } else if (currentInterior.type == InteriorPiece.TYPE.smallBottom) {
                    if (this.interior[(this.interior.length + this.currentlySelected + shift) % this.interior.length].type == InteriorPiece.TYPE.smallTop) {
                        shift = 2;
                    } else {
                        shift = 1;
                    }
                }

                this.currentlySelected = (this.currentlySelected + shift) % this.interior.length;
            } else if (key == KeyCode.UP) {
                if (currentInterior.type == InteriorPiece.TYPE.smallBottom) {
                    shift = 1;
                } else {
                    shift = 0;
                }
                this.currentlySelected = (this.interior.length + this.currentlySelected - shift) % this.interior.length;
            } else if (key == KeyCode.DOWN) {
                if (currentInterior.type == InteriorPiece.TYPE.smallTop) {
                    shift = 1;
                } else {
                    shift = 0;
                }
                this.currentlySelected = (this.currentlySelected + shift) % this.interior.length;
            } else if (key == KeyCode.S) {
                //this.initRoom()
            } else if (key == KeyCode.C) {
                currentInterior.interior.search();
            } else if (key == KeyCode.X) {
                Game.hideCurrentScreen();
            }
        }
    }
}
