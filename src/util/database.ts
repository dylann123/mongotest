/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 21 September 2024
 * mongodb utility
 */

import { Db, MongoClient, ObjectId, WithId } from "mongodb"
import dotenv from "dotenv"
dotenv.config({ path: __dirname + '/../../.env' })
const DATABASE_NAME = process.env.DATABASE_QUERY
const client = new MongoClient(process.env.DATABASE_URL).connect()

class Database {
	static deleteItemInCollection(collection: string, query: { event: any; season: any; userid: any; competition: any }) {
		throw new Error("Method not implemented.")
	}


    public static STATES = "states"
    public static REGIONALS = "regionals"

    public static SESSION_COLLECTION_NAME = "sessiondata" // session data: { user, secret, expires }
    public static USERDATA_COLLECTION_NAME = "userdata" // profile data { user, type, events, firstname, lastname, admin }
    public static COMPETITION_COLLECTION_NAME = "competitiondata" // competition data { name, date, location, schedule, links, training } 
    public static RANKINGS_COLLECTION_NAME = "rankingsdata" // rankings data { type: "individual"/"team", event, data, id: 1/2/3/userid }
    public static EVENTS_COLLECTION_NAME = "eventstorage" // drive data { name, link, type }
    public static PHOTOS_COLLECTION_NAME = "photostorage" // drive data { name, photolink }

    public static generateID(): string {
        return crypto.randomUUID().toString()
    }

    /**
     * Writes to a collection
     * @param collection collection to write to
     * @param data object to write
     * @returns true on success
     */
    public static async writeToCollection(collection: string, data: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const dbClient: MongoClient = await client
            const db: Db = dbClient.db(DATABASE_NAME)

            if (!this.collectionExistsInDb(db, collection))
                db.createCollection(collection)

            await db.collection(collection).insertOne(data)
                .catch(function (err) { reject(err) })

            resolve(true)
        })
    }

    /**
     * Returns an array of every collection item that matches query
     * @param collection string
     * @param query object
     * @returns Array<object>
     */
    public static async queryItemsInCollection(collection: string, query: object = {}): Promise<any[]> {
        return new Promise(async function (resolve, reject) {
            const dbClient = await client
            const db: Db = dbClient.db(DATABASE_NAME)
            
            const data = await db.collection(collection).find(query).toArray()

            // convert to JS object
            const object = []
            for (let i of data)
                object.push(i)

            resolve(object)
        })
    }

    /**
     * Modifies a selected item using the keys from another object
     * @param collection string; collection to modify
     * @param query object; object query to replace
     * @param replacement object; replaces every item from the queried object with every item in replacement
     * @returns object; new object
     */
    public static async modifyItemInCollection(collection: string, query: object, replacement: object): Promise<object> {
        return new Promise(async function (resolve, reject) {
            const queries = await Database.queryItemsInCollection(collection, query)

            if (queries["length"] > 1){
                reject("modifyItemInCollection: query returned multiple rows")
                return
            }
            if (queries["length"] == 0){
                reject("modifyItemInCollection: query returned no rows")
                return
            }

            const newRow = queries[0]

            for(let i in replacement){
                newRow[i] = replacement[i]
            }

            Database.removeItemFromCollection(collection, query)
            Database.writeToCollection(collection, newRow)

            resolve(queries)
        })
    }

    /**
     * Returns an array of every item in a collection
     * @param collection the collection to read
     * @returns array of collection items
     */
    public static getCollection(collection: string): Promise<Array<any>> {
        return new Promise(async function (resolve, reject) {
            const dbClient: MongoClient = await client
            const db: Db = dbClient.db(DATABASE_NAME)
            const data = await db.collection(collection).find().toArray()

            resolve(data)
        })
    }

    /**
     * Returns every collection in the database
     * @returns array of every collection
     */
    public static getDatabase(): Promise<object> {
        return new Promise(async function (resolve, reject) {
            const dbClient: MongoClient = await client
            const db: Db = dbClient.db(DATABASE_NAME)
            const data = await db.listCollections().toArray()
            resolve(data)
        })
    }

    /**
     * 
     * @param db database object
     * @param collectionName collection
     * @returns boolean
     */
    private static async collectionExistsInDb(db: Db, collectionName: string) {
        const collection = await db.listCollections({ name: collectionName }).next()
        return (collection) ? true : false
    }

    public static async removeItemFromCollection(collection: string, query: object): Promise<boolean> {
        return new Promise(async function (resolve, reject) {
            const dbClient: MongoClient = await client
            const db: Db = dbClient.db(DATABASE_NAME)

            if (!Database.collectionExistsInDb(db, collection))
                db.createCollection(collection)

            if ((await Database.queryItemsInCollection(collection, query))["length"] != 1)
                resolve(false)
            else {
                await db.collection(collection).deleteOne(query)
                    .catch(function (err) { reject(err) })

                resolve(true)
            }
        })
    }

    public static async removeItemsFromCollection(collection: string, query: object): Promise<boolean> {
        return new Promise(async function (resolve, reject) {
            const dbClient: MongoClient = await client
            const db: Db = dbClient.db(DATABASE_NAME)

            if (!this.collectionExistsInDb(db, collection))
                db.createCollection(collection)

            await db.collection(collection).deleteMany(query)
                .catch(function (err) { reject(err) })

            resolve(true)
        })
    }

    /** only for testing use */
    public static getMongoClient() {
        return client
    }
}

export default Database