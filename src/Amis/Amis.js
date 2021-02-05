import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import NavBar from '../NavBar/NavBar'

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// TODO : Systeme de recommendation pour optimiser la recherche
// TODO : système de notifications pour l'ajout des amis
// TODO : Affichage des images utilisateur (idem AffichageAmi)
// BACKEND fini
// TODO : STYLE A FAIRE

const Amis = () => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère les informations sur les personnes qui sont dans la base
    // de données pour les afficher
    const [resultat, setResultat] = useState();
    // Et les résultats de la recherche
    const [resultatR, setResultatR] = useState();

    // Récupère les noms et prénoms pour la recherche de personne
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');

    // Affiche une erreur si personne n'a été trouvée
    const [errorM, setErrorM] = useState('');
    const [errorR, setErrorR] = useState('');


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

    // Permet de rechercher une personne par son nom et/ou son prénom
    function searchFriend(e) {
        e.preventDefault();
        if(decoded) {
            const user_info3 = {
                id: decoded.userId,
                nom: nom,
                prenom: prenom
            }
            axios.post('http://localhost:4000/app/amis/searchFriend', user_info3)
            .then(function(res) {
                setErrorR('');
                setResultatR(res.data.resultat);
            })
            .catch(function(error) {
                console.log('popo');
                setErrorR(error.response.data.message);
            })
            if(resultatR) {
                var c = document.getElementById('res-re');
                c.style.display = 'block';
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
                        <div className="test">
                            {/* Permet la recherche d'une personne en particulier pour 
                            l'ajouter en ami (recherche par nom et/ou prénom) */}
                            <div>
                                <p>Rechercher une personne en particulier</p>
                                <form onSubmit={searchFriend}>
                                    <label>Nom</label>
                                    <input
                                        type="text"
                                        placeholder="Nom"
                                        value={nom}
                                        onChange={(e) => setNom(e.target.value)}
                                    />
                                    <label>Prénom</label>
                                    <input
                                        type="text"
                                        placeholder="Prénom"
                                        value={prenom}
                                        onChange={(e) => setPrenom(e.target.value)}
                                    />
                                    <input
                                        type="submit"
                                        value="Rechercher"
                                    />
                                </form>
                            </div>
                            {/* Affiche les résultats de la recherche */}
                            <div>
                                <p id="res-re" style={{display: 'none'}}>Résultat de la recherche : </p>
                                <ul>
                                    {/* On affiche les personnes que l'on a récupéré au 
                                    chargement de la page dans le backend */}
                                    {resultatR && resultatR.map(item => {
                                        return (
                                            <>
                                                {/* Si on a pas la personne en ami, propose de l'ajouter */}
                                                {item.id && 
                                                <div key={item.id}>
                                                    <form onSubmit={addFriend(item.id)}>
                                                        <li key={item.id + 'li'}> 
                                                            <p>Image des familles</p>
                                                            <p key={item.nom}> {item.nom} {item.prenom}</p>
                                                            <a key={item.id + 'bb'} href={'/ProfilUtilisateur/'+item.id}>Page de profil</a>
                                                            <input id={item.id} key={item.id} type="submit" value="Ajouter"/>
                                                            <p id={item.id + 'aa'} style={{display: 'none'}}>Ami ajouté</p>
                                                        </li>
                                                    </form>
                                                </div>}
                                                {/* Sinon affiche qu'elle est déjà notre ami */}
                                                {item.idF && 
                                                <div key={item.idF}>
                                                    <li key={item.idF + 'li'}>
                                                        <p>Image des familles</p>
                                                        <p key={item.nomF}> {item.nomF} {item.prenomF}</p>
                                                        <a key={item.idF + 'bb'} href={'/ProfilUtilisateur/'+item.idF}>Page de profil</a>
                                                        <p id={item.idF + 'aa'}>Ami déjà ajouté</p> 
                                                    </li>
                                                </div>}
                                            </>
                                        )
                                    })}
                                </ul>
                                {/* Sinon on affiche l'erreur */}
                                {errorR && <p>{errorR}</p>}
                            </div>
                            {/* Div principale avec l'affichage des informations personelles
                            (Au chargement de la page) */}
                            <div>
                                <p>Suggestions d'ami :</p>
                                <ul>
                                    {/* On affiche les personnes que l'on a récupéré au 
                                    chargement de la page dans le backend */}
                                    {resultat && resultat.map(item => {
                                        return (
                                            <div key={item.id}>
                                                <form onSubmit={addFriend(item.id)}>
                                                    <li key={item.nom +'li'}> 
                                                        <p>Image des familles</p>
                                                        <p key={item.nom}> {item.nom} {item.prenom}</p>
                                                        <a key={item.id + 'bb'} href={'/ProfilUtilisateur/'+item.id}>Page de profil</a>
                                                        <input id={item.id} key={item.id} type="submit" value="Ajouter"/>
                                                        <p id={item.id + 'aa'} style={{display: 'none'}}>Ami ajouté</p>
                                                    </li>
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