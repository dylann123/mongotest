/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 13 September 2024
 * mongodb utility
 */

import { Db, MongoClient, WithId } from "mongodb"
import dotenv from "dotenv"
dotenv.config({ path: __dirname + '/../../.env' })
const DATABASE_NAME = process.env.DATABASE_QUERY
const client = new MongoClient(process.env.DATABASE_URL).connect()

class Database {
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
    public static async queryItemsInCollection(collection: string, query: object): Promise<object> {
        return new Promise(async function (resolve, reject){
            const dbClient = await client
            const db: Db = dbClient.db(DATABASE_NAME)
            const data = await db.collection(collection).find(query).toArray()
            
            // convert to JS object
            const object = []
            for(let i of data)
                object.push(i)
            
            resolve(object)
        })
    }

    /**
     * Returns an array of every item in a collection
     * @param collection the collection to read
     * @returns array of collection items
     */
    public static getCollection(collection: string) {
        return new Promise(async function (resolve, reject){
            const dbClient: MongoClient = await client
            const db: Db = dbClient.db(DATABASE_NAME)
            const data = await db.collection(collection).find().toArray()
                .catch(function (err) { reject(err) })
            resolve(data)
        })
    }

    /**
     * Returns every collection in the database
     * @returns array of every collection
     */
    public static getDatabase() {
        return new Promise(async function(resolve, reject){
            const dbClient: MongoClient = await client
            const db: Db = dbClient.db(DATABASE_NAME)
            const data = await db.listCollections().toArray()
                .catch(function (err) { reject(err) })
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

    /** only for testing use */
    public static getMongoClient(){
        return client
    }
}

export default Database