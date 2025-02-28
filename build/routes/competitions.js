"use strict";
/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 21 September 2024
 * Handles endpoint requests to /competitions
 * Returns values from competition database
 */
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
var express_1 = __importDefault(require("express"));
var cookie_1 = __importDefault(require("../util/cookie"));
var database_1 = __importDefault(require("../util/database"));
var router = express_1.default.Router();
router.use(cookie_1.default.parseCookiesRejectSession);
var COLLECTION = database_1.default.COMPETITION_COLLECTION_NAME;
router.get('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var body, rawdata, _i, rawdata_1, competition;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {};
                    return [4 /*yield*/, database_1.default.getCollection(COLLECTION)];
                case 1:
                    rawdata = _a.sent();
                    for (_i = 0, rawdata_1 = rawdata; _i < rawdata_1.length; _i++) {
                        competition = rawdata_1[_i];
                        body[competition["id"]] = {
                            "name": competition["name"],
                            "date": competition["date"] // UNIX timestamp
                        };
                    }
                    res.send({ code: 200, result: body });
                    return [2 /*return*/];
            }
        });
    });
});
router.get('/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, competition;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!res.locals.validated)
                        return [2 /*return*/, cookie_1.default.sendUnauthorized(res)];
                    id = req.params.id;
                    return [4 /*yield*/, database_1.default.queryItemsInCollection(COLLECTION, { id: id })];
                case 1:
                    competition = _a.sent();
                    if (competition["length"] == 0) {
                        res.status(404).send({ code: 404, result: "competition not found." });
                        return [2 /*return*/];
                    }
                    res.status(200).send({ code: 200, result: competition[0] });
                    return [2 /*return*/];
            }
        });
    });
});
router.post('/add', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var body, params, _i, params_1, param, duplicates, competition, param, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!res.locals.validated)
                        return [2 /*return*/, cookie_1.default.sendUnauthorized(res)];
                    if (!res.locals.administrator)
                        return [2 /*return*/, cookie_1.default.sendUnauthorized(res)];
                    body = req.body;
                    params = ["name", "date", "locations", "links", "time_slots", "season"];
                    for (_i = 0, params_1 = params; _i < params_1.length; _i++) {
                        param = params_1[_i];
                        if (!body[param]) {
                            res.status(400).send({ code: 400, result: "Missing parameter: ".concat(param) });
                            return [2 /*return*/];
                        }
                        else {
                            switch (param) {
                                case "name":
                                    if (typeof body[param] != "string") {
                                        res.status(400).send({ code: 400, result: "Parameter ".concat(param, " must be a string") });
                                        return [2 /*return*/];
                                    }
                                    break;
                                case "date":
                                    if (typeof body[param] != "number") {
                                        res.status(400).send({ code: 400, result: "Parameter ".concat(param, " must be a unix timestamp") });
                                        return [2 /*return*/];
                                    }
                                    break;
                                case "locations":
                                    if (!Array.isArray(body[param])) {
                                        res.status(400).send({ code: 400, result: "Parameter ".concat(param, " must be an array") });
                                        return [2 /*return*/];
                                    }
                                    break;
                                case "links":
                                    if (!Array.isArray(body[param])) {
                                        res.status(400).send({ code: 400, result: "Parameter ".concat(param, " must be an array") });
                                        return [2 /*return*/];
                                    }
                                    break;
                                case "time_slots":
                                    if (!Array.isArray(body[param])) {
                                        res.status(400).send({ code: 400, result: "Parameter ".concat(param, " must be an array of objects formatted as [{start: starttimeunix, stop: stoptimeunix}, ...]") });
                                        return [2 /*return*/];
                                    }
                                    break;
                                case "season":
                                    if (typeof body[param] != "string") {
                                        res.status(400).send({ code: 400, result: "Parameter ".concat(param, " must be a string") });
                                        return [2 /*return*/];
                                    }
                            }
                        }
                    }
                    return [4 /*yield*/, database_1.default.queryItemsInCollection(COLLECTION, { name: body["name"] })];
                case 1:
                    duplicates = _a.sent();
                    if (duplicates["length"] > 0) {
                        res.status(400).send({ code: 400, result: "competition '" + body["name"] + "' already exists." });
                        return [2 /*return*/];
                    }
                    competition = {
                        "name": body["name"],
                        "date": body["date"],
                        "locations": body["locations"],
                        "links": body["links"],
                        "time_slots": body["time_slots"],
                        "season": body["season"],
                        "id": database_1.default.generateID()
                    };
                    for (param in params) {
                        switch (param) {
                            case "name":
                                if (typeof competition[param] != "string") {
                                    res.status(400).send({ code: 400, result: "Parameter ".concat(param, " must be a string") });
                                    return [2 /*return*/];
                                }
                                break;
                            case "date":
                                if (typeof competition[param] != "number") {
                                    res.status(400).send({ code: 400, result: "Parameter ".concat(param, " must be a unix timestamp") });
                                    return [2 /*return*/];
                                }
                                break;
                            case "locations":
                                if (!Array.isArray(competition[param])) {
                                    res.status(400).send({ code: 400, result: "Parameter ".concat(param, " must be an array") });
                                    return [2 /*return*/];
                                }
                                break;
                            case "links":
                                if (!Array.isArray(competition[param])) {
                                    res.status(400).send({ code: 400, result: "Parameter ".concat(param, " must be an array") });
                                    return [2 /*return*/];
                                }
                                break;
                            case "time_slots":
                                if (!Array.isArray(competition[param])) {
                                    res.status(400).send({ code: 400, result: "Parameter ".concat(param, " must be an array of objects formatted as [{start: starttimeunix, stop: stoptimeunix}, ...]") });
                                    return [2 /*return*/];
                                }
                                break;
                            case "season":
                                if (isNaN(competition[param])) {
                                    res.status(400).send({ code: 400, result: "Parameter ".concat(param, " must be a number") });
                                    return [2 /*return*/];
                                }
                        }
                    }
                    return [4 /*yield*/, database_1.default.writeToCollection(COLLECTION, competition)];
                case 2:
                    result = _a.sent();
                    res.status(200).send({ code: 200, result: result });
                    return [2 /*return*/];
            }
        });
    });
});
router.post('/update', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var body, competition;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!res.locals.validated)
                        return [2 /*return*/, cookie_1.default.sendUnauthorized(res)];
                    if (!res.locals.administrator)
                        return [2 /*return*/, cookie_1.default.sendUnauthorized(res)];
                    body = req.body;
                    if (!body["id"]) {
                        res.status(400).send({ code: 400, result: "Missing parameter id." });
                        return [2 /*return*/];
                    }
                    competition = {};
                    if (body["name"])
                        competition["name"] = body["name"];
                    if (body["date"])
                        competition["date"] = body["date"];
                    if (body["locations"])
                        competition["locations"] = body["locations"];
                    if (body["links"])
                        competition["links"] = body["links"];
                    if (body["time_slots"])
                        competition["time_slots"] = body["time_slots"];
                    return [4 /*yield*/, database_1.default.modifyItemInCollection(COLLECTION, { id: body["id"] }, competition).catch(function (err) {
                            res.status(400).send({ code: 400, result: err });
                            return;
                        }).then(function (result) {
                            if (!result)
                                return;
                            res.status(200).send({ code: 200, result: result });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
router.post('/delete', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var body, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!res.locals.validated)
                        return [2 /*return*/, cookie_1.default.sendUnauthorized(res)];
                    if (!res.locals.administrator)
                        return [2 /*return*/, cookie_1.default.sendUnauthorized(res)];
                    body = req.body;
                    if (!body["id"]) {
                        res.status(400).send({ code: 400, result: "Missing parameter: id" });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, database_1.default.removeItemFromCollection(COLLECTION, { id: body["id"] }).catch(function (err) {
                            res.status(400).send({ code: 400, result: err });
                            return;
                        }).then(function (result) {
                            if (!result)
                                return;
                            res.status(200).send({ code: 200, result: result });
                        })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
exports.default = router;
