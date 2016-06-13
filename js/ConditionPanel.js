function ConditionPanel(sprites){

    this.drawPanel = function(ctx){
        var barStart = 48 * 4;

        ctx.drawImage(sprites, 65, 64, 1, 24, 0, 0, 4, 24 * 4);
        ctx.drawImage(sprites, 66, 64, 1, 24, 4, 0, Config.width - 2 * 4, 24 * 4);
        ctx.drawImage(sprites, 65, 64, 1, 24, Config.width - 4, 0, 4, 24 * 4);

        ctx.drawImage(sprites, 14, 64, 7, 6, barStart, 2 * 4, 7 * 4, 6 * 4);
        ctx.drawImage(sprites, 0, 87, 1, 6, barStart + 8 * 4, 2 * 4, 4, 6 * 4);

        ctx.drawImage(sprites, 1, 87, 1, 6, barStart + (8 + 1) * 4, 2 * 4, 91 * 4, 6 * 4);

        var conditionBarLength = Math.ceil(Game.player.status.condition * 91 / 100);
        ctx.drawImage(sprites, 0, 89, 1, 2, barStart + (8 + 2) * 4, 4 * 4, (conditionBarLength - 2) * 4, 2 * 4);
        ctx.drawImage(sprites, 0, 87, 1, 6, barStart + 100 * 4, 2 * 4, 4, 6 * 4);

        var conditionPercentage = "  " + Math.ceil(Game.player.status.condition) + "%";
        conditionPercentage = conditionPercentage.substring(conditionPercentage.length - 4, conditionPercentage.length);
        textPainter.drawText(conditionPercentage, ctx, barStart + 102 * 4, 4);

        var h = "00" + Math.floor(Game.dayTime.minutes / 60);
        h = h.substring(h.length - 2, h.length);
        var m = "00" + (Game.dayTime.minutes % 60);
        m = m.substring(m.length - 2, m.length);
        textPainter.drawText("TIME: " + h + ":" + m, ctx, 2 * 4, 4);

        var symbols = [box(3, 129, 7, 12), box(10, 129, 7, 12), box(18, 129, 7, 12), box(47, 129, 7, 12)];
        var places = [p(2, 9), p(43, 9), p(84, 9), p(125, 9)];
        var values = [[Game.player.status.thirst, Game.player.status.thresholds.thirst], [Game.player.status.hunger, Game.player.status.thresholds.hunger], [Game.player.status.temperature, Game.player.status.thresholds.temperature], [Game.player.status.fatigue, Game.player.status.thresholds.fatigue]];
        for (var n = 0; n < 4; n++) {
            var shift = places[n].x * 4;
            var yShift = places[n].y * 4;
            var symbol = symbols[n];
            var data = values[n];
            ctx.drawImage(sprites, 0, 129, 2, 12, shift, yShift, 2 * 4, 12 * 4);
            shift += 2 * 4;
            ctx.drawImage(sprites, symbol.x, symbol.y, symbol.width, symbol.height, shift, yShift, symbol.width * 4, symbol.height * 4);
            shift += symbol.width * 4;
            var scaleShiftStart = shift;
            ctx.drawImage(sprites, 2, 129, 1, 12, shift, yShift, 28 * 4, 12 * 4);
            shift += 28 * 4;
            ctx.drawImage(sprites, 44, 129, 3, 12, shift, yShift, 3 * 4, 12 * 4);

            var severity = 0;

            var status = data[0];
            var threshold = data[1];

            if (status >= threshold[0]) {
                if (status < threshold[1]) {
                    ctx.drawImage(sprites, 0, 117, 5, 12, (places[n].x + symbol.width + 20) * 4, yShift + 10 * 4, 5 * 4, 12 * 4);
                } else if (status < threshold[2]) {
                    ctx.drawImage(sprites, 5, 117, 9, 12, (places[n].x + symbol.width + 20) * 4, yShift + 10 * 4, 9 * 4, 12 * 4);
                    severity = 1;
                } else {
                    ctx.drawImage(sprites, 14, 117, 11, 12, (places[n].x + symbol.width + 20) * 4, yShift + 10 * 4, 11 * 4, 12 * 4);
                    severity = 2;
                }
            }

            for (var i = 0; i < Math.floor(Math.min(status, threshold[3]) * 25 / threshold[3]); i++) {
                ctx.drawImage(sprites, severity * 2, 93, 2, 4, scaleShiftStart + (2 + i) * 4, yShift + 4 * 4, 2 * 4, 4 * 4)
            }


            ctx.drawImage(sprites, 27, 87, 1, 6, scaleShiftStart + (2 + Math.floor(threshold[0] * 25 / threshold[3])) * 4, yShift + 3 * 4, 4, 6 * 4);
            ctx.drawImage(sprites, 27, 87, 1, 6, scaleShiftStart + (2 + Math.floor(threshold[1] * 25 / threshold[3])) * 4, yShift + 3 * 4, 4, 6 * 4);
            ctx.drawImage(sprites, 27, 87, 1, 6, scaleShiftStart + (2 + Math.floor(threshold[2] * 25 / threshold[3])) * 4, yShift + 3 * 4, 4, 6 * 4);

            ctx.drawImage(sprites, 0, 87, 27, 6, scaleShiftStart + 4, yShift + 3 * 4, 27 * 4, 6 * 4)
        }
    };

}
