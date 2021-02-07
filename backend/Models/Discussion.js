const _ = require('lodash');

function Discussion(id1, id2, message) {
    _.extend(this, {
        id1: id1,
        id2: id2, 
        message: message
    });
}

module.exports = Discussion;