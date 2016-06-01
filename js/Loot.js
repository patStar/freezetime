function Loot(item, minCount, maxCount, probability) {
    this.item = item;
    this.minCount = minCount;
    this.maxCount = maxCount;
    this.probability = probability;
    this.getSlot = function () {
        return new Slot(item, minCount + w(maxCount - minCount + 1))
    }
}
