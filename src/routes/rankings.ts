/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 14 November 2024
 * Handles event rankings
 */
import express from "express"
import Database from "../util/database";
import cookie from "../util/cookie"
const router = express.Router();

router.use(cookie.parseCookiesRejectSession)

router.get('/get', function (req, res, next) {
	const query = req.query;
	const event = query.event;
	const season = query.season;
	const userid = query.userid;
	const competition = query.competition;

	const collection = Database.RANKINGS_COLLECTION_NAME;
	const queryObj = {}

	if (userid) {
		queryObj["userid"] = userid
	}

	if (competition) {
		queryObj["competition"] = competition
	}

	if (event) {
		queryObj["event"] = event
	}

	if (season) {
		queryObj["season"] = season
	}

	Database.queryItemsInCollection(collection, queryObj).then((result) => {
		if (result.length == 0) {
			res.status(404).send({ code: 404, result: "Rankings not found." });
			return
		}
		res.status(200).send({ code: 200, result: result });
	});
});

router.post('/add', async function (req, res, next) {
	if (!res.locals.validated) return cookie.sendUnauthorized(res)
	const body = req.body;
	const params = {
		"event": "string",
		"season": "string",
		"userid": "string",
		"rank": "number",
		"competition": "string"
	}

	for (const param in params) {
		if (!body[param]) {
			res.status(400).send({ code: 400, result: `Missing parameter: ${param}` });
			return
		}
		if (typeof body[param] != params[param]) {
			res.status(400).send({ code: 400, result: `Parameter ${param} must be a ${params[param]}` });
			return
		}
	}

	const collection = Database.RANKINGS_COLLECTION_NAME;
	await Database.writeToCollection(collection, {...body, id: Database.generateID()});
	res.status(200).send({ code: 200, result: "Ranking added." });
});

router.post('/update', function (req, res, next) {
	if (!res.locals.validated) return cookie.sendUnauthorized(res)
	const body = req.body;
	const id = body.id;

	if (!id) {
		res.status(400).send({ code: 400, result: "Missing parameter: id" });
		return
	}

	const params = ["event", "season", "userid", "rank", "competition"]
	const updateObject = {}

	for (const param of params) {
		if (body[param]) {
			updateObject[param] = body[param]
			return
		}
	}


	const collection = Database.RANKINGS_COLLECTION_NAME;
	const query = { event: body.event, season: body.season, userid: body.userid, competition: body.competition }
	const update = { $set: { rank: body.rank } }

	Database.modifyItemInCollection(collection, query, update).then(() => {
		res.status(200).send({ code: 200, result: "Ranking updated." });
	});
});

router.delete('/delete', function (req, res, next) {
	const body = req.body;
	const params = ["event", "season", "userid", "competition"]

	for (const param of params) {
		if (!body[param]) {
			res.status(400).send({ code: 400, result: `Missing parameter: ${param}` });
			return
		}
	}

	const collection = Database.RANKINGS_COLLECTION_NAME;
	const query = { event: body.event, season: body.season, userid: body.userid, competition: body.competition }

	Database.deleteItemInCollection(collection, query)

	res.status(200).send({ code: 200, result: "Ranking deleted." });
});

export default router;
