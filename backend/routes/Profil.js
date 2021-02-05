// Back pour la gestion du profil de l'utilisateur, il permet notamment la 
// modification du profil

const express = require('express');
const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');

const router = express.Router();
dotenv.config();

// On importe le modèle de données concernant le profil de l'utilisateur
const DonneesUtil = require('../Models/DonneesUtil');
const _ = require('lodash');

// On se connecte au driver neo4j, Nécéssite la clé (.env)
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', process.env.DB_UTIL_PASS));
const session = driver.session();
const session2 = driver.session();


/*--------------------------------------------------------------------
Profil Principal
--------------------------------------------------------------------*/


// Récupère le nom et le prénom de l'utilisateur
router.post('/getName', (req, res) => {
    session2.readTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur {Id:$userId})
                RETURN u.Nom as nom, u.Prenom as prenom`,
            {
                userId: req.body.id
            }    
        )
        .then(result => {
            result.records.map(record => {
                const data = {
                    nom: record.get('nom'),
                    prenom: record.get('prenom')
                }
                return res.status(200).json({data})
            })
        })
        .catch(error => {
            throw error;
        })
    )
})


// Permet de récupérer les données enregistrées dans la base de données
// Pour les afficher ensuite à l'écran 
router.post('/getBdd', (req, res) => {
    const id = req.body.id;
    session.readTransaction((tcx) => 
        tcx.run(`MATCH (p:Profil {Id:$userId}) 
                RETURN p.Ville as ville, p.Ecole as ecole, p.Filiere as filiere, 
                p.Site as site, p.Matiere as matiere`,
            {
                userId: id
            }
        )
        .then(result => {
            // Si l'utilisateur n'a jamais modifié ses informations le node 
            // n'existe pas
            if(_.isEmpty(result.records)) {
                return res.status(500).json({error:true, message: 'Pas de données'});
            }
            // Sinon on récupère les informations non vide à l'intérieur du 
            // node
            else {
                result.records.map(record => {
                    const data = {
                        ville: record.get('ville'),
                        ecole: record.get('ecole'),
                        filiere: record.get('filiere'),
                        site: record.get('site'),
                        matiere: record.get('matiere'),
                    }
                    // on passe toutes les informations au front qui s'occupe de
                    // vérifier leur contenu
                    return res.status(200).json({data})
                })
            }
        })
        .catch(error => {
            throw error;
        })
    )
})

// On vérifie si l'utilisateur a déjà un profil dans la base de données :
// Prend l'id en entrée
function findProfile(id) {
    return session.readTransaction((tcx) =>
        tcx.run(`MATCH (p:Profil {Id:$userId})
                RETURN p.Id as id, p.Ville as ville, p.Ecole as ecole, p.Filiere as filiere, 
                p.Site as site, p.Matiere as matiere`,
            {
                userId: id
            }    
        )
        .then(result => {
            return result.records.map(record => {
                return new DonneesUtil(record.get('id'), record.get('ville'), record.get('ecole'), record.get('filiere'), record.get('site'), record.get('matiere'));
            });
        })
        .catch(error => {
            throw error;
        })
    )
}


// Crée le profil
function createProfil(id, ville, ecole, filiere, site, matiere) {
    session.writeTransaction((tcx) =>
        tcx.run(`CREATE (p:Profil {Id:$userId, Ville:$userVille, Ecole:$userEcole, 
                Filiere:$userFiliere, Site:$userSite, Matiere:$userMatiere})`,
            {
                userId: id,
                userVille: ville,
                userEcole: ecole,
                userFiliere: filiere,
                userSite: site,
                userMatiere: matiere
            }
        )
        .catch(error =>{
            throw error;
        })
    )
}

// crée la relation entre l'utilisateur et le profil
function createRelationProfil(id) {
    session2.writeTransaction((tcx) => 
        tcx.run(`MATCH (u:Utilisateur)
                WITH u
                MATCH (p:Profil)
                WHERE u.Id = p.Id = $userId
                CREATE (u)-[r:A_POUR_PROFIL {Id:$userId}]->(p)`,
            {
                userId: id
            }
        )
        .catch(error => {
            throw error;
        })
    )
}


// Modifie le profil 
function modifyProfil(id, ville, ecole, filiere, site, matiere) {
    session.writeTransaction((tcx) => 
        tcx.run(`MATCH (p:Profil {Id:$userId}) 
                SET p.Ville = $userVille, p.Ecole = $userEcole, p.Filiere = $userFiliere,
                p.Site = $userSite, p.Matiere = $userMatiere`,
            {
                userId: id,
                userVille: ville,
                userEcole: ecole,
                userFiliere: filiere,
                userSite: site,
                userMatiere: matiere
            }
        )
        .catch(error => {
            throw error;
        })
    )
}


// Modifie les informaitons du profil de l'utilisateur, si ce dernier n'a jamais
// renseigné de profil, le crée avec les informations données
router.post('/createProfil', (req, res) => {
    const id = req.body.id;
    // On vérifie quelles informations ont été transmises
    let ville = null;
    let ecole = null;
    let filiere = null;
    let site = null;
    let matiere = null;

    if(req.body.ville) {
        ville = req.body.ville
    }
    if(req.body.ecole) {
        ecole = req.body.ecole
    }
    if(req.body.filiere) {
        filiere = req.body.filiere
    }
    if(req.body.site) {
        site = req.body.site
    }
    if(req.body.matiere) {
        matiere = req.body.matiere
    }

    // On vérifie ensuite si l'utilisateur a déjà un profil
    findProfile(id)
    .then(utils => {
        // Si ce n'est pas le cas on crée le profil
        if(_.isEmpty(utils)) {
            createProfil(id, ville, ecole, filiere, site, matiere);
            createRelationProfil(id);
            return res.status(200).json({message: 'ok'})
        }
        // Sinon on modifie l'utilisateur
        else {
            // Si l'utilisateur n'a pas renseigné le champ mais que celui-ci est 
            // dans la bdd alors on ne le modifie pas
            if(!ville && utils[0].ville) {
                ville = utils[0].ville;
            }
            if(!ecole && utils[0].ecole) {
                ecole = utils[0].ecole;
            }
            if(!filiere && utils[0].filiere) {
                filiere = utils[0].filiere;
            }
            if(!site && utils[0].site) {
                site = utils[0].site;
            }
            if(!matiere && utils[0].matiere) {
                matiere = utils[0].matiere;
            }
            modifyProfil(id, ville, ecole, filiere, site, matiere);
            return res.status(200).json({message: 'ok'})
        }
    })
})

module.exports = router