function InputListener() {

    var registeredClients = {
        mouseDown: [],
        mouseMove: []
    };

    var keysDown = [];

    this.onMouseDown = function (evt) {
        for (var i = 0; i < registeredClients.mouseDown.length; i++) {
            registeredClients.mouseDown[i].notify(InputListener.MOUSE_DOWN, evt);
        }
    };

    this.onMouseMove = function (evt) {
        for (var i = 0; i < registeredClients.mouseMove.length; i++) {
            registeredClients.mouseMove[i].notify(InputListener.MOUSE_MOVE, evt);
        }
    };

    this.pressKey = function(keyCode){
        keysDown[keyCode] = Date.now();
    };

    this.releaseKey = function(keyCode){
        keysDown[keyCode] = false;
    };

    this.isKeyDown = function(keyCode){
        return  keysDown[keyCode];
    };

    this.registerClient = function(client){
        registeredClients.mouseMove.push(client);
        registeredClients.mouseDown.push(client);
    }
}
InputListener.MOUSE_MOVE = "mouseMove";
InputListener.MOUSE_DOWN = "mouseDown";