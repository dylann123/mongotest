var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.getInstance = function () {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    };
    Logger.setLogLevel = function (logLevel) {
        Logger.logLevel = logLevel;
    };
    Logger.log = function (message, logLevel) {
        if (logLevel === void 0) { logLevel = LogLevel.INFO; }
        if (logLevel >= Logger.logLevel) {
            console.log(message);
        }
    };
    Logger.logLevel = LogLevel.INFO;
    return Logger;
}());
