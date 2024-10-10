/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 9/19/24
 * Session manager
 * Classes for managing user sessions
 */

import { Response } from "express"
import Database from "./database"

class AccountManager {

    public static async createUserAccount(username: string, password: string, userdata: object){
		
		await Database.writeToCollection(Database.USER_COLLECTION_NAME, { username: username, password: password })

		const baseUserData = {
			username: username,
			type: "regional",
			events: [],
			firstname: "",
			lastname: "",
			admin: false
		}

		await Database.writeToCollection(Database.USERDATA_COLLECTION_NAME, {...baseUserData, ...userdata})
	}

	public static async getUserData(username: string){
		const data = await Database.queryItemsInCollection(Database.USERDATA_COLLECTION_NAME, { username: username })
		return data
	}

	public static async getUserAccount(username: string){
		const data = await Database.queryItemsInCollection(Database.USER_COLLECTION_NAME, { username: username })
		return data
	}

	public static async updateUserAccount(username: string, data: object){
		await Database.modifyItemInCollection(Database.USER_COLLECTION_NAME, { username: username }, data)
	}
    
}

export default AccountManager