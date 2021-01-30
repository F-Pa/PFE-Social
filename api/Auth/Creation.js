const neo4j = require('neo4j-driver');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();

// On importe le modèle de données concernant l'utilisateur
const Utilisateur = require('../Models/Utilisateur');
const _ = require('lodash');

// On se connecte au driver neo4j, Nécéssite la clé (.env)
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', process.env.DB_UTIL_PASS));
const session = driver.session();

// Sel pour le hachage du mot de passe
const saltRounds = 10;


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
async function createUser(email, password, quest, secret) {
    const hashP = await bcrypt.hash(password, saltRounds);
    const hashS = await bcrypt.hash(secret, saltRounds);
    session.writeTransaction((tcx) =>
        tcx.run(`CREATE (u:Utilisateur {Email:$userEmail, Password:$userPassword, Quest:$userQuest, Secret:$userSecret})`,
            {
                userEmail: email,
                userPassword: hashP,
                userQuest: quest,
                userSecret: hashS
            }
        )
        .catch(error =>{
            throw error;
        })
    )
}


// Traitement de la requête du front. Appelle les deux fonctions définies 
// ci-dessus. 
// Renvoie une erreur si l'utilisateur existe déjà ou si un problème à eu lieu
// Sinon crée l'utilisateur et renvoie un token pour qu'il puisse continuer à 
// naviguer sur le site.
export default (req, res) => {
    console.log('iauvd');
    if(req.method === 'POST') {

        const email = req.body.email;
        const password = req.body.password;
        const quest = req.body.quest;
        const secret = req.body.secret;
        console.log('aindoba');

        // On vérifie si l'email est déjà utilisé
        findUser(email)
        .then(utils => {
            // Si ce n'est pas le cas on crée l'utilisateur
            if(_.isEmpty(utils)) {
                createUser(email, password, quest, secret);
                // const token = jwt.sign(
                //     {userId: v4(), userEmail: email},
                //     process.env.JWTSECRET,
                //     {expiresIn: 3000},
                // );
                res.status(200).json({error: true, message: 'Ok'});
                // res.status(200).json({token});
                return;
            }
            // Sinon l'utilisateur existe : on renvoie un message d'erreur
            else {
                res.status(403).json({error: true, message: 'L\'email est déjà lié à un compte'});
                return;
            }
        })
    }
}