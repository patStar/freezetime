Array.prototype.rnd = function () {
    return this[Math.floor(this.length * Math.random())];
};

Array.prototype.max = function () {
    return Math.max(...this);
};

Array.prototype.min = function () {
    return Math.min(...this);
};


function arrayContains(needle, haystack) {
    return haystack.indexOf(needle) > -1;
}

function arrayRemove(needle, haystack) {
    if (arrayContains(needle, haystack)) {
        return haystack.splice(haystack.indexOf(needle), 1);
    }
    return null;
}

function p(x, y) {
    return {
        x: x, y: y, add: function (x, y) {
            return p(this.x + x, this.y + y)
        }, addV: function (v) {
            return p(this.x + v.x, this.y + v.y)
        }
    };
}

function img(src) {
    var im = new Image();
    im.src = src;
    return im;
}

function w(x) {
    return Math.floor(Math.random() * x)
}

function createCanvas(width, height, inputListener, id) {
    var canvas = document.createElement('canvas');
    canvas.id = id;
    canvas.width = width;
    canvas.height = height;
    if (inputListener) {
        canvas.onmousedown = inputListener.onMouseDown;
        canvas.onmousemove = inputListener.onMouseMove;
    }
    return canvas;
}

function box(x, y, w, h) {
    return {x: x, y: y, width: w, height: h}
}

function drawBox(ctx,image,box,screen){
    ctx.drawImage(image,box.x,box.y,box.width,box.height,screen.x,screen.y,box.width*4,box.height*4)
}

function makePixelPerfect(ctx) {
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
}

function drawButton(ctx, x, y, text) {
    ctx.fillStyle = "#21262b";
    ctx.fillRect(x, y + 8, text.length * 5 * 4, 32 + 16);
    ctx.fillStyle = "#e0f0f0";
    ctx.fillRect(x + 4, y + 8 + 4, text.length * 5 * 4 - 8, 32 + 16 - 8);
    textPainter.drawText(text, ctx, x + 16, y + 18);
}
