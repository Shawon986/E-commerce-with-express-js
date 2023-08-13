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
  // Create a product by admin
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
      await product.save();
      if(product?.fileId){
        const createdProduct = await Product.findById(product._id).populate("fileId").exec()
        res.status(201).json(createdProduct);

      }
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ message: "Something went wrong with the server !!!" });
    }
  }
);
//! Get all Products by visitors
router.get("/getProducts", authAccessToken, async (req, res) => {
  try {
    const id = req.payload.id;
    const products = await Product.find({ userId: id });
    res.json(products);
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
//! Update a Product by admin
router.put("/edit/:id", authAccessToken, async (req, res) => {
  try {
    if(req?.payload?.type !="admin"){
      return res.status(400).json({message:"You are not an admin"})
    }
    const id = req.params.id;
    const userId = req.payload.id;
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    if (!product) {
      res.status(404).json({ message: "product not found" });
    } else {
      res.json(product);
      await product.save();
    }
  } catch (error) {}
});
//! Get a product by visitor
router.get("/oneProduct/:id", authAccessToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.payload.id;
    const product = await Product.findOne({ _id: id, userId: userId });
    if (!product) {
      res.status(404).json({ message: "product not found" });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Something went wrong with the server !!!" });
  }
});
//! Delete a task by admin
router.delete("/deleteOne/:id", authAccessToken, async (req, res) => {
  try {
    if(req?.payload?.type !="admin"){
      return res.status(400).json({message:"You are not an admin"})
    }
    const id = req.params.id;
    const userId = req.payload.id;
    const product = await Product.findByIdAndDelete({ _id: id});
    if (!product) {
      res.status(404).json({ message: "product not found" });
    } else {
      res.json(product);
    }
  } catch (error) {}
});
module.exports = router;