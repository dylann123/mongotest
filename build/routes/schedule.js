"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 5 December 2024
 * Handles unhandled endpoint requests at /*
 */
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/getschedule", function (req, res) {
    var query = req.query;
    var date = query.date;
    if (date) {
    }
});
router.get('/', function (req, res, next) {
    var query = req.query;
    var queryTypes = ["date", "starttime", "endtime", "location", "description", "event"];
    res.status(404).send({ error: "404 Not Found" });
});
exports.default = router;
