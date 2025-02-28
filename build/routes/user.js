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
var express_1 = __importDefault(require("express"));
var session_1 = __importDefault(require("../util/session"));
var cookie_1 = __importDefault(require("../util/cookie"));
var OAuth2Client = require('google-auth-library').OAuth2Client; // it doesn't like es6. I don't know why. Please don't ask me.
var dotenv_1 = __importDefault(require("dotenv"));
var account_1 = __importDefault(require("../util/account"));
var logger_1 = __importDefault(require("../util/logger"));
dotenv_1.default.config({ path: __dirname + '/../../.env' });
var app_id = "195885898085-lliad6echbr00hs29tdni25bo3t7rcod.apps.googleusercontent.com";
var client = new OAuth2Client();
var router = express_1.default.Router();
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: true }));
// reject unauthorized sessions
router.use(cookie_1.default.parseCookiesRejectSession);
// 404 handler
router.get('/', function (req, res, next) {
    res.status(404).send({ code: "404", error: "unknown path" });
});
router.post("/logout", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, session_1.default.verifyUserSession({ secret: res.locals.cookie[session_1.default.SECRET_COOKIE_NAME] })];
            case 1:
                session = _a.sent();
                if (!session["verified"]) {
                    res.status(401).send("Unauthorized");
                    return [2 /*return*/];
                }
                session_1.default.removeSession({ secret: res.locals.cookie[session_1.default.SECRET_COOKIE_NAME] }).then(function () {
                    res.setHeader("Set-Cookie", [session_1.default.getSessionCookieHeader(true), session_1.default.getUserCookieHeader(true)]);
                    res.status(200).send("Logged out");
                });
                return [2 /*return*/];
        }
    });
}); });
router.get("/getuserinfo", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, session_1.default.verifyUserSession({ secret: res.locals.cookie[session_1.default.SECRET_COOKIE_NAME] })];
            case 1:
                session = _a.sent();
                if (!session["verified"]) {
                    res.status(401).send("Unauthorized");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, account_1.default.getUserAccount({ id: session["result"]["id"] })];
            case 2:
                user = _a.sent();
                res.status(200).send(user);
                return [2 /*return*/];
        }
    });
}); });
router.get("/loggedin", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, session_1.default.verifyUserSession({ secret: res.locals.cookie[session_1.default.SECRET_COOKIE_NAME] })];
            case 1:
                session = _a.sent();
                if (!session["verified"]) {
                    res.status(401).send({ 'value': 'false' });
                    return [2 /*return*/];
                }
                res.status(200).send({ 'value': 'true' });
                return [2 /*return*/];
        }
    });
}); });
router.post("/g_login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies, csrf_cookie, csrf_body, ticket, payload, exists;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cookies = req.headers.cookie.split(";");
                csrf_cookie = "";
                cookies.forEach(function (cookie) {
                    var _a = cookie.split("="), key = _a[0], value = _a[1];
                    if (key.trim() === "g_csrf_token") {
                        csrf_cookie = value;
                    }
                });
                if (!csrf_cookie) {
                    res.status(401).send("Unauthorized");
                    return [2 /*return*/];
                }
                csrf_body = req.body.g_csrf_token;
                if (!csrf_body || csrf_cookie !== csrf_body) {
                    res.status(401).send("Unauthorized");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, client.verifyIdToken({
                        idToken: req.body.credential,
                        audience: app_id
                    })];
            case 1:
                ticket = _a.sent();
                payload = ticket.getPayload();
                res.cookie("g_csrf_token", "", { maxAge: 0 }); // clear csrf token
                return [4 /*yield*/, account_1.default.doesUserExist({ id: parseInt(payload.sub) })];
            case 2:
                exists = _a.sent();
                if (!exists) {
                    account_1.default.createUserAccount(parseInt(payload.sub), { firstname: payload.given_name, lastname: payload.family_name, email: payload.email });
                }
                session_1.default.createUserSession(parseInt(payload.sub)).then(function (secret) {
                    res.setHeader("Set-Cookie", [session_1.default.getSessionCookieHeader(secret), session_1.default.getUserCookieHeader(payload.sub)]);
                    logger_1.default.log(payload.name + " logged in as id " + payload.sub + " with secret " + secret);
                    res.status(200).redirect(process.env.CLIENT_HOST + "/home.html");
                });
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
