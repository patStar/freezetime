function MessagePanel() {
    this.drawOn = function (message, ctx, speech, lineSpan) {
        var top = 13 * 32 - 5 - 4;

        var _lineSpan = lineSpan || 1;
        ctx.fillStyle = "#21262b";
        ctx.fillRect(0, top, WIDTH, 100);
        ctx.fillStyle = "#e0f0f0";
        ctx.fillRect(0, top + 4, WIDTH, 100 - 2 * 4);

        if (speech) ctx.drawImage(sprites, Type.speak.x * 8, Type.speak.y * 8, 8, 8, 10 * 32, 12 * 32 - 5, 32, 32);
        var textLines = message.getLines();
        for (var i = 0; i < textLines.length; i++) {
            var messageLine = textLines[i];
            var x = Math.floor(WIDTH / 2 - messageLine.length * 8);
            var y = top + 19 + (7 + _lineSpan) * 4 * i;
            textPainter.drawText(messageLine, ctx, x, y);
        }

        if (message.hasDoubleOption()) {
            ctx.fillStyle = "#21262b";
            ctx.fillRect(2 * 32, 16 * 32 + 8, 6 * 32, 32 + 16);
            ctx.fillStyle = "#e0f0f0";
            ctx.fillRect(2 * 32 + 4, 16 * 32 + 8 + 4, 6 * 32 - 8, 32 + 16 - 8);
            textPainter.drawText("(X) IGNORE", ctx, 2 * 32 + 16, 16 * 32 + 18);

            var xShift = 0;
            var text = message.option.getText();
            if (text.length > 12) {
                xShift = -(text.length - 12) * 5 * 4
            }

            ctx.fillStyle = "#21262b";
            ctx.fillRect(xShift + 13 * 32, 16 * 32 + 8, 6 * 32 - xShift, 32 + 16);
            ctx.fillStyle = "#e0f0f0";
            ctx.fillRect(xShift + 13 * 32 + 4, 16 * 32 + 8 + 4, 6 * 32 - 8 - xShift, 32 + 16 - 8);

            textPainter.drawText(message.option.getText(), ctx, xShift + 13 * 32 + 16, 16 * 32 + 18);
        } else if (message.hasSingleOption()) {
            var size = Math.ceil(Game.currentInterest.unit.name.length / 1.5);
            ctx.fillStyle = "#21262b";
            ctx.fillRect((8 - Math.floor(size / 2)) * 32, 12 * 32, 6 * 32 + size * 32, 32 + 16);
            ctx.fillStyle = "#e0f0f0";
            ctx.fillRect((8 - Math.floor(size / 2)) * 32 + 4, 12 * 32 + 4, 6 * 32 - 8 + size * 32, 32 + 16 - 8);
            textPainter.drawText(message.option.getText(), ctx, (8 - Math.floor(size / 2)) * 32 + 16, 12 * 32 + 10);
        }
    }
}