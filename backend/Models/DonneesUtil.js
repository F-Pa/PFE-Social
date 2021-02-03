const _ = require('lodash');

function DonneesUtil(id, nom, prenom, ville, ecole, filiere, site, matiere) {
    _.extend(this, {
        id: id,
        nom: nom,
        prenom: prenom,
        ville: ville,
        ecole: ecole,
        filiere: filiere,
        site: site,
        matiere: matiere
    });
}

module.exports = DonneesUtil;