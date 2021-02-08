import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import '../style/ami.css';
import logo from './test.jpg';

import NavBar from '../NavBar/NavBar'

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// TODO : Affichage des images utilisateur (idemAMIS)
// BACKEND fini
// STYLE fini

const AffichageAmi = () => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère les informations sur les amis de l'utilisateur
    const [resultat, setResultat] = useState();


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
        getFriend();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    
    // Permet de récupérer les amis de l'utilisateur dans la bdd
    function getFriend(e) {
        if(decoded) {
            var a = document.getElementById('nofriend');
            const user_info = {
                id: decoded.userId
            }
            axios.post('http://localhost:4000/app/amis/getFriend', user_info)
            .then(function(res) {
                a.style.display = 'none';
                setResultat(res.data.resultat);
            })
            .catch(function(error) {
                a.style.display = 'block';
            })
        }
    }

    // Permet de supprimer un ami
    function removeFriend(id) {
        return e => {
            e.preventDefault();
            if(decoded) {
                const user_info2 = {
                    idUtilisateur: decoded.userId,
                    idPersonne: id
                }
                axios.post('http://localhost:4000/app/amis/removeFriend', user_info2)
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
                        {/* NavBar à gauche */}
                        <div>
                            <NavBar/>
                        </div>
                        {/* On affiche les amis de l'utilisateur */}
                        <div className="test">
                            <div className="scor">
                                <h1>Vos amis :</h1>
                                <ul>
                                    {/* Amis récupérés dans le backend au
                                    chargement de la page */}
                                    {resultat && resultat.map(item => {
                                        return (
                                            <div className="ami" key={item.id}>
                                                <form onSubmit={removeFriend(item.id)}>
                                                    <li className="card" key={item.id + 'li'}>
                                                        <img className="picture" src={logo} alt=""/>
                                                        <p className="name" key={item.nom}>{item.prenom} {item.nom}</p>
                                                        <a className="a-ami" key={item.id + 'bb'} href={'/ProfilUtilisateur/'+item.id}>Page de profil</a>
                                                        <input className="button" id={item.id} key={item.id} type="submit" value="Supprimer"/>
                                                        <p className="p-ami" id={item.id + 'aa'} style={{display: 'none'}}>Ami supprimé</p>
                                                    </li>
                                                </form>
                                            </div>
                                        )
                                    })}
                                </ul>
                            </div>
                            {/* Si ce dernier n'en a pas encore on le redirige vers la page de rencontre */}
                            <div className="div-ami" id='nofriend' style={{display: 'none'}}>
                                <p className="p-a">Vous n'avez pas encore d'ami</p>
                                <Link className="link-ami" to="/Rencontre">
                                    N'hésitez pas à en ajouter
                                </Link>
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

export default AffichageAmi