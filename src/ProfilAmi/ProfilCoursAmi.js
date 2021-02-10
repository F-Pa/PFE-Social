import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// BACKEND Fini / STYLE A FAIRE

const ProfilCoursAmi = (urlid) => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère les pdfs de l'utilisateur dans la bdd
    const [pdfBd, setPdfBd] = useState();


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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


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
                </>
            )}
            {!decoded && (
                <div></div>
            )}
        </div>
    )
}

export default ProfilCoursAmi