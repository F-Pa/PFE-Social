import React from 'react';
import { Redirect } from 'react-router-dom';

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const Test = () => {

    let decoded;
    const token = sessionStorage.getItem('token');
    if(token) {
        try {
            decoded = jwt.verify(token, process.env.REACT_APP_JWTSECRET);
        }
        catch(e) {
            console.error(e);
        }
    }
    console.log(decoded);
    
    return (
        <div>
            {decoded && (
                <>
                    <p>Bienvenue {decoded.userEmail}</p>
                </>
            )}
            {!decoded && (
                <>
                    <Redirect to="/Signin"/>
                </>
            )}
        </div>
    )
}

export default Test;
