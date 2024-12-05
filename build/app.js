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
var fs_1 = __importDefault(require("fs"));
var _404_1 = __importDefault(require("./routes/404"));
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
fs_1.default.readdirSync(__dirname + "/routes").forEach(function (file) {
    if (file.endsWith(".js") && file !== "404.js") {
        var route = require(__dirname + "/routes/" + file).default;
        app.use("/" + file.split(".")[0], route);
        console.log("Route ".concat(file.split(".")[0], " loaded"));
    }
});
// testing services
app.use("/testing", testing_1.default);
// handle uncaught routes
app.use("*", _404_1.default);
// listen on .env PORT
app.listen(process.env.PORT || 8080, function () {
    console.log("Open on :" + (process.env.PORT || 8080));
});
