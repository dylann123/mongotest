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
var SessionManager = /** @class */ (function () {
    function SessionManager() {
    }
    SessionManager.generateSecret = function () {
        var secret = crypto.randomUUID();
        return secret;
    };
    /**
     * Gets a user session
     * @param data query by userobject
     * @param createSessionIfMissing boolean; if true, will create a session if the user does not exist
     * @returns Promise<object>
     */
    SessionManager.getUserSession = function (data_1) {
        return __awaiter(this, arguments, void 0, function (data, createSessionIfMissing) {
            if (createSessionIfMissing === void 0) { createSessionIfMissing = false; }
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var users, secret;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.SESSION_COLLECTION_NAME, data)];
                                    case 1:
                                        users = _a.sent();
                                        if (!(users["length"] == 1)) return [3 /*break*/, 2];
                                        resolve(users[0]);
                                        return [3 /*break*/, 6];
                                    case 2:
                                        if (!(users["length"] > 1)) return [3 /*break*/, 3];
                                        resolve({ error: "getUserSession: multiple users in selection" });
                                        return [3 /*break*/, 6];
                                    case 3:
                                        if (!createSessionIfMissing) return [3 /*break*/, 5];
                                        return [4 /*yield*/, SessionManager.createUserSession(data)];
                                    case 4:
                                        secret = _a.sent();
                                        resolve(SessionManager.getUserSession({ secret: secret }));
                                        return [3 /*break*/, 6];
                                    case 5:
                                        reject({ error: "getUserSession: user session does not exist" });
                                        _a.label = 6;
                                    case 6: return [2 /*return*/];
                                }
                            });
                        });
                    })];
            });
        });
    };
    SessionManager.verifyUserSession = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var users;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.SESSION_COLLECTION_NAME, data)];
                                    case 1:
                                        users = _a.sent();
                                        if (users["length"] == 1)
                                            resolve({ verified: true, result: users[0] });
                                        else if (users["length"] > 1)
                                            resolve({ verified: false, result: "verifyUserSession: multiple users found" });
                                        else
                                            resolve({ verified: false, result: "verifyUserSession: no user found" });
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
            });
        });
    };
    SessionManager.createUserSession = function (userdata) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var userSession;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        userSession = structuredClone(userdata);
                                        userSession["secret"] = SessionManager.generateSecret();
                                        userSession["expires"] = Date.now() + SessionManager.MAX_SESSION_LENGTH_MS;
                                        return [4 /*yield*/, database_1.default.writeToCollection(database_1.default.SESSION_COLLECTION_NAME, userSession)];
                                    case 1:
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
                                        else if (sessions["length"] > 1)
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
    SessionManager.removeSession = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var sessions, userSession;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, database_1.default.queryItemsInCollection(database_1.default.SESSION_COLLECTION_NAME, (typeof query === "string") ? { secret: query } : query)];
                                    case 1:
                                        sessions = _a.sent();
                                        if (sessions["length"] == 0)
                                            resolve(false);
                                        else if (sessions["length"] > 1)
                                            resolve(false);
                                        else {
                                            userSession = sessions[0];
                                            database_1.default.removeItemsFromCollection(database_1.default.SESSION_COLLECTION_NAME, userSession);
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
    SessionManager.setSessionCookie = function (res, secret) {
        res.cookie(SessionManager.COOKIE_NAME, secret, { maxAge: SessionManager.MAX_SESSION_LENGTH_MS, httpOnly: true });
        return true;
    };
    SessionManager.COOKIE_NAME = "secret";
    SessionManager.MAX_SESSION_LENGTH_MS = 1000 * 60 * 60;
    return SessionManager;
}());
exports.default = SessionManager;
