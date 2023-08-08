const mongoose = require("mongoose");


//! Schema
const fileSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    path: {
        type: String,        
    },
    
  },{timestamps:true});
  
  //! Model
  module.exports= File = mongoose.model("File", fileSchema);