import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

// TODO : BACKEND fini / STYLE A FAIRE

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
            {redirection ? <Redirect to="/Test"/> : null}
            <div>
                <p>Petit Logo des familles</p>
                <p>Tirez le meilleur parti de votre vie Universitaire</p>
                {/*  On gère le Signup */}
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
                    <input
                        required  
                        type='text'
                        placeholder='Nom'
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />
                    <input
                        required
                        type='text'
                        placeholder='Prénom'
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                    />
                    <p>Question secrète</p>
                    {/* Ici le select avec les différentes questions */}
                    <select required onChange={(e) => setQuest(e.target.value)}>
                        <option value="" hidden>Questions</option>
                        <option value='Surnom'>Quelle était votre surnom enfant ?</option>
                        <option value='City'>Dans quelle ville êtes-vous né ?</option>
                        <option value='Mat'>Quel est votre domaine d'étude préféré ?</option>
                        <option value='Animal'>Quel est le nom de votre animal de compagnie ?</option>
                    </select>
                    {/* La réponse attendue */}
                    <input
                        required
                        type='text'
                        placeholder='Réponse'
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                    />
                    {/* Bouton de validation */}
                    <input
                        required
                        type='submit'
                        value='Créer un compte'
                    />
                    {errorS && <p>{errorS}</p>}
                </form>
                {/* Redirection vers la page d'identification */}
                <div>
                    <p>Déjà inscrit ?</p>
                    <Link to="/Signin">
                        S'identifier
                    </Link>
                </div>     
            </div>
        </>
    )
}

export default Signup;