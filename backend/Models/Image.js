const mongoose = require('mongoose');
 
const imageSchema = new mongoose.Schema({
    id: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
 
//Image is a model which has a schema imageSchema
 
module.exports = Image = mongoose.model('Image', imageSchema);