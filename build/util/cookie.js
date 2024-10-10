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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var session_1 = __importDefault(require("./session"));
var database_1 = __importDefault(require("./database"));
function parseCookies(req, res, next) {
    // https://stackoverflow.com/questions/44816519/how-to-get-cookie-value-in-expressjs
    var cookie = req.headers.cookie;
    if (cookie) {
        var values = cookie.split(';');
        var cookies = {};
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var cookie_1 = values_1[_i];
            var key = cookie_1.split("=")[0];
            var value = cookie_1.split("=")[1];
            cookies[key] = value;
        }
        res.locals.cookie = values;
    }
    else
        res.locals.cookie = {};
    next();
}
function parseCookiesRejectSession(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var cookie, values, cookies, _i, values_2, cookie_2, key, value, sessionExistsCookie, sessionExistsBody, sessionExistsQuery, userdata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cookie = req.headers.cookie;
                    if (!cookie) return [3 /*break*/, 6];
                    values = cookie.split(';');
                    cookies = {};
                    for (_i = 0, values_2 = values; _i < values_2.length; _i++) {
                        cookie_2 = values_2[_i];
                        key = cookie_2.split("=")[0].trim();
                        value = cookie_2.split("=")[1].trim();
                        cookies[key] = value;
                    }
                    res.locals.validated = false;
                    return [4 /*yield*/, session_1.default.verifyUserSession({ secret: cookies[session_1.default.COOKIE_NAME] }).catch(function (err) { res.locals.validated = false; })];
                case 1:
                    sessionExistsCookie = (_a.sent());
                    return [4 /*yield*/, session_1.default.verifyUserSession({ secret: req.body[session_1.default.COOKIE_NAME] }).catch(function (err) { res.locals.validated = false; })];
                case 2:
                    sessionExistsBody = (_a.sent());
                    return [4 /*yield*/, session_1.default.verifyUserSession({ secret: req.query[session_1.default.COOKIE_NAME] }).catch(function (err) { res.locals.validated = false; })];
                case 3:
                    sessionExistsQuery = (_a.sent()) // unsafe
                    ;
                    if (!(cookies[session_1.default.COOKIE_NAME] && (sessionExistsCookie["verified"] || sessionExistsBody["verified"] || sessionExistsQuery["verified"]))) return [3 /*break*/, 5];
                    res.locals.validated = true;
                    res.locals.username = sessionExistsCookie["result"]["username"] || sessionExistsBody["result"]["username"] || sessionExistsQuery["result"]["username"];
                    return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.USERDATA_COLLECTION_NAME, { username: res.locals.username })];
                case 4:
                    userdata = _a.sent();
                    res.locals.userdata = userdata[0]; // it is assumed that there is only one user with a given username, and that it actually exists
                    _a.label = 5;
                case 5:
                    console.log("validated: " + res.locals.validated);
                    res.locals.cookie = cookies;
                    return [3 /*break*/, 7];
                case 6:
                    res.locals.cookie = {};
                    _a.label = 7;
                case 7:
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
function sendUnauthorized(res) {
    res.status(403).send({ code: 403, result: "Unauthorized request." });
}
exports.default = { parseCookies: parseCookies, parseCookiesRejectSession: parseCookiesRejectSession, sendUnauthorized: sendUnauthorized };
