/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 13 September 2024
 * Handles endpoint requests to /user
 * Login, signup, and account options
 */
import cors from "cors"
import express, { query } from "express"
import Database from "../util/database"
import events from "../util/events"
import SessionManager from "../util/session"
import cookie from "../util/cookie"
const { OAuth2Client } = require('google-auth-library'); // it doesn't like es6. I don't know why. Please don't ask me.

import dotenv from "dotenv"
import AccountManager from "../util/account"
import Logger from "../util/logger"
dotenv.config({ path: __dirname + '/../../.env' })

const app_id = "195885898085-lliad6echbr00hs29tdni25bo3t7rcod.apps.googleusercontent.com"
const client = new OAuth2Client()

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// reject unauthorized sessions
router.use(cookie.parseCookiesRejectSession);

// 404 handler
router.get('/', function (req, res, next) {
	res.status(404).send({ code: "404", error: "unknown path" });
});

router.post("/logout", async (req, res) => {
	const session = await SessionManager.verifyUserSession({ secret: res.locals.cookie[SessionManager.SECRET_COOKIE_NAME] })
	if (!session["verified"]) {
		res.status(401).send("Unauthorized")
		return
	}

	SessionManager.removeSession({ secret: res.locals.cookie[SessionManager.SECRET_COOKIE_NAME] }).then(() => {
		res.setHeader("Set-Cookie", [SessionManager.getSessionCookieHeader(true), SessionManager.getUserCookieHeader(true)])
		res.status(200).send("Logged out")
	})
})

router.get("/getuserinfo", async (req, res) => {
	const session = await SessionManager.verifyUserSession({ secret: res.locals.cookie[SessionManager.SECRET_COOKIE_NAME] })
	if (!session["verified"]) {
		res.status(401).send("Unauthorized")
		return
	}

	const user = await AccountManager.getUserAccount({ id: session["result"]["id"] })
	res.status(200).send(user)
})

router.get("/loggedin", async (req, res) => {
	const session = await SessionManager.verifyUserSession({ secret: res.locals.cookie[SessionManager.SECRET_COOKIE_NAME] })
	if (!session["verified"]) {
		res.status(401).send({'value':'false'})
		return
	}

	res.status(200).send({'value':'true'})
})

router.post("/g_login", async (req, res) => {

	const cookies = req.headers.cookie.split(";")
	let csrf_cookie = ""

	cookies.forEach(cookie => {
		const [key, value] = cookie.split("=")
		if (key.trim() === "g_csrf_token") {
			csrf_cookie = value
		}
	})

	if (!csrf_cookie) {
		res.status(401).send("Unauthorized")
		return
	}

	const csrf_body = req.body.g_csrf_token
	if (!csrf_body || csrf_cookie !== csrf_body) {
		res.status(401).send("Unauthorized")
		return
	}

	const ticket = await client.verifyIdToken({
		idToken: req.body.credential,
		audience: app_id
	})
	const payload = ticket.getPayload()
	res.cookie("g_csrf_token", "", { maxAge: 0 }) // clear csrf token
	const exists = await AccountManager.doesUserExist({ id: parseInt(payload.sub) })
	if (!exists) {
		AccountManager.createUserAccount(parseInt(payload.sub), { firstname: payload.given_name, lastname: payload.family_name, email: payload.email })
	}

	SessionManager.createUserSession(parseInt(payload.sub)).then((secret) => {
		res.setHeader("Set-Cookie", [SessionManager.getSessionCookieHeader(secret), SessionManager.getUserCookieHeader(payload.sub)])
		Logger.log(payload.name + " logged in as id " + payload.sub + " with secret " + secret)
		res.status(200).redirect(process.env.CLIENT_HOST + "/home.html")
	})
});

export default router;
