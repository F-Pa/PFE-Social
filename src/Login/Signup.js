import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

// Style :
import '../style/login.css';

// FINI

const Signup = () => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère les valeurs rentrées par l'utilisateur dans le formulaire
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');

    // Récupère la question 
    const [quest, setQuest] = useState('');

    // Récupère la réponse à la question secrète
    const [secret, setSecret] = useState('');

    // Message d'erreur à afficher si il y a un problème dans le backend
    const [errorS, setErrorS] = useState('');

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
    // de vérifier) puis appelle le back pour sauvegarder dans la bdd
    function handleSubmit(e) {
        e.preventDefault();

        const user_info = {
            email: email,
            password: password,
            nom: nom,
            prenom: prenom,
            quest: quest,
            secret: secret
        };

        // On utilise le back, renvoie ... TODO
        axios.post('http://localhost:4000/app/auth/signup', user_info)
        .then(function(res) {
            sessionStorage.setItem('token', res.data.token);
            setRedirection(true);
        })
        .catch(function(error) {
            setErrorS(error.response.data.message);
        })
    }



    /* ---------------------------------------------------------------------
    HTML
    ----------------------------------------------------------------------*/


    return(
        <>
            {/* Si l'utilisateur s'est identifié redirige vers la page de profil */}
            {redirection ? <Redirect to="/Profil"/> : null}
            <div className="login-wrap">
                <div className="login-html">
                    <h1 class="titre">S'inscrire</h1>
                    <p className="subtitle">Tirez le meilleur parti de votre vie Universitaire</p>
                    {/*  On gère le Signup */}
                    <div className="login-form-si">
                        <div className="sign-in-htm">
                            <form onSubmit={handleSubmit}>
                                <div className="group">
                                    <label className="label">E-mail</label>
                                    <input
                                        className="input"
                                        required  
                                        type='email'
                                        placeholder='E-mail'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="group">
                                    <label className="label">Mot de passe</label>
                                    <input
                                        className="input"
                                        required
                                        type='password'
                                        placeholder='Mot de passe'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="group">
                                    <label className="label">Nom</label>
                                    <input
                                        className="input"
                                        required  
                                        type='text'
                                        placeholder='Nom'
                                        value={nom}
                                        onChange={(e) => setNom(e.target.value)}
                                    />
                                </div>
                                <div className="group">
                                    <label className="label">Prénom</label>
                                    <input
                                        className="input"
                                        required
                                        type='text'
                                        placeholder='Prénom'
                                        value={prenom}
                                        onChange={(e) => setPrenom(e.target.value)}
                                    />
                                </div>
                                <div className="group">
                                    <label className="label">Question secrète</label>
                                    <select className="select" required onChange={(e) => setQuest(e.target.value)}>
                                        <option value="" hidden>Questions</option>
                                        <option value='Surnom'>Quel était votre surnom enfant ?</option>
                                        <option value='City'>Dans quelle ville êtes-vous né(e) ?</option>
                                        <option value='Mat'>Quel est votre domaine d'étude préféré ?</option>
                                        <option value='Animal'>Quel est le nom de votre animal de compagnie ?</option>
                                    </select>
                                    <input className="input"
                                        required
                                        type='text'
                                        placeholder='Réponse'
                                        value={secret}
                                        onChange={(e) => setSecret(e.target.value)}
                                    />
                                </div>
                                <div className="group">
                                    <input className="button"
                                        required
                                        type='submit'
                                        value='Créer un compte'
                                    />
                                </div>
                                {errorS && <p className="error-signin">{errorS}</p>}
                            </form>
                        </div>
                    </div>
                    {/* Redirection vers la page d'identification */}
                    <div className="hr"></div>
                    <div className="foot-lnk">
                        <label className="subtitle" for="tab-1">Déjà inscrit(e) ? </label>
                        <Link className="link-signin" to="/Signin">
                            S'identifier
                        </Link>
                    </div>
                </div>    
            </div>
        </>
    )
}

export default Signup;