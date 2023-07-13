import express from "express";
import { json } from "body-parser";
import "express-async-errors"; //To enable async on route function
import config from "./config/config";
import helmet from "helmet";
import morgan from "./config/morgan";
import v1Routes from "./routes/v1Routes";
import { errorHandler } from "./middlewares/error";
import ApiError from "./utils/request/ApiError";
import { errorConverter } from "./middlewares/error";
import httpStatus from "http-status";

const xss = require("xss-clean");

const app = express();

app.use(json());
// parse json request body!
app.use(express.json({ limit: "50mb" }));

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
app.set("trust proxy", true);
// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());

// enable cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Accept, X-Requested-With, Authorization, Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.get("/webhook", (req, res) => {
  return res.send("Hi There!");
});

// Routing...
app.use("/ts-template-service/v1", v1Routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, `Route[${req.method}::${req.url}] not found!`));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// Catch all Errors
app.use(errorHandler);

export { app };
