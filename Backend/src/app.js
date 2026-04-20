const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes");

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

app.use("/uploads", express.static("src/uploads"));

// mount all routes under /api
app.use("/api", routes);


module.exports = app;