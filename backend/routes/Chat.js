// Back pour la gestion des messages et des discussions

const express = require('express');
const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');

const router = express.Router();
dotenv.config();

// On importe le modèle de données concernant le profil de l'utilisateur
// const DonneesUtil = require('../Models/DonneesUtil');
const _ = require('lodash');

// On se connecte au driver neo4j, Nécéssite la clé (.env)
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', process.env.DB_UTIL_PASS));
// const session = driver.session();


/*--------------------------------------------------------------------
Récupère les messages d'une discussion
--------------------------------------------------------------------*/


router.post('/getDiscussion', (req, res) => {
    const session = driver.session();
    session.readTransaction((tcx) => 
        tcx.run(`MATCH (d:Discussion)
                WHERE (d.Id1 = $userIdu AND d.Id2 = $userIdp) OR (d.Id1 = $userIdp AND d.Id2 = $userIdu)
                RETURN d.Message as message`,
            {
                userIdu: req.body.idu,
                userIdp: req.body.idp
            }
        )
        .then(result => {
            result.records.map(record => {
                if(_.isEmpty(record.get('message'))){
                    res.status(404).json({error: true, message: 'Démarrez la discussion'})
                }
                else {
                    const resultat = [];
                    const longu = record.get('message').length/4;
                    for(let i = 0; i < longu; i++){
                        j = i*4;
                        let util = {
                            id: record.get('message')[j],
                            date: record.get('message')[j+1],
                            message: record.get('message')[j+2],
                            dt: record.get('message')[j+3]
                        }
                        resultat.push(util);
                    }
                    res.status(200).json({resultat});
                }
            })
        })
        .catch(error => {
            throw error;
        })
    )
})


/*--------------------------------------------------------------------
Stocke le message envoyé dans la base de données
--------------------------------------------------------------------*/


router.post('/writeMessage', (req, res) => {
    console.log(req.body);
    const session = driver.session();
    const message = [req.body.idu, req.body.date, req.body.message, req.body.dt];
    session.writeTransaction((tcx) => 
        tcx.run(`MATCH (d:Discussion)
                WHERE (d.Id1 = $userIdu AND d.Id2 = $userIdp) OR (d.Id1 = $userIdp AND d.Id2 = $userIdu)
                SET d.Message = d.Message + $message`,
            {
                userIdu: req.body.idu,
                userIdp: req.body.idp,
                message: message
            }
        )
        .catch(error => {
            throw error;
        })
    )
    return res.status(200).json({message: 'ok'});
})


module.exports = router