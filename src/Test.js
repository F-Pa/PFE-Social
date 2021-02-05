import React from 'react';
import { Redirect } from 'react-router-dom';

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const Test = (props) => {

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
    console.log(props.match.params.id);
    
    return (
        <div>
            {decoded && (
                <>
                    <p>Bienvenue {decoded.userEmail}</p>
                    <p>Vous Etes {props.match.params.id}</p>
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
