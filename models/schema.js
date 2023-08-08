const mongoose = require("mongoose");


//! Schema
const VisitorSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    type: {
      type: String,
      enum:["admin","customer"],
      default:"customer"
    },
  },{timestamps:true});
  
  //! Model
  module.exports= Visitors = mongoose.model("Visitor", VisitorSchema);