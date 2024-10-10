/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 6 September 2024
 * Handles endpoint requests to /tests/
 */

import express from "express"
import categories from "../util/categories";
import cookie from "../util/cookie"
import Database from "../util/database";
import SessionManager from "../util/session";

const router = express.Router();

router.use(cookie.parseCookiesRejectSession)

/* =================================== GET HANDLERS =================================== */

// returns the category table
router.get('/categories', function (req, res, next) {
	if (!res.locals.validated)
		cookie.sendUnauthorized(res)
	else {
		res.status(200).send({ code: 200, result: categories.TEST_CATEGORIES })
	}
})

// returns a drive link for a given event
router.get('/:event', async function (req, res, next) {
	if (!res.locals.validated) return cookie.sendUnauthorized(res)

	const event = req.params.event;
	if (swap(categories.TEST_CATEGORIES)[event] == undefined) {
		res.status(404).send({ code: 404, result: "Event not found." });
		return
	}

	const users = (await Database.queryItemsInCollection(Database.USER_COLLECTION_NAME, { username: res.locals.username }))

	const user = users[0]

	console.log(user)

	if (user["type"].includes("states")) {
		let body = {
			"regionals": categories.DRIVE_LINKS["regionals"][event],
			"states": categories.DRIVE_LINKS["states"][event]
		}
		res.status(200).send({ code: 200, result: body });
	} else 
		res.status(200).send({ code: 200, result: {"regionals": categories.DRIVE_LINKS["regionals"][event]} });
	
});
// returns an inversed JSON object; used for iteration
function swap(json: Object) {
	let ret = {};
	for (let key in json) {
		ret[json[key]] = key;
	}
	return ret;
}

export default router;
