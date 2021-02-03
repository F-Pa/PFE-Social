import React from 'react'
import { Redirect } from 'react-router-dom';

import NavBar from '../NavBar/NavBar'

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const AffichageAmi = () => {
    // Récupère les informations du Token
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

    return (
        <>
            <div>
                {/* Si l'utilisateur n'est pas connecté redirige vers la page d'indentification */}
                { !decoded ? <Redirect to="/Signin"/> : null}
                {/* Sinon on affiche ses amis */}
                {/* NavBar à gauche */}
                <div>
                    <NavBar/>
                </div>
                <div>
                    <ul>
                        <li>La photo de mon ami1 / Son nom / Son Prénom  / (sa page de profil ??)</li>
                        <li>La photo de mon ami2 / Son nom / Son Prénom  / (sa page de profil ??)</li>
                        <li>La photo de mon ami3 / Son nom / Son Prénom  / (sa page de profil ??)</li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default AffichageAmi