/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 13 September 2024
 * Handles endpoint requests to /user
 * Login, signup, and account options
 */

import express, { query } from "express"
import bcrypt from "bcrypt"
import Database from "../util/database"
import events from "../util/events"
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
	if (!res.locals.validated) return

	res.status(404).send({ code: "404", error: "unknown path" });
});

/**
 * @apiDefine User User endpoints
 * User endpoints are used for account management and authentication.
 * 
 * Authentication is required for most user endpoints.
 * 
 * Authentication is done through a session secret, which is given to the user upon login and is stored as a cookie by default.
 * 
 * The secret can be provided to the server in three ways:
 * 
 * 1. As a cookie
 * 2. As a body parameter
 * 3. As a query parameter	(unsafe)
 * 
 * If any of these are given to the server, the server will validate the session secret and allow access to the endpoint.
 * 
 * If the session secret is not provided, the server will return a 401 Unauthorized error.
 *  
 */

/**
 * @api {get} /user/login Login
 * @apidescription Logs in a user
 * @apiName Login
 * @apiGroup User
 * 
 * @apiParam {String} username Username
 * @apiParam {String} password Password
 * 
 * @apiSuccess result secret for session authentication. Is also set as a cookie.
 * 
 * @apiError MissingArgument 400 Must supply username and password
 * @apiError InvalidArgument 400 Password must be a string
 * @apiError Unauthorized 401 Username or password is incorrect
 * @apiError UsernameNotFound 500 Internal server error
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
		if (bcrypt.compareSync(password, inputpassword)) {
			const sessionobject = await SessionManager.getUserSession({ username: data[0]["username"] }, true).catch((error) => {
				res.status(500).send({ code: 500, result: error })
				return
			})
			const secret = sessionobject["secret"]
			SessionManager.setSessionCookie(res, secret)
			res.status(200).send({ code: 200, result: secret });
		}
		else
			res.status(401).send({ code: 401, result: "Username or password is incorrect" });
	} else
		res.status(500).send({ code: 500, result: "Username not found" })
})


/**
 * @api {post} /user/createaccount Create an Account
 * @apidescription Creates an account. Requires admin privileges (admin or officer).
 * @apiName CreateAccount
 * @apiGroup User
 * 
 * @apiParam {String} username Username
 * @apiParam {String} password Password
 * @apiParam {Object} userdata User data. Must contain: { type: "regional","state","officer", events: Array }. Can Contain: { firstname: String, lastname: String, admin: Boolean }
 * 
 * @apiSuccess result Account created successfully
 * 
 * @apiError MissingArgument 401 Must supply username, password, and userdata
 * @apiError InvalidArgument 401 Must supply type/Must supply at least one event
 * @apiError UsernameTaken 409 Username already taken
 * 
 */
router.post('/createaccount', async function (req, res, next) {
	const invalidUser = !res.locals.administrator
	if (invalidUser && req.body.secretadminkeywow != process.env.ADMIN_SECRET) {
		res.status(501).send({ success: false, result: "and who do you think you are? (invalidated request)" });
		return
	}

	const body = req.body
	const username: string = body.username
	let password: string = body.password
	const userdata: object = body.userdata

	if (username == undefined || password == undefined) {
		res.status(400).send({ success: false, result: "Must supply username and password; got user " + username + " and password " + password });
		return
	}

	if (userdata == undefined) {
		res.status(401).send({ success: false, result: "Must supply userdata" });
		return
	}

	if (userdata["type"] == undefined) {
		res.status(401).send({ success: false, result: "Must supply userdata.type" });
		return
	}

	if (userdata["type"] != AccountManager.USERTYPE.REGIONAL && userdata["type"] != AccountManager.USERTYPE.STATE && userdata["type"] != AccountManager.USERTYPE.OFFICER) {
		res.status(401).send({ success: false, result: "Invalid userdata.type; must be 'regional', 'state', or 'officer'" });
		return
	}

	if (userdata["events"] == undefined) {
		res.status(401).send({ success: false, result: "Must supply at least one event (userdata.events)" });
		return
	}

	const invalid_events = []
	for (let event of userdata["events"]) {
		if(!events.EVENT_NAMES[event]){
			invalid_events.push(event)
			return
		}
	}	
	if (invalid_events.length > 0) {
		res.status(401).send({ success: false, result: "Invalid events: " + invalid_events.join(", ") });
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

	const uid = AccountManager.createUserAccount(username, password, userdata)

	res.status(200).send({ code: 200, result: userdata["type"] + " account '" + username + "' with id '"+uid+"' created successfully." })
})

export default router;
