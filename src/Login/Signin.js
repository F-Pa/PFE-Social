import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

// Style
import '../style/login.css';

// FINI

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
            <div className="login-wrap">
                <div className="login-html">
                    <h1 className="titre">S'identifier</h1>
                    <p className="subtitle">Tenez-vous au courant des évolutions de vos universités</p>		
                    <div className="login-form">
                        <div className="sign-in-htm">
                            <form onSubmit={handleSubmit}>
                                <div className="group">
                                    <label className="label">E-mail</label>
                                    <input className="input"
                                        required
                                        type='email'
                                        placeholder='E-mail'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="group">
                                    <label className="label">Mot de passe</label>
                                    <input className="input"
                                        required
                                        type='password'
                                        placeholder='Mot de passe'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {/* Bouton de validation */}
                                <div className="group">
                                    <input className="button"
                                        type='submit'
                                        value="S'identifier"
                                    />
                                </div>
                                {errorSi && <p className="error-signin">{errorSi}</p>}
                            </form>
                            {/* Utilise la question secrète */}
                            <div className="mdp-forgot">
                                <Link className="link-signin" to="/Oups">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <div className="hr"></div>
                            {/* Redirection vers la page d'inscription */}
                            <div className="foot-lnk">
                                <label className="subtitle" for="tab-2">Nouveau sur AmuSoc ? </label>
                                <Link className="link-signin" to="/Signup">
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