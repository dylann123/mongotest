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
		username: "",
		type: AccountManager.USERTYPE.REGIONAL,
		events: [],
		firstname: "",
		lastname: "",
		admin: false,
		id: ""
	}

	public static async createUserAccount(username: string, password: string, userdata: object) {

		await Database.writeToCollection(Database.USER_COLLECTION_NAME, { username: username, password: password })


		const id = crypto.randomUUID()
		const fullUserData = { ...AccountManager.BASE_USER, ...{ username: username, id: id }, ...userdata }
		await Database.writeToCollection(Database.USERDATA_COLLECTION_NAME,fullUserData)
		return id
	}

	public static async getUserData(username: string) {
	const data = await Database.queryItemsInCollection(Database.USERDATA_COLLECTION_NAME, { username: username })
	return data
}

	public static async getUserAccount(username: string) {
	const data = await Database.queryItemsInCollection(Database.USER_COLLECTION_NAME, { username: username })
	return data
}

	public static async updateUserAccount(username: string, data: object) {
	await Database.modifyItemInCollection(Database.USER_COLLECTION_NAME, { username: username }, data)
}

}

export default AccountManager