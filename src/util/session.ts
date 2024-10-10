/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 9/19/24
 * Session manager
 * Classes for managing user sessions
 */

import { Response } from "express"
import Database from "./database"

class SessionManager {

    public static COOKIE_NAME = "secret"
    public static MAX_SESSION_LENGTH_MS = 1000 * 60 * 60

    private static generateSecret(): string {
        const secret = crypto.randomUUID()
        return secret
    }

    /**
     * Gets a user session
     * @param data query by userobject
     * @param createSessionIfMissing boolean; if true, will create a session if the user does not exist
     * @returns Promise<object>
     */
    public static async getUserSession(data: object, createSessionIfMissing = false): Promise<object> {
        return new Promise(async function (resolve, reject) {
            const users = await Database.queryItemsInCollection(Database.SESSION_COLLECTION_NAME, data)
            if (users["length"] == 1)
                resolve(users[0])
            else if (users["length"] > 1)
                resolve({ error: "getUserSession: multiple users in selection" })
            else {
                if (createSessionIfMissing) {
                    const secret = await SessionManager.createUserSession(data)
                    resolve(SessionManager.getUserSession({ secret: secret }))
                } else
                    reject({ error: "getUserSession: user session does not exist" })
            }
        })
    }

    public static async verifyUserSession(data: object): Promise<object> {
        return new Promise(async function (resolve, reject) {
            const users = await Database.queryItemsInCollection(Database.SESSION_COLLECTION_NAME, data)
            if (users["length"] == 1)
                resolve({ verified: true, result: users[0] })
            else if (users["length"] > 1)
                resolve({ verified: false, result: "verifyUserSession: multiple users found" })
            else
                resolve({ verified: false, result: "verifyUserSession: no user found" })
        })
    }

    public static async createUserSession(userdata: object): Promise<string> {
        return new Promise(async function (resolve, reject) {
            const userSession = structuredClone(userdata)
            userSession["secret"] = SessionManager.generateSecret()
            userSession["expires"] = Date.now() + SessionManager.MAX_SESSION_LENGTH_MS
            await Database.writeToCollection(Database.SESSION_COLLECTION_NAME, userSession)
            resolve(userSession["secret"])
        })
    }

    public static async refreshSession(query: object): Promise<boolean> {
        return new Promise(async function (resolve, reject) {
            const sessions = await Database.queryItemsInCollection(Database.SESSION_COLLECTION_NAME, query)
            if (sessions["length"] == 0)
                resolve(false)
            else if (sessions["length"] > 1)
                resolve(false)
            else {
                const userSession = sessions[0]
                userSession["expires"] = Date.now() + SessionManager.MAX_SESSION_LENGTH_MS
                resolve(true)
            }
        })
    }

    public static async removeSession(query: string | object): Promise<boolean> {
        return new Promise(async function (resolve, reject) {
            const sessions = await Database.queryItemsInCollection(Database.SESSION_COLLECTION_NAME, (typeof query === "string") ? { secret: query } : query)
            if (sessions["length"] == 0)
                resolve(false)
            else if (sessions["length"] > 1)
                resolve(false)
            else {
                const userSession: object = sessions[0]
                Database.removeItemsFromCollection(Database.SESSION_COLLECTION_NAME, userSession)
                resolve(true)
            }
        })
    }

    public static setSessionCookie(res: Response, secret: string): boolean {
        res.cookie(SessionManager.COOKIE_NAME, secret, { maxAge: SessionManager.MAX_SESSION_LENGTH_MS, httpOnly: true })
        return true
    }
}

export default SessionManager