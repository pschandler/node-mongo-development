var env = require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { format } = require("date-fns");
const { getSecret } = require("./keyvault");

// 1st party dependencies
var configData = require("./config/connection");
var indexRouter = require("./routes/index");

async function getApp() {
  // Database
  var connectionInfo = await configData.getConnectionInfo();
  // mongoose.connect(
  //   connectionInfo.DATABASE_URL + "/" + connectionInfo.DATABASE_NAME
  // );

  console.log("Connection info: ", connectionInfo);
  console.log("Get secret: ", getSecret("mongodbconnection-live"));
  mongoose
    .connect(
      "mongodb://pcs-node-mongo-server.mongo.cosmos.azure.com:10255/pcs-node-mongo-db?ssl=true&replicaSet=globaldb",
      {
        auth: {
          username: "pcs-node-mongo-server",
          password:
            "Z7wh75U5fQgEzfeCIWDBuW4jKyK3FMvJsQJ37ne1hQoShRtYEMXSTpNOUgIsTPOcxZ1OiAdXlwu0ACDbtnC3hw==",
        },
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: false,
      }
    )
    .then(() => console.log("Connection to CosmosDB successful"))
    .catch((err) => console.error(err));

  var app = express();

  var port = normalizePort(process.env.PORT || "3000");
  app.set("port", port);

  console.log("app.js > app.set [port] ", port);

  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  console.log("views", path.join(__dirname, "views"));

  app.set("view engine", "pug");
  console.log(" app.set('view engine', 'pug');");

  app.use(logger("dev"));
  // console.log("app.use(logger('dev')");
  app.use(express.json());
  // console.log("app.use(express.json());");
  app.use(express.urlencoded({ extended: false }));
  console.log("app.use(express.urlencoded({ extended: false }));");
  app.use(cookieParser());
  // console.log("app.use(cookieParser());");
  app.use(express.static(path.join(__dirname, "public")));
  // console.log("app.use(express.static(path.join(__dirname, 'public')));");

  app.locals.format = format;

  app.use("/", indexRouter);
  app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js")); // redirect bootstrap JS
  app.use(
    "/css",
    express.static(__dirname + "/node_modules/bootstrap/dist/css")
  ); // redirect CSS bootstrap

  console.log("after css and js");

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });
  console.log("no 404");

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log("err.message: ", err.message);
    res.render("error");
  });

  console.log("returning app");
  return app;
}
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
module.exports = {
  getApp,
};
