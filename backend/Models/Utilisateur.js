const _ = require('lodash');

function Utilisateur(email, password, quest, secret) {
    _.extend(this, {
        email: email,
        password: password,
        quest: quest,
        secret: secret
    });
}

module.exports = Utilisateur;