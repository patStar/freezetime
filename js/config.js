var language = "en"

var MAP_WIDTH =1000;
var MAP_HEIGHT=1000;

var WIDTH = 21*32;
var HEIGHT= 21*32;

var lakeTiles = [9,100,110,120,130,140,150,160,170,180,190,200,210,10,11,12,13,14,15,16,17,18,19,20,21,22];
var passableTypes = [30,31,32,9,0,6,10,100,110,120,130,140,150,160,170,180,190,200,210,11,12,13,14,15,16,17,18,19,20,21,22,61,62,63,64];
var campFireTypes = [6,61,62,63,64,0,30,31,32];

var fieldSize = p(8,8);

var animationStepTime = 250;
var stepTime = 50;

