import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Style
import '../style/login.css';

// FINI

const Mdp = () => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère les valeurs rentrées par l'utilisateur dans le formulaire
    const [email, setEmail] = useState('');
    const [quest, setQuest] = useState('');
    const [secret, setSecret] = useState('');
    const [mdp1, setMdp1] = useState('');
    const [mdp2, setMdp2] = useState('');

    // Message d'erreur à afficher s'il y a un problème dans le backend
    // Pour l'E-mail
    const [errorM, setErrorM] = useState('');
    // Pour la question secrète
    const [errorQ, setErrorQ] = useState('');
    // Pour le mot de passe
    const [errorMp, setErrorMp] = useState('');


    /* ---------------------------------------------------------------------
    JS
    ----------------------------------------------------------------------*/


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
            setQuest(res.data.question);
            var x = document.getElementById('formdeux');
            var y = document.getElementById('formun');
            y.style.display = "none";
            x.style.display = "block";
        })
        .catch(function (error) {
            setErrorM(error.response.data.message);
        })
    }



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
            setErrorQ('');
            var w = document.getElementById('formtrois');
            var z = document.getElementById('formdeux');
            z.style.display = "none";
            w.style.display = "block";
        })
        .catch(function(error) {
            setErrorQ(error.response.data.message);
        })

    }



    // Récupère le mot de passe, vérifie que les deux champs sont identiques
    // Si c'est le cas change le mot de passe et propose le lien de redirection
    // vers la page d'identification
    function handleSubmitPassword(e) {
        e.preventDefault();
        if(mdp1 === mdp2) {
            const user_info3 = {
                email: email,
                password: mdp1
            };

            axios.post('http://localhost:4000/app/auth/mdpPassword', user_info3)
            .then(function(res) {
                setErrorMp('');
                var a = document.getElementById('formtrois');
                var b = document.getElementById('fin');
                var c = document.getElementById('identification');
                var d = document.getElementById('hide');
                a.style.display = "none";
                c.style.display = "none";
                b.style.display = "block";
                d.style.display = "none";
            })
            .catch(function(error) {
                setErrorMp(error.response.data.message);
            })
        }
        else {
            setErrorMp('Les mots de passe ne sont pas identiques');
        }
    }



    /* ---------------------------------------------------------------------
    HTML
    ----------------------------------------------------------------------*/
    
    
    return (
        <div className="login-wrap">
            <div className="login-html">		
                <h1 className="titre">Mot de passe oublié</h1>
                <p className="subtitle">Cela arrive même aux meilleurs, renseignez votre email et votre question secrète ci-dessous</p>
                {/* On gère les informations */}
                <div className="login-form" id="formun">
                    <form onSubmit={handleSubmitMail}>
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
                        {/* Bouton de validation */}
                        <div className="group">
                            <input className="button"
                                required
                                type='submit'
                                value='Suite'
                            />
                        </div>
                        {errorM && <p className="error-signin">{errorM}</p>}
                    </form>
                </div>
                {/* On affiche ce form si l'utilisateur a rentré son Email */}
                <div className="login-form" id="formdeux" style={{display: 'none'}}>
                    <form onSubmit={handleSubmitQuest}>
                        <div className="group">
                            <label className="label">{quest}</label>
                            <input className="input"
                                id = 'secret'
                                required
                                type='text'
                                value={secret}
                                placeholder='Réponse'
                                onChange={(e) => setSecret(e.target.value)}
                            />
                        </div>
                        {/* Bouton de validation */}
                        <div className="group">
                            <input className="button"
                                required
                                type='submit'
                                value='Valider'
                            />
                        </div>
                        {errorQ && <p className="error-signin">{errorQ}</p>}
                    </form>
                </div>
                {/* Et celui-ci s'il a rensigné la réponse à la question secrète */}
                <div className="login-form" id="formtrois" style={{display: 'none'}}>
                    <form onSubmit={handleSubmitPassword}>
                        <div className="group">
                            <input className="input"
                                required
                                type='password'
                                value={mdp1}
                                placeholder='Mot de passe'
                                onChange={(e) => setMdp1(e.target.value)}
                            />
                        </div>
                        <div className="group">
                            <input className="input"
                                required
                                type='password'
                                value={mdp2}
                                placeholder='Confirmation du mot de passe'
                                onChange={(e) => setMdp2(e.target.value)}
                            />
                        </div>
                        {/* Bouton de validation */}
                        <div className="group">
                            <input className="button"
                                required
                                type='submit'
                                value='Changer'
                            />
                        </div>
                        {errorMp && <p className="error-signin">{errorMp}</p>}
                    </form>
                </div>
                <div id="fin" style={{display: 'none'}}>
                    <p className="subtitle">Le mot de passe est changé avec succès</p>
                    <Link className="link-signin" to='/Signin'>
                        Revenir vers la page d'identification
                    </Link>
                </div>
                {/* Redirection vers la page d'identification */}
                <div id="hide" className="hr"></div>
                <div className="foot-lnk" id="identification">
                    <p className="subtitle">La mémoire vous est revenue ?</p>
                    <Link className="link-signin" to="/Signin">
                        Revenez vous identifier
                    </Link>
                </div>  
            </div>
        </div>
    )
}

export default Mdp;