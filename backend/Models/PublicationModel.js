const _ = require('lodash');

function Publication(id, nom, prenom, contenu) {
    _.extend(this, {
        id: id,
        nom: nom,
        prenom: prenom,
        contenu: contenu,
    });
}

module.exports = Publication;