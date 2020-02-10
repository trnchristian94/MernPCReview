const express = require("express");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

//const { mongoose } = require('./database');

// Bodyparser middleware
/*app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());*/

// DB Config
const db = require("./config/keys").mongoURI;
// Middlewares
app.use(morgan("dev"));
app.use(express.json()); // Permite al servidor entender json.

// Routes
app.use("/api/tasks", require("./routes/task.routes"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
const port = process.env.PORT || 3000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

/*
// Settings
app.set('port', process.env.PORT || 3000)

// Starting server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});*/
