"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 14 November 2024
 * Handles event rankings
 */
var express_1 = __importDefault(require("express"));
var database_1 = __importDefault(require("../util/database"));
var router = express_1.default.Router();
router.get('/', function (req, res, next) {
    res.status(404).send({ error: "404 Not Found" });
});
router.get('/get', function (req, res, next) {
    var query = req.query;
    var event = query.event;
    var years = query.years;
    var userid = query.userid;
    var competition = query.competition;
    if (!event || !years) {
        res.status(400).send({ code: 400, result: "Missing parameters: event, years" });
        return;
    }
    var collection = database_1.default.RANKINGS_COLLECTION_NAME;
    var queryObj = { event: event, year: years };
    if (userid) {
        queryObj["userid"] = userid;
    }
    if (competition) {
        queryObj["competition"] = competition;
    }
    database_1.default.queryItemsInCollection(collection, queryObj).then(function (result) {
        if (result.length == 0) {
            res.status(404).send({ code: 404, result: "Rankings not found." });
            return;
        }
        res.status(200).send({ code: 200, result: result });
    });
});
exports.default = router;
