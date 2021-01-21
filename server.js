// require dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
// configure the PORT
const PORT = process.env.PORT || 3000;
// initialize express app
const app = express();
// use morgan http request logger middleware
app.use(logger("dev"));
// use compression middleware
app.use(compression());
// use middleware to handle json, string, or array request objects
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// serve static content for the app from the public directory
app.use(express.static("public"));
// routes
app.use(require("./routes/api-routes.js"));
// set up connection to mongodb using mongoose
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
// start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});