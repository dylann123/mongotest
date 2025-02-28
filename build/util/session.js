"use strict";
/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 9/19/24
 * Session manager
 * Classes for managing user sessions
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
var database_1 = __importDefault(require("./database"));
var logger_1 = __importDefault(require("./logger"));
var SessionManager = /** @class */ (function () {
    function SessionManager() {
    }
    SessionManager.generateSecret = function () {
        var secret = crypto.randomUUID();
        return secret;
    };
    SessionManager.verifyUserSession = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var users, user;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.SESSION_COLLECTION_NAME, query)];
                                    case 1:
                                        users = _a.sent();
                                        if (!(users["length"] == 1)) return [3 /*break*/, 3];
                                        user = users[0];
                                        return [4 /*yield*/, SessionManager.isSessionExpired({ id: user["id"] })];
                                    case 2:
                                        if (_a.sent()) {
                                            SessionManager.removeSession({ id: user["id"] });
                                            resolve({ verified: false, result: "verifyUserSession: session expired" });
                                            return [2 /*return*/];
                                        }
                                        SessionManager.refreshSession({ id: user["id"] });
                                        resolve({ verified: true, result: users[0] });
                                        return [3 /*break*/, 4];
                                    case 3:
                                        logger_1.default.log(query);
                                        resolve({ verified: false, result: "verifyUserSession: no user found" });
                                        _a.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        });
                    })];
            });
        });
    };
    SessionManager.createUserSession = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var checkExistingSession, userSession;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, SessionManager.verifyUserSession({ id: id })];
                                    case 1:
                                        checkExistingSession = _a.sent();
                                        if (checkExistingSession["verified"]) {
                                            resolve(checkExistingSession["result"]["secret"]);
                                            return [2 /*return*/];
                                        }
                                        userSession = { id: id };
                                        userSession["secret"] = SessionManager.generateSecret();
                                        userSession["expires"] = Date.now() + SessionManager.MAX_SESSION_LENGTH_MS;
                                        return [4 /*yield*/, database_1.default.writeToCollection(database_1.default.SESSION_COLLECTION_NAME, userSession)];
                                    case 2:
                                        _a.sent();
                                        resolve(userSession["secret"]);
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
            });
        });
    };
    /**
     * Refreshes a session by updating the expiration time
     * @param id user id
     * @returns boolean; true if session was refreshed, false if not found at all
     */
    SessionManager.refreshSession = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var sessions, userSession;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.SESSION_COLLECTION_NAME, query)];
                                    case 1:
                                        sessions = _a.sent();
                                        if (sessions["length"] == 0)
                                            resolve(false);
                                        else {
                                            userSession = sessions[0];
                                            userSession["expires"] = Date.now() + SessionManager.MAX_SESSION_LENGTH_MS;
                                            resolve(true);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
            });
        });
    };
    /**
     * Removes a session from the database
     * @param query query object
     * @returns boolean; true if session was removed, false if not
     */
    SessionManager.removeSession = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var sessions, userSession;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.SESSION_COLLECTION_NAME, query)];
                                    case 1:
                                        sessions = _a.sent();
                                        if (sessions["length"] == 0)
                                            resolve(false);
                                        else {
                                            userSession = sessions[0];
                                            database_1.default.removeItemFromCollection(database_1.default.SESSION_COLLECTION_NAME, userSession);
                                            resolve(true);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
            });
        });
    };
    /**
     * Checks if a session is expired
     * @param query query object
     * @returns boolean; true if session is expired or query is invalid, false if not
     */
    SessionManager.isSessionExpired = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var sessions, userSession;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.SESSION_COLLECTION_NAME, query)];
                                    case 1:
                                        sessions = _a.sent();
                                        if (sessions["length"] == 0)
                                            resolve(true);
                                        else {
                                            userSession = sessions[0];
                                            if (userSession["expires"] < Date.now()) {
                                                resolve(true);
                                            }
                                            else
                                                resolve(false);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
            });
        });
    };
    SessionManager.getSessionCookieHeader = function (secret) {
        if (secret === true)
            return "".concat(SessionManager.SECRET_COOKIE_NAME, "=; Path=/; Max-Age=0; SameSite=Strict; HttpOnly;"); // logout
        else
            return "".concat(SessionManager.SECRET_COOKIE_NAME, "=").concat(secret, "; Path=/; Max-Age=").concat(SessionManager.MAX_SESSION_LENGTH_MS, "; SameSite=Strict; HttpOnly;");
    };
    SessionManager.getUserCookieHeader = function (id) {
        if (id === true)
            return "id=; Path=/; Max-Age=0; SameSite=Strict;";
        else
            return "id=".concat(id, "; Path=/; Max-Age=").concat(SessionManager.MAX_SESSION_LENGTH_MS, "; SameSite=Strict;");
    };
    SessionManager.SECRET_COOKIE_NAME = "client_secret!DO_NOT_SHARE";
    SessionManager.MAX_SESSION_LENGTH_MS = 1000 * 60 * 60;
    return SessionManager;
}());
exports.default = SessionManager;
