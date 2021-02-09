// Back qui gère l'upload des images et des pdfs dans MongoDB
// On n'utilise pas Neo4j qui n'est pas adapté pour les images

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
var path = require('path');

const router = express.Router();
dotenv.config();

const Image = require('../Models/Image');
const Pdf = require('../Models/Pdf');

mongoose.connect(process.env.DATABASE_ACCESS, { useNewUrlParser: true, useUnifiedTopology: true })
 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
const upload = multer({ storage: storage });

/*----------------------------------------------------------------------
Upload l'image de profil de l'utilisateur, si il en a déjà une la 
supprime avant d'upload la nouvelle
----------------------------------------------------------------------*/

router.post('/storeImg', upload.single('file'), (req, res, next) => {
    var obj = {
        id: req.body.id,
        img: {
            data: fs.readFileSync(path.join(process.env.PATTH + req.file.filename)),
            contentType: 'image/png'
        }
    }
    Image.exists({id: req.body.id}, function(err, user) {
        if(err) return console.log(err);
        if(user) {
            Image.deleteOne({id: req.body.id}, function(err) {
                if(err) console.log(err);
            })
            Image.create(obj, (err, item) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.status(200).json({message: 'Image ajoutée'});
                }
            });
        }
        else {
            Image.create(obj, (err, item) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.status(200).json({message: 'Image ajoutée'});
                }
            });
        }
    })
});


/*----------------------------------------------------------------------
Récupère l'image si elle existe sinon renvoie l'image de base
----------------------------------------------------------------------*/


router.post('/getImg', (req, res) => {
    Image.exists({id: req.body.id}, function(err, user) {
        if(err) console.log(err);
        if(user) {
            Image.find({id: req.body.id}, function(err, items) {
                if(err) console.log(err);
                else {
                    res.status(200).json({items: items});
                }
            })
        }
        else {
            Image.find({id: "0"}, function(err, items) {
                if(err) console.log(err);
                else {
                    res.status(200).json({items: items});
                }
            })
        }
    })
})


/*----------------------------------------------------------------------
Upload le pdf de l'utilisateur 
----------------------------------------------------------------------*/


router.post('/storePdf', upload.single('file'), (req, res, next) => {
    var obj = {
        id: req.body.id,
        titre: req.body.titre,
        pdf: {
            data: fs.readFileSync(path.join(process.env.PATTH + req.file.filename)),
            contentType: 'application/pdf'
        }
    };
    Pdf.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).json({message: 'Image ajoutée'});
        }
    });
})


/*----------------------------------------------------------------------
Récupère les pdfs de l'utilisateur si ils existent
----------------------------------------------------------------------*/


router.post('/getPdf', (req, res) => {
    Pdf.exists({id: req.body.id}, function(err, user) {
        if(err) console.log(err);
        if(user) {
            Pdf.find({id: req.body.id}, function(err, items) {
                if(err) console.log(err);
                else {
                    res.status(200).json({items: items});
                }
            })
        }
        else {
            return res.status(404).json({error: true, message: 'Vous n\'avez pas encore de cours'})
        }
    })
})



module.exports = router