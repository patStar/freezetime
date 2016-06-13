function ImageLoader (){
    var imageMap = {};
    this.loadingImages = 0;

    this.prepare = function(mapping){
        for(var name of Object.getOwnPropertyNames(mapping)){
            this.createFromImage(name, mapping[name],true);
        }
    };

    this.isReady = function(){
        return this.loadingImages === 0;
    };

    this.get = function(name){
        return imageMap[name];
    };

    this.put = function(name, canvas){
        imageMap[name] = canvas;
    };

    this.createFromImage = function(name, src, transparency){
        this.loadingImages++;
        var sprite = new Image();
        var self = this;
        sprite.onload = function(){
            var imageCanvas = createCanvas(sprite.width,sprite.height);
            imageCanvas.getContext('2d').drawImage(sprite,0,0);

            if(transparency){
                var imgData = imageCanvas.getContext('2d').getImageData(0,0,sprite.width,sprite.height);
                var data = imgData.data;
                var transparencyColor = [data[0],data[1],data[2]];
                for(var i=0; i<data.length; i+=4){
                    if(data[i] == transparencyColor[0] &&
                        data[i+1] == transparencyColor[1] &&
                        data[i+2] == transparencyColor[2]){
                        data[i+3] = 0;
                    }
                }
                imageCanvas.getContext('2d').putImageData(imgData,0,0);
            }

            self.loadingImages --;
            self.put(name, imageCanvas);
        };
        sprite.src = src;
    };
}
