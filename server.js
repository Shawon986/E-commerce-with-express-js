const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const app = express();

app.use(bodyParser.json());



const db_connect = require("./config/db");  

//! MongoDb connection
db_connect();

//! Connection Check
app.get("/", (req, res) => {
  res.json({ message: "Welcome to E-commerce app" });
});


//! Routes
app.use("/api/visitors", require("./routes/api/route"));
app.use("/api/tasks", require("./routes/api/tasks"));
app.use("/api/products", require("./routes/api/products"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
 