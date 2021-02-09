const mongoose = require('mongoose');
 
const pdfSchema = new mongoose.Schema({
    id: String,
    titre: String,
    pdf:
    {
        data: Buffer,
        contentType: String
    }
});
 
//PDF is a model which has a schema pdfSchema
 
module.exports = Pdf = mongoose.model('Pdf', pdfSchema);