/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 5 December 2024
 * Handles unhandled endpoint requests at /*
 */
import express from "express"
const router = express.Router();

router.get("/getschedule", (req, res) => {
	let query = req.query;
	let date = query.date;
	if(date) {
		
	}
})

router.get('/', function (req, res, next) {
	let query = req.query;
	let queryTypes = ["date", "starttime", "endtime", "location", "description", "event"];
	res.status(404).send({ error: "404 Not Found" });
});

export default router;
