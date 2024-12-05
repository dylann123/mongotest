"use strict";
/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 21 September 2024
 * mongodb utility
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
var mongodb_1 = require("mongodb");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + '/../../.env' });
var DATABASE_NAME = process.env.DATABASE_QUERY;
var client = new mongodb_1.MongoClient(process.env.DATABASE_URL).connect();
var Database = /** @class */ (function () {
    function Database() {
    }
    Database.generateID = function () {
        return crypto.randomUUID().toString();
    };
    /**
     * Writes to a collection
     * @param collection collection to write to
     * @param data object to write
     * @returns true on success
     */
    Database.writeToCollection = function (collection, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dbClient, db;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client];
                                case 1:
                                    dbClient = _a.sent();
                                    db = dbClient.db(DATABASE_NAME);
                                    if (!this.collectionExistsInDb(db, collection))
                                        db.createCollection(collection);
                                    return [4 /*yield*/, db.collection(collection).insertOne(data)
                                            .catch(function (err) { reject(err); })];
                                case 2:
                                    _a.sent();
                                    resolve(true);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Returns an array of every collection item that matches query
     * @param collection string
     * @param query object
     * @returns Array<object>
     */
    Database.queryItemsInCollection = function (collection_1) {
        return __awaiter(this, arguments, void 0, function (collection, query) {
            if (query === void 0) { query = {}; }
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var dbClient, db, data, object, _i, data_1, i;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, client];
                                    case 1:
                                        dbClient = _a.sent();
                                        db = dbClient.db(DATABASE_NAME);
                                        if (query["_id"] && typeof query["_id"] == "string")
                                            query["_id"] = mongodb_1.ObjectId.createFromHexString(query["_id"]);
                                        return [4 /*yield*/, db.collection(collection).find(query).toArray()
                                            // convert to JS object
                                        ];
                                    case 2:
                                        data = _a.sent();
                                        object = [];
                                        for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                                            i = data_1[_i];
                                            object.push(i);
                                        }
                                        resolve(object);
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
            });
        });
    };
    /**
     * Modifies a selected item using the keys from another object
     * @param collection string; collection to modify
     * @param query object; object query to replace
     * @param replacement object; replaces every item from the queried object with every item in replacement
     * @returns object; new object
     */
    Database.modifyItemInCollection = function (collection, query, replacement) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var queries, newRow, i;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Database.queryItemsInCollection(collection, query)];
                                    case 1:
                                        queries = _a.sent();
                                        if (queries["length"] > 1) {
                                            reject("modifyItemInCollection: query returned multiple rows");
                                            return [2 /*return*/];
                                        }
                                        if (queries["length"] == 0) {
                                            console.log(query);
                                            reject("modifyItemInCollection: query returned no rows");
                                            return [2 /*return*/];
                                        }
                                        newRow = queries[0];
                                        for (i in replacement) {
                                            if (i == "_id")
                                                continue;
                                            newRow[i] = replacement[i];
                                        }
                                        console.log(newRow);
                                        Database.removeItemFromCollection(collection, query);
                                        Database.writeToCollection(collection, newRow);
                                        resolve(queries);
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
            });
        });
    };
    /**
     * Returns an array of every item in a collection
     * @param collection the collection to read
     * @returns array of collection items
     */
    Database.getCollection = function (collection) {
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                var dbClient, db, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client];
                        case 1:
                            dbClient = _a.sent();
                            db = dbClient.db(DATABASE_NAME);
                            return [4 /*yield*/, db.collection(collection).find().toArray()];
                        case 2:
                            data = _a.sent();
                            resolve(data);
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    /**
     * Returns every collection in the database
     * @returns array of every collection
     */
    Database.getDatabase = function () {
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                var dbClient, db, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client];
                        case 1:
                            dbClient = _a.sent();
                            db = dbClient.db(DATABASE_NAME);
                            return [4 /*yield*/, db.listCollections().toArray()];
                        case 2:
                            data = _a.sent();
                            resolve(data);
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    /**
     *
     * @param db database object
     * @param collectionName collection
     * @returns boolean
     */
    Database.collectionExistsInDb = function (db, collectionName) {
        return __awaiter(this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.listCollections({ name: collectionName }).next()];
                    case 1:
                        collection = _a.sent();
                        return [2 /*return*/, (collection) ? true : false];
                }
            });
        });
    };
    Database.removeItemFromCollection = function (collection, query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var dbClient, db;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, client];
                                    case 1:
                                        dbClient = _a.sent();
                                        db = dbClient.db(DATABASE_NAME);
                                        if (!Database.collectionExistsInDb(db, collection))
                                            db.createCollection(collection);
                                        return [4 /*yield*/, Database.queryItemsInCollection(collection, query)];
                                    case 2:
                                        if (!((_a.sent())["length"] != 1)) return [3 /*break*/, 3];
                                        resolve(false);
                                        return [3 /*break*/, 5];
                                    case 3: return [4 /*yield*/, db.collection(collection).deleteOne(query)
                                            .catch(function (err) { reject(err); })];
                                    case 4:
                                        _a.sent();
                                        resolve(true);
                                        _a.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        });
                    })];
            });
        });
    };
    Database.removeItemsFromCollection = function (collection, query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var dbClient, db;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, client];
                                    case 1:
                                        dbClient = _a.sent();
                                        db = dbClient.db(DATABASE_NAME);
                                        if (!this.collectionExistsInDb(db, collection))
                                            db.createCollection(collection);
                                        return [4 /*yield*/, db.collection(collection).deleteMany(query)
                                                .catch(function (err) { reject(err); })];
                                    case 2:
                                        _a.sent();
                                        resolve(true);
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
            });
        });
    };
    /** only for testing use */
    Database.getMongoClient = function () {
        return client;
    };
    Database.STATES = "states";
    Database.REGIONALS = "regionals";
    Database.SESSION_COLLECTION_NAME = "sessiondata"; // session data: { user, secret, expires }
    Database.USER_COLLECTION_NAME = "logindata"; // user, password { user, password }
    Database.USERDATA_COLLECTION_NAME = "userdata"; // profile data { user, type, events, firstname, lastname, admin }
    Database.TOURNAMENT_COLLECTION_NAME = "tournamentdata"; // tournament data { name, date, location, schedule, links, training } 
    Database.RANKINGS_COLLECTION_NAME = "rankingsdata"; // rankings data { type: "individual"/"team", event, data, id: 1/2/3/userid }
    Database.EVENTS_COLLECTION_NAME = "eventstorage"; // drive data { name, link, type }
    Database.PHOTOS_COLLECTION_NAME = "photostorage"; // drive data { name, photolink }
    return Database;
}());
exports.default = Database;
