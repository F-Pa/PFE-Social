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


/*--------------------------------------------------------------------
Affichage des personnes n'étant pas ami avec l'utilisateur 
Et étant recommandé
--------------------------------------------------------------------*/

// Récupère les personnes dans la bdd (limité à 10)
// Elles correspondent au système de recommendation / ici ami d'ami
router.post('/getPersonne', (req, res) => {
    const session3 = driver.session();
    session3.readTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Id:$userId})-[r:EST_AMI]->(p)
                WITH p, u 
                MATCH (p:Utilisateur)-[e:EST_AMI]->(x)
                WHERE NOT (x)-[:EST_AMI]->(u) AND NOT (x.Id = $userId)
                RETURN x.Id as id, x.Nom as nom, x.Prenom as prenom
                LIMIT 10`,
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


// Récupère les personnes dans la bdd (limité à 9)
// Elles correspondent au système de recommendation / ici localisé
router.post('/getPersonneLoc', (req, res) => {
    const session4 = driver.session();
    session4.readTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Id:$userId})-[x:A_POUR_PROFIL]-(e)
                WITH u, e
                MATCH (p:Utilisateur)-[r:A_POUR_PROFIL]-(d)
                WHERE ((d.Ville = e.Ville) OR (d.Ecole = e.Ecole)) AND NOT (p.Id = $userId) AND NOT (p)-[:EST_AMI]->(u)
                RETURN p.Id as id, p.Nom as nom, p.Prenom as prenom
                LIMIT 10`,
            {
                userId: req.body.id
            }
        )
        .then(result => {
            // Si on ne trouve personne 
            if(_.isEmpty(result.records)) {
                return res.status(404).json({error: true, message: 'Avez-vous renseigné votre profil ? Personne ne correspond à votre localisation'})
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


// Récupère les personnes dans la bdd (limité à 9)
// Elles correspondent au système de recommendation / ici domaine
router.post('/getPersonneDom', (req, res) => {
    const session5 = driver.session();
    session5.readTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Id:$userId})-[x:A_POUR_PROFIL]-(e)
                WITH u, e
                MATCH (p:Utilisateur)-[r:A_POUR_PROFIL]-(d)
                WHERE ((d.Filiere = e.Filiere) OR (d.Matiere = e.Matiere)) AND NOT (p.Id = $userId) AND NOT (p)-[:EST_AMI]->(u)
                RETURN p.Id as id, p.Nom as nom, p.Prenom as prenom
                LIMIT 10`,
            {
                userId: req.body.id
            }
        )
        .then(result => {
            // Si on ne trouve personne 
            if(_.isEmpty(result.records)) {
                return res.status(404).json({error: true, message: 'Avez-vous renseigné votre profil ? Personne ne correspond à votre domaine d\'étude'})
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


/*--------------------------------------------------------------------
Ajout et suppression d'amis
--------------------------------------------------------------------*/


// Ajoute une relation entre l'utilisateur et la personne selectionnée
// Crée une discussion entre ces deux personnes
router.post('/addFriend', (req, res) => {
    const session = driver.session();
    session.writeTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Id:$userIdu})
                WITH u
                MATCH (p:Utilisateur)
                WHERE p.Id = $userIdp
                CREATE (d:Discussion {Id1:$userIdu, Id2:$userIdp, Message:[]}), ((u)-[r:EST_AMI {Id:$userIdu}]->(p)-[a:EST_AMI {Id:$userIdp}]->(u)), ((u)-[b:DISCUTE]->(d)), ((p)-[c:DISCUTE]->(d)) `,
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

router.post('/removeFriend', (req, res) => {
    const session = driver.session();
    const session4 = driver.session();
    console.log(req.body);
    session.writeTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Id:$userIdu})
                WITH u
                MATCH (p:Utilisateur {Id:$userIdp})-[r:EST_AMI]->(u)-[a:EST_AMI]->(p)
                DETACH DELETE r, a`,
            {
                userIdu: req.body.idUtilisateur,
                userIdp: req.body.idPersonne
            }
        )
        .catch(error => {
            console.log(error);
            throw error;
        })
    )
    session4.writeTransaction((tcx) => 
        tcx.run(`MATCH (d:Discussion)
                WHERE (d.Id1 = $userIdu AND d.Id2 = $userIdp) OR (d.Id1 = $userIdp AND d.Id2 = $userIdu)
                DETACH DELETE d`,
            {
                userIdu: req.body.idUtilisateur,
                userIdp: req.body.idPersonne
            }    
        )
        .catch(error => {
            console.log(error);
            throw error;
        })
    )
    return res.status(200).json({message: 'Ami supprimé'})
})


/*--------------------------------------------------------------------
Affichage des amis de l'utilisateur sur la page AffichageAmi (MesAmis)
--------------------------------------------------------------------*/


router.post('/getFriend', (req, res) => {
    const session = driver.session();
    session.readTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Id:$userId})-[:EST_AMI]->(p)
                RETURN p.Id as id, p.Nom as nom, p.Prenom as prenom`,
            {
                userId: req.body.id
            }
        )
        .then(result => {
            // Si la personne n'a pas d'ami
            if(_.isEmpty(result.records)){
                res.status(404).json({error: true, message: 'Vous n\'avez pas encore d\'ami'})
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


router.post('/getFriendBis', (req, res) => {
    const session = driver.session();
    session.readTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Id:$userId})-[:EST_AMI]->(p)
                WHERE NOT p.Id = $userIdu
                RETURN p.Id as id, p.Nom as nom, p.Prenom as prenom`,
            {
                userIdu: req.body.idu,
                userId: req.body.idp
            }
        )
        .then(result => {
            // Si la personne n'a pas d'ami
            if(_.isEmpty(result.records)){
                res.status(404).json({error: true, message: 'Vous n\'avez pas encore d\'ami'})
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



/*--------------------------------------------------------------------
Recheche d'une personne spécifique
--------------------------------------------------------------------*/

// Permet la recherche d'une personne spécifique (par nom et prénom)
// L'utilisateur ne peut pas se rechercher lui-même d'où l'usage de l'id
router.post('/searchFriend', (req, res) => {
    const session = driver.session();
    const session2 = driver.session();
    session.readTransaction((tcx) =>
        tcx.run(`MATCH (u:Utilisateur {Id:$userIdu})
                WITH u
                MATCH (p:Utilisateur)
                WHERE (p)-[:EST_AMI]-(u) AND (p.Prenom = $prenom OR p.Nom = $nom)
                RETURN p.Id as idF, p.Nom as nomF, p.Prenom as prenomF
                LIMIT 3`,
            {
                userIdu: req.body.id,
                nom: req.body.nom,
                prenom: req.body.prenom
            }
        )
        .then(result => {
            // Si la recherche n'a pas abouti
            if(_.isEmpty(result.records)){
                session2.readTransaction((tcx) => 
                    tcx.run(`MATCH (u:Utilisateur)
                            WHERE (u.Prenom = $prenom OR u.Nom = $nom) AND NOT (u.Id = $userIdu)
                            RETURN u.Id as id, u.Nom as nom, u.Prenom as prenom
                            LIMIT 10`,
                        {
                            userIdu: req.body.id,
                            nom: req.body.nom,
                            prenom: req.body.prenom
                        }
                    )
                )
                .then(resu => {
                    // Si la recherche n'a pas abouti
                    if(_.isEmpty(resu.records)) {
                        return res.status(404).json({error: true, message: 'Nous n\'avons pas trouvé de personne correspondante'})
                    }
                    else {
                        const resultat = [];
                        resu.records.map(item => {
                            let utili = {
                                id: item.get('id'),
                                nom: item.get('nom'),
                                prenom: item.get('prenom')
                            };
                            resultat.push(utili);
                        })
                        return res.status(200).json({resultat});
                    }
                })
            }
            // Sinon on affiche les personnes trouvées
            else {
                const resultat = [];
                const idF = [];
                result.records.map(record => {
                    idF.push(record.get('idF'));
                    let util = {
                        idF: record.get('idF'),
                        nomF: record.get('nomF'),
                        prenomF: record.get('prenomF')
                    };
                    resultat.push(util);
                })
                session2.readTransaction((tcx) => 
                    tcx.run(`MATCH (p:Utilisateur {Id:$userIdp})
                            WITH p
                            MATCH (u:Utilisateur)
                            WHERE (u.Prenom = $prenom OR u.Nom = $nom) AND NOT (u.Id = $userIdu) AND NOT (u = p)
                            RETURN u.Id as id, u.Nom as nom, u.Prenom as prenom
                            LIMIT 10`,
                        {
                            userIdu: req.body.id,
                            userIdp: idF[0],
                            nom: req.body.nom,
                            prenom: req.body.prenom
                        }
                    )
                )
                .then(resu => {
                    // Si la recherche n'a pas abouti
                    if(_.isEmpty(resu.records)) {
                        return res.status(404).json({error: true, message: 'Nous n\'avons pas trouvé de personne correspondante'})
                    }
                    else {
                        resu.records.map(item => {
                            let utili = {
                                id: item.get('id'),
                                nom: item.get('nom'),
                                prenom: item.get('prenom')
                            };
                            resultat.push(utili);
                        })
                        return res.status(200).json({resultat});
                    }
                })
            }
        })
        .catch(error => {
            throw error;
        })
    )
})


/*--------------------------------------------------------------------
Vérifie si l'utilisateur est déjà ami avec la personne
--------------------------------------------------------------------*/


// Vérifie si deux personnes données sont amis
router.post('/isFriend', (req, res) => {
    const session = driver.session();
    session.readTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Id:$userIdu})-[:EST_AMI]-(p:Utilisateur {Id:$userIdp})
                RETURN u`,
            {
                userIdu: req.body.idUtilisateur,
                userIdp: req.body.idPersonne
            }
        )
        .then(result => {
            if(_.isEmpty(result.records)) {
                return res.status(200).json({message: 'Pas Ami'})
            }
            else {
                return res.status(200).json({mes: 'Ami'})
            }
        })
    )
})


module.exports = router