import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signin = () => {
    // Récupère les valeurs rentrées par l'utilisateur dans le formulaire
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // HTML du Signin
    return (
        <div>
            <p>Petit Logo des familles</p>
            <p>S'identifier</p>
            <p>Tenez-vous au courant des évolutions d'AMU</p>
            {/* On gère le Signin */}
            <form>
                <input 
                    type='email'
                    placeholder='E-mail'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='Mot de passe'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type='submit'
                    value="S'identifier"
                />                
            </form>
            {/* Utilise la question secrète */}
            <p>Mot de passe oublié</p>
            <div>
                <p>Nouveau sur AMUSoc ?</p>
                <Link to="/Signup">
                    S'inscrire
                </Link>
            </div>        
        </div>
    )
}

export default Signin;