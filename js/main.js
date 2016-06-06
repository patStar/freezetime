//pragma strict

var inputListener = new InputListener();
var gameCanvas, gameView, ctx, map, mapDrawer, stepManager;
var sprites;

var Game = {
    interiorCreator : new InteriorCreator(),
    dropping : new DroppingProcess(),
    onKeyDown : function(code){
        inputListener.pressKey(code);
        if(this.currentScreen){
            this.currentScreen.onKeyDown(code);
        }
    },
    onKeyUp : function(code){
        inputListener.releaseKey(code)
    },
    createCanvas : function(name){
        Game.canvas[name] = createCanvas(WIDTH,HEIGHT,null,name);
        Game.ctx[name] = Game.canvas[name].getContext('2d');
        makePixelPerfect(Game.ctx[name])
    },
    canvas : {},
    ctx : {},
    screens : {},
    screenStack : [],
    currentScreen  : null,
    drawCurrentScreen : function(){
        if(this.currentScreen){
            this.currentScreen.draw();
        }
    },
    showScreen : function(screen){
        this.hideCurrentScreen();
        this.currentScreen = screen;
        this.currentScreen.show();
    },
    hideCurrentScreen : function(){
        if(this.currentScreen){
            this.currentScreen.hide();
            if(this.screenStack.length > 1){
                this.screenStack.pop()
            }
            this.currentScreen = this.screenStack[this.screenStack.length-1];
        }
    },
    fastForward : function(minutes){
        this.dayTime.minutes = (this.dayTime.minutes+minutes) % 1440
    },
    dayTime : new DayTime(),
    inventoryVisible : false,
    time: 0,
    campFireManager : new CampFireManager(),
    selectedInventorySlot: 0,
    isPassable : function (x,y){
        return arrayContains(map.get(x,y).unit.subType,[Units.EMPTY.subType,'small_branch','drop']) && arrayContains(map.get(x,y).type,passableTypes)
    },
    showLootingDialog : function(unit){
        Game.looting.unit = unit;
        Game.selectedInventorySlot = 0;
        if(!this.currentScreen.isIndoors){
            this.showScreen(Game.screens.looting)
        }
    },
    hideLootingDialog : function(){
        Game.looting.unit = null;
        Game.selectedInventorySlot = 0;
        Game.dialog.reset();
        if(!this.currentScreen.isIndoors){
            this.hideCurrentScreen()
        }
    },
    looting : {
        showDialog : false,
        unit : null,
        currentPickUpNumber : 0,
        pickUpInProgress : false,
        sourceInventory : null,
        targetInventory : null,
        pickUp : function(){
            var item = this.sourceInventory.getSlot(Game.selectedInventorySlot).item;
            if(this.targetInventory.hasFreeSlotFor(item, this.currentPickUpNumber)){
                this.targetInventory.addItem(item, this.currentPickUpNumber);
                this.sourceInventory.remove(item, this.currentPickUpNumber)
            }
        }
    },
    player : null,
    startLootingToInventory : function(source, target){
        var slot = source.getSlot(Game.selectedInventorySlot);
        Game.looting.currentPickUpNumber = slot.stackSize;
        Game.looting.pickUpInProgress = true;
        Game.looting.sourceInventory = source;
        Game.looting.targetInventory = target
    },
    stopLooting : function(){
        Game.looting.currentPickUpNumber = 0;
        Game.looting.pickUpInProgress = false;
    },
    lastTemperatureUpdate : Date.now(),
    currentTemperatureModifier : 1.6,
    update : function(){
        if(Game.search.isSearching()){
            var n = Game.search.searchTime - Game.search.searchTimeToDo + 1;
            Game.setMessage(new Message(Game.search.message+"\n\n\n"+" ".repeat(Math.floor(Game.search.searchTime/3))+"["+"I".repeat(n)+".".repeat(Game.search.searchTimeToDo-1)+"]"),true)
        }

        // dying
        if(Game.player.status.condition == 0 && Game.player.status.isAlive()){
            document.getElementById('instructions').style.display = "none";
            Game.player.status.dead = Date.now();
            Game.dialog.reset();
        }

        if(Date.now() - Game.dayTime.lastUpdate > 1000 && Game.player.status.isAlive()){

            Game.dayTime.lastUpdate = Date.now();
            Game.dayTime.next();

            Game.player.status.updateConditions();
        }

        if(Date.now() - Game.lastTemperatureUpdate > 1000){
            Game.lastTemperatureUpdate = Date.now();
            var modifier = 0;
            if(!w(10)){
                if(w(2)){
                    modifier = 0.1;
                }else{
                    modifier = 0.1;
                }
            }


            Game.currentTemperatureModifier = Math.max(1.3,Math.min(5, Game.currentTemperatureModifier+modifier));
        }
    },
    search : {
        unit:null,
        searchIntervalStart: 0,
        searchTimeToDo: 0,
        searchTime : 0,
        outcome : null,
        message : null,
        defaultOutcome : function(){
            this.searchIntervalStart = 0;
            this.searchTime = 0;
            Game.findSomething(Game.search.unit)
        },
        start : function(unit,outcome,text){
            this.message = text || ["LET'S SEE IF I CAN FIND SOMETHING","WHAT HAVE WE HERE?","THERE MUST BE SOMETHING _","JUST A SEC _"].rnd();
            this.unit = unit;
            this.searchTime = unit.searchTime;
            this.searchTimeToDo = unit.searchTime;
            this.searchIntervalStart = Game.time;
            this.outcome = outcome;
        },
        cancel : function(){
            this.outcome = null;
            this.message = null;
            this.searchTimeToDo = 0;
            this.searchIntervalStart = 0;
            this.searchTime = 0;
        },
        update : function(time){
            if(this.searchTimeToDo == 0) return;
            if(time - this.searchIntervalStart > 1000){
                this.searchTimeToDo--;
                this.searchIntervalStart = time;
                if(this.searchTimeToDo == 0) {
                    (this.outcome || this.defaultOutcome)(this.unit);
                    this.outcome = null;
                    this.message = null;
                }
            }
        },
        isSearching : function(){
            return this.searchTimeToDo > 0;
        }
    },
    shaderComputation : -1,
    findSomething : function(unit){
        if(unit.inventory.length == 0 || unit.inventory.getSlot(0).item == Item.all.nothing){
            Game.setMessage(new Message("THERE'S NOTHING I COULD USE."))
        }else{
            Game.setMessage(new Message("I FOUND: "+unit.inventory.getSlot(0).getText(),new Option('C','PICK UP')))
        }
        unit.searched = true;
    },
    currentInterest : null,
    dialog : {
        message : null,
        reset : function() {
            Game.dialog.message = null;
            textPainter.reset();
        }
    },
    hasMessageToSet : function(field){
        return field.unit.message;
    },
    setMessageByField : function(field){
        Game.currentInterest = null;
        if(field.unit.message){
            Game.currentInterest = field;
            Game.dialog.message = field.unit.message;
        }
    },
    setMessage : function(message, keepCurrentInterest){
        if(typeof message == "string"){
            message = new Message(message);
        }

        if(!keepCurrentInterest) Game.currentInterest = null;
        Game.dialog.message = message;
        textPainter.reset();
    },
    showInventory : function(){
        this.showScreen(this.screens.inventory);
    },
    hideInventory : function(){
        this.hideCurrentScreen();
        this.selectedInventorySlot = 0;
    },
    canStartCampFire : function(){
        if(
            Game.player.inventory.hasItem(Item.all.small_branch,5) &&
            Game.player.inventory.hasItem(Item.all.matches)
        ){
            return true;
        }
    },
    getPlayerOnMap : function(direction,times){
        if(!direction){
            direction = p(0,0)
        }

        return map.get(Game.player.movement.position.x+direction.x*(times || 1),Game.player.movement.position.y+direction.y*(times || 1))
    }
};

