/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 13 September 2024
 * Handles endpoints and listens at process.env.PORT
*/

import logger from "./util/logger"
import express from "express"
import dotenv from "dotenv"
import fs from "fs"
import cors from "cors"
import cookieparser from "cookie-parser"

import unhandledRouter from "./routes/404"

// __dirname is not available in ES5/6
import path from "path"
import Logger from "./util/logger"
const __dirname = path.resolve(path.dirname(''));

// load .env for tokens
dotenv.config({ path: __dirname + '/../.env' })

const app = express()

// parse response body in JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieparser())

// route requests
fs.readdirSync(__dirname + "/routes").forEach((file) => {
    if (file.endsWith(".js") && file !== "404.js") {
        const route = require(__dirname + "/routes/" + file).default
        route.use(cors(
            {
                origin: true,
                credentials: true
            }
        ))
        app.use("/" + file.split(".")[0], route)
        logger.log(`Route ${file.split(".")[0]} loaded`)
    }
})

// handle uncaught routes
app.use("*", unhandledRouter, cors())

// listen on .env PORT
app.listen(process.env.SERVER_PORT || 8080, () => {
    logger.log("Open on :" + (process.env.SERVER_PORT || 8080));
})