import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import '../style/login.css';

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
            <div class="login-wrap">
                <div class="login-html">
                    <h1 class="titre">CONNEXION</h1>		
                        <div class="login-form">
                            <div class="sign-in-htm">
                                <form onSubmit={handleSubmit}>
                                    <div class="group">
                                        <label class="label">E-mail</label>
                                        <input class="input"
                                            required
                                            type='email'
                                            placeholder='E-mail'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div class="group">
                                        <label class="label">Mot de passe</label>
                                        <input class="input"
                                            required
                                            type='password'
                                            placeholder='Mot de passe'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <p>
                                        <Link to="/Oups">
                                            Mot de passe oublié ?
                                        </Link>
                                    </p>
                                    <div class="group">
                                        <input class="button"
                                            type='submit'
                                            value="S'identifier"
                                        />
                                    </div>
                                </form>
                                <div class="hr"></div>
                                <div class="foot-lnk">
                                    <label for="tab-2">Nouveau sur AmuSoc ? </label>
                                    <Link to="/Signup">
                                        S'inscrire
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
        </>
    )
}

export default Signin;