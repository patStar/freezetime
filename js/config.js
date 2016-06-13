var Config = {
    language : "en",
    images : {
        'main_sprites' : 'gfx/sprites.png',
        'text_sprites' : 'gfx/text.png'
    },
    width : 21*32,
    height : 21*32,
    mapWidth : 1000,
    mapHeight : 1000,
    animationStepTime : 250,
    stepTime : 50,
    fieldSize : p(8,8)
};

var lakeTiles = [9,100,110,120,130,140,150,160,170,180,190,200,210,10,11,12,13,14,15,16,17,18,19,20,21,22];
var passableTypes = [30,31,32,9,0,6,10,100,110,120,130,140,150,160,170,180,190,200,210,11,12,13,14,15,16,17,18,19,20,21,22,61,62,63,64];
var campFireTypes = [6,61,62,63,64,0,30,31,32];

var GRASS_PROBABILITY = 0.01;
var STONE_PROBABILITY = 0.007;
var HUT_PROBABILITY = 0.01;//0.0005;
var CORPSE_PROBABILITY = 0.0001;
var WOOD_PROBABILITY = 0.01;
var LAKE_PROBABILITY = 0.01;
var ITEM_PROBABILITY = 0.01;
var HIDDEN_ITEM_PROBABILITY = 0.0005;
var FISHER_HUT_PROBABILITY = 0.95;

