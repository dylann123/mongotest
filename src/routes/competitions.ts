/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 21 September 2024
 * Handles endpoint requests to /competitions
 * Returns values from competition database
 */

import express from "express"
import events from "../util/events";
import cookie from "../util/cookie"
import Database from "../util/database";
import { parse } from "path";

const router = express.Router();

router.use(cookie.parseCookiesRejectSession)

const COLLECTION = Database.COMPETITION_COLLECTION_NAME

router.get('/', async function (req, res, next) {

	const body = {}
	const rawdata = await Database.getCollection(COLLECTION)
	for (const competition of rawdata) {
		body[competition["id"]] = {
			"name": competition["name"],
			"date": competition["date"] // UNIX timestamp
		}
	}
	res.send({ code: 200, result: body });
})

router.get('/:id', async function (req, res, next) {
	if (!res.locals.validated) return cookie.sendUnauthorized(res)

	const id = req.params.id;
	const competition = await Database.queryItemsInCollection(COLLECTION, { id: id })

	if (competition["length"] == 0) {
		res.status(404).send({ code: 404, result: "competition not found." });
		return
	}

	res.status(200).send({ code: 200, result: competition[0] });
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
		res.status(400).send({ code: 400, result: "competition '" + body["name"] + "' already exists." });
		return
	}

	const competition = {
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
				if (typeof competition[param] != "string") {
					res.status(400).send({ code: 400, result: `Parameter ${param} must be a string` });
					return
				}
				break;
			case "date":
				if (typeof competition[param] != "number") {
					res.status(400).send({ code: 400, result: `Parameter ${param} must be a unix timestamp` });
					return
				}
				break;
			case "locations":
				if (!Array.isArray(competition[param])) {
					res.status(400).send({ code: 400, result: `Parameter ${param} must be an array` });
					return
				}
				break;
			case "links":
				if (!Array.isArray(competition[param])) {
					res.status(400).send({ code: 400, result: `Parameter ${param} must be an array` });
					return
				}
				break;
			case "time_slots":
				if (!Array.isArray(competition[param])) {
					res.status(400).send({ code: 400, result: `Parameter ${param} must be an array of objects formatted as [{start: starttimeunix, stop: stoptimeunix}, ...]` });
					return
				}
				break;
			case "season":
				if (isNaN(competition[param])) {
					res.status(400).send({ code: 400, result: `Parameter ${param} must be a number` });
					return
				}
		}
	}

	const result = await Database.writeToCollection(COLLECTION, competition)
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

	const competition = {}

	if (body["name"]) competition["name"] = body["name"]
	if (body["date"]) competition["date"] = body["date"]
	if (body["locations"]) competition["locations"] = body["locations"]
	if (body["links"]) competition["links"] = body["links"]
	if (body["time_slots"]) competition["time_slots"] = body["time_slots"]

	await Database.modifyItemInCollection(COLLECTION, { id: body["id"] }, competition).catch((err) => {
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