function getFromProbabilityArray(loot){
    var sum = 0;
    for(var i=0; i<loot.length; i++){
        sum += loot[i].probability
    }
    var r = Math.random()*sum;
    var current = 0;
    for(var i=0; i<loot.length; i++){
        if(current + loot[i].probability >= r){
            return loot[i];
            break;
        }
        current += loot[i].probability
    }
    return null;
}

var Units = {
    add : function(type,subType,messages,lootable,minSearchTime,maxSearchTime,loot,minItems,maxItems){
        if(!Units[type]) Units[type] = {};
        if(!Units[type][subType]) Units[type][subType] = function() { return new Unit(type,subType,messages,lootable,minSearchTime,maxSearchTime,loot,minItems,maxItems)};
    },
    addEventUnit : function(type,subType,messages,event){
        if(!Units[type]) Units[type] = {};
        if(!Units[type][subType]) Units[type][subType] = function() { return new EventUnit(type,subType,messages,event)};
    },
    addPickupItem : function(name,subType){
        if(!Units['item']) Units['item'] = {};
        if(!Units['item'][subType]) Units['item'][subType] = function() { return new UnitPickupItem(name,subType,new Message(null,new Option('C','PICK UP '+name)))};
    },
    addDigUpItem : function(subType,messages,minSearchTime,maxSearchTime,loot){
        if(!Units['item']) Units['item'] = {};
        if(!Units['item'][subType]) Units['item'][subType] = function() { return new UnitDigUpItem(subType,messages,minSearchTime,maxSearchTime,loot)};
    }
};

Units.EMPTY = new Unit('empty','empty',[]);

var dayTimeShader = [];
var dayTimeShaderColors = [];

function updateShader(){

    var W = WIDTH / 4;
    var H = HEIGHT / 4;
    Game.shaderComputation = 0;
    for(var i=0; i<=30; i++){
        Game.shaderComputation = i;
        dayTimeShader.unshift(createCanvas(W,H));
        var shaderCtx = dayTimeShader[0].getContext('2d');
        shaderCtx.clearRect(0,0,W,H);
        daylight = i/30.0;
        var rg = Math.round(daylight * 255);
        var color = "rgb("+rg+","+rg+","+Math.min(255,rg+20)+")";
        dayTimeShaderColors.unshift(color);
        for(var y=0; y<H; y++){
            for(var x=0; x<W; x++){
                shaderCtx.globalAlpha = Math.min(Math.sqrt(Math.pow(W/2,2)+Math.pow(H/2,2))/Game.currentTemperatureModifier,Math.sqrt(Math.pow(x-W/2,2)+Math.pow(y-H/2,2)))/(Math.sqrt(Math.pow(W/2,2)+Math.pow(H/2,2))/Game.currentTemperatureModifier);
                shaderCtx.fillStyle=color;
                shaderCtx.fillRect(x,y,1,1);
                shaderCtx.globalAlpha = 1;
            }
        }
    }
}

var textPainter, lightCtx, lightCanvas,crissleCtx,crissleCanvas;

function getSprites(x,y,w,h,n){
    var result = [];
    for(var i=0; i<n; i++){
        result.push(box(x+w*i,y,w,h))
    }
    return result
}

