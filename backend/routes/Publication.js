// Back pour la gestion des publications, le images sont gérées dans 
// Mongo

const express = require('express');
const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');

const router = express.Router();
dotenv.config();

// On importe le modèle de données concernant le profil de l'utilisateur
const Publication = require('../Models/PublicationModel');
const _ = require('lodash');

// On se connecte au driver neo4j, Nécéssite la clé (.env)
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', process.env.DB_UTIL_PASS));
const session = driver.session();

router.post('/addPub', (req, res) => {
    const session2 = driver.session();
    const session3 = driver.session();
    session2.readTransaction((tcx) =>
        tcx.run(`MATCH (p:Publication)
                RETURN p`)
        .then(result => {
            if(_.isEmpty(result.records)){
                session3.writeTransaction((tcx) => 
                    tcx.run(`CREATE (p:Publication {Pub:[]})`)
                )
                .then(data => {
                    const ctn = [req.body.id, req.body.nom, req.body.prenom, req.body.contenu, req.body.date, req.body.dt];
                    session.writeTransaction((tcx) => 
                        tcx.run(`MATCH (p:Publication)
                                SET p.Pub = p.Pub + $contenu`,
                            {
                                contenu: ctn
                            }    
                        )
                        .then(data => {
                            return res.status(200).json({message: 'ok'})
                        })
                        .catch(error => {
                            throw error;
                        })
                    )
                })
            }
            else {
                const ctn = [req.body.id, req.body.nom, req.body.prenom, req.body.contenu, req.body.date, req.body.dt];
                session.writeTransaction((tcx) => 
                    tcx.run(`MATCH (p:Publication)
                            SET p.Pub = p.Pub + $contenu`,
                        {
                            contenu: ctn
                        }    
                    )
                    .then(data => {
                        return res.status(200).json({message: 'ok'})
                    })
                    .catch(error => {
                        throw error;
                    })
                )
            }
        })
    )
})


router.post('/getPub', (req, res) => {
    session.readTransaction((tcx) =>
        tcx.run(`MATCH (p:Publication)
                RETURN p.Pub as pub`)
        .then(result => {
            result.records.map(record => {
                if(_.isEmpty(record.get('pub'))){
                    res.status(404).json({error: true, message:'Pas de publication'});
                }
                else {
                    const resultat = [];
                    const longu = record.get('pub').length/6;
                    for(let i = 0; i < longu; i++){
                        j = i*6;
                        let util = {
                            id: record.get('pub')[j],
                            nom: record.get('pub')[j+1],
                            prenom: record.get('pub')[j+2],
                            msg: record.get('pub')[j+3],
                            date: record.get('pub')[j+4],
                            dt: record.get('pub')[j+5],
                        }
                        resultat.push(util);
                    }
                    res.status(200).json({resultat});
                }
            })
        })
        .catch(error => {
            console.log(error);
        })
    )
})

module.exports = router