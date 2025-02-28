/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 6 September 2024
 * Handles endpoint requests to /tests/
 */

import express from "express"
import events from "../util/events";
import cookie from "../util/cookie"
import Database from "../util/database";
import SessionManager from "../util/session";

const router = express.Router();

router.use(cookie.parseCookiesRejectSession)

/**
 * @apiDefine Drive Drive
 * Handles event Drive storage.
 */

/**
 * @api {get} /drive/events Get Events
 * @apidescription Returns a JSON object containing event types. Requires authentication.
 * @apiName GetEvents
 * @apiGroup Drive
 * 
 * @apiSuccess result JSON object containing event types
 * 
 * @apiError Unauthorized Unauthorized
 * 
 */
router.get('/events', function (req, res, next) {
	if (!res.locals.validated)
		cookie.sendUnauthorized(res)
	else {
		res.status(200).send({ code: 200, result: events.EVENT_NAMES })
	}
})

/**
 * @api {get} /drive/:event Get Drive Links
 * @apidescription Returns a JSON object containing drive links for a given event. Requires authentication. Response changes based on user type (regional/state).
 * @apiName GetDriveLinks
 * @apiGroup Drive
 * 
 * @apiParam {String} event Event name
 * 
 * @apiSuccess result JSON object containing drive links
 * 
 * @apiError EventNotFound Event not found.
 * @apiError Unauthorized Unauthorized
 */
router.get('/:event', async function (req, res, next) {
	if (!res.locals.validated) return cookie.sendUnauthorized(res)

	const event = req.params.event;
	if (events.EVENT_NAMES[event] == undefined) {
		res.status(404).send({ code: 404, result: "Event not found." });
		return
	}

	if ((await Database.queryItemsInCollection(Database.EVENTS_COLLECTION_NAME, { event: event })).length == 0) {
		await Database.writeToCollection(Database.EVENTS_COLLECTION_NAME, { event: event, type: "states", links: [] })
		await Database.writeToCollection(Database.EVENTS_COLLECTION_NAME, { event: event, type: "regionals", links: [] })
		return
	}

	const users = (await Database.queryItemsInCollection(Database.USERDATA_COLLECTION_NAME, { id: res.locals.id }))

	const user = users[0]

	if (user["type"].includes("states")) {
		const body = {}
		const rawdata = await Database.queryItemsInCollection(Database.EVENTS_COLLECTION_NAME, { event: event })
		if (rawdata[0]["type"] == "states") {
			body["states"] = rawdata[0]
			body["regionals"] = rawdata[1]
		} else {
			body["states"] = rawdata[1]
			body["regionals"] = rawdata[0]
		}

		res.status(200).send({ code: 200, result: body });
	} else
		res.status(200).send({ code: 200, result: { "regionals": await Database.queryItemsInCollection(Database.EVENTS_COLLECTION_NAME, { event: event, type: "regionals" }) } });

});

/**
 * @api {post} /drive/:event Add Drive Link
 * @apidescription Adds a drive link to the database. Requires authentication.
 * @apiName AddDriveLink
 * @apiGroup Drive
 * 
 * @apiParam {String} event Event name
 * @apiParam {String} link Drive link
 * @apiParam {String} type Link type (states, regionals)
 * 
 * @apiSuccess result JSON object containing drive links
 * 
 * @apiError Unauthorized Unauthorized
 * @apiError MissingArgument Missing event, link, or type
 * @apiError InvalidArgument Invalid type
 * @apiError EventNotFound Event not found
 */

router.post('/:event', async function (req, res, next) {
	if (!res.locals.validated) return cookie.sendUnauthorized(res)

	const event = req.params.event;
	const link = req.body.link;
	const type = req.body.type;
	const season = req.body.season;

	if (event == undefined || link == undefined || type == undefined) {
		res.status(400).send({ code: 400, result: "Missing event, link, or type" });
		return
	}

	if (type != "states" && type != "regionals") {
		res.status(400).send({ code: 400, result: "Invalid type" });
		return
	}

	const data = await Database.queryItemsInCollection(Database.EVENTS_COLLECTION_NAME, { event: event, season: season })
	if (data.length == 0) {
		res.status(404).send({ code: 404, result: "Event not found" });
		return
	}
	const item = data[0]
	item.links.push({ type: type, link: link })
	await Database.writeToCollection(Database.EVENTS_COLLECTION_NAME, item)
	res.status(200).send({ code: 200, result: item });
});

/**
 * @api {get} /drive/photos Get Photos
 * @apidescription Returns a JSON object containing drive links for photos.
 * @apiName GetPhotos
 * @apiGroup Drive
 * 
 * @apiSuccess result JSON object containing drive links for photos
 * 
 */
router.get("/photos", async function (req, res, next) {
	const photos = await Database.queryItemsInCollection(Database.PHOTOS_COLLECTION_NAME)
	res.status(200).send({ code: 200, result: photos })
})

/**
 * @api {post} /drive/photos Add Photos
 * @apidescription Adds a photo link to the database. Requires authentication.
 * @apiName AddPhotos
 * @apiGroup Drive
 * 
 * @apiParam {String} link Photo link
 * 
 * @apiSuccess result JSON object containing drive links for photos
 * 
 * @apiError Unauthorized Unauthorized
 * @apiError MissingArgument Missing link
 */
router.post("/photos", async function (req, res, next) {
	if (!res.locals.validated) return cookie.sendUnauthorized(res)

	const link = req.body.link
	const name = req.body.name
	if (!link || !name) {
		res.status(400).send({ code: 400, result: "Missing params" })
		return
	}

	const photoLink = { name: name, link: link }
	await Database.writeToCollection(Database.PHOTOS_COLLECTION_NAME, photoLink)
	res.status(200).send({ code: 200, result: photoLink })
})

/**
 * @api {delete} /drive/photo Delete Photo
 * @apidescription Deletes a photo link from the database. Requires authentication.
 * 
 * @apiParam {String} link Photo link
 * 
 * @apiSuccess result JSON object containing drive links for photos
 * 
 * @apiError Unauthorized Unauthorized
 * @apiError MissingArgument Missing link
 * @apiError LinkNotFound Link not found
 * 
 */

router.delete("/photos", async function (req, res, next) {
	if (!res.locals.validated) return cookie.sendUnauthorized(res)

	const link = req.body.link
	if (!link) {
		res.status(400).send({ code: 400, result: "Missing link" })
		return
	}

	const photos = await Database.queryItemsInCollection(Database.PHOTOS_COLLECTION_NAME)
	if (photos.length == 0) {
		res.status(404).send({ code: 404, result: "Link not found" })
		return
	}

	const photo = photos[0]
	const index = photo.links.indexOf(link)
	if (index == -1) {
		res.status(404).send({ code: 404, result: "Link not found" })
		return
	}

	photo.links.splice(index, 1)
	await Database.writeToCollection(Database.PHOTOS_COLLECTION_NAME, photo)
	res.status(200).send({ code: 200, result: photo.links })
})


export default router;
