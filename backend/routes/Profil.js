// Back pour la gestion du profil de l'utilisateur, il permet notamment la 
// modification du profil

const express = require('express');
const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');
const v4 = require('uuid').v4;

const router = express.Router();
dotenv.config();

// On importe le modèle de données concernant le profil de l'utilisateur
const DonneesUtil = require('../Models/DonneesUtil');
const _ = require('lodash');

// On se connecte au driver neo4j, Nécéssite la clé (.env)
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', process.env.DB_UTIL_PASS));
const session = driver.session();


/*--------------------------------------------------------------------
Profil Principal
--------------------------------------------------------------------*/


// Permet de récupérer les données enregistrées dans la base de données
// Pour les afficher ensuite à l'écran 
router.post('/getBdd', (req, res) => {
    const id = req.body.id;
    const email = req.body.email;
    session.readTransaction((tcx) => 
        tcx.run(`MATCH (p:Profil {Id:$userId}) 
                RETURN p.Nom as nom, p.Prenom as prenom, p.Ville as ville,
                p.Ecole as ecole, p.Filiere as filiere, p.Site as site, p.Matiere as matiere`,
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
                        nom: record.get('nom'),
                        prenom: record.get('prenom'),
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
    )
})

// On vérifie si l'utilisateur a déjà un profil dans la base de données :
// Prend l'id en entrée
function findProfile(id) {
    return session.readTransaction((tcx) =>
        tcx.run(`MATCH (p:Profil {Id:$userId})
                RETURN p.Id as id, p.Nom as nom, p.Prenom as prenom, p.Ville as ville,
                p.Ecole as ecole, p.Filiere as filiere, p.Site as site, p.Matiere as matiere`,
            {
                userId: id
            }    
        )
        .then(result => {
            return result.records.map(record => {
                return new DonneesUtil(record.get('id'), record.get('nom'), record.get('prenom'), record.get('ville'), record.get('ecole'), record.get('filiere'), record.get('site'), record.get('matiere'));
            });
        })
        .catch(error => {
            throw error;
        })
    )
}


// Crée le profil
function createProfil(id, nom, prenom, ville, ecole, filiere, site, matiere) {
    session.writeTransaction((tcx) =>
        tcx.run(`CREATE (p:Profil {Id:$userId, Nom:$userNom, Prenom:$userPrenom, 
                Ville:$userVille, Ecole:$userEcole, Filiere:$userFiliere, Site:$userSite, 
                Matiere:$userMatiere})`,
            {
                userId: id,
                userNom: nom,
                userPrenom: prenom,
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


// Modifie le profil 
function modifyProfil(id, nom, prenom, ville, ecole, filiere, site, matiere) {
    session.writeTransaction((tcx) => 
        tcx.run(`MATCH (p:Profil {Id:$userId}) 
                SET p.Nom = $userNom, p.Prenom = $userPrenom, p.Ville = $userVille, 
                p.Ecole = $userEcole, p.Filiere = $userFiliere, p.Site = $userSite, 
                p.Matiere = $userMatiere`,
            {
                userId: id,
                userNom: nom,
                userPrenom: prenom,
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
    let nom = null;
    let prenom = null;
    let ville = null;
    let ecole = null;
    let filiere = null;
    let site = null;
    let matiere = null;

    if(req.body.nom) {
        nom = req.body.nom
    }
    if(req.body.prenom) {
        prenom = req.body.prenom
    }
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
            createProfil(id, nom, prenom, ville, ecole, filiere, site, matiere);
            return res.status(200).json({message: 'ok'})
        }
        // Sinon on modifie l'utilisateur
        else {
            // Si l'utilisateur n'a pas renseigné le champ mais que celui-ci est 
            // dans la bdd alors on ne le modifie pas
            if(!nom && utils[0].nom) {
                nom = utils[0].nom;
            }
            if(!prenom && utils[0].prenom) {
                prenom = utils[0].prenom;
            }
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
            modifyProfil(id, nom, prenom, ville, ecole, filiere, site, matiere);
            return res.status(200).json({message: 'ok'})
        }
    })
})

module.exports = router