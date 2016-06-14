function MapDrawer(ctx, map, canvasWidth, canvasHeight) {

    var HOUSE = 7;
    var SEA = 9;
    var RUIN = 40;

    var tileSpriteMapping = {
        0 : Type.ground.coordinate(),
        2 : Type.tree1.coordinate(),
        3 : Type.tree2.coordinate(),
        4 : Type.tree3.coordinate(),
        5 : Type.tree4.coordinate(),
        6 : Type.grass.coordinate(),
        7 : Type.house.coordinate(),
        8 : Type.hole.coordinate(),
        9 : Type.see.coordinate(),
        10 : Type.see_n_w.coordinate(),
        11 : Type.see_n_e.coordinate(),
        12 : Type.see_s_w.coordinate(),
        13 : Type.see_s_e.coordinate(),
        14 : Type.see_w.coordinate(),
        15 : Type.see_e.coordinate(),
        16 : Type.see_e_x.coordinate(),
        17 : Type.see_w_x.coordinate(),
        18 : Type.see_n_x.coordinate(),
        19 : Type.see_s_x.coordinate(),
        20 : Type.see_sn_x.coordinate(),
        21 : Type.see_we_x.coordinate(),
        22 : Type.single_lake.coordinate(),
        30 : Type.ground_2.coordinate(),
        31 : Type.ground_3.coordinate(),
        32 : Type.ground_4.coordinate(),
        61 : Type.grass_2.coordinate(),
        62 : Type.grass_3.coordinate(),
        63 : Type.grass_4.coordinate(),
        64 : Type.grass_5.coordinate(),
        100 : Type.see_n_w.coordinate().add(0,8),
        110 : Type.see_n_e.coordinate().add(0,8),
        120 : Type.see_s_w.coordinate().add(0,8),
        130 : Type.see_s_e.coordinate().add(0,8),
        140 : Type.see_w.coordinate().add(0,8),
        150 : Type.see_e.coordinate().add(0,8),
        160 : Type.see_e_x.coordinate().add(0,8),
        170 : Type.see_w_x.coordinate().add(0,8),
        180 : Type.see_n_x.coordinate().add(0,8),
        190 : Type.see_s_x.coordinate().add(0,8),
        200 : Type.see_sn_x.coordinate().add(0,8),
        210 : Type.see_we_x.coordinate().add(0,8)
    };

    this.xShift = 0;
    this.yShift = 0;

    this.currentMousePosition = null;

    this.notify = function (topic, evt) {
        var x = Math.floor((evt.pageX - gameCanvas.offsetLeft) / 16);
        var y = Math.floor((evt.pageY - gameCanvas.offsetTop) / 16);
        if (!(x >= 0 && x < map.width() && y >= 0 && y < map.height())) {
            this.currentMousePosition = null;
            return
        }

        if (topic == InputListener.MOUSE_DOWN) {

        } else if (topic == InputListener.MOUSE_MOVE) {
            this.currentMousePosition = p(x, y)
        }
    };

    this.drawTile = function(ctx,spriteCoordinate,positionOnCanvas){
        ctx.drawImage(sprites, spriteCoordinate.x, spriteCoordinate.y, 8, 8, 32 * positionOnCanvas.x, 32 * positionOnCanvas.y, 32, 32)
    };

    this.draw = function () {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "grey";
        ctx.translate(Game.player.movement.mapShift.x, Game.player.movement.mapShift.y);

        var deathTime = 0;
        if (Game.player.status.isDead()) deathTime = Math.min(Math.max(0, (Date.now() - Game.player.status.dead - 7000) / 1000) / 10, 1);

        for (var ys = -16; ys < 12; ys++) {
            for (var xs = -16; xs < 12; xs++) {
                var field = map.get(Game.player.movement.position.x + xs, Game.player.movement.position.y + ys);

                var positionOnScreen = p(10+xs,10+ys);
                var spriteCoordinates = tileSpriteMapping[field.type];

                // Mirror the player in a lake
                // FIXME! ALPHA REFLECTION BUG
                if (arrayContains(field.type, lakeTiles)) {
                    this.drawTile(ctx,Type.see.coordinate(),positionOnScreen);
                    if (xs == 0 && ys == 1) {
                        if (Game.player.movement.moving && (arrayContains(map.get(Game.player.movement.position.x + xs, Game.player.movement.position.y + ys - 1).type, lakeTiles) || Game.player.movement.movingDirection.y != -1) && (arrayContains(map.get(Game.player.movement.position.x + xs - 1, Game.player.movement.position.y + ys).type, lakeTiles) || Game.player.movement.movingDirection.x != -1) && (arrayContains(map.get(Game.player.movement.position.x + xs + 1, Game.player.movement.position.y + ys).type, lakeTiles) || Game.player.movement.movingDirection.x != 1)) {
                            ctx.drawImage(sprites, Type.mirror_man.x, Type.mirror_man.y, 8, 8, 32 * 10 - Game.player.movement.mapShift.x, 32 * 11 - Game.player.movement.mapShift.y, 32, 32)
                        } else {
                            this.drawTile(ctx,Type.mirror_man.coordinate(),positionOnScreen);
                        }
                    }
                }

                if (field.isNot(SEA) && field.isNot(HOUSE) && field.isNot(RUIN)) {
                    this.drawTile(ctx,spriteCoordinates,positionOnScreen);
                } else if (field.type == HOUSE) {
                    this.drawTile(ctx,p(Type.hutStart.x + field.housePart.x*8, Type.hutStart.y + field.housePart.y*8),positionOnScreen);
                } else if (field.type == RUIN) {
                    this.drawTile(ctx,p(Type.ruinStart.x + field.housePart.x*8, Type.ruinStart.y + field.housePart.y*8),positionOnScreen);
                }

                if (field.unit.subType == SubType.FISHER_HUT) {
                    this.drawTile(ctx,p(Type.fisher_hut.x + field.housePart.x*8, Type.fisher_hut.y + field.housePart.y*8),positionOnScreen);
                }

                if (field.steps) {
                    if (field.steps == "E") {
                        this.drawTile(ctx,Type.stepsRight.coordinate(),positionOnScreen);
                    }
                    if (field.steps == "W") {
                        this.drawTile(ctx,Type.stepsLeft.coordinate(),positionOnScreen);
                    }
                    if (field.steps == "N") {
                        this.drawTile(ctx,Type.stepsUp.coordinate(),positionOnScreen);
                    }
                    if (field.steps == "S") {
                        this.drawTile(ctx,Type.stepsDown.coordinate(),positionOnScreen);
                    }
                    if (field.steps == "steps") {
                        this.drawTile(ctx,Type.steps.coordinate(),positionOnScreen);
                    }
                }

                if (field.unit.subType == SubType.SMALL_BRANCH) {
                    this.drawTile(ctx,Type.twig.coordinate(),positionOnScreen);
                } else if (field.unit.subType == SubType.UNKNOWN_IN_THE_SNOW) {
                    this.drawTile(ctx,Type.unknown_item.coordinate(),positionOnScreen);
                } else if (field.unit.type == SubType.CORPSE) {
                    this.drawTile(ctx,Type.man.coordinate(),positionOnScreen);
                } else if (field.unit.subType == SubType.CAMP_FIRE) {
                    AnimatedSprite.all.CAMP_FIRE.draw(ctx, box(32 * positionOnScreen.x, 32 * positionOnScreen.y, 32, 32))
                } else if (field.unit.subType == SubType.DROP) {
                    this.drawTile(ctx,Type.drop.coordinate(),positionOnScreen);
                } else if (field.unit.subType == SubType.BEAR) {
                    AnimatedSprite.all.BEAR.draw(ctx, box(32 * positionOnScreen.x + field.unit.xShift, 32 * positionOnScreen.y + Math.round(field.unit.yShift), 32, 32));
                    field.unit.xShift -= 2;
                    field.unit.yShift -= 0.2;
                }
            }
        }

        this.drawAlphaLayer(ctx, deathTime);

        if (map.get(Game.player.movement.position.x, Game.player.movement.position.y).type != HOUSE) {
            X = Type.guy.x;
            Y = Type.guy.y;
            if (Game.player.status.isAlive()) {
                // Player is alive
                if (Game.player.movement.moving) {
                    // Player is moving
                    if (Game.player.movement.movingDirection.y == -1) {
                        if (Game.player.movement.movingDirection.x == -1) {
                            AnimatedSprite.all.PLAYER_CHAR_MAN_BACK_LEFT.draw(ctx, box(32 * 10 - Game.player.movement.mapShift.x, 32 * 10 - Game.player.movement.mapShift.y, 32, 32))
                        } else {
                            AnimatedSprite.all.PLAYER_CHAR_MAN_BACK.draw(ctx, box(32 * 10 - Game.player.movement.mapShift.x, 32 * 10 - Game.player.movement.mapShift.y, 32, 32))
                        }
                    } else {
                        if (Game.player.movement.movingDirection.x == -1) {
                            AnimatedSprite.all.PLAYER_CHAR_MAN_LEFT.draw(ctx, box(32 * 10 - Game.player.movement.mapShift.x, 32 * 10 - Game.player.movement.mapShift.y, 32, 32))
                        } else {
                            AnimatedSprite.all.PLAYER_CHAR_MAN.draw(ctx, box(32 * 10 - Game.player.movement.mapShift.x, 32 * 10 - Game.player.movement.mapShift.y, 32, 32))
                        }
                    }
                } else if (Game.player.status.timeNearCampFire && Date.now() - Game.player.status.timeNearCampFire > 5000) {
                    // Player lies is near a camp fire
                    X = Type.guy_sitting.x;
                    Y = Type.guy_sitting.y;
                    ctx.drawImage(sprites, X, Y, 8, 8, 32 * 10, 32 * 10, 32, 32)
                } else {
                    // Player stands still
                    this.drawTile(ctx, Type.guy.coordinate() ,p(10,10))
                }
            } else {
                // Player is dead
                ctx.globalAlpha = deathTime;
                ctx.drawImage(sprites, 73, 88, 8, 8, 32 * 10, 32 * 10, 32, 32);
                ctx.globalAlpha = 1 - deathTime;
                AnimatedSprite.all.PLAYER_CHAR_MAN_DYING.draw(ctx, box(32 * 10 - Game.player.movement.mapShift.x, 32 * 10 - Game.player.movement.mapShift.y, 32, 32));
                ctx.globalAlpha = 1;
            }
        }

        ctx.translate(-Game.player.movement.mapShift.x, -Game.player.movement.mapShift.y)
    };

    this.drawAlphaLayer = function(ctx, deathTime){
        for (var ys = -16; ys < 12; ys++) {
            for (var xs = -16; xs < 12; xs++) {
                var field = map.get(Game.player.movement.position.x + xs, Game.player.movement.position.y + ys);

                var positionOnScreen = p(10 + xs, 10 + ys);

                // Alpha values of fields (light, fire, daylight, ...)
                if (field.lightFactor && field.lightFactor > 1 - Math.max(0, Math.abs(Game.dayTime.minutes - 720) - 240) / (8 * 60)) {
                    ctx.fillStyle = "rgba(0,0,20," + Math.max(0, 1 - (field.lightFactor + (w(2) ? 0.000 : +0.01))) + ")";
                    ctx.fillRect(positionOnScreen.x * 32, positionOnScreen.y * 32, 32, 32)
                } else if (Math.max(0, Math.abs(Game.dayTime.minutes - 720) - 240) < 8 * 60) {
                    var darkness = Math.max(0, Math.abs(Game.dayTime.minutes - 720) - 240) / (8 * 60);
                    ctx.fillStyle = "rgba(0,0,20," + Math.max(0, darkness) + ")";
                    ctx.fillRect(positionOnScreen.x * 32, positionOnScreen.y * 32, 32, 32)
                }

                ctx.globalAlpha = Math.min(Math.max(0, 1 - deathTime * 1.5), 1 - Game.player.status.condition / 100);
                ctx.fillStyle = "white";
                ctx.fillRect(-32, -32, canvasWidth + 64, canvasHeight + 64);
                ctx.globalAlpha = 1;
            }
        }
    }
}
