function CampFireScreen(ctx, messagePanel, campFireManager) {
    this.visible = false;

    this.show = function () {
        this.visible = true;
    };

    this.hide = function () {
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        this.visible = false;
    };

    this.draw = function () {
        var campFireField = Game.getPlayerOnMap(campFireManager.campFireBuildingMode);

        ctx.globalAlpha = 0.65;
        if (campFireManager.canBuildCampFire(campFireField)) {
            ctx.drawImage(sprites, Type.camp_fire_build.x * 8, Type.camp_fire_build.y * 8, 8, 8, (10 + campFireManager.campFireBuildingMode.x) * 32, (10 + campFireManager.campFireBuildingMode.y) * 32, 32, 32)
        } else {
            ctx.drawImage(sprites, Type.camp_fire_impossible.x * 8, Type.camp_fire_build.y * 8, 8, 8, (10 + campFireManager.campFireBuildingMode.x) * 32, (10 + campFireManager.campFireBuildingMode.y) * 32, 32, 32)
        }
        ctx.globalAlpha = 1;

        drawButton(ctx, 32 * 7 + 16, 15 * 32, '(X) CANCEL');
        drawButton(ctx, 32 * 5, 13 * 32, '(S) BUILD CAMP FIRE');
    };

    this.onKeyDown = function (key) {
        if (!this.visible) return;
        if (key == KeyCode.LEFT) {
            campFireManager.setCampFireBuildingMode(DIRECTION.W)
        }
        else if (key == KeyCode.UP) {
            campFireManager.setCampFireBuildingMode(DIRECTION.N)
        }
        else if (key == KeyCode.RIGHT) {
            campFireManager.setCampFireBuildingMode(DIRECTION.E)
        }
        else if (key == KeyCode.DOWN) {
            campFireManager.setCampFireBuildingMode(DIRECTION.S)
        }
        else if (key == KeyCode.S) {
            if (campFireManager.canBuildCampFire(Game.getPlayerOnMap(Game.campFireBuildingMode))) {
                campFireManager.addCampFire(Game.getPlayerOnMap(Game.campFireBuildingMode));
                Game.player.inventory.remove(Item.all.small_branch, 5);
                Game.player.inventory.remove(Item.all.matches, 1);
                campFireManager.stopCampFireBuildingMode()
            }
        }
        else if (key == KeyCode.X) {
            campFireManager.stopCampFireBuildingMode();
        }
    }
}