function TextPainter(sprite, canvasWidth, canvasHeight){
    var textSprite = sprite;
    var textPattern = {
        'A' : box(0,0,5,7),
        'B' : box(4,0,5,7),
        'C' : box(8,0,5,7),
        'D' : box(12,0,5,7),
        'E' : box(16,0,5,7),
        'F' : box(20,0,5,7),
        'G' : box(24,0,5,7),
        'H' : box(28,0,5,7),
        'I' : box(32,0,3,7),
        'J' : box(34,0,5,7),
        'K' : box(38,0,5,7),
        'L' : box(42,0,5,7),
        'M' : box(46,0,7,7),
        'N' : box(52,0,5,7),
        'O' : box(56,0,5,7),
        'P' : box(60,0,5,7),
        'Q' : box(64,0,5,7),
        'R' : box(68,0,5,7),
        'S' : box(72,0,5,7),
        'T' : box(76,0,5,7),
        'U' : box(80,0,5,7),
        'V' : box(84,0,5,7),
        'W' : box(88,0,7,7),
        'X' : box(94,0,5,7),
        'Y' : box(98,0,5,7),
        'Z' : box(102,0,5,7),
        '_' : box(106,0,7,7),
        ',' : box(112,0,3,7),
        '&' : box(114,0,6,7),
        '!' : box(119,0,3,7),
        '?' : box(121,0,5,7),
        '.' : box(125,0,3,7),
        '`' : box(127,0,6,7),
        '´' : box(132,0,6,7),
        '-' : box(137,0,5,7),
        "'" : box(141,0,3,7),
        "[" : box(143,0,4,7),
        "]" : box(146,0,4,7),
        "(" : box(149,0,4,7),
        ")" : box(152,0,4,7),
        ":" : box(155,0,3,7),
        "<" : box(157,0,6,7),
        ">" : box(162,0,6,7),
        "%" : box(167,0,5,7),
        "0" : box(0,6,5,7),
        "1" : box(4,6,4,7),
        "2" : box(7,6,5,7),
        "3" : box(11,6,5,7),
        "4" : box(15,6,5,7),
        "5" : box(19,6,5,7),
        "6" : box(23,6,5,7),
        "7" : box(27,6,5,7),
        "8" : box(31,6,5,7),
        "9" : box(35,6,5,7)
    };

    this.reset = function(){
        Game.ctx.overlay.clearRect(0,0,canvasWidth, canvasHeight)
    };

    this.drawText = function(text,ctx,x,y){
        var characters = text.split('');
        var xShift=0;
        for(var i=0; i<characters.length; i++){
            var character = characters[i];
            if(textPattern[character]){
                var letter = textPattern[character];
                ctx.drawImage(textSprite,letter.x,letter.y,letter.width,letter.height,x+xShift,y,letter.width*4,letter.height*4);
                xShift+=letter.width*4-4
            }else{
                xShift+=4*4;
            }
        }
        y+=7*4
    }
}
