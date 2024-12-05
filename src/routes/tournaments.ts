/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 21 September 2024
 * Handles endpoint requests to /tournaments
 * Returns values from tournament database
 */

import express from "express"
import events from "../util/events";
import cookie from "../util/cookie"
import Database from "../util/database";
import { parse } from "path";

const router = express.Router();

router.use(cookie.parseCookiesRejectSession)

const COLLECTION = Database.TOURNAMENT_COLLECTION_NAME

router.get('/', async function (req, res, next) {

	const body = {}
	const rawdata = await Database.getCollection(COLLECTION)
	for (const tournament of rawdata) {
		body[tournament["id"]] = {
			"name": tournament["name"],
			"date": tournament["date"] // UNIX timestamp
		}
	}
	res.send({ code: 200, result: body });
})

router.get('/:id', async function (req, res, next) {
	if (!res.locals.validated) return cookie.sendUnauthorized(res)

	const id = req.params.id;
	const tournament = await Database.queryItemsInCollection(COLLECTION, { id: id })

	if (tournament["length"] == 0) {
		res.status(404).send({ code: 404, result: "Tournament not found." });
		return
	}

	res.status(200).send({ code: 200, result: tournament[0] });
});

router.post('/add', async function (req, res, next) {
	if (!res.locals.validated) return cookie.sendUnauthorized(res)
	if (!res.locals.administrator) return cookie.sendUnauthorized(res)

	const body = req.body;
	const params = ["name", "date", "locations", "links", "time_slots", "season"]

	for (const param of params) {
		if (!body[param]) {
			res.status(400).send({ code: 400, result: `Missing parameter: ${param}` });
			return
		} else {
			switch (param) {
				case "name":
					if (typeof body[param] != "string") {
						res.status(400).send({ code: 400, result: `Parameter ${param} must be a string` });
						return
					}
					break;
				case "date":
					if (typeof body[param] != "number") {
						res.status(400).send({ code: 400, result: `Parameter ${param} must be a unix timestamp` });
						return
					}
					break;
				case "locations":
					if (!Array.isArray(body[param])) {
						res.status(400).send({ code: 400, result: `Parameter ${param} must be an array` });
						return
					}
					break;
				case "links":
					if (!Array.isArray(body[param])) {
						res.status(400).send({ code: 400, result: `Parameter ${param} must be an array` });
						return
					}
					break;
				case "time_slots":
					if (!Array.isArray(body[param])) {
						res.status(400).send({ code: 400, result: `Parameter ${param} must be an array of objects formatted as [{start: starttimeunix, stop: stoptimeunix}, ...]` });
						return
					}
					break;
				case "season":
					if (typeof body[param] != "string") {
						res.status(400).send({ code: 400, result: `Parameter ${param} must be a string` });
						return
					}
			}
		}
	}

	const duplicates = await Database.queryItemsInCollection(COLLECTION, { name: body["name"] })
	if (duplicates["length"] > 0) {
		res.status(400).send({ code: 400, result: "Tournament '" + body["name"] + "' already exists." });
		return
	}

	const tournament = {
		"name": body["name"],
		"date": body["date"],
		"locations": body["locations"],
		"links": body["links"],
		"time_slots": body["time_slots"],
		"season": body["season"],
		"id": Database.generateID()
	}

	for (const param in params) {
		switch (param) {
			case "name":
				if (typeof tournament[param] != "string") {
					res.status(400).send({ code: 400, result: `Parameter ${param} must be a string` });
					return
				}
				break;
			case "date":
				if (typeof tournament[param] != "number") {
					res.status(400).send({ code: 400, result: `Parameter ${param} must be a unix timestamp` });
					return
				}
				break;
			case "locations":
				if (!Array.isArray(tournament[param])) {
					res.status(400).send({ code: 400, result: `Parameter ${param} must be an array` });
					return
				}
				break;
			case "links":
				if (!Array.isArray(tournament[param])) {
					res.status(400).send({ code: 400, result: `Parameter ${param} must be an array` });
					return
				}
				break;
			case "time_slots":
				if (!Array.isArray(tournament[param])) {
					res.status(400).send({ code: 400, result: `Parameter ${param} must be an array of objects formatted as [{start: starttimeunix, stop: stoptimeunix}, ...]` });
					return
				}
				break;
			case "season":
				if (isNaN(tournament[param])) {
					res.status(400).send({ code: 400, result: `Parameter ${param} must be a number` });
					return
				}
		}
	}

	const result = await Database.writeToCollection(COLLECTION, tournament)
	res.status(200).send({ code: 200, result: result });
});

router.post('/update', async function (req, res, next) {
	if (!res.locals.validated) return cookie.sendUnauthorized(res)
	if (!res.locals.administrator) return cookie.sendUnauthorized(res)

	const body = req.body;

	if (!body["id"]) {
		res.status(400).send({ code: 400, result: `Missing parameter id.` });
		return
	}

	const tournament = {}

	if (body["name"]) tournament["name"] = body["name"]
	if (body["date"]) tournament["date"] = body["date"]
	if (body["locations"]) tournament["locations"] = body["locations"]
	if (body["links"]) tournament["links"] = body["links"]
	if (body["time_slots"]) tournament["time_slots"] = body["time_slots"]

	await Database.modifyItemInCollection(COLLECTION, { id: body["id"] }, tournament).catch((err) => {
		res.status(400).send({ code: 400, result: err });
		return
	}).then((result) => {
		if (!result)
			return

		res.status(200).send({ code: 200, result: result });
	})
});

router.post('/delete', async function (req, res, next) {
	if (!res.locals.validated) return cookie.sendUnauthorized(res)
	if (!res.locals.administrator) return cookie.sendUnauthorized(res)

	const body = req.body;
	if (!body["id"]) {
		res.status(400).send({ code: 400, result: "Missing parameter: id" });
		return
	}

	const result = await Database.removeItemFromCollection(COLLECTION, { id: body["id"] }).catch((err) => {
		res.status(400).send({ code: 400, result: err });
		return
	}).then((result) => {
		if (!result)
			return

		res.status(200).send({ code: 200, result: result });
	})
});

export default router;
