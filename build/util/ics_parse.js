"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ICS_Object = /** @class */ (function () {
    function ICS_Object(ics_path) {
        this.ics_path = "";
        this.ics = "";
        this.events = [];
        this.ics_path = ics_path;
    }
    ICS_Object.prototype.parse = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getICS(this.ics_path)];
                    case 1:
                        _a.ics = _b.sent();
                        this.events = this.parseICS(this.ics);
                        return [2 /*return*/];
                }
            });
        });
    };
    ICS_Object.prototype.getICS = function (ics_path) {
        return __awaiter(this, void 0, void 0, function () {
            var fs;
            return __generator(this, function (_a) {
                fs = require('fs');
                return [2 /*return*/, fs.readFileSync(ics_path, 'utf8')];
            });
        });
    };
    ICS_Object.prototype.parseICS = function (ics) {
        var lines = ics.split('\n');
        var evts = [];
        var event = {};
        var inEvent = false;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line === 'BEGIN:VEVENT') {
                inEvent = true;
                event = {};
            }
            else if (line === 'END:VEVENT') {
                inEvent = false;
                evts.push(event);
            }
            else if (inEvent) {
                var parts = line.split(':');
                var key = parts[0];
                var value = parts[1];
                if (key === 'DTSTART') { // normal event
                    var year = parseInt(value.substring(0, 4));
                    var month = parseInt(value.substring(4, 6));
                    var day = parseInt(value.substring(6, 8));
                    var hour = parseInt(value.substring(9, 11));
                    var minute = parseInt(value.substring(11, 13));
                    var second = parseInt(value.substring(13, 15));
                    event.start = new Date(year, month, day, hour, minute, second);
                }
                else if (key === 'DTSTART;VALUE=DATE') { // even/odd day
                    var year = parseInt(value.substring(0, 4));
                    var month = parseInt(value.substring(4, 6));
                    var day = parseInt(value.substring(6, 8));
                    event.start = new Date(year, month, day);
                }
                else if (key === 'DTEND') {
                    var year = parseInt(value.substring(0, 4));
                    var month = parseInt(value.substring(4, 6));
                    var day = parseInt(value.substring(6, 8));
                    var hour = parseInt(value.substring(9, 11));
                    var minute = parseInt(value.substring(11, 13));
                    var second = parseInt(value.substring(13, 15));
                    event.end = new Date(year, month, day, hour, minute, second);
                }
                else if (key === 'DTEND;VALUE=DATE') {
                    var year = parseInt(value.substring(0, 4));
                    var month = parseInt(value.substring(4, 6));
                    var day = parseInt(value.substring(6, 8));
                    event.end = new Date(year, month, day);
                }
                else if (key === 'SUMMARY') {
                    event.summary = value;
                }
                else if (key === 'LOCATION') {
                    event.location = value;
                }
            }
        }
        return evts;
    };
    ICS_Object.prototype.getEvents = function () {
        return this.events;
    };
    return ICS_Object;
}());
exports.default = ICS_Object;
