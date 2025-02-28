import { Response, Request, NextFunction } from "express"
import SessionManager from "./session";
import Database from "./database";
import Logger from "./logger";
import dotenv from "dotenv"
dotenv.config({ path: __dirname + '/../../.env' })

Logger.log(process.env)

function parseCookies(req: Request, res: Response, next: NextFunction) {
    // https://stackoverflow.com/questions/44816519/how-to-get-cookie-value-in-expressjs
    const { headers: { cookie } } = req;
    if (cookie) {
        const values = cookie.split(';')
        const cookies = {}
        for (let cookie of values) {
            let key = cookie.split("=")[0]
            let value = cookie.split("=")[1]
            cookies[key] = value
        }
        res.locals.cookie = values;
    }
    else
        res.locals.cookie = {};
    next();
}

async function parseCookiesRejectSession(req: Request, res: Response, next: NextFunction) {
    const { headers: { cookie } } = req;
    Logger.log(req.headers)
    if (cookie) {
        const values = cookie.split(';')
        const cookies = {}
        for (let cookie of values) {
            let key = cookie.split("=")[0].trim()
            let value = cookie.split("=")[1].trim()
            cookies[key] = value
        }

        res.locals.validated = false
        res.locals.administrator = false

        const sessionExistsCookie = (cookies[SessionManager.SECRET_COOKIE_NAME]) ? (await SessionManager.verifyUserSession({secret: cookies[SessionManager.SECRET_COOKIE_NAME]}).catch((err) => { res.locals.validated = false })) : {verified: false, result: {}}
        if (cookies[SessionManager.SECRET_COOKIE_NAME] && (sessionExistsCookie["verified"])){
            res.locals.validated = true
            res.locals.id = sessionExistsCookie["result"]["id"]
            res.setHeader("Set-Cookie", SessionManager.getUserCookieHeader(res.locals.id))
            const userdata = await Database.queryItemsInCollection(Database.USERDATA_COLLECTION_NAME, {id: res.locals.id})
            res.locals.userdata = userdata[0] // it is assumed that there is only one user with a given id, and that it actually exists
            res.locals.administrator = (res.locals.userdata.type == "officer" || res.locals.userdata.admin)
            
            // allow cors for identified users
            res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_HOST)
            res.setHeader("Access-Control-Allow-Credentials", "true")
        }
        res.locals.cookie = cookies;
    }
    else
        res.locals.cookie = {};
    next();
}

function sendUnauthorized(res: Response){
    res.status(403).send({ code: 403, result: "Unauthorized request."})
    return true
}

export default { parseCookies, parseCookiesRejectSession, sendUnauthorized }