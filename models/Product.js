const mongoose = require("mongoose");


//! Schema
const productSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    desc: {
        type: String,        
    },
    price:{
        type: Number,
    },
    madeIn:{
        type: String,
    },
    expiresAt:{
        type:Date,
    },
    status: {
      type: String,
      enum:["admin","customer"],
    },
    userId: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: "Visitors"
    },
    fileId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "File"
    }
    
  },{timestamps:true});
  
  //! Model
  module.exports= Product = mongoose.model("Product", productSchema);