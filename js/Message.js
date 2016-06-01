function Message(text, option) {
    this.text = text ? text.split('\n') : [];
    this.option = option;
    this.getLines = function () {
        return this.text;
    };
    this.hasText = function () {
        return text && text.replace('\n', '').replace(' ', '').length > 0;
    };
    this.hasOption = function () {
        return option ? true : false;
    };
    this.hasSingleOption = function () {
        return !text && option;
    };
    this.hasDoubleOption = function () {
        return text && option;
    }
}