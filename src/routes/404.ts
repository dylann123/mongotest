/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 6 September 2024
 * Handles unhandled endpoint requests at /*
 */
import express from "express"
const router = express.Router();

router.get('/', function(req, res, next) {
	res.status(404).send({ error: "404 Not Found"});
});

export default router;
