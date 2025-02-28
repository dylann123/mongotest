/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 9/19/24
 * Session manager
 * Classes for managing user sessions
 */

import { Response } from "express"
import Database from "./database"
import Logger from "./logger"

class SessionManager {

    public static SECRET_COOKIE_NAME = "client_secret!DO_NOT_SHARE"
    public static MAX_SESSION_LENGTH_MS = 1000 * 60 * 60

    private static generateSecret(): string {
        const secret = crypto.randomUUID()
        return secret
    }

    public static async verifyUserSession(query: object): Promise<object> {
        return new Promise(async function (resolve, reject) {
            const users = await Database.queryItemsInCollection(Database.SESSION_COLLECTION_NAME, query)
            if (users["length"] == 1) {
                const user = users[0]
                if (await SessionManager.isSessionExpired({ id: user["id"] })) {
                    SessionManager.removeSession({ id: user["id"] })
                    resolve({ verified: false, result: "verifyUserSession: session expired" })
                    return
                }
                SessionManager.refreshSession({ id: user["id"] })
                resolve({ verified: true, result: users[0] })
            }
            else {
                Logger.log(query)
                resolve({ verified: false, result: "verifyUserSession: no user found" })
            }
        })
    }

    public static async createUserSession(id: number): Promise<string> {
        return new Promise(async function (resolve, reject) {
            const checkExistingSession = await SessionManager.verifyUserSession({ id: id })
            if (checkExistingSession["verified"]) {
                resolve(checkExistingSession["result"]["secret"])
                return
            }
            const userSession = { id: id }
            userSession["secret"] = SessionManager.generateSecret()
            userSession["expires"] = Date.now() + SessionManager.MAX_SESSION_LENGTH_MS
            await Database.writeToCollection(Database.SESSION_COLLECTION_NAME, userSession)
            resolve(userSession["secret"])
        })
    }

    /** 
     * Refreshes a session by updating the expiration time
     * @param id user id
     * @returns boolean; true if session was refreshed, false if not found at all
     */
    public static async refreshSession(query: object): Promise<boolean> {
        return new Promise(async function (resolve, reject) {
            const sessions = await Database.queryItemsInCollection(Database.SESSION_COLLECTION_NAME, query)
            if (sessions["length"] == 0)
                resolve(false)
            else {
                const userSession = sessions[0]
                userSession["expires"] = Date.now() + SessionManager.MAX_SESSION_LENGTH_MS
                resolve(true)
            }
        })
    }

    /**
     * Removes a session from the database
     * @param query query object
     * @returns boolean; true if session was removed, false if not
     */
    public static async removeSession(query: object): Promise<boolean> {
        return new Promise(async function (resolve, reject) {
            const sessions = await Database.queryItemsInCollection(Database.SESSION_COLLECTION_NAME, query)
            if (sessions["length"] == 0)
                resolve(false)
            else {
                const userSession: object = sessions[0]
                Database.removeItemFromCollection(Database.SESSION_COLLECTION_NAME, userSession)
                resolve(true)
            }
        })
    }

    /**
     * Checks if a session is expired
     * @param query query object
     * @returns boolean; true if session is expired or query is invalid, false if not
     */
    public static async isSessionExpired(query: object): Promise<boolean> {
        return new Promise(async function (resolve, reject) {
            const sessions = await Database.queryItemsInCollection(Database.SESSION_COLLECTION_NAME, query)
            if (sessions["length"] == 0)
                resolve(true)
            else {
                const userSession = sessions[0]
                if (userSession["expires"] < Date.now()) {
                    resolve(true)
                } else
                    resolve(false)
            }
        })
    }

    public static getSessionCookieHeader(secret: string | boolean): string {
        if (secret === true)
            return `${SessionManager.SECRET_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Strict; HttpOnly;` // logout
        else
            return `${SessionManager.SECRET_COOKIE_NAME}=${secret}; Path=/; Max-Age=${SessionManager.MAX_SESSION_LENGTH_MS}; SameSite=Strict; HttpOnly;`
    }

    public static getUserCookieHeader(id: string | boolean): string {
        if (id === true)
            return `id=; Path=/; Max-Age=0; SameSite=Strict;`
        else
            return `id=${id}; Path=/; Max-Age=${SessionManager.MAX_SESSION_LENGTH_MS}; SameSite=Strict;`
    }
}

export default SessionManager