import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// TODO : Je n'arrive pas à rentrer du texte dans le form2 à voir pourquoi
// TODO : Quand on clique sur suite, cela remplace le form1 par le form2 
// mais ne l'affiche pas à la suite comme maintenant.
// idem du form2 au form3, on remplace les forms on ne les affiche plus à la suite 

const Mdp = () => {
    // Récupère les valeurs rentrées par l'utilisateur dans le formulaire
    const [email, setEmail] = useState('');
    const [secret, setSecret] = useState('');
    // Affiche le deuxième form si l'email est validé
    const [form2, setForm2] = useState('');
    // Message d'erreur à afficher s'il y a un problème dans le backend
    // Pour l'E-mail
    const [errorM, setErrorM] = useState('');
    // Pour la question secrète
    const [errorQ, setErrorQ] = useState('');


    // Récupère la réponse à la question (required) et vérifie si l'infomation
    // est correcte
    function handleSubmitQuest(e) {
        e.preventDefault();
        
        const user_info2 = {
            email: email,
            secret: secret
        };

        axios.post('http://localhost:4000/app/auth/mdpQuest', user_info2)
        .then(function(res) {
            console.log(res);
        })
        .catch(function(error) {
            console.log(error);
            setErrorQ(error.response.data.message);
        })

    }

    // Récupère l'email (Il est required donc pas besoin de vérifier) 
    // puis appelle le back pour vérifier les informations
    function handleSubmitMail(e) {
        e.preventDefault();

        const user_info = {
            email: email
        }

        axios.post('http://localhost:4000/app/auth/mdpEmail', user_info)
        .then(function(res) {
            setErrorM('');
            setForm2(
                <>
                    <form onSubmit={handleSubmitQuest}>
                        <p>{res.data.question}</p>
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
                            value='Valider'
                        />
                        {errorQ && <p>{errorQ}</p>}
                    </form>
                </>
            )
        })
        .catch(function (error) {
            setErrorM(error.response.data.message);
        })
    }


    // HTML du mot de passe oublié
    return (
        <div>
            <p>Petit logo de la mifa</p>
            <p>Mot de passe oublié</p>
            <p>Cela arrive même aux meilleurs, renseignez votre email et votre question secrète ci-dessous</p>
            {/* On gère les informations */}
            <form onSubmit={handleSubmitMail}>
                <input
                    required
                    type='email'
                    placeholder='E-mail'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {/* Bouton de validation */}
                <input
                    required
                    type='submit'
                    value='Suite'
                />
                {errorM && <p>{errorM}</p>}
            </form>
            {form2}
            {/* Redirection vers la page d'identification */}
            <div>
                <p>La mémoire vous est revenue ?</p>
                <Link to="/Signin">
                    Revenez vous identifier
                </Link>
            </div>  
        </div>
    )
}

export default Mdp;