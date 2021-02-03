// Back pour l'affichage et la modification des amis de l'utilisateur,
// Il affiche aussi les gens selectionnés pour la personne et 
// permet la recherche par nom et prénom d'une personne en particulier

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
const session = driver.session();


/*--------------------------------------------------------------------
Affichage des personnes et ajout d'ami
--------------------------------------------------------------------*/

// Récupère les personnes dans la bdd (limité à 9)
// Elles correspondent au système de recommendation TODO
router.post('/getPersonne', (req, res) => {
    session.readTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Id:$userId})
                WITH u
                MATCH (p:Utilisateur)
                WHERE NOT (p)-[:EST_AMI]-(u) AND NOT (p.Id = $userId)
                RETURN p.Id as id, p.Nom as nom, p.Prenom as prenom
                LIMIT 9`,
            {
                userId: req.body.id
            }
        )
        .then(result => {
            // Si on ne trouve personne 
            if(_.isEmpty(result.records)) {
                return res.status(404).json({error: true, message: 'Nous n\'avons pas d\'amis à vous proposer'})
            }
            // Sinon on affiche les personnes trouvées
            else {
                const resultat = [];
                result.records.map(record => {
                    let util = {
                        id: record.get('id'),
                        nom: record.get('nom'),
                        prenom: record.get('prenom')
                    };
                    resultat.push(util);
                })
                res.status(200).json({resultat});
            }
        })
        .catch(error => {
            throw error;
        })
    )
})


// Ajoute une relation entre l'utilisateur et la personne selectionnée
router.post('/addFriend', (req, res) => {
    session.writeTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Id:$userIdu})
                WITH u
                MATCH (p:Utilisateur)
                WHERE p.Id = $userIdp
                CREATE (u)-[r:EST_AMI {Id:$userIdu}]->(p)-[a:EST_AMI {Id:$userIdp}]->(u)`,
            {
                userIdu: req.body.idUtilisateur,
                userIdp: req.body.idPersonne
            }
        )
        .catch(error => {
            throw error;
        })
    )
    return res.status(200).json({message: 'Ami ajouté'})
})

module.exports = router