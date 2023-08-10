const express = require("express");
const multer = require("multer")
const authAccessToken = require("../../middleware/auth");
const router = express.Router();
const { body, validationResult } = require("express-validator");
// const Task = require("../../models/task");
const Product = require("../../models/Product");
const File = require("../../models/File");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '-'+ file.originalname)
    }
  }) 
  
  const upload = multer({ storage: storage })

  router.post("/uploads",upload.single("file"),async(req,res)=>{
    const fileObj ={
        name:req.file.filename,
        path:req.file.path
    }
    const file = new File(fileObj)
    await file.save()
    res.status(201).json(file)
    
  })
router.post(
  "/",
  [body("name", "Please input the name").notEmpty()],
  [authAccessToken],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      let error = errors.array().map((error) => error.msg);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: error });
      }
      if(req?.payload?.type !="admin"){
        return res.status(400).json({message:"You are not an admin"})
      }
      const id = req.payload.id;
      const productObj = {
        name: req.body.name,
        desc: req.body.desc ?? "",
        price: req.body.price ?? 0,
        madeIn: req.body.madeIn ?? "",
        expiresAt: new Date(),
        fileId:req.body.fileId ??"",
        userId: id,
      };
      const product = new Product(productObj);
      res.status(201).json(product);
      await product.save();
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ message: "Something went wrong with the server !!!" });
    }
  }
);
//! Get all tasks by visitors
router.get("/get", authAccessToken, async (req, res) => {
  try {
    const id = req.payload.id;
    const task = await Task.find({ userId: id });
    res.json(task);
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Something went wrong with the server !!!" });
  }
});
//! Update a status by visitor
router.put("/status/:id", authAccessToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.payload.id;
    const status = req.body.status;
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: userId },
      { status: status },
      {
        new: true,
      }
    );
    if (!task) {
      res.status(404).json({ message: "task not found" });
    } else {
      res.json(task);
      await task.save();
    }
  } catch (error) {}
});
//! Update a task by visitor
router.put("/update/:id", authAccessToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.payload.id;
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: userId },
      req.body,
      {
        new: true,
      }
    );
    if (!task) {
      res.status(404).json({ message: "task not found" });
    } else {
      res.json(task);
      await task.save();
    }
  } catch (error) {}
});
//! Get a task by visitor
router.get("/getone/:id", authAccessToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.payload.id;
    const task = await Task.findOne({ _id: id, userId: userId });
    if (!task) {
      res.status(404).json({ message: "task not found" });
    } else {
      res.json(task);
    }
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Something went wrong with the server !!!" });
  }
});
//! Delete a task by visitor
router.delete("/delete/:id", authAccessToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.payload.id;
    const task = await Task.findOneAndDelete({ _id: id, userId: userId });
    if (!task) {
      res.status(404).json({ message: "task not found" });
    } else {
      res.json(task);
    }
  } catch (error) {}
});
module.exports = router;