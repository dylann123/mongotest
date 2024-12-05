/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 13 September 2024
 * Handles endpoints and listens at process.env.PORT
*/

import express from "express"
import dotenv from "dotenv"
import fs from "fs"

import unhandledRouter from "./routes/404"

import testingRouter from "./routes/testing"

// __dirname is not available in ES5/6
import path from "path"
const __dirname = path.resolve(path.dirname('')); 

// load .env for tokens
dotenv.config({ path: __dirname + '/../.env' })

const app = express()

// parse response body in JSON
app.use(express.json())

// route requests
fs.readdirSync(__dirname + "/routes").forEach((file) => {
    if (file.endsWith(".js") && file !== "404.js") {
        const route = require(__dirname + "/routes/" + file).default
        app.use("/" + file.split(".")[0], route)
        console.log(`Route ${file.split(".")[0]} loaded`)
    }
})

// testing services
app.use("/testing", testingRouter)

// handle uncaught routes
app.use("*",unhandledRouter)

// listen on .env PORT
app.listen(process.env.PORT || 8080, () => {
    console.log("Open on :" + (process.env.PORT || 8080));
})