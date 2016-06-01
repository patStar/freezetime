function Item(id, name, maxStackSize, image, boundings, updateFrame, onCreate, onUse) {

    this.boundings      = (boundings instanceof Array) ? boundings : [boundings];
    this.maxStackSize   = maxStackSize;
    this.id             = id;
    this.name           = name;
    this.frame          = 0;
    this.weight         = 0;
    this.space          = 0;
    this.fillStatus     = 0;

    (onCreate || function () {
    })(this);

    this.getName = function (slot) {
        return this.name + (slot.stackSize > 1 ? (" X " + slot.stackSize) : "");
    };

    this.canBeUsed = function () {
        return onUse ? true : false
    };

    this.use = function (slot) {
        if (onUse) {
            onUse(this, slot);
        }
    };

    this.updateFrame = updateFrame || function () {
    };

    this.drawOn = function (ctx, target) {
        this.updateFrame(this);
        ctx.drawImage(image, this.boundings[this.frame].x, this.boundings[this.frame].y, this.boundings[this.frame].width, this.boundings[this.frame].height, target.x, target.y, target.width, target.height)
    }
}
Item.all = {};
Item.add = function (id, name, maxStackSize, image, bounding, updateFrame, onCreate, onUse) {
    Item.all[id] = new Item(id, name, maxStackSize, image, bounding, updateFrame, onCreate, onUse)
};