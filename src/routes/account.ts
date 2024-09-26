/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 13 September 2024
 * Handles endpoint requests to /account
 * Login, signup, and account options
 */

import express from "express"
import bcrypt from "bcrypt"
import database from "../util/database"

const USER_COLLECTION_NAME = "accountdata"
const SESSION_COLLECTION_NAME = "sessiondata"

import dotenv from "dotenv"
dotenv.config({ path: __dirname + '/../../.env' })

const router = express.Router();

// 404 handler
router.get('/', function (req, res, next) {
	res.status(404).send({ code: "404", error: "unknown path" });
});

/**
 * GET /account/login
 * @param username: string
 * @param password: string
 */
router.get('/login', async function (req, res, next) {
	const username = req.query.username;
	let password = req.query.password;

	if (username == undefined || password == undefined) {
		res.status(400).send({ code: 400, result: "Must supply username and password" });
		return
	}

	if (typeof password == "string")
		password = password.trim();
	else {
		res.status(400).send({ code: 400, result: "Password must be a string" });
		return;
	}

	const data = await database.queryItemsInCollection(USER_COLLECTION_NAME, { username: username })
	if (data["length"] > 1) {
		res.status(500).send({ code: 500, result: "Internal server error" });
		return
	} else {
		if (data["length"] == 1) {
			const inputpassword = data[0]["password"]
			if (bcrypt.compareSync(password, inputpassword)) {
				res.status(200).send({ code: 200, result: "Login successful" });
				return
			}
			res.status(401).send({ code: 403, result: "Username or password is incorrect" });
			return
		}
	}
})


/**
 * POST /account/signup
 * On success, stores username and password, hashed with sha256
 * @param body.username username
 * @param body.password password; please hash
 */
router.post('/signup', async function (req, res, next) {
	const body = req.body
	const username = body.username
	let password = body.password

	if (username == undefined || password == undefined) {
		res.status(400).send({ success: false, result: "Must supply username and password" });
		return
	}

	if (typeof password == "string")
		password = password.trim();
	else {
		res.status(400).send({ code: 400, result: "Password must be a string" });
		return;
	}

	password = bcrypt.hashSync(password, parseInt(process.env.PASSWORD_SALT));

	const existingAccounts = await database.queryItemsInCollection(USER_COLLECTION_NAME, { username: username })

	if (existingAccounts["length"] > 0) {
		res.status(409).send({ success: false, result: "Username already taken." });
		return
	}

	database.writeToCollection(USER_COLLECTION_NAME, { username: username, password: password })

	res.status(200).send({ success: true, result: "Account successfully created." })
})

export default router;
