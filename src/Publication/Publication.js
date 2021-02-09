import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import NavBar from '../NavBar/NavBar'
import PubImage from './PubImage'
import '../style/publication.css'

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// FINI

const Publication = () => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère le texte de la publication
    const [text, setText] = useState('');

    // Récupère les publications
    const [publi, setPubli] = useState('');


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
        getPub();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Récupère les publications
    function getPub() {
        if(decoded) {
            const user_info = {
                id: decoded.userId
            };
            axios.post('http://localhost:4000/app/pub/getPub', user_info)
            .then(function(res) {
                setPubli(res.data.resultat.reverse());
            })
            .catch(function(error) {
                console.log(error);
            })
        }
    }

    // Soumet la publication 
    function handleSubmit(e) {
        e.preventDefault();
        if(decoded) {
            var d = new Date();
            const p = d.getMonth() + 1;
            const date = d.getDay() + '/' + p + '/' + d.getFullYear() + ' | ' + d.getHours() + ':' + d.getMinutes();
            const pub_info = {
                id: decoded.userId,
                nom: decoded.userNom,
                prenom: decoded.userPrenom,
                contenu: text,
                date: date,
                dt: Date.now().toString()
            }
            axios.post('http://localhost:4000/app/pub/addPub', pub_info)
            .then(function(res) {
                window.location.reload();
            })
            .catch(function(error) {
                console.log(error);
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
                        <NavBar/>
                    </div>
                    <div className="yyui">
                        <div className="pub">
                            <h2 className='h2-pub'>Ajouter une publication</h2>
                            <form onSubmit={handleSubmit}>
                                <textarea 
                                    id="ok"
                                    className="input-pub"
                                    required
                                    placeholder='Contenu'
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <input className="button-pub"
                                    type='submit'
                                    value="Créer"
                                />
                            </form>
                        </div>
                        <div className="pub-test">
                            <div id="page">
                                <h1 className="h1-pub">Publications : </h1>
                                {publi && publi.map(item => {
                                    return(
                                        <div key={item.dt + 'aa'} id="tweet">
                                            <div key={item.dt + 'bb'} className="tweet-container pt pb pr pl">
                                                <div key={item.dt + 'cc'} className="user pr">
                                                    <PubImage data={item.id}/>
                                                    <div key={item.dt + 'dd'} className="username">
                                                        <div key={item.dt + 'ff'} className="name">{item.prenom} {item.nom}</div>
                                                    </div>
                                                    <div key={item.dt+'ee'} className="tweet-content pt">
                                                        {item.msg} 
                                                    </div>
                                                    <div key={item.dt+ 'gg'} className="date pt pb">{item.date}</div>
                                                </div>
                                            </div>
                                            <hr key={item.dt}/>
                                        </div>
                                    )
                                })}
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

export default Publication