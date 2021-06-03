var mongoose = require('mongoose');

const document = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    content: { type: String, required: true }   
   })

   var articleSchema = mongoose.model('admin', document);
  
   module.exports = articleSchema;