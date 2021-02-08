import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import '../style/ami.css';
import logo from './test.jpg';

import NavBar from '../NavBar/NavBar'

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// TODO : Systeme de recommendation pour optimiser la recherche
// TODO : système de notifications pour l'ajout des amis (si on a le temps)
// TODO : Fixer le recherche (n'affiche pas les amis déjà ajouté)
// TODO : Affichage des images utilisateur (idem AffichageAmi)
// BACKEND fini
// STYLE fini

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
                            <div className="scor">
                                {/* Permet la recherche d'une personne en particulier pour 
                                l'ajouter en ami (recherche par nom et/ou prénom) */}
                                <div className="search-ami">
                                    <h2 className="h2-ami">Rechercher une personne en particulier</h2>
                                    <form className="search" onSubmit={searchFriend}>
                                        <label className="search-name">Nom :</label>
                                        <input
                                            className="champ-search"
                                            type="text"
                                            placeholder="Nom"
                                            value={nom}
                                            onChange={(e) => setNom(e.target.value)}
                                        />
                                        <label className="search-name">Prénom :</label>
                                        <input
                                            className="champ-search"
                                            type="text"
                                            placeholder="Prénom"
                                            value={prenom}
                                            onChange={(e) => setPrenom(e.target.value)}
                                        />
                                        <input
                                            className="button-ami"
                                            type="submit"
                                            value="Rechercher"
                                        />
                                    </form>
                                </div>
                                {/* Affiche les résultats de la recherche */}
                                <div>
                                    <ul>
                                        {/* On affiche les personnes que l'on a récupéré au 
                                        chargement de la page dans le backend */}
                                        {resultatR && resultatR.map(item => {
                                            return (
                                                <>
                                                    {/* Si on a pas la personne en ami, propose de l'ajouter */}
                                                    {item.id && 
                                                    <div className="ami" key={item.id}>
                                                        <form onSubmit={addFriend(item.id)}>
                                                            <li className="card" key={item.id + 'li'}>
                                                                <img className="picture" src={logo} alt=""/>
                                                                <p className="name" key={item.nom}>{item.prenom} {item.nom}</p>
                                                                <a className="a-ami" key={item.id + 'bb'} href={'/ProfilUtilisateur/'+item.id}>Page de profil</a>
                                                                <input className="button" id={item.id} key={item.id} type="submit" value="Ajouter"/>
                                                                <p className="p-ami" id={item.id + 'aa'} style={{display: 'none'}}>Ami ajouté</p>
                                                            </li>
                                                        </form>
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
                                <div id="sugg">
                                    <h2 className="h2-ami">Suggestions d'ami :</h2>
                                    <ul>
                                        {/* On affiche les personnes que l'on a récupéré au 
                                        chargement de la page dans le backend */}
                                        {resultat && resultat.map(item => {
                                            return (
                                                <div className="ami" key={item.id}>
                                                    <form onSubmit={addFriend(item.id)}>
                                                        <li className="card" key={item.nom +'li'}> 
                                                            <img className="picture" src={logo} alt=""/>
                                                            <p className="name" key={item.nom}>{item.prenom} {item.nom}</p>
                                                            <a className="a-ami" key={item.id + 'bb'} href={'/ProfilUtilisateur/'+item.id}>Page de profil</a>
                                                            <input className="button" id={item.id} key={item.id} type="submit" value="Ajouter"/>
                                                            <p className="p-ami" id={item.id + 'aa'} style={{display: 'none'}}>Ami ajouté</p>
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
                                </div>
                                {/* Refresh la page */}
                                <a className="link-ami" href="/Rencontre">D'autres Suggestions</a>
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