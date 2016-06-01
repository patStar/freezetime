function Option(key, text, action) {
    this.action = action;
    this.getText = function () {
        return "(" + key + ") " + text;
    };
}
