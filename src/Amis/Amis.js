import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import NavBar from '../NavBar/NavBar'

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// TODO : Systeme de recommendation pour optimiser la recherche
// TODO : Lien vers la page de profil pour chaque ami (idem AffichageAmi)
// BACKEND fini
// TODO : STYLE A FAIRE

const Amis = () => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère les informations sur les personnes qui sont dans la base
    // de données pour les afficher
    const [resultat, setResultat] = useState();

    // Affiche une erreur si personne n'a été trouvée
    const [errorM, setErrorM] = useState('');


    /* ---------------------------------------------------------------------
    JS
    ----------------------------------------------------------------------*/


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

    // Au chargement de la page on affiche les informations contenues dans la bdd
    useEffect(() => {
        getPersonne();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Cette fonction permet de rechercher les autres personnes dans la bdd
    // Elle est optimisée avec un système de recommandation (TODO)
    function getPersonne() {
        // e.preventDefault();
        // Si il y a un token 
        if(decoded) {
            const user_info = {
                id: decoded.userId
            }
            axios.post('http://localhost:4000/app/amis/getPersonne', user_info)
            .then(function(res) {
                setErrorM('');
                setResultat(res.data.resultat);
            })
            .catch(function(error) {
                setErrorM(error.response.data.message);
            })
        }
    }

    // Permet d'ajouter des amis (ajoute la relation entre deux utilisateurs)
    function addFriend(id) {
        return e => {
            e.preventDefault();
            if(decoded) {
                const user_info2 = {
                    idUtilisateur: decoded.userId,
                    idPersonne: id
                }
                axios.post('http://localhost:4000/app/amis/addFriend', user_info2)
                .then(function(res) {
                    var a = document.getElementById(id);
                    var b = document.getElementById(id + 'aa');
                    a.style.display = 'none';
                    b.style.display = 'block';
                })
                .catch(function(error) {
                    console.log(error);
                })
            }
        }
    }


    /* ---------------------------------------------------------------------
    HTML
    ----------------------------------------------------------------------*/


    return (
        <div>
            {decoded && (
                <>
                    <div>
                        {/* Navbar à gauche */}
                        <div>
                            <NavBar/>
                        </div>
                        <div>
                            {/* Permet la recherche d'une personne en particulier pour 
                            l'ajouter en ami (recherche par nom et/ou prénom) */}
                            <div>
                            </div>
                            {/* Div principale avec l'affichage des informations personelles */}
                            <div>
                                <p>Suggestions d'ami :</p>
                                <ul>
                                    {/* On affiche les personnes que l'on a récupéré au 
                                    chargement de la page dans le backend */}
                                    {resultat && resultat.map(item => {
                                        return (
                                            <div key={item.id}>
                                                <form onSubmit={addFriend(item.id)}>
                                                    <li key={item.nom}> {item.nom} {item.prenom}</li>
                                                    <input id={item.id} key={item.id} type="submit" value="Ajouter"/>
                                                    <p id={item.id + 'aa'} style={{display: 'none'}}>Ami ajouté</p>
                                                </form>
                                            </div>
                                        )
                                    })}
                                    {/* Sinon on affiche le chargement */}
                                    {!resultat && !errorM && <p>chargement ...</p>}
                                </ul>
                                {/* Erreur si la recherche dans le back n'a rien fourni*/}
                                {errorM && <p>{errorM}</p>}
                                {/* Refresh la page */}
                                <a href="/Rencontre">D'autres Suggestions</a>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {!decoded && (
                <Redirect to="/Signin"/>
            )}
        </div>
    )
}

export default Amis;