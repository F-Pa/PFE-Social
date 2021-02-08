import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

import '../style/chat.css'

import NavBar from '../NavBar/NavBar'

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// TODO : BACKEND fini / STYLE fini
// TODO : Gérer les websockets pour des messages en temps réel

const Chat = () => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère les informations sur les amis de l'utilisateur
    const [resultat, setResultat] = useState();
    // Récupère les messages de l'utilisateur
    const [message, setMessage] = useState();

    // Récupère le message écrit par l'utilisateur
    const [messageE, setMessageE] = useState('');

    // Récupère l'id de la personne avec qui l'utilisateur veut discuter
    const [idp, setIdp] = useState('');

    // Si la discussion n'a pas encore de message
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
        getFriend();
        // eslint-disable-next-line
    }, []);

    
    // Permet de récupérer les amis de l'utilisateur dans la bdd
    function getFriend() {
        if(decoded) {
            const user_info = {
                id: decoded.userId
            }
            axios.post('http://localhost:4000/app/amis/getFriend', user_info)
            .then(function(res) {
                setResultat(res.data.resultat);
            })
            .catch(function(error) {
                console.log(error);
            })
        }
    }


    // Permet d'afficher les messages de la conversations séctionnées
    function handleClick(id) {
        return e => {
            e.preventDefault();
            if(decoded) {
                setIdp(id);
                const user_info2 = {
                    idu : decoded.userId,
                    idp: idp
                }
                axios.post('http://localhost:4000/app/chat/getDiscussion', user_info2)
                .then(function(res) {
                    setErrorM('');
                    setMessage(res.data.resultat);
                })
                .catch(function(error) {
                    setErrorM(error.response.data.message);
                    setMessage();
                    var a = document.getElementById('nomessage');
                    a.style.display = 'block';
                })
            }
        }
    }


    // Envoie le message et le crée dans la base de donnée
    function handleMessage(e) {
        e.preventDefault();
        var d = new Date();
        const p = d.getMonth() + 1;
        const date = d.getDay() + '/' + p + '/' + d.getFullYear() + ' | ' + d.getHours() + ':' + d.getMinutes();
        if(decoded) {
            const user_info3 = {
                idu: decoded.userId,
                idp: idp,
                message: messageE,
                date: date,
                dt: Date.now().toString()
            }
            axios.post('http://localhost:4000/app/chat/writeMessage', user_info3)
            .then(function(res) {
                var b = document.getElementById("input_msg");
                b.value = "";
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
                    <div className="test_bis">
                        <div className="container">
                            <div className="messaging">
                                <div className="inbox_msg">
                                    <div className="inbox_people">
                                        <div className="headind_srch">
                                            <div className="recent_heading">
                                                <h4>Messages</h4>
                                            </div>
                                        </div>
                                        <div className="inbox_chat">
                                            {resultat && resultat.map(item => {
                                                return (
                                                    <button key={item.id + 'bu'} onClick={handleClick(item.id)} className="button_list">
                                                        <div key={item.id + 'tr'} className="chat_list">
                                                            <div key={item.id + 're'} className="chat_people">
                                                                <div key={item.id+'tr'} className="chat_ib">
                                                                    <h5 key={item.id + 'hh'}>{item.prenom} {item.nom}</h5>
                                                                    <p key={item.id + 'pp'}>Continuez votre discussion</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                            {!resultat && (
                                                <div id='nofriend' style={{display: 'none'}}>
                                                    <p>Vous n'avez pas encore d'ami</p>
                                                    <Link to="/Rencontre">
                                                        N'hésitez pas à en ajouter
                                                    </Link>
                                                </div>
                                            )}                                            
                                        </div>
                                    </div>
                                    <div className="mesgs">
                                        <div className="msg_history">
                                            {message && message.map(item => {
                                                if(item.id === decoded.userId) {
                                                    return (
                                                        <div key={item.dt + 'fx'} className="outgoing_msg">
                                                            <div key={item.dt + 'am'} className="sent_msg">
                                                                <p key={item.dt+'nb'}>{item.message}</p>
                                                                <span key={item.dt + 'hg'} className="time_date">{item.date}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                else {
                                                    return (
                                                        <div key={item.dt + 'qs'} className="incoming_msg">
                                                            <div key={item.dt + 'xc'} className="received_msg">
                                                                <div key={item.dt + 'vb'} className="received_withd_msg">
                                                                    <p key={item.dt + 'pp'}>{item.message}</p>
                                                                    <span key = {item.dt + 'sp'} className="time_date">{item.date}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                            })}
                                            <div id='nomessage' style={{display: 'none'}}>
                                                {errorM && <p>{errorM}</p>}
                                            </div>  
                                        </div>
                                        <div className="type_msg">
                                            <div className="input_msg_write">
                                                <input id="input_msg" onChange={(e) => setMessageE(e.target.value)} type="text" className="write_msg" required placeholder="Type a message" />
                                                <button onClick={handleMessage} className="msg_send_btn" type="button"><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

export default Chat;