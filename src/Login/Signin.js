import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

// TODO : BACKEND fini / STYLE A FAIRE

const Signin = () => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère les valeurs rentrées par l'utilisateur dans le formulaire
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Message d'erreur à afficher si il y a un problème dans le backend
    const [errorSi, setErrorSi] = useState('');

    // Si l'utilisateur a bien rentré ses informations, permets la redirection
    // vers la page de profil
    const [redirection, setRedirection] = useState(false);


    /* ---------------------------------------------------------------------
    JS
    ----------------------------------------------------------------------*/

    
    // Permet de vérifier si l'utlisateur est déjà connecté, auquel cas, il 
    // n'a pas besoin d'être sur cette page
    useEffect(() => {
        if(sessionStorage.getItem('token')) {
            setRedirection(true);
        }
      }, []);


    // Récupère tout les champs renseignés (Ils sont required donc pas besoin
    // de vérifier) puis appelle le back pour vérifier si l'utilisateur est enregistré
    function handleSubmit(e) {
        e.preventDefault();

        const user_info = {
            email: email,
            password: password
        };

        // on utilise le back, stocke un token dans la session, et redirige 
        // vers la page de profil
        axios.post('http://localhost:4000/app/auth/signin', user_info)
        .then(function(res) {
            sessionStorage.setItem('token', res.data.token);
            setRedirection(true);
        })
        .catch(function(error) {
            setErrorSi(error.response.data.message);
        })
    }


    /* ---------------------------------------------------------------------
    HTML
    ----------------------------------------------------------------------*/


    return (
        <>
            {/* Si l'utilisateur s'est identifié redirige vers la page de profil */}
            {redirection ? <Redirect to="/Test"/> : null}
            <div>
                <p>Petit Logo des familles</p>
                <p>S'identifier</p>
                <p>Tenez-vous au courant des évolutions d'AMU</p>
                {/* On gère le Signin */}
                <form onSubmit={handleSubmit}>
                    <input 
                        required
                        type='email'
                        placeholder='E-mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        required
                        type='password'
                        placeholder='Mot de passe'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Bouton de validation */}
                    <input
                        type='submit'
                        value="S'identifier"
                    />
                    {errorSi && <p>{errorSi}</p>}                
                </form>
                {/* Utilise la question secrète */}
                <div>
                    <Link to="/Oups">
                        Mot de passe oublié
                    </Link>
                </div>
                {/* Redirection vers la page d'inscription */}
                <div>
                    <p>Nouveau sur AMUSoc ?</p>
                    <Link to="/Signup">
                        S'inscrire
                    </Link>
                </div>        
            </div>
        </>
    )
}

export default Signin;