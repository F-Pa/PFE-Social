import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'

import Amiimage from '../Amis/Amiimage'

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Fini

const ProfilCoursAmi = (urlid) => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère les pdfs de l'utilisateur dans la bdd
    const [pdfBd, setPdfBd] = useState();

    // Récupère les informations sur les amis de l'utilisateur
    const [resultat, setResultat] = useState();


    /* ---------------------------------------------------------------------
    JS
    ----------------------------------------------------------------------*/


    // Récupère les informations du token
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
        getPdf();
        getFriend();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Permet de récupérer les amis de l'utilisateur dans la bdd
    function getFriend() {
        if(decoded) {
            var a = document.getElementById('nofriend');
            const user_info = {
                idu: decoded.userId,
                idp: urlid.props.match.params.id
            }
            axios.post('http://localhost:4000/app/amis/getFriendBis', user_info)
            .then(function(res) {
                a.style.display = 'none';
                setResultat(res.data.resultat);
            })
            .catch(function(error) {
                a.style.display = 'block';
            })
        }
    }


    // Récupère les pdfs de l'utilisateur
    function getPdf() {
        const user_info = {
            id: urlid.props.match.params.id
        };
        axios.post('http://localhost:4000/app/mongo/getPdf', user_info)
        .then(res => {
            setPdfBd(res.data.items);
        })
        .catch(error => {
            console.log(error);
        })
    }

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));        
        bytes.forEach((b) => binary += String.fromCharCode(b));        
        return window.btoa(binary);
    };


    /* ---------------------------------------------------------------------
    HTML
    ----------------------------------------------------------------------*/

    
    return (
        <div>
            {decoded && (
                <>
                <div className="info-box-profil">
                    <h2>Ses cours :</h2>
                    {pdfBd && pdfBd.map(element => {
                        var src = 'data:'+element.pdf.contentType+';base64,'+arrayBufferToBase64(element.pdf.data.data);
                        return (
                            <div className="pdf-di" key={element.titre + 'rr'}>
                                <li key={element.titre + 'ii'} className="li-c">
                                    <FontAwesomeIcon size="3x" className="ic-pr" icon={faFilePdf}/>
                                    <Link className="li-li" key={element.titre + 'tt'} to={{
                                        pathname: '/PrintPdf',
                                        state: {src}
                                    }}>
                                        {element.titre}
                                    </Link>
                                </li>
                            </div>

                        )
                    })}
                </div>
                <div className="info-box-profil">
                    <h2>Ses amis :</h2>
                    <ul>
                        {/* Amis récupérés dans le backend au
                        chargement de la page */}
                        {resultat && resultat.map(item => {
                            return (
                                <div className="ami" key={item.id}>
                                    <li className="card-spec" key={item.id + 'li'}>
                                        <Amiimage data={item.id}/>
                                        <p className="name" key={item.nom}>{item.prenom} {item.nom}</p>
                                        <a className="a-ami" key={item.id + 'bb'} href={'/ProfilUtilisateur/'+item.id}>Page de profil</a>
                                    </li>
                                </div>
                            )
                        })}
                    </ul>
                    <div className="div-ami" id='nofriend' style={{display: 'none'}}>
                        <p className="p-a">Cette personne n'a pas d'ami</p>
                    </div>
                </div>
                </>
            )}
            {!decoded && (
                <div></div>
            )}
        </div>
    )
}

export default ProfilCoursAmi