/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 13 September 2024
 * Admin panel; only for testing
 */
import express from "express"
import Database from "../util/database";
import { MongoClient } from "mongodb";
import path from "path"

const router = express.Router();

import dotenv from "dotenv"
dotenv.config({ path: __dirname + '/../../.env' })
const DATABASE_NAME = process.env.DATABASE_QUERY

router.get('/dev', function(req, res, next) {
	res.status(200).sendFile(path.resolve(__dirname + "/../../dev.html"))
});

router.get("/cleardatabase", async function(req,res,next){
    const client: MongoClient = await Database.getMongoClient()
    client.db(DATABASE_NAME).dropDatabase()
    res.status(200).send({success: true})
})

router.get("/removecollection", async function(req,res,next){
    const collection = (req.query.collection as string)
    const client: MongoClient = await Database.getMongoClient()
    client.db(DATABASE_NAME).collection(collection).drop()
    res.status(200).send({success: true})
})
 
router.get("/clearcollection", async function(req,res,next){
    const collection = (req.query.collection as string)
    const client: MongoClient = await Database.getMongoClient()
    client.db(DATABASE_NAME).collection(collection).drop()
    client.db(DATABASE_NAME).createCollection(collection)
    res.status(200).send({success: true})
})

router.get("/getdatabaseitems", async function(req,res,next){
    const client: MongoClient = await Database.getMongoClient()
    const array = await client.db(DATABASE_NAME).listCollections().toArray()
    res.status(200).send(array)
})

router.get("/getcollectionitems", async function(req,res,next){
    const collection = (req.query.collection as string)
    const client: MongoClient = await Database.getMongoClient()
    console.log("find "+collection)
    const array = await client.db(DATABASE_NAME).collection(collection).find().toArray()
    res.status(200).send(array)
})



export default router;
