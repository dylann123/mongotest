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
var categories_1 = __importDefault(require("../util/categories"));
var cookie_1 = __importDefault(require("../util/cookie"));
var database_1 = __importDefault(require("../util/database"));
var router = express_1.default.Router();
router.use(cookie_1.default.parseCookiesRejectSession);
/* =================================== GET HANDLERS =================================== */
// returns the category table
router.get('/categories', function (req, res, next) {
    if (!res.locals.validated)
        cookie_1.default.sendUnauthorized(res);
    else {
        res.status(200).send({ code: 200, result: categories_1.default.TEST_CATEGORIES });
    }
});
// returns a drive link for a given event
router.get('/:event', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var event, users, user, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!res.locals.validated)
                        return [2 /*return*/, cookie_1.default.sendUnauthorized(res)];
                    event = req.params.event;
                    if (swap(categories_1.default.TEST_CATEGORIES)[event] == undefined) {
                        res.status(404).send({ code: 404, result: "Event not found." });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.USER_COLLECTION_NAME, { username: res.locals.username })];
                case 1:
                    users = (_a.sent());
                    user = users[0];
                    console.log(user);
                    if (user["type"].includes("states")) {
                        body = {
                            "regionals": categories_1.default.DRIVE_LINKS["regionals"][event],
                            "states": categories_1.default.DRIVE_LINKS["states"][event]
                        };
                        res.status(200).send({ code: 200, result: body });
                    }
                    else
                        res.status(200).send({ code: 200, result: { "regionals": categories_1.default.DRIVE_LINKS["regionals"][event] } });
                    return [2 /*return*/];
            }
        });
    });
});
// returns an inversed JSON object; used for iteration
function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}
exports.default = router;
