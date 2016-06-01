function MapDrawer(ctx, map) {

    var HOUSE = 7;
    var SEA = 9;
    var RUIN = 40;

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

    this.draw = function () {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "grey";
        ctx.translate(Game.player.movement.mapShift.x, Game.player.movement.mapShift.y);

        var deathTime = 0;
        if (Game.player.status.isDead()) deathTime = Math.min(Math.max(0, (Date.now() - Game.player.status.dead - 7000) / 1000) / 10, 1);

        for (var ys = -16; ys < 12; ys++) {
            for (var xs = -16; xs < 12; xs++) {
                var field = map.get(Game.player.movement.position.x + xs, Game.player.movement.position.y + ys);

                var x = 10 + xs;
                var y = 10 + ys;
                var X, Y;
                if (field.type == 0) {
                    X = Type.ground.x;
                    Y = Type.ground.y;
                } else if (field.type == 2) {
                    X = Type.tree1.x;
                    Y = Type.tree1.y;
                } else if (field.type == 3) {
                    X = Type.tree2.x;
                    Y = Type.tree2.y;
                } else if (field.type == 4) {
                    X = Type.tree3.x;
                    Y = Type.tree3.y;
                } else if (field.type == 5) {
                    X = Type.tree4.x;
                    Y = Type.tree4.y;
                } else if (field.type == 6) {
                    X = Type.grass.x;
                    Y = Type.grass.y;
                } else if (field.type == HOUSE) {
                    X = Type.house.x;
                    Y = Type.house.y;
                } else if (field.type == 8) {
                    X = Type.hole.x;
                    Y = Type.hole.y;
                } else if (field.type == SEA) {
                    X = Type.see.x;
                    Y = Type.see.y;
                } else if (field.type == 10) {
                    X = Type.see_n_w.x;
                    Y = Type.see_n_w.y;
                } else if (field.type == 11) {
                    X = Type.see_n_e.x;
                    Y = Type.see_n_e.y;
                } else if (field.type == 12) {
                    X = Type.see_s_w.x;
                    Y = Type.see_s_w.y;
                } else if (field.type == 13) {
                    X = Type.see_s_e.x;
                    Y = Type.see_s_e.y;
                } else if (field.type == 14) {
                    X = Type.see_w.x;
                    Y = Type.see_w.y;
                } else if (field.type == 15) {
                    X = Type.see_e.x;
                    Y = Type.see_e.y;
                } else if (field.type == 16) {
                    X = Type.see_e_x.x;
                    Y = Type.see_e_x.y;
                } else if (field.type == 17) {
                    X = Type.see_w_x.x;
                    Y = Type.see_w_x.y;
                } else if (field.type == 18) {
                    X = Type.see_n_x.x;
                    Y = Type.see_n_x.y;
                } else if (field.type == 19) {
                    X = Type.see_s_x.x;
                    Y = Type.see_s_x.y;
                } else if (field.type == 20) {
                    X = Type.see_sn_x.x;
                    Y = Type.see_sn_x.y;
                } else if (field.type == 21) {
                    X = Type.see_we_x.x;
                    Y = Type.see_we_x.y;
                } else if (field.type == 22) {
                    X = Type.single_lake.x;
                    Y = Type.single_lake.y;
                } else if (field.type == 30) {
                    X = Type.ground_2.x;
                    Y = Type.ground_2.y;
                } else if (field.type == 31) {
                    X = Type.ground_3.x;
                    Y = Type.ground_3.y;
                } else if (field.type == 32) {
                    X = Type.ground_4.x;
                    Y = Type.ground_4.y;
                }
                else if (field.type == 61) {
                    X = Type.grass_2.x;
                    Y = Type.grass_2.y;
                } else if (field.type == 62) {
                    X = Type.grass_3.x;
                    Y = Type.grass_3.y;
                } else if (field.type == 63) {
                    X = Type.grass_4.x;
                    Y = Type.grass_4.y;
                } else if (field.type == 64) {
                    X = Type.grass_5.x;
                    Y = Type.grass_5.y;
                }
                else if (field.type == 100) {
                    X = Type.see_n_w.x;
                    Y = (8 + Type.see_n_w.y);
                } else if (field.type == 110) {
                    X = Type.see_n_e.x;
                    Y = (8 + Type.see_n_e.y);
                } else if (field.type == 120) {
                    X = Type.see_s_w.x;
                    Y = (8 + Type.see_s_w.y);
                } else if (field.type == 130) {
                    X = Type.see_s_e.x;
                    Y = (8 + Type.see_s_e.y);
                } else if (field.type == 140) {
                    X = Type.see_w.x;
                    Y = (8 + Type.see_w.y);
                } else if (field.type == 150) {
                    X = Type.see_e.x;
                    Y = (8 + Type.see_e.y);
                } else if (field.type == 160) {
                    X = Type.see_e_x.x;
                    Y = (8 + Type.see_e_x.y);
                } else if (field.type == 170) {
                    X = Type.see_w_x.x;
                    Y = (8 + Type.see_w_x.y);
                } else if (field.type == 180) {
                    X = Type.see_n_x.x;
                    Y = (8 + Type.see_n_x.y);
                } else if (field.type == 190) {
                    X = Type.see_s_x.x;
                    Y = (8 + Type.see_s_x.y);
                } else if (field.type == 200) {
                    X = Type.see_sn_x.x;
                    Y = (8 + Type.see_sn_x.y);
                } else if (field.type == 210) {
                    X = Type.see_we_x.x;
                    Y = (8 + Type.see_we_x.y);
                }

                // Mirror the player in a lake
                // FIXME! ALPHA REFLECTION BUG
                if (arrayContains(field.type, lakeTiles)) {
                    ctx.drawImage(sprites, Type.see.x, Type.see.y, 8, 8, 32 * x, 32 * y, 32, 32);
                    if (xs == 0 && ys == 1) {
                        if (Game.player.movement.moving && (arrayContains(map.get(Game.player.movement.position.x + xs, Game.player.movement.position.y + ys - 1).type, lakeTiles) || Game.player.movement.movingDirection.y != -1) && (arrayContains(map.get(Game.player.movement.position.x + xs - 1, Game.player.movement.position.y + ys).type, lakeTiles) || Game.player.movement.movingDirection.x != -1) && (arrayContains(map.get(Game.player.movement.position.x + xs + 1, Game.player.movement.position.y + ys).type, lakeTiles) || Game.player.movement.movingDirection.x != 1)) {
                            ctx.drawImage(sprites, Type.mirror_man.x, Type.mirror_man.y, 8, 8, 32 * 10 - Game.player.movement.mapShift.x, 32 * 11 - Game.player.movement.mapShift.y, 32, 32)
                        } else {
                            ctx.drawImage(sprites, Type.mirror_man.x, Type.mirror_man.y, 8, 8, 32 * x, 32 * y, 32, 32)
                        }
                    }
                }

                if (field.isNot(SEA) && field.isNot(HOUSE) && field.isNot(RUIN)) {
                    ctx.drawImage(sprites, X, Y, 8, 8, 32 * x, 32 * y, 32, 32)
                } else if (field.type == HOUSE) {
                    ctx.drawImage(sprites, (Type.hutStart.x + field.housePart.x), (Type.hutStart.y + field.housePart.y), 8, 8, 32 * x, 32 * y, 32, 32)
                } else if (field.type == RUIN) {
                    ctx.drawImage(sprites, (Type.ruinStart.x + field.housePart.x), (Type.ruinStart.y + field.housePart.y), 8, 8, 32 * x, 32 * y, 32, 32)
                }

                if (field.unit.subType == SubType.FISHER_HUT) {
                    ctx.drawImage(sprites, (Type.fisher_hut.x + field.housePart.x), (Type.fisher_hut.y + field.housePart.y), 8, 8, 32 * x, 32 * y, 32, 32)
                }

                if (field.steps) {
                    if (field.steps == "E") {
                        ctx.drawImage(sprites, Type.stepsRight.x, Type.stepsRight.y, 8, 8, 32 * x, 32 * y, 32, 32)
                    }
                    if (field.steps == "W") {
                        ctx.drawImage(sprites, Type.stepsLeft.x, Type.stepsLeft.y, 8, 8, 32 * x, 32 * y, 32, 32)
                    }
                    if (field.steps == "N") {
                        ctx.drawImage(sprites, Type.stepsUp.x, Type.stepsUp.y, 8, 8, 32 * x, 32 * y, 32, 32)
                    }
                    if (field.steps == "S") {
                        ctx.drawImage(sprites, Type.stepsDown.x, Type.stepsDown.y, 8, 8, 32 * x, 32 * y, 32, 32)
                    }
                    if (field.steps == "steps") {
                        ctx.drawImage(sprites, Type.steps.x, Type.steps.y, 8, 8, 32 * x, 32 * y, 32, 32)
                    }
                }

                if (field.unit.subType == SubType.SMALL_BRANCH) {
                    X = Type.twig.x;
                    Y = Type.twig.y;
                    ctx.drawImage(sprites, X, Y, 8, 8, 32 * x, 32 * y, 32, 32)
                } else if (field.unit.subType == SubType.UNKNOWN_IN_THE_SNOW) {
                    X = Type.unknown_item.x;
                    Y = Type.unknown_item.y;
                    ctx.drawImage(sprites, X, Y, 8, 8, 32 * x, 32 * y, 32, 32)
                } else if (field.unit.type == SubType.CORPSE) {
                    X = Type.man.x;
                    Y = Type.man.y;
                    ctx.drawImage(sprites, X, Y, 8, 8, 32 * x, 32 * y, 32, 32)
                } else if (field.unit.subType == SubType.CAMP_FIRE) {
                    AnimatedSprite.all.CAMP_FIRE.draw(ctx, box(32 * x, 32 * y, 32, 32))
                } else if (field.unit.subType == SubType.DROP) {
                    X = Type.drop.x;
                    Y = Type.drop.y;
                    ctx.drawImage(sprites, 96, 40, 8, 8, 32 * x, 32 * y, 32, 32)
                } else if (field.unit.subType == SubType.BEAR) {
                    AnimatedSprite.all.BEAR.draw(ctx, box(32 * x + field.unit.xShift, 32 * y + Math.round(field.unit.yShift), 32, 32));
                    field.unit.xShift -= 2;
                    field.unit.yShift -= 0.2;
                }


                // Alpha values of fields (light, fire, daylight, ...)
                if (field.lightFactor && field.lightFactor > 1 - Math.max(0, Math.abs(Game.dayTime.minutes - 720) - 240) / (8 * 60)) {
                    ctx.fillStyle = "rgba(0,0,20," + Math.max(0, 1 - (field.lightFactor + (w(2) ? 0.000 : +0.01))) + ")";
                    ctx.fillRect(x * 32, y * 32, 32, 32)
                } else if (Math.max(0, Math.abs(Game.dayTime.minutes - 720) - 240) < 8 * 60) {
                    var darkness = Math.max(0, Math.abs(Game.dayTime.minutes - 720) - 240) / (8 * 60);
                    ctx.fillStyle = "rgba(0,0,20," + Math.max(0, darkness) + ")";
                    ctx.fillRect(x * 32, y * 32, 32, 32)
                }
            }
        }

        ctx.globalAlpha = Math.min(Math.max(0, 1 - deathTime * 1.5), 1 - Game.player.status.condition / 100);
        ctx.fillStyle = "white";
        ctx.fillRect(-32, -32, WIDTH + 64, HEIGHT + 64);
        ctx.globalAlpha = 1;

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
                    ctx.drawImage(sprites, X, Y, 8, 8, 32 * 10, 32 * 10, 32, 32)
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
    }
}
