import React from 'react';
import { Redirect } from 'react-router-dom';

import ProfilPrincipal from './ProfilPrincipal'

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const Profil = () => {
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
                {/* TODO Div à gauche avec photo de profil, amis et centre d'intérêts */}
                <div>
                    <p>Photo de profil TMTC</p>
                    {/* Les amis */}
                    <div>
                        <p>Collègues</p>
                        <p>Ami 1</p>
                        <p>Ami 2</p>
                        <p>Etc ...</p>
                        <p>Voir Plus</p>
                    </div>
                    {/* Les centre d'intérêts */}
                    <div>
                        <p>Passion 1</p>
                        <p>Passion 2</p>
                        <p>Etc ...</p>
                    </div>
                </div>
                {/* Div principale avec l'affichage des informations personelles */}
                <div>
                    <ProfilPrincipal/>
                </div>
            </div>
        </>
    )
}

export default Profil;
