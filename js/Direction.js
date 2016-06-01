var DIRECTION = {
    N: p(0, -1),
    NE: p(1, -1),
    NW: p(-1, -1),
    E: p(1, 0),
    W: p(-1, 0),
    S: p(0, 1),
    SE: p(1, 1),
    SW: p(-1, 1),
    order: null,
    turnAround: function (direction) {
        return DIRECTION.turn(direction, 2)
    },
    turnLeft: function (direction) {
        return DIRECTION.turn(direction, -1)
    },
    turnRight: function (direction) {
        return DIRECTION.turn(direction, 1)
    },
    turn: function (direction, delta) {
        var index = DIRECTION.order.indexOf(direction);
        if (index == -1) return null;
        return DIRECTION.order[(DIRECTION.order.length + index + delta) % DIRECTION.order.length]
    }
};
DIRECTION.order = [DIRECTION.N, DIRECTION.E, DIRECTION.S, DIRECTION.W];
