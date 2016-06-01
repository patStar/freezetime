function Player() {
    this.status = new PlayerStatus();
    this.inventory = new Inventory();
    this.movement = new PlayerMovement();
    this.isNearCampFire = function () {
        return (arrayContains('camp_fire', [Game.getPlayerOnMap(DIRECTION.NE).unit.subType,
            Game.getPlayerOnMap(DIRECTION.NW).unit.subType,
            Game.getPlayerOnMap(DIRECTION.SE).unit.subType,
            Game.getPlayerOnMap(DIRECTION.SW).unit.subType,
            Game.getPlayerOnMap(DIRECTION.N).unit.subType,
            Game.getPlayerOnMap(DIRECTION.E).unit.subType,
            Game.getPlayerOnMap(DIRECTION.W).unit.subType,
            Game.getPlayerOnMap(DIRECTION.S).unit.subType])
        )
    };

    this.isComfortable = function(){
        return this.status.isComfortable();
    };

    this.isHungry = function(){
        return this.status.isHungry();
    };
    this.isCold = function(){
        return this.status.isCold();
    };
    this.isThirsty = function(){
        return this.status.isThirsty();
    };
    this.isTired = function(){
        return this.status.isTired();
    };
    this.isDead = function () {
        return this.status.isDead();
    };
    this.isAlive = function () {
        return this.status.isAlive();
    };

    this.update = function (inputListener) {
        if (this.movement.moving) {
            this.movement.move();
        }

        console.log(1);

        var keyMoveMap = {};
        keyMoveMap[KeyCode.LEFT]    = "W";
        keyMoveMap[KeyCode.RIGHT]   = "E";
        keyMoveMap[KeyCode.UP]      = "N";
        keyMoveMap[KeyCode.DOWN]    = "S";

        if (!this.movement.moving && !Game.currentScreen && this.status.isAlive()) {
            // diagonal movement
            if ((inputListener.isKeyDown(KeyCode.LEFT) || inputListener.isKeyDown(KeyCode.RIGHT)) && (inputListener.isKeyDown(KeyCode.UP) || inputListener.isKeyDown(KeyCode.DOWN))) {
                var fieldDirection;
                if (inputListener.isKeyDown(KeyCode.LEFT) && inputListener.isKeyDown(KeyCode.UP)) {
                    fieldDirection = DIRECTION.NW
                } else if (inputListener.isKeyDown(KeyCode.LEFT) && inputListener.isKeyDown(KeyCode.DOWN)) {
                    fieldDirection = DIRECTION.SW
                } else if (inputListener.isKeyDown(KeyCode.RIGHT) && inputListener.isKeyDown(KeyCode.UP)) {
                    fieldDirection = DIRECTION.NE
                } else {
                    fieldDirection = DIRECTION.SE
                }

                if (Game.dialog.message) {
                    Game.dialog.reset();
                }
                Game.setMessageByField(Game.getPlayerOnMap(fieldDirection));

                if (!Game.getPlayerOnMap(fieldDirection).isPassable() && (Game.getPlayerOnMap(p(fieldDirection.x, 0)).isPassable() || Game.getPlayerOnMap(p(0, fieldDirection.y)).isPassable())) {
                    if (Game.isPassable(this.movement.position.x, this.movement.position.y + fieldDirection.y)) {
                        direction = p(0, fieldDirection.y)
                    } else if (Game.isPassable(this.movement.position.x + fieldDirection.x, this.movement.position.y)) {
                        direction = p(fieldDirection.x, 0)
                    }
                    var field = Game.getPlayerOnMap(fieldDirection);
                    if (Game.hasMessageToSet(field)) Game.setMessageByField(field);
                }

                if (Game.isPassable(this.movement.position.x + fieldDirection.x, this.movement.position.y + fieldDirection.y)) {
                    map.get(this.movement.position.x, this.movement.position.y).steps = "steps";
                    this.movement.startMoving(fieldDirection);
                    if (Game.search.isSearching()) Game.search.cancel()
                }
            } else {
                for (var key of [KeyCode.LEFT, KeyCode.RIGHT, KeyCode.UP, KeyCode.DOWN])
                {
                    if (!inputListener.isKeyDown(key) || (!this.movement.moving && Date.now() - inputListener.isKeyDown(key) < 50)) continue;
                    var direction = DIRECTION[keyMoveMap[key]];

                    if (!this.movement.moving) {
                        var playerField = Game.getPlayerOnMap();
                        var adjacentField = Game.getPlayerOnMap(direction);
                        if (adjacentField.isPassable()) {
                            if (playerField.steps || !adjacentField.steps) {
                                playerField.steps = "steps";
                            } else {
                                playerField.steps = keyMoveMap[key];
                            }
                            this.movement.startMoving(direction);
                            if (Game.search.isSearching()) Game.search.cancel();
                            Game.dialog.reset();
                            Game.setMessageByField(adjacentField);
                        } else {
                            if (Game.dialog.message) {
                                Game.dialog.reset();
                            }
                            Game.setMessageByField(adjacentField);
                        }
                    }
                    break;
                }
            }
        }
    }
}