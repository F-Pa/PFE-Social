const _ = require('lodash');

function DonneesUtil(id, ville, ecole, filiere, site, matiere) {
    _.extend(this, {
        id: id,
        ville: ville,
        ecole: ecole,
        filiere: filiere,
        site: site,
        matiere: matiere
    });
}

module.exports = DonneesUtil;