const _ = require('lodash');

function Utilisateur(email, password, nom, prenom, quest, secret) {
    _.extend(this, {
        email: email,
        password: password,
        nom: nom,
        prenom: prenom,
        quest: quest,
        secret: secret
    });
}

module.exports = Utilisateur;