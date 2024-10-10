"use strict";
/**
 * @author Dylan Nguyen (@dylann123)
 * Last Updated: 13 September 2024
 * Handles endpoints and listens at process.env.PORT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var _404_1 = __importDefault(require("./routes/404"));
var tests_1 = __importDefault(require("./routes/tests"));
var user_1 = __importDefault(require("./routes/user"));
var testing_1 = __importDefault(require("./routes/testing"));
// __dirname is not available in ES5/6
var path_1 = __importDefault(require("path"));
var __dirname = path_1.default.resolve(path_1.default.dirname(''));
// load .env for tokens
dotenv_1.default.config({ path: __dirname + '/../.env' });
var app = (0, express_1.default)();
// parse response body in JSON
app.use(express_1.default.json());
// route requests
app.use("/tests", tests_1.default);
app.use("/user", user_1.default);
// testing services
app.use("/testing", testing_1.default);
// handle uncaught routes
app.use(_404_1.default);
// listen on .env PORT
app.listen(process.env.PORT || 8080, function () {
    console.log("Open on :" + (process.env.PORT || 8080));
});
