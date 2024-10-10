/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 13 September 2024
 * Handles endpoints and listens at process.env.PORT
 */

import express from "express"
import dotenv from "dotenv"

import unhandledRouter from "./routes/404"
import testsRouter from "./routes/tests"
import userRouter from "./routes/user"
import testingRouter from "./routes/testing"

// __dirname is not available in ES5/6
import path from "path"
const __dirname = path.resolve(path.dirname('')); 

// load .env for tokens
dotenv.config({path: __dirname+'/../.env'})

const app = express()

// parse response body in JSON
app.use(express.json())

// route requests
app.use("/tests", testsRouter)
app.use("/user", userRouter)

// testing services
app.use("/testing", testingRouter)

// handle uncaught routes
app.use(unhandledRouter)

// listen on .env PORT
app.listen(process.env.PORT || 8080, () => {
    console.log("Open on :"+(process.env.PORT || 8080));
})