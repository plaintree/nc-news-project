const express = require("express");
const app = express();

const apiRoute = require("./routes/api.route");
const topicsRoute = require("./routes/topics.route");
const articlesRoute = require("./routes/articles.route");
const usersRoute = require("./routes/users.route");
const errorHandler = require("./errorHandler");

app.use(express.json());

// Handle api routes
app.use("/api", apiRoute);

// Handle topics routes
app.use("/api/topics", topicsRoute);

// Handle articles routes
app.use("/api/articles", articlesRoute);

// Handle users routes
app.use("/api/users", usersRoute);

// Handle 404 route error
app.all("/*", errorHandler.routeNotFound404);

// Handle custom error including 400, 404, 500 status code
app.use(errorHandler.customErrorHandler);

module.exports = app;
