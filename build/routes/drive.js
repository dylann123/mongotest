"use strict";
/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 6 September 2024
 * Handles endpoint requests to /tests/
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
var events_1 = __importDefault(require("../util/events"));
var cookie_1 = __importDefault(require("../util/cookie"));
var database_1 = __importDefault(require("../util/database"));
var router = express_1.default.Router();
router.use(cookie_1.default.parseCookiesRejectSession);
/**
 * @apiDefine Drive Drive
 * Handles event Drive storage.
 */
/**
 * @api {get} /drive/events Get Events
 * @apidescription Returns a JSON object containing event types. Requires authentication.
 * @apiName GetEvents
 * @apiGroup Drive
 *
 * @apiSuccess result JSON object containing event types
 *
 * @apiError Unauthorized Unauthorized
 *
 */
router.get('/events', function (req, res, next) {
    if (!res.locals.validated)
        cookie_1.default.sendUnauthorized(res);
    else {
        res.status(200).send({ code: 200, result: events_1.default.EVENT_NAMES });
    }
});
/**
 * @api {get} /drive/:event Get Drive Links
 * @apidescription Returns a JSON object containing drive links for a given event. Requires authentication. Response changes based on user type (regional/state).
 * @apiName GetDriveLinks
 * @apiGroup Drive
 *
 * @apiParam {String} event Event name
 *
 * @apiSuccess result JSON object containing drive links
 *
 * @apiError EventNotFound Event not found.
 * @apiError Unauthorized Unauthorized
 */
router.get('/:event', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var event, users, user, body, rawdata, _a, _b, _c;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!res.locals.validated)
                        return [2 /*return*/, cookie_1.default.sendUnauthorized(res)];
                    event = req.params.event;
                    if (events_1.default.EVENT_NAMES[event] == undefined) {
                        res.status(404).send({ code: 404, result: "Event not found." });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.EVENTS_COLLECTION_NAME, { event: event })];
                case 1:
                    if (!((_f.sent()).length == 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.default.writeToCollection(database_1.default.EVENTS_COLLECTION_NAME, { event: event, type: "states", links: [] })];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, database_1.default.writeToCollection(database_1.default.EVENTS_COLLECTION_NAME, { event: event, type: "regionals", links: [] })];
                case 3:
                    _f.sent();
                    return [2 /*return*/];
                case 4: return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.USER_COLLECTION_NAME, { username: res.locals.username })];
                case 5:
                    users = (_f.sent());
                    user = users[0];
                    if (!user["type"].includes("states")) return [3 /*break*/, 7];
                    body = {};
                    return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.EVENTS_COLLECTION_NAME, { event: event })];
                case 6:
                    rawdata = _f.sent();
                    if (rawdata[0]["type"] == "states") {
                        body["states"] = rawdata[0];
                        body["regionals"] = rawdata[1];
                    }
                    else {
                        body["states"] = rawdata[1];
                        body["regionals"] = rawdata[0];
                    }
                    res.status(200).send({ code: 200, result: body });
                    return [3 /*break*/, 9];
                case 7:
                    _b = (_a = res.status(200)).send;
                    _d = { code: 200 };
                    _e = {};
                    _c = "regionals";
                    return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.EVENTS_COLLECTION_NAME, { event: event, type: "regionals" })];
                case 8:
                    _b.apply(_a, [(_d.result = (_e[_c] = _f.sent(), _e), _d)]);
                    _f.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
});
/**
 * @api {post} /drive/:event Add Drive Link
 * @apidescription Adds a drive link to the database. Requires authentication.
 * @apiName AddDriveLink
 * @apiGroup Drive
 *
 * @apiParam {String} event Event name
 * @apiParam {String} link Drive link
 * @apiParam {String} type Link type (states, regionals)
 *
 * @apiSuccess result JSON object containing drive links
 *
 * @apiError Unauthorized Unauthorized
 * @apiError MissingArgument Missing event, link, or type
 * @apiError InvalidArgument Invalid type
 * @apiError EventNotFound Event not found
 */
