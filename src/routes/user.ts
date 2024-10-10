/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 13 September 2024
 * Handles endpoint requests to /user
 * Login, signup, and account options
 */

import express, { query } from "express"
import bcrypt from "bcrypt"
import Database from "../util/database"
import SessionManager from "../util/session"
import cookie from "../util/cookie"

import dotenv from "dotenv"
import AccountManager from "../util/account"
dotenv.config({ path: __dirname + '/../../.env' })

const router = express.Router();

// reject unauthorized sessions
router.use(cookie.parseCookiesRejectSession);

// 404 handler
router.get('/', function (req, res, next) {
	if(!res.locals.validated) return

	res.status(404).send({ code: "404", error: "unknown path" });
});

/**
 * GET /user/login
 * @param username: string
 * @param password: string
 * @returns {
 * 	"code": "errorcode",
 * 	"result" "authcode"
 * }
 */
router.get('/login', async function (req, res, next) {
	const username = req.query.username as string;
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

	const data = await AccountManager.getUserAccount(username)

	if (data["length"] > 1)
		res.status(500).send({ code: 500, result: "Internal server error" });
	else if (data["length"] == 1) {
		const inputpassword = data[0]["password"]
		if (bcrypt.compareSync(password, inputpassword)){
			const sessionobject = await SessionManager.getUserSession({username: data[0]["username"]}, true).catch((error)=>{
				res.status(500).send({ code: 500, result: error })
				return
			})
			const secret = sessionobject["secret"]
			SessionManager.setSessionCookie(res, secret)
			res.status(200).send({ code: 200, result: secret });
		}
		else
			res.status(401).send({ code: 403, result: "Username or password is incorrect" });
	} else
		res.status(500).send({ code: 500, result: "Username not found" })
})


/**
 * POST /user/createaccount
 * On success, stores username and password, hashed with bcrypt
 * @param body.username username
 * @param body.password password; please hash
 * @param body.type type; Valid types: regional, state, officer
 */
router.post('/createaccount', async function (req, res, next) {
	const invalidUser = !res.locals.validated || res.locals.userdata.type == undefined || 
						(res.locals.userdata.type != "officer" && !res.locals.userdata.admin)
	if (invalidUser && req.body.secretadminkeywow != process.env.ADMIN_SECRET) {
		res.status(501).send({ success: false, result: "and who do you think you are? (invalidated request)" });
		return
	}

	const body = req.body
	const username: string = body.username
	let password: string = body.password
	const userdata: object = body.userdata

	if (username == undefined || password == undefined) {
		res.status(400).send({ success: false, result: "Must supply username and password; got user "+username+" and password "+password });
		return
	}

	if (userdata["type"] == undefined) {
		res.status(400).send({ success: false, result: "Must supply type" });
		return
	}

	if (userdata["events"] == undefined) {
		res.status(400).send({ success: false, result: "Must supply at least one event" });
		return
	}

	if (typeof password == "string")
		password = password.trim();
	else {
		res.status(400).send({ code: 400, result: "Password must be a string" });
		return;
	}

	const existingAccounts = await AccountManager.getUserAccount(username)

	if (existingAccounts["length"] > 0) {
		res.status(409).send({ success: false, result: "Username already taken." });
		return
	}

	password = bcrypt.hashSync(password, parseInt(process.env.PASSWORD_SALT));


	
	AccountManager.createUserAccount(username, password, userdata)
	res.status(200).send({ code: 200, result: userdata["type"]+" account "+username+" created successfully." })
})

export default router;
