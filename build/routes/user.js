"use strict";
/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 13 September 2024
 * Handles endpoint requests to /user
 * Login, signup, and account options
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
var bcrypt_1 = __importDefault(require("bcrypt"));
var session_1 = __importDefault(require("../util/session"));
var cookie_1 = __importDefault(require("../util/cookie"));
var dotenv_1 = __importDefault(require("dotenv"));
var account_1 = __importDefault(require("../util/account"));
dotenv_1.default.config({ path: __dirname + '/../../.env' });
var router = express_1.default.Router();
// reject unauthorized sessions
router.use(cookie_1.default.parseCookiesRejectSession);
// 404 handler
router.get('/', function (req, res, next) {
    if (!res.locals.validated)
        return;
    res.status(404).send({ code: "404", error: "unknown path" });
});
/**
 * GET /user/login
 * @param username: string
 * @param password: string
 * @returns {
 * 	"code": "errorcode",
 * 	"result" "authcode"
 * }
 */
router.get('/login', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, data, inputpassword, sessionobject, secret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    username = req.query.username;
                    password = req.query.password;
                    if (username == undefined || password == undefined) {
                        res.status(400).send({ code: 400, result: "Must supply username and password" });
                        return [2 /*return*/];
                    }
                    if (typeof password == "string")
                        password = password.trim();
                    else {
                        res.status(400).send({ code: 400, result: "Password must be a string" });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, account_1.default.getUserAccount(username)];
                case 1:
                    data = _a.sent();
                    if (!(data["length"] > 1)) return [3 /*break*/, 2];
                    res.status(500).send({ code: 500, result: "Internal server error" });
                    return [3 /*break*/, 7];
                case 2:
                    if (!(data["length"] == 1)) return [3 /*break*/, 6];
                    inputpassword = data[0]["password"];
                    if (!bcrypt_1.default.compareSync(password, inputpassword)) return [3 /*break*/, 4];
                    return [4 /*yield*/, session_1.default.getUserSession({ username: data[0]["username"] }, true).catch(function (error) {
                            res.status(500).send({ code: 500, result: error });
                            return;
                        })];
                case 3:
                    sessionobject = _a.sent();
                    secret = sessionobject["secret"];
                    session_1.default.setSessionCookie(res, secret);
                    res.status(200).send({ code: 200, result: secret });
                    return [3 /*break*/, 5];
                case 4:
                    res.status(401).send({ code: 403, result: "Username or password is incorrect" });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    res.status(500).send({ code: 500, result: "Username not found" });
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
});
/**
 * POST /user/createaccount
 * On success, stores username and password, hashed with bcrypt
 * @param body.username username
 * @param body.password password; please hash
 * @param body.type type; Valid types: regional, state, officer
 */
router.post('/createaccount', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var invalidUser, body, username, password, userdata, existingAccounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    invalidUser = !res.locals.validated || res.locals.userdata.type == undefined ||
                        (res.locals.userdata.type != "officer" && !res.locals.userdata.admin);
                    if (invalidUser && req.body.secretadminkeywow != process.env.ADMIN_SECRET) {
                        res.status(501).send({ success: false, result: "and who do you think you are? (invalidated request)" });
                        return [2 /*return*/];
                    }
                    body = req.body;
                    username = body.username;
                    password = body.password;
                    userdata = body.userdata;
                    if (username == undefined || password == undefined) {
                        res.status(400).send({ success: false, result: "Must supply username and password; got user " + username + " and password " + password });
                        return [2 /*return*/];
                    }
                    if (userdata["type"] == undefined) {
                        res.status(400).send({ success: false, result: "Must supply type" });
                        return [2 /*return*/];
                    }
                    if (userdata["events"] == undefined) {
                        res.status(400).send({ success: false, result: "Must supply at least one event" });
                        return [2 /*return*/];
                    }
                    if (typeof password == "string")
                        password = password.trim();
                    else {
                        res.status(400).send({ code: 400, result: "Password must be a string" });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, account_1.default.getUserAccount(username)];
                case 1:
                    existingAccounts = _a.sent();
                    if (existingAccounts["length"] > 0) {
                        res.status(409).send({ success: false, result: "Username already taken." });
                        return [2 /*return*/];
                    }
                    password = bcrypt_1.default.hashSync(password, parseInt(process.env.PASSWORD_SALT));
                    account_1.default.createUserAccount(username, password, userdata);
                    res.status(200).send({ code: 200, result: userdata["type"] + " account " + username + " created successfully." });
                    return [2 /*return*/];
            }
        });
    });
});
exports.default = router;
