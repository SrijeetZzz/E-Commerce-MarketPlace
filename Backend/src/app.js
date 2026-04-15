const express = require("express");
const app = express();

const routes = require("./routes");

app.use(express.json());

// mount all routes under /api
app.use("/api", routes);

module.exports = app;