/***************************************

 S T A R T

 ****************************************/
function start(){

    sprites = img('gfx/sprites.png');

    Item.add('nothing','NOTHING',1,sprites,box(0,7*8,8,8));
    Item.add('small_branch','SMALL BRANCH',10,sprites,box(0,7*8,8,8));
    Item.add('matches','MATCHES',99,sprites,box(7*8,7*8,8,8));
    Item.add('book','BOOK',5,sprites,box(8*8,7*8,8,8));
    Item.add('canned_food','CANNED FOOD',5,sprites,box(14*8,7*8,8,8),function(){},function(){},function(item){
        if(Math.floor(Game.player.status.hunger * 25 /Game.player.status.hungerThresholds[3]) > 0){
            Game.player.status.hunger = Math.max(0,Game.player.status.hunger - 800);
            Game.player.inventory.remove(item)
        }
    });
    Item.add('water','CLEAN WATER',12,sprites,box(13*8,5*8,8,8),function(){},function(item){
        item.getName = function(slot){
            return this.name+" ("+(slot.stackSize*250)+" ML)";
        };
    },function(item, slot){
        if(Math.floor(Game.player.status.thirst * 25 /Game.player.status.thirstThresholds[3]) > 0){
            Game.player.status.thirst = Math.max(0,Game.player.status.thirst - 170);
            slot.remove(1)
        }
    });

    Units.add('animal','bear',[new Message("_")]);

    Units.add('indoor','shelf'			,[new Message("A SHELF",new Option('C','SEARCH'))], true,3,4,[new Loot(Item.all.nothing,1,1,1),new Loot(Item.all.matches,2,12,10),new Loot(Item.all.water,1,1,1),new Loot(Item.all.book,1,1,1)],0,3);
    Units.add('indoor','small_shelf'	,[new Message("A SMALL SHELF",new Option('C','SEARCH'))], true,3,4,[new Loot(Item.all.nothing,1,1,1),new Loot(Item.all.matches,2,12,10),new Loot(Item.all.water,1,1,1),new Loot(Item.all.book,1,1,1)],0,1);
    Units.add('indoor','big_table'		,[new Message("A TABLE",new Option('C','SEARCH'))], true,3,4,[new Loot(Item.all.nothing,1,1,1),new Loot(Item.all.matches,2,12,10),new Loot(Item.all.water,1,1,1),new Loot(Item.all.book,1,1,1)],0,2);
    Units.add('indoor','stone_hearth'	,[new Message("A STONE HEARTH",new Option('C','SEARCH'))], true,3,4,[new Loot(Item.all.nothing,1,1,1),new Loot(Item.all.matches,2,12,10),new Loot(Item.all.book,1,1,1)],0,1);
    Units.add('corpse','elder_man'		,[new Message("THE FROZEN CORPSE OF AN ELDER MAN.\nWHAT A MESS!",new Option('C','SEARCH'))], true,3,4,[new Loot(Item.all.nothing,1,1,100),new Loot(Item.all.matches,2,12,10),new Loot(Item.all.water,1,1,1),new Loot(Item.all.book,1,1,1)]);
    Units.add('corpse','elder_women'	,[new Message("THE DEAD BODY OF AN ELDER WOMAN.\nI WONDER WHAT HAPPENED TO HER.",new Option('C','SEARCH'))], true,3,4,[new Loot(Item.all.nothing,1,1,100),new Loot(Item.all.matches,2,12,10),new Loot(Item.all.water,1,1,1),new Loot(Item.all.book,1,1,1)]);
    Units.add('corpse','women'			,[new Message("SHE'S DEAD.\nWHAT WAS SHE DOING OUT HERE?",new Option('C','SEARCH'))], true,3,4,[new Loot(Item.all.nothing,1,1,100),new Loot(Item.all.matches,2,12,10),new Loot(Item.all.water,1,1,1),new Loot(Item.all.book,1,1,1)]);
    Units.add('corpse','man'			,[new Message("THIS MAN IS DEAD. HE IS FROZEN.\nI CAN'T SEE ANY WOUNDS.",new Option('C','SEARCH'))], true,3,4,[new Loot(Item.all.nothing,1,1,100),new Loot(Item.all.matches,2,12,10),new Loot(Item.all.water,1,1,1),new Loot(Item.all.book,1,1,1)]);
    Units.addEventUnit('building' ,SubType.HOUSE,
        new Message(
            ["SHELTER! FINALLY!","THIS ONE'S STILL STANDING.\nLET'S HAVE A LOOK INSIDE.","A SAFE PLACE TO HIDE\nFROM THE WIND?"].rnd(),
            new Option('C','SEARCH')
        )
        , function(){
            Game.dialog.reset();
            if(!this.interior){
                this.interior = Game.interiorCreator.createCabinRoom();
            }
            Game.screens.indoor.initRoom(this.interior);
            Game.showScreen(Game.screens.indoor)
        });
    Units.add('building' ,SubType.RUIN,[
        new Message("THIS PLACE IS COLLAPSED."),
        new Message("THE REMNANTS OF A HOUSE.\nLOOKS LIKE IT COLLAPSED LONG AGO."),
        new Message("ONCE, THIS WAS THE HOME OF SOMEBODY.\nNOW THIS PLACE IS A RUIN.")
    ]);
    Units.add('building' ,SubType.FISHER_HUT,[
        new Message(
            ["AN OLD AND ABANDONED FISHING HUT.\nAT LEAST SOME TYPE OF SHELTER.","A RAMSHACKLE FISHING HUT.\nKEEPS THE WIND OUTSIDE I HOPE."].rnd(),
            new Option('C','SEARCH')
        )
    ], true,3,5,[new Loot(Item.all.nothing,1,1,30),new Loot(Item.all.water,1,1,1),new Loot(Item.all.canned_food,1,2,1),new Loot(Item.all.matches,12,20,10),new Loot(Item.all.book,1,1,1)],3);
    Units.addEventUnit('camp_fire' ,SubType.CAMP_FIRE,[
        new Message("WELL, IT STILL BURNS.",new Option('C','PUT OUT FIRE')),
        new Message("ONE LIGHT IN THE DARK.",new Option('C','PUT OUT FIRE')),
        new Message("KEEPS THE COLD AWAY.",new Option('C','PUT OUT FIRE')),
        new Message("I MIGHT SURVIVE A BIT LONGER NOW.",new Option('C','PUT OUT FIRE')),
    ].rnd(),function(){
        Game.campFireManager.putOutCampFire(Game.currentInterest);
        Game.dialog.reset()
    });

    // roof gets same message as body programatically
    Units.add('building' ,SubType.FISHER_HUT_ROOF,[]);
    Units.STONE = new Unit('landscape','stone',[]);
    Units.addPickupItem(Item.all.small_branch.name,Item.all.small_branch.id);
    Units.addPickupItem('MISC STUFF','misc_stuff');

    Units.addDigUpItem(SubType.UNKNOWN_IN_THE_SNOW,['THERE IS SOMETHING BENEATH THE SNOW.'],3,6,[
        new Diggable(Units.item.small_branch,2,3,10),
        new Diggable(Units.corpse.elder_man,4,6,1),
        new Diggable(Units.corpse.elder_women,4,6,1),
        new Diggable(Units.corpse.man,4,6,1),
        new Diggable(Units.corpse.women,4,6,1)]);

    Game.player = new Player();
    Game.player.inventory.reset();
    Game.player.inventory.addItem(Item.all.matches,20);

    /*
     Game.player.inventory.addItem(Item.all.small_branch)
     Game.player.inventory.getSlotByItem(Item.all.small_branch).stackSize = 5;
     */
    Game.player.inventory.addItem(Item.all.canned_food,2);
    Game.player.inventory.addItem(Item.all.water,4);

    AnimatedSprite.all.BEAR = new AnimatedSprite(sprites,getSprites(74,96,8,8,3));
    AnimatedSprite.all.CAMP_FIRE = new AnimatedSprite(sprites,[box(9*8,7*8,8,8),box(9*8,8*8,8,8),box(9*8,9*8,8,8)]);
    AnimatedSprite.all.PLAYER_CHAR_MAN = new AnimatedSprite(sprites,[box(8,6*8,8,8),box(2*8,6*8,8,8)]);
    AnimatedSprite.all.PLAYER_CHAR_MAN_LEFT = new AnimatedSprite(sprites,[box(5*8,7*8,8,8),box(6*8,7*8,8,8)]);
    AnimatedSprite.all.PLAYER_CHAR_MAN_BACK = new AnimatedSprite(sprites,[box(8,7*8,8,8),box(2*8,7*8,8,8)]);
    AnimatedSprite.all.PLAYER_CHAR_MAN_BACK_LEFT = new AnimatedSprite(sprites,[box(3*8,7*8,8,8),box(4*8,7*8,8,8)]);
    AnimatedSprite.all.PLAYER_CHAR_MAN_DYING = new AnimatedSprite(sprites,getSprites(72,80,8,8,3).concat([box(80,80,8,8),box(80,80,8,8)]).concat(getSprites(72,80,8,8,3)).concat([box(80,80,8,8),box(80,80,8,8),box(80,80,8,8),box(80,80,8,8),box(72,80,8,8),box(72,80,8,8),box(72,80,8,8),box(72,80,8,8)]).concat(getSprites(96,80,8,8,4)),true);

    Type.guy = new Type(0,0);
    Type.man = new Type(0,3);
    Type.tree1 = new Type(1,0);
    Type.tree2 = new Type(2,0);
    Type.tree3 = new Type(3,0);
    Type.tree4 = new Type(4,0);
    Type.grass = new Type(5,0);
    Type.grass_2 = new Type(3,6);
    Type.grass_3 = new Type(4,6);
    Type.grass_4 = new Type(5,6);
    Type.grass_5 = new Type(6,6);
    Type.twig = new Type(7,6);
    Type.unknown_item = new Type(8,6);
    Type.drop = new Type(12,5);

    Type.house = new Type(6,0);
    Type.hole = new Type(7,0);
    Type.stepsRight = new Type(8,0);
    Type.ground = new Type(9,0);
    Type.see = new Type(10,0);
    Type.stepsDown = new Type(11,0);
    Type.stepsUp = new Type(12,0);
    Type.stepsLeft = new Type(13,0);
    Type.steps = new Type(14,0);
    Type.ground_2 = new Type(15,0);
    Type.see_n_w = new Type(0,1);
    Type.see_n_e = new Type(1,1);
    Type.see_s_w = new Type(2,1);
    Type.see_s_e = new Type(3,1);
    Type.see_w = new Type(4,1);
    Type.see_e = new Type(5,1);
    Type.see_e_x = new Type(6,1);
    Type.see_w_x = new Type(7,1);
    Type.see_n_x = new Type(8,1);
    Type.see_s_x = new Type(9,1);
    Type.see_sn_x = new Type(10,1);
    Type.see_we_x = new Type(11,1);
    Type.ground_3 = new Type(6,3);
    Type.ground_4 = new Type(7,3);
    Type.ruin= new Type(8,3);
    Type.speak= new Type(9,3);
    Type.single_lake= new Type(10,3);

    Type.hutStart= new Type(3,4);
    Type.ruinStart= new Type(0,35);
    Type.mirror_man= new Type(9,4);

    Type.fisher_hut= new Type(10,4);

    Type.camp_fire= new Type(9,7);
    Type.camp_fire_build= new Type(10,7);
    Type.camp_fire_impossible =new Type(11,7);
    Type.guy_sitting =new Type(12,7);

    Indoor = {
        pointer: new Interior('POINTER',sprites,box(14,70,5,6)),
        viewField : new Interior('VIEW FIELD',sprites,box(0,141,107,71)),
        window : new Interior('WINDOW',sprites,box(0,213,26,21)),
        stoneHearth : new Interior('STONE HEARTH',sprites,box(26, 213, 23, 56),Units.indoor.stone_hearth),
        shelf : new Interior('SHELF',sprites,box(49, 213, 23, 44),Units.indoor.shelf),
        table : new Interior('TABLE',sprites,box(72, 213, 20, 20),Units.indoor.big_table),
        smallShelf : new Interior('SMALL SHELF',sprites,box(92, 213, 23, 25),Units.indoor.small_shelf),
        bigTable : new Interior('TABLE',sprites,box(72,238,32,18),Units.indoor.big_table),
        map : new Interior('MAP',sprites,box(0,246,26,22))
    };

    textPainter = new TextPainter(img('gfx/text.png'));

    crissleCanvas = createCanvas(WIDTH,HEIGHT,null,"crissleCanvas");
    lightCanvas = createCanvas(WIDTH,HEIGHT,null,"lightCanvas");
    gameCanvas = createCanvas(WIDTH,HEIGHT,inputListener,"gameCanvas");

    lightCtx = lightCanvas.getContext('2d');
    crissleCtx = crissleCanvas.getContext('2d');

    ctx = gameCanvas.getContext("2d");

    makePixelPerfect(ctx);
    makePixelPerfect(crissleCtx);
    makePixelPerfect(lightCtx);

    Game.createCanvas('overlay');
    Game.createCanvas('map');

    var effectSize = 4;
    for(var y=0; y<HEIGHT; y+=effectSize){
        for(var x=0; x<HEIGHT; x+=effectSize){
            var r = w(256);
            crissleCtx.fillStyle="rgb("+r+","+r+","+r+")";
            crissleCtx.fillRect(x,y,effectSize,effectSize)
        }
    }

    ctx.filllStyle = "black";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    document.body.appendChild(gameCanvas);
    document.body.appendChild(document.getElementById('instructions'));
    document.onkeydown = function(evt){
        var code =  evt.keyCode? evt.keyCode : evt.charCode;
        if(inputListener.isKeyDown(code)) return;
        Game.onKeyDown(code);
    };
    document.onkeyup = function(evt){
        var code =  evt.keyCode? evt.keyCode : evt.charCode;
        Game.onKeyUp(code);
    };

    map = new Map(MAP_WIDTH,MAP_HEIGHT);

    // grass
    for(var i=0; i<Math.floor((MAP_WIDTH*MAP_HEIGHT)*GRASS_PROBABILITY); i++){
        var x = w(MAP_WIDTH);
        var y = w(MAP_HEIGHT);

        for(var n=0; n<5+w(5); n++){
            var xLeft = w(5);
            for(var X=xLeft; X<4+w(4); X++){
                var field = map.get(x+X,y+n);
                if(field.type != 0) continue;
                if(w(6))field.type = [6,61,62,63,64].rnd();
            }
        }
    }

    // stones
    for(var i=0; i<Math.floor((MAP_WIDTH*MAP_HEIGHT)*STONE_PROBABILITY); i++){
        var field = map.get(w(MAP_WIDTH),w(MAP_HEIGHT));
        field.unit = Units.STONE;
        field.type = 8
    }

    // huts
    for(var i=0; i<Math.floor((MAP_WIDTH*MAP_HEIGHT)*HUT_PROBABILITY); i++){
        var x = w(MAP_WIDTH);
        var y = w(MAP_HEIGHT);
        var field = map.get(x,y);

        if(x<=10 && x+8>=10 || y<=10 && y+10 >= 10) continue;

        var skip = false;
        // do not spawn a house in a house

        var len = 3+w(4);

        for(var ys=0; ys<2; ys++){
            for(var xs=0; xs<len; xs++){
                if(arrayContains(map.get(x+xs,y+ys).type,[40,7,70])){
                    skip = true;
                }
            }
        }
        if(skip) continue;

        var threePos = [[p(0,0),p(3,0),p(5,0)],[p(0,1),p(3,1),p(5,1)]];
        var fourPos = [[p(0,0),p(3,0),p(4,0),p(5,0)],[p(0,1),p(3,1),p(4,1),p(5,1)]];
        var fivePos = [[p(0,0),p(2,0),p(3,0),p(4,0),p(5,0)],[p(0,1),p(2,1),p(3,1),p(4,1),p(5,1)]];
        var sixPos = [[p(0,0),p(1,0),p(2,0),p(3,0),p(4,0),p(5,0)],[p(0,1),p(1,1),p(2,1),p(3,1),p(4,1),p(5,1)]];

        var spritePos = null;
        if(len == 3){
            spritePos = threePos
        }else if(len == 4){
            spritePos = fourPos
        }else if(len == 5){
            spritePos = fivePos
        }else if(len == 6){
            spritePos = sixPos
        }

        var house = null;
        var houseType = null;
        if(!w(5)){
            house = Units.building.house();
            houseType = 7;
        }else{
            house = Units.building.ruin();
            houseType = 40;
        }

        for(var ys=0; ys<2; ys++){
            for(var xs=0; xs<len; xs++){
                map.get(x+xs,y+ys).unit = house;
                map.get(x+xs,y+ys).type = houseType;
                map.get(x+xs,y+ys).housePart = spritePos[ys][xs];
                if(houseType == 40)map.get(x+xs,y+ys).housePart.y+=w(2)*2
            }
        }
        field.type = houseType;
        field.houseLength = len;
    }

    // corpse
    for(var i=0; i<Math.floor((MAP_WIDTH*MAP_HEIGHT)*CORPSE_PROBABILITY); i++){
        var x = w(MAP_WIDTH);
        var y = w(MAP_HEIGHT);
        var field = map.get(x,y);
        if(arrayContains(field.type,passableTypes)){
            men.push(p(x,y));
            var r = w(4);
            if(r==0) map.get(x,y).unit = Units.corpse.elder_man();
            else if(r==1) map.get(x,y).unit = Units.corpse.elder_women();
            else if(r==2) map.get(x,y).unit = Units.corpse.man();
            else if(r==3) map.get(x,y).unit = Units.corpse.women();
        }
    }

    // wood
    for(var i=0; i<Math.floor((MAP_WIDTH*MAP_HEIGHT)*WOOD_PROBABILITY); i++){
        var x = w(MAP_WIDTH);
        var y = w(MAP_HEIGHT);

        if(x<=10 && x+8>=10 || y<=10 && y+10 >= 10) continue;

        for(var n=0; n<5+w(5); n++){
            var xLeft = w(5);
            for(var X=xLeft; X<4+w(4); X++){
                var field = map.get(x+X,y+n);
                if(arrayContains(field.type,[40,7])) continue;
                if(field.type != 0) continue;
                if(w(6)) field.type = [2,3,4,5].rnd();
                else if(!w(3)) field.type = [6,61,62,63,64].rnd()
            }
        }
    }

    // lake
    for(var i=0; i<Math.floor((MAP_WIDTH*MAP_HEIGHT)*LAKE_PROBABILITY); i++){
        var x = w(MAP_WIDTH);
        var y = w(MAP_HEIGHT);

        if(x<=10 && x+8>=10 || y<=10 && y+10 >= 10) continue;

        var drawFisherHut = !w(20);

        for(var n=0; n<5+w(5); n++){
            var xLeft = w(2);
            var xMax = 3+w(5);
            for(var X=xLeft; X<xMax; X++){
                var field = map.get(x+X,y+n);
                if(arrayContains(field.type,[40,7,8])) continue;
                field.type = 9;
                if(drawFisherHut && !w(9) && X != xLeft && X != xMax-1 && map.get(x+X,y+n-1).type == 9){
                    field.unit = Units.building.fisher_hut();
                    field.housePart = p(0,1);
                    map.get(x+X,y+n-1).unit = field.unit;
                    map.get(x+X,y+n-1).housePart = p(0,0);
                    drawFisherHut = false
                }
            }
        }

    }

    // lake banks
    var todo = [];
    for(var y=0; y<map.height(); y++){
        for(var x=0; x<map.width(); x++){
            var field = map.get(x,y);
            if(field.type == 9){
                if(map.get(x-1,y).type != 9 && map.get(x,y-1).type != 9 && map.get(x,y+1).type != 9 && map.get(x+1,y).type != 9) field.type = 22;
                else if(map.get(x-1,y).type != 9 && map.get(x,y-1).type != 9 && map.get(x,y+1).type != 9) todo.push([x,y,14]);
                else if(map.get(x+1,y).type != 9 && map.get(x,y-1).type != 9 && map.get(x,y+1).type != 9) todo.push([x,y,15]);
                else if(map.get(x-1,y).type != 9 && map.get(x,y-1).type != 9) todo.push([x,y,[10,100].rnd()]);
                else if(map.get(x-1,y).type != 9 && map.get(x,y+1).type != 9) todo.push([x,y,[12,120].rnd()]);
                else if(map.get(x+1,y).type != 9 && map.get(x,y-1).type != 9) todo.push([x,y,[11,110].rnd()]);
                else if(map.get(x+1,y).type != 9 && map.get(x,y+1).type != 9) todo.push([x,y,[13,130].rnd()]);
                else if(map.get(x,y+1).type != 9 && map.get(x,y-1).type != 9) todo.push([x,y,[20,200].rnd()]);
                else if(map.get(x+1,y).type != 9 && map.get(x-1,y).type != 9) todo.push([x,y,[21,210].rnd()]);
                else if(map.get(x-1,y).type != 9) todo.push([x,y,[16,160].rnd()]);
                else if(map.get(x+1,y).type != 9) todo.push([x,y,[17,170].rnd()]);
                else if(map.get(x,y-1).type != 9) todo.push([x,y,[18,180].rnd()]);
                else if(map.get(x,y+1).type != 9) todo.push([x,y,[19,190].rnd()])
            }
            else if(field.type == 0 && !w(16)){
                var r = w(3);
                if(r==0) field.type = 30;
                else if(r==1) field.type = 31;
                else if(r==2) field.type = 32
            }
        }
    }

    for(var i=0; i<todo.length; i++){
        var field = map.get(todo[i][0],todo[i][1]);
        field.type = todo[i][2];
        if(!arrayContains(field.unit.subType,['fisher_hut','fisher_hut_roof'])){
            field.unit = Units.EMPTY
        }
    }

    // items
    for(var i=0; i<Math.floor((MAP_WIDTH*MAP_HEIGHT)*ITEM_PROBABILITY); i++){
        var field = map.get(w(MAP_WIDTH),w(MAP_HEIGHT));
        if(field.type != 0) continue;

        field.unit = Units.item.small_branch();
    }

    // hidden items
    for(var i=0; i<Math.floor((MAP_WIDTH*MAP_HEIGHT)*HIDDEN_ITEM_PROBABILITY); i++){
        var field = map.get(w(MAP_WIDTH),w(MAP_HEIGHT));
        if(field.type != 0) continue;

        field.unit = Units.item.unknownInTheSnow();
    }

    map.get(10,10).type = 0;
    map.get(10,10).unit = Units.EMPTY;

    /*
     map.get(16,13).unit = Units.animal.bear()
     map.get(16,13).unit.xShift = 0;
     map.get(16,13).unit.yShift = 0;
     */


    mapDrawer = new MapDrawer(Game.ctx.map, map, stepManager);

    inputListener.registerClient(mapDrawer);

    var conditionPanel = new ConditionPanel(sprites);

    Game.screens.default = new MapScreen(inputListener, mapDrawer);
    Game.screens.indoor = new IndoorScreen(Game.ctx.overlay, messagePanel, inventoryBag, conditionPanel);
    Game.screens.inventory = new InventoryScreen(Game.ctx.overlay,messagePanel, inventoryBag, conditionPanel);
    Game.screens.looting = new LootingScreen(Game.ctx.overlay,messagePanel,inventoryBag);
    Game.screens.campFire = new CampFireScreen(Game.ctx.overlay,messagePanel,Game.campFireManager);
    Game.screens.boilingWater = new BoilingWaterScreen(Game.ctx.overlay,messagePanel);


    ctx.clearRect(0,0,WIDTH,HEIGHT);

    updateShader();

    Game.screenStack = [Game.screens.default]
    Game.showScreen(Game.screens.default);
    Game.dayTime.minutes = 60*5;
    window.requestAnimationFrame(tick)
}

