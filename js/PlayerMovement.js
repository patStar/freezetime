function PlayerMovement() {
    this.moving = false;
    this.mapShift = p(0, 0);
    this.maxShift = p(32, 32);
    this.position = p(10, 10);
    this.movingDirection = p(0, 0);

    this.startMoving = function (direction) {
        this.movingDirection = direction;
        if (!this.moving) {
            Game.player.status.timeNearCampFire = 0; // FIXME
            var speed = 2;
            this.mapShift.x += speed * -this.movingDirection.x;
            this.mapShift.y += speed * -this.movingDirection.y;
            this.moving = true;
        }
    };

    this.stopMoving = function () {
        this.movingDirection = p(0, 0);
        this.mapShift = p(0, 0);
        this.moving = false;
    };

    this.move = function () {
        if (!this.moving) return;
        var speed = 2;
        this.mapShift.x -= speed * this.movingDirection.x;
        this.mapShift.y -= speed * this.movingDirection.y;
        if (Math.abs(this.mapShift.x) >= this.maxShift.x || Math.abs(this.mapShift.y) >= this.maxShift.y) {
            this.position.x = ((this.position.x + this.movingDirection.x + map.width()) % map.width());
            this.position.y = ((this.position.y + this.movingDirection.y + map.height()) % map.height());
            this.stopMoving();
            if (Game.player.isNearCampFire()) { // FIXME
                Game.player.status.timeNearCampFire = Date.now(); // FIXME
            }
        }
    };
}