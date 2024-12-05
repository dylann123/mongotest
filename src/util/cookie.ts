import { Response, Request, NextFunction } from "express"
import SessionManager from "./session";
import Database from "./database";

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

        const sessionExistsCookie = (cookies[SessionManager.COOKIE_NAME]) ? (await SessionManager.verifyUserSession({secret: cookies[SessionManager.COOKIE_NAME]}).catch((err) => { res.locals.validated = false })) : {verified: false, result: {}}
        const sessionExistsBody = (req.body[SessionManager.COOKIE_NAME]) ? (await SessionManager.verifyUserSession({secret: req.body[SessionManager.COOKIE_NAME]}).catch((err) => { res.locals.validated = false })) : {verified: false, result: {}}
        const sessionExistsQuery = (req.query[SessionManager.COOKIE_NAME]) ? (await SessionManager.verifyUserSession({secret: req.query[SessionManager.COOKIE_NAME]}).catch((err) => { res.locals.validated = false })) : {verified: false, result: {}} // unsafe
        if (cookies[SessionManager.COOKIE_NAME] && (sessionExistsCookie["verified"] || sessionExistsBody["verified"] || sessionExistsQuery["verified"])){
            res.locals.validated = true
            res.locals.username = sessionExistsCookie["result"]["username"] || sessionExistsBody["result"]["username"] || sessionExistsQuery["result"]["username"]
            const userdata = await Database.queryItemsInCollection(Database.USERDATA_COLLECTION_NAME, {username: res.locals.username})
            res.locals.userdata = userdata[0] // it is assumed that there is only one user with a given username, and that it actually exists
            res.locals.administrator = (res.locals.userdata.type == "officer" || res.locals.userdata.admin)
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