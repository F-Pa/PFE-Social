// Back pour l'authentification de l'utilisateur, il permet l'identification et la création de compte
// Tout en gérant les tokens pour l'ensemble de l'application

const express = require('express');
const bcrypt = require('bcrypt');
const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const v4 = require('uuid').v4;

const router = express.Router();
dotenv.config();

// On importe le modèle de données concernant l'utilisateur
const Utilisateur = require('../Models/Utilisateur');
const _ = require('lodash');

// On se connecte au driver neo4j, Nécéssite la clé (.env)
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', process.env.DB_UTIL_PASS));
const session = driver.session();

// Sel pour le hachage du mot de passe
const saltRounds = 10;

/* ---------------------------------------------------------------------
Création d'un compte (Signup)
----------------------------------------------------------------------*/

// On vérifie si l'utilisateur existe déjà dans la base de données :
// Prend l'email en entrée
function findUser(email) {
    return session.readTransaction((tcx) =>
        tcx.run(`MATCH (u:Utilisateur {Email:$userEmail})
                RETURN u.Email as email`,
            {
                userEmail: email
            }    
        )
        .then(result => {
            return result.records.map(record => {
                return new Utilisateur(record.get('email'));
            });
        })
        .catch(error => {
            throw error;
        })
    )
}

// Crée l'utilisateur (hash le mot de passe et la réponse à la question secrète
// pour plus de sécurité)
async function createUser(email, password, nom, prenom, quest, secret, idUnique) {
    const hashP = await bcrypt.hash(password, saltRounds);
    const hashS = await bcrypt.hash(secret, saltRounds);
    session.writeTransaction((tcx) =>
        tcx.run(`CREATE (u:Utilisateur {Id:$userId, Email:$userEmail, Password:$userPassword, 
                Nom:$userNom, Prenom:$userPrenom, Quest:$userQuest, Secret:$userSecret})`,
            {
                userId: idUnique,
                userEmail: email,
                userPassword: hashP,
                userNom: nom,
                userPrenom: prenom,
                userQuest: quest,
                userSecret: hashS
            }
        )
        .catch(error =>{
            throw error;
        })
    )
}


// Permet de créer l'utilisateur, fait appel à findUser et createUser, renvoie un 
// token si l'utilisateur est crée avec succès, un message d'erreur sinon
router.post('/signup', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const quest = req.body.quest;
    const secret = req.body.secret;
    const idUnique = v4();

    // Cherche si l'utilisateur existe
    findUser(email)
    .then(utils => {
        // Si ce n'est pas le cas on crée l'utilisateur
        if(_.isEmpty(utils)) {
            createUser(email, password, nom, prenom, quest, secret, idUnique);
            const token = jwt.sign(
                {userId: idUnique, userEmail: email, userNom: nom, userPrenom: prenom},
                process.env.JWTSECRET,
                {expiresIn: 8000},
            );
            res.status(200).json({token});
            return;
        }
        // Sinon l'utilisateur existe : on renvoie un message d'erreur
        else {
            res.status(403).json({error: true, message: 'L\'email est déjà lié à un compte'});
            return;
        }
    })
})


/* ---------------------------------------------------------------------
Identification (Signin)
----------------------------------------------------------------------*/


// Permet d'authentifier l'utilisateur, renvoie un message d'erreur si ce dernier
// n'est pas dans la bdd, sinon un token pour utiliser l'application
router.post('/signin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // On vérifie si l'utilisateur existe
    session.readTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Email:$userEmail})
                RETURN u.Id as id, u.Email as email, u.Password as password, u.Nom as nom, u.Prenom as prenom`,
            {
                userEmail: email
            }
        )
        .then(result => {
            if(_.isEmpty(result.records)) {
                res.status(403).json({error: true, message: 'Erreur de saisie de l\'email ou du mot de passe' })
            }
            else {
                result.records.map(record => {
                    bcrypt.compare(password, record.get('password'), function(err, match) {
                        if (err) {
                                res.status(500).json({error: true, message: 'Auth échoué'});
                        }
                        if (match) {
                            const token = jwt.sign(
                                {userId: record.get('id'), userEmail: email, userNom: record.get('nom'), userPrenom: record.get('prenom')},
                                process.env.JWTSECRET,
                                {expiresIn: 8000},
                            );
                            res.status(200).json({token});
                            return;
                        }
                        else {
                            res.status(401).json({error: true, message: 'Erreur de saisie de l\'email ou du mot de passe'});
                            return;
                        }
                    })
                })
            }
        })
    )
})

/* ---------------------------------------------------------------------
Mot de Passe oublié 
----------------------------------------------------------------------*/

// Permet de vérifier que le mail fournit existe, ainsi que de cibler la question
// à laquelle l'utilisateur devra ensuite répondre.
router.post('/mdpEmail', (req, res) => {
    const email = req.body.email;
    
    // On effectue la requête
    session.readTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Email:$userEmail})
                RETURN u.Email as email, u.Quest as quest`,
            {
                userEmail: email
            }
        )
        .then(result => {
            // Si l'email n'est pas valide
            if(_.isEmpty(result.records)) {
                return res.status(403).json({error: true, message: 'L\'Email saisit ne correspond à aucun compte'})
            }
            // sinon on cherche à quelle question l'utilisateur a répondu
            else{
                result.records.map(record => {
                    const resultat = record.get('quest');
                    if(resultat == 'Surnom') {
                        return res.status(200).json({question: 'Quelle était votre surnom enfant ?'})
                    }
                    else if(resultat == 'City') {
                        return res.status(200).json({question: 'Dans quelle ville êtes-vous né ?'})
                    }
                    else if(resultat == 'Mat') {
                        return res.status(200).json({question: 'Quel est votre domaine d\'étude préféré ?'})
                    }
                    else {
                        return res.status(200).json({question: 'Quel est le nom de votre animal de compagnie ?'})
                    }
                })
            }
        })
    )
})


// Permet de vérifier que la réponse à la question est juste et autorise ainsi la 
// modification du mot de passe
router.post('/mdpQuest', (req, res) => {
    const email = req.body.email;
    const secret = req.body.secret;

    // On vérifie si l'utilisateur existe
    session.readTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Email:$userEmail})
                RETURN u.Email as email, u.Secret as secret`,
            {
                userEmail: email
            }
        )
        .then(result => {
            if(_.isEmpty(result.records)) {
                res.status(403).json({error: true, message: 'L\'Email saisit ne correspond à aucun compte' })
            }
            else {
                result.records.map(record => {
                    bcrypt.compare(secret, record.get('secret'), function(err, match) {
                        if (err) {
                            res.status(500).json({error: true, message: 'Auth échoué'});
                        }
                        if (match) {
                            res.status(200).json({message: 'Ok'});
                            return;
                        }
                        else {
                            res.status(401).json({error: true, message: 'La réponse à la question n\'est pas correcte'});
                            return;
                        }
                    })
                })
            }
        })
    )
})

// Permet de changer le mot de passe de l'utilisateur
router.post('/mdpPassword', async(req, res) => {
    const email = req.body.email;
    const hashP = await bcrypt.hash(req.body.password, saltRounds);

    session.writeTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Email:$userEmail})
                SET u.Password = $userPassword
                RETURN u.Email, u.Password`,
            {
                userEmail: email,
                userPassword: hashP,
            }
        )
        .then(result => {
            return res.status(200).json({message: 'Ok'});
        })
    )
})

module.exports = router