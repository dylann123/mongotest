"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.log = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        var filename = new Error().stack.split("\n")[2].split("\\build\\").pop();
        console.log.apply(console, __spreadArray(["[".concat(Logger.getTime(), "] [").concat(filename, "]")], message, false));
    };
    Logger.error = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        var filename = new Error().stack.split("\n")[2].split("\\build\\").pop();
        console.error.apply(console, __spreadArray(["[".concat(Logger.getTime(), "] [").concat(filename, "]")], message, false));
    };
    Logger.warn = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        var filename = new Error().stack.split("\n")[2].split("\\build\\").pop();
        console.warn.apply(console, __spreadArray(["[".concat(Logger.getTime(), "] [").concat(filename, "]")], message, false));
    };
    Logger.getTime = function () {
        var date = new Date();
        return (date.getFullYear() + "-" +
            ((date.getMonth() + 1 > 9) ? "" : 0) + (date.getMonth() + 1) + "-" +
            ((date.getDate() > 9) ? "" : 0) + date.getDate() + "T" +
            ((date.getHours() > 9) ? "" : 0) + date.getHours() + ":" +
            ((date.getMinutes() > 9) ? "" : 0) + date.getMinutes() + ":" +
            ((date.getSeconds() > 9) ? "" : 0) + date.getSeconds() + "." + date.getMilliseconds());
    };
    return Logger;
}());
exports.default = Logger;
