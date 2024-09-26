"use strict";
/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 6 September 2024
 * Handles endpoint requests to /tests/
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var categories_1 = __importDefault(require("../util/categories"));
var router = express_1.default.Router();
/* =================================== GET HANDLERS =================================== */
// returns a drive link for a given event
router.get('/:event', function (req, res, next) {
    var event = req.params.event;
    if (swap(categories_1.default.TEST_CATEGORIES)[event] == undefined) {
        res.status(404).send({ code: 404, result: "Event not found." });
        return;
    }
    res.status(200).send({ code: 200, result: categories_1.default.DRIVE_LINKS[event] });
});
// returns the category table
router.get('/categories', function (req, res, next) {
    res.status(200).send({ code: 200, result: categories_1.default });
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
