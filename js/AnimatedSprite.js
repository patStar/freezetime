function AnimatedSprite(image, frames, doNotRepeat) {
    var currentFrame = 0;
    this.length = function () {
        return frames.length;
    };
    this.tick = function () {
        if (doNotRepeat) {
            currentFrame = Math.min(frames.length - 1, currentFrame + 1)
        } else {
            currentFrame = (currentFrame + 1) % frames.length
        }
    };
    this.draw = function (ctx, bounding) {
        var frame = frames[currentFrame];
        ctx.drawImage(image, frame.x, frame.y, frame.width, frame.height, bounding.x, bounding.y, bounding.width, bounding.height)
    }
}
AnimatedSprite.all = {};