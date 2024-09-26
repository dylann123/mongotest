/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 6 September 2024
 * Handles endpoint requests to /tests/
 */

import express from "express"
import categories from "../util/categories";
const router = express.Router();

/* =================================== GET HANDLERS =================================== */

// returns a drive link for a given event
router.get('/:event', function (req, res, next) {
	const event = req.params.event;
	if (swap(categories.TEST_CATEGORIES)[event] == undefined) {
		res.status(404).send({ code: 404, result: "Event not found." });
		return
	}
	res.status(200).send({ code: 200, result: categories.DRIVE_LINKS[event] });
});

// returns the category table
router.get('/categories', function (req, res, next) {
	res.status(200).send({ code: 200, result: categories})
})

// returns an inversed JSON object; used for iteration
function swap(json: Object) {
	let ret = {};
	for (let key in json) {
		ret[json[key]] = key;
	}
	return ret;
}

export default router;
