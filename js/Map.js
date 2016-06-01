function Map(width,height){
    var map = [];
    for(var y=0; y<height; y++){
        map.push([]);
        for(var x=0; x<width; x++){
            map[y].push(new MapField(0,x,y));
        }
    }

    this.getTopField = function(direction, x, y){
        var direction = DIRECTION.N;
        return this.get(x+rightDirection.x,y+rightDirection.y)
    };

    this.getRightField = function(direction, x, y){
        var rightDirection = DIRECTION.turnRight(direction || DIRECTION.N);
        return this.get(x+rightDirection.x,y+rightDirection.y)
    };

    this.getLeftField = function(direction, x, y){
        var rightDirection = DIRECTION.turnLeft(direction || DIRECTION.N);
        return this.get(x+rightDirection.x,y+rightDirection.y)
    };

    this.get = function(x,y){
        return map[(height+(y%height))%height][(width+(x%width))%width];
    };

    this.width = function(){
        return width;
    };

    this.height = function(){
        return height;
    }
}