var messagePanel = new MessagePanel();
var inventoryBag = new InventoryPainter();
var Indoor = {};

var men = [];
var lastAnimationTime = 0;

function drawConditionIcons(overlayCtx) {
    if (Game.player.isAlive() && !Game.currentScreen && !Game.player.isComfortable()) {
        overlayCtx.drawImage(sprites, 0, 129, 3, 12, 0, 0, 3 * 4, 12 * 4);
        var shift = 3 * 4;

        var nextThirstThreshold = Game.player.status.getNextThirstThreshold();
        if (nextThirstThreshold > 0) {
            overlayCtx.drawImage(sprites, 3, 129, 7, 12, shift, 0, 7 * 4, 12 * 4);
            shift += 7 * 4;
            if (nextThirstThreshold == 1) {
                overlayCtx.drawImage(sprites, 26, 129, 3, 12, shift, 0, 3 * 4, 12 * 4);
                shift += 3 * 4;
            } else if (nextThirstThreshold == 2) {
                overlayCtx.drawImage(sprites, 29, 129, 7, 12, shift, 0, 7 * 4, 12 * 4);
                shift += 7 * 4;
            } else {
                overlayCtx.drawImage(sprites, 36, 129, 9, 12, shift, 0, 9 * 4, 12 * 4);
                shift += 9 * 4;
            }
        }

        var nextHungerThreshold = Game.player.status.getNextHungerThreshold();
        if (nextHungerThreshold > 0) {
            overlayCtx.drawImage(sprites, 10, 129, 8, 12, shift, 0, 8 * 4, 12 * 4);
            shift += 8 * 4;
            if (nextHungerThreshold == 1) {
                overlayCtx.drawImage(sprites, 26, 129, 3, 12, shift, 0, 3 * 4, 12 * 4);
                shift += 3 * 4;
            } else if (nextHungerThreshold == 2) {
                overlayCtx.drawImage(sprites, 29, 129, 7, 12, shift, 0, 7 * 4, 12 * 4);
                shift += 7 * 4;
            } else {
                overlayCtx.drawImage(sprites, 36, 129, 9, 12, shift, 0, 9 * 4, 12 * 4);
                shift += 9 * 4;
            }
        }

        var nextTemperatureThreshold = Game.player.status.getNextTemperatureThreshold();
        if (nextTemperatureThreshold > 0) {
            overlayCtx.drawImage(sprites, 18, 129, 8, 12, shift, 0, 8 * 4, 12 * 4);
            shift += 8 * 4;
            if (nextTemperatureThreshold == 1) {
                overlayCtx.drawImage(sprites, 26, 129, 3, 12, shift, 0, 3 * 4, 12 * 4);
                shift += 3 * 4;
            } else if (nextTemperatureThreshold == 2) {
                overlayCtx.drawImage(sprites, 29, 129, 7, 12, shift, 0, 7 * 4, 12 * 4);
                shift += 7 * 4;
            } else {
                overlayCtx.drawImage(sprites, 36, 129, 9, 12, shift, 0, 9 * 4, 12 * 4);
                shift += 9 * 4;
            }
        }

        var nextFatigueThreshold = Game.player.status.getNextFatigueThreshold();
        if (nextFatigueThreshold > 0) {
            overlayCtx.drawImage(sprites, 47, 129, 7, 12, shift, 0, 7 * 4, 12 * 4);
            shift += 7 * 4;
            if (nextFatigueThreshold == 1) {
                overlayCtx.drawImage(sprites, 26, 129, 3, 12, shift, 0, 3 * 4, 12 * 4);
                shift += 3 * 4;
            } else if (nextFatigueThreshold == 2) {
                overlayCtx.drawImage(sprites, 29, 129, 7, 12, shift, 0, 7 * 4, 12 * 4);
                shift += 7 * 4;
            } else {
                overlayCtx.drawImage(sprites, 36, 129, 9, 12, shift, 0, 9 * 4, 12 * 4);
                shift += 9 * 4;
            }
        }
        overlayCtx.drawImage(sprites, 44, 129, 3, 12, shift, 0, 3 * 4, 12 * 4);

        var conditionPercentage = "  " + Math.ceil(Game.player.status.condition) + "%";
        conditionPercentage = conditionPercentage.substring(conditionPercentage.length - 4, conditionPercentage.length);
        textPainter.drawText(conditionPercentage, overlayCtx, shift + 4 * 4, 3 * 4);
    }
}