router.post('/:event', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var event, link, type, yearString, data, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!res.locals.validated)
                        return [2 /*return*/, cookie_1.default.sendUnauthorized(res)];
                    event = req.params.event;
                    link = req.body.link;
                    type = req.body.type;
                    if (event == undefined || link == undefined || type == undefined) {
                        res.status(400).send({ code: 400, result: "Missing event, link, or type" });
                        return [2 /*return*/];
                    }
                    if (type != "states" && type != "regionals") {
                        res.status(400).send({ code: 400, result: "Invalid type" });
                        return [2 /*return*/];
                    }
                    yearString = new Date().getFullYear().toString();
                    if (new Date().getMonth() < 6)
                        yearString = (new Date().getFullYear() - 1).toString() + "-" + yearString;
                    else
                        yearString = yearString + "-" + (new Date().getFullYear() + 1).toString();
                    return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.EVENTS_COLLECTION_NAME, { event: event, year: yearString })];
                case 1:
                    data = _a.sent();
                    if (data.length == 0) {
                        res.status(404).send({ code: 404, result: "Event not found" });
                        return [2 /*return*/];
                    }
                    item = data[0];
                    item.links.push({ type: type, link: link });
                    return [4 /*yield*/, database_1.default.writeToCollection(database_1.default.EVENTS_COLLECTION_NAME, item)];
                case 2:
                    _a.sent();
                    res.status(200).send({ code: 200, result: item });
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * @api {get} /drive/photos Get Photos
 * @apidescription Returns a JSON object containing drive links for photos.
 * @apiName GetPhotos
 * @apiGroup Drive
 *
 * @apiSuccess result JSON object containing drive links for photos
 *
 */
router.get("/photos", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var photos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.PHOTOS_COLLECTION_NAME)];
                case 1:
                    photos = _a.sent();
                    res.status(200).send({ code: 200, result: photos });
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * @api {post} /drive/photos Add Photos
 * @apidescription Adds a photo link to the database. Requires authentication.
 * @apiName AddPhotos
 * @apiGroup Drive
 *
 * @apiParam {String} link Photo link
 *
 * @apiSuccess result JSON object containing drive links for photos
 *
 * @apiError Unauthorized Unauthorized
 * @apiError MissingArgument Missing link
 */
router.post("/photos", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var link, name, photoLink;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!res.locals.validated)
                        return [2 /*return*/, cookie_1.default.sendUnauthorized(res)];
                    link = req.body.link;
                    name = req.body.name;
                    if (!link || !name) {
                        res.status(400).send({ code: 400, result: "Missing params" });
                        return [2 /*return*/];
                    }
                    photoLink = { name: name, link: link };
                    return [4 /*yield*/, database_1.default.writeToCollection(database_1.default.PHOTOS_COLLECTION_NAME, photoLink)];
                case 1:
                    _a.sent();
                    res.status(200).send({ code: 200, result: photoLink });
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * @api {delete} /drive/photo Delete Photo
 * @apidescription Deletes a photo link from the database. Requires authentication.
 *
 * @apiParam {String} link Photo link
 *
 * @apiSuccess result JSON object containing drive links for photos
 *
 * @apiError Unauthorized Unauthorized
 * @apiError MissingArgument Missing link
 * @apiError LinkNotFound Link not found
 *
 */
router.delete("/photos", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var link, photos, photo, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!res.locals.validated)
                        return [2 /*return*/, cookie_1.default.sendUnauthorized(res)];
                    link = req.body.link;
                    if (!link) {
                        res.status(400).send({ code: 400, result: "Missing link" });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.PHOTOS_COLLECTION_NAME)];
                case 1:
                    photos = _a.sent();
                    if (photos.length == 0) {
                        res.status(404).send({ code: 404, result: "Link not found" });
                        return [2 /*return*/];
                    }
                    photo = photos[0];
                    index = photo.links.indexOf(link);
                    if (index == -1) {
                        res.status(404).send({ code: 404, result: "Link not found" });
                        return [2 /*return*/];
                    }
                    photo.links.splice(index, 1);
                    return [4 /*yield*/, database_1.default.writeToCollection(database_1.default.PHOTOS_COLLECTION_NAME, photo)];
                case 2:
                    _a.sent();
                    res.status(200).send({ code: 200, result: photo.links });
                    return [2 /*return*/];
            }
        });
    });
});
exports.default = router;
