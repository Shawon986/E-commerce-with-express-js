const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer")
const dotenv = require("dotenv").config();
const app = express();

app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + require("crypto").randomBytes(64).toString("hex")+ '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '-'+ file.originalname)
  }
}) 

const upload = multer({ storage: storage })

const db_connect = require("./config/db");  

//! MongoDb connection
db_connect();

//! Connection Check
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Task Manager app" });
});

// Multer(File upload)
app.post("/uploads",upload.single("file"),(req,res)=>{
  res.json({ message: "Upload completed" });
})

//! Routes
app.use("/api/visitors", require("./routes/api/route"));
app.use("/api/tasks", require("./routes/api/tasks"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
 