/******************************

 --- T I C K ---

 *******************************/

function tick(time){

    Game.time = time;
    Game.update();

    if(time-lastAnimationTime > animationStepTime){
        lastAnimationTime = time;
        AnimatedSprite.all.BEAR.tick();
        AnimatedSprite.all.CAMP_FIRE.tick();
        AnimatedSprite.all.PLAYER_CHAR_MAN.tick();
        AnimatedSprite.all.PLAYER_CHAR_MAN_LEFT.tick();
        AnimatedSprite.all.PLAYER_CHAR_MAN_BACK.tick();
        AnimatedSprite.all.PLAYER_CHAR_MAN_BACK_LEFT.tick();
        if(Game.player.status.isDead()) AnimatedSprite.all.PLAYER_CHAR_MAN_DYING.tick()
    }

    var overlayCtx = Game.ctx.overlay;
    overlayCtx.clearRect(0,0,WIDTH,HEIGHT);

    Game.player.update(inputListener);
    Game.search.update(time);
    Game.drawCurrentScreen();

    if(Game.dialog.message){
        if(Game.dialog.message.hasText()){
            overlayCtx.fillStyle = "#21262b";
            overlayCtx.fillRect(0,13*32-5-4,WIDTH,100);
            overlayCtx.fillStyle = "#e0f0f0";
            overlayCtx.fillRect(0,13*32-5,WIDTH,100- 2*4);

            overlayCtx.drawImage(sprites,Type.speak.x*8,Type.speak.y*8,8,8,10*32,12*32-5,32,32);
            var textLines = Game.dialog.message.getLines();
            for(var i=0; i<textLines.length;i++){
                var message = textLines[i];
                textPainter.drawText(message,overlayCtx,Math.floor(WIDTH/2-message.length*8),13*32+10+(7*4)*i);
            }
        }

        if(Game.dialog.message.hasDoubleOption()){
            overlayCtx.fillStyle = "#21262b";
            overlayCtx.fillRect(2*32,16*32+8,6*32,32+16);
            overlayCtx.fillStyle = "#e0f0f0";
            overlayCtx.fillRect(2*32+4,16*32+8+4,6*32-8,32+16-8);
            textPainter.drawText("(X) IGNORE",overlayCtx,2*32+16,16*32+18);

            var xShift = 0;
            var text = Game.dialog.message.option.getText();
            if(text.length > 12){
                xShift = -(text.length-12)*5*4
            }

            overlayCtx.fillStyle = "#21262b";
            overlayCtx.fillRect(xShift+13*32,16*32+8,6*32-xShift,32+16);
            overlayCtx.fillStyle = "#e0f0f0";
            overlayCtx.fillRect(xShift+13*32+4,16*32+8+4,6*32-8-xShift,32+16-8);

            textPainter.drawText(Game.dialog.message.option.getText(),overlayCtx,xShift+13*32+16,16*32+18);
        }else if(Game.dialog.message.hasSingleOption()){
            var size = Math.ceil(Game.currentInterest.unit.name.length/1.5);
            overlayCtx.fillStyle = "#21262b";
            overlayCtx.fillRect((8-Math.floor(size/2))*32,12*32,6*32+size*32,32+16);
            overlayCtx.fillStyle = "#e0f0f0";
            overlayCtx.fillRect((8-Math.floor(size/2))*32+4,12*32+4,6*32-8+size*32,32+16-8);
            textPainter.drawText(Game.dialog.message.option.getText(),overlayCtx,(8-Math.floor(size/2))*32+16,12*32+10);
        }
    }

    drawConditionIcons(overlayCtx);

    var dayLight = Math.floor(Math.max(0,Math.abs(Game.dayTime.minutes - 720) - 240)/16);

    document.body.style.backgroundColor = dayTimeShaderColors[dayLight];
    ctx.drawImage(Game.canvas.map,0,0);
    ctx.globalAlpha = 0.05;
    ctx.drawImage(crissleCanvas,0,0);
    ctx.globalAlpha = 1;
    ctx.drawImage(dayTimeShader[dayLight],0,0,WIDTH/4,HEIGHT/4,0,0,WIDTH,HEIGHT);
    ctx.globalAlpha = 1;
    ctx.drawImage(Game.canvas.overlay,0,0);
    ctx.globalAlpha = 1;

    window.requestAnimationFrame(tick)
}