/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 9/19/24
 * Session manager
 * Classes for managing user sessions
 */

import { Response } from "express"
import Database from "./database"

class AccountManager {

	public static USERTYPE = {
		REGIONAL: "regional",
		STATE: "state",
		OFFICER: "officer",
	}

	public static BASE_USER = {
		id: "",
		email: "",
		type: AccountManager.USERTYPE.REGIONAL,
		events: [],
		firstname: "",
		lastname: "",
		admin: false
	}

	public static async createUserAccount(g_id: number, userdata: object) {

		const fullUserData = { ...AccountManager.BASE_USER, ...{ id: g_id }, ...userdata }
		await Database.writeToCollection(Database.USERDATA_COLLECTION_NAME, fullUserData)
	}

	public static async doesUserExist(query: object) {
		return (await Database.queryItemsInCollection(Database.USERDATA_COLLECTION_NAME, query)).length > 0
	}

	public static async getUserAccount(query: object) {
		const data = await Database.queryItemsInCollection(Database.USERDATA_COLLECTION_NAME, query)
		return data
	}

	public static async updateUserAccount(id: string, data: object) {
		await Database.modifyItemInCollection(Database.USERDATA_COLLECTION_NAME, { id: id }, data)
	}

}

export default AccountManager