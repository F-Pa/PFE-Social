import React from 'react';
import { Redirect } from 'react-router-dom';

import ProfilPrincipal from './ProfilPrincipal'
import ProfilCours from './ProfilCours'
import NavBar from '../NavBar/NavBar'

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const Profil = () => {
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
                {/* Navbar à gauche */}
                <div>
                    <NavBar/>
                </div>
                {/* Div principale avec l'affichage des informations personelles */}
                <div className="test-profil">
                    <div className="scor-profil">
                        <ProfilPrincipal/>
                        <ProfilCours/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profil;
