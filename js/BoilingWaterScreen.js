function BoilingWaterScreen(ctx, messagePanel) {
    this.visible = false;
    this.counter = 1;

    this.show = function () {
        this.visible = true;
    };

    this.hide = function () {
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        this.visible = false;
    };

    this.draw = function () {
        messagePanel.drawOn(new Message("I THINK < " + (this.counter * 250) + " ML >\nSHOULD BE ENOUGH.", new Option('C', 'BOIL SNOW ')), ctx)
    };

    this.onKeyDown = function (key) {
        if (!this.visible) return;

        if (key == KeyCode.LEFT) {
            this.counter = Math.max(1, this.counter - 1)
        } else if (key == KeyCode.RIGHT) {
            this.counter++
        } else if (key == KeyCode.C) {
            Game.player.inventory.addItem(Item.all.water, this.counter);
            Game.fastForward(this.counter * 10);
            Game.hideCurrentScreen();
            Game.showInventory();
        } else if (key == KeyCode.X) {
            Game.hideCurrentScreen();
            Game.showInventory();
        }
    }
}
