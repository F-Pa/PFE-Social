import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// BACKEND Fini / STYLE A FAIRE

const ProfilCours = () => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère le pdf upload par l'utilisateur
    const [pdf, setPdf] = useState();
    const [nom, setNom] = useState('');

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

    // Upload le pdf dans la bdd Mongo
    function handlePdf(e) {
        e.preventDefault();
        if(decoded) {
            console.log(pdf);
            const data = new FormData();
            data.append('id', decoded.userId);
            data.append('titre', nom);
            data.append('file', pdf);
            axios.post('http://localhost:4000/app/mongo/storePdf', data)
            .then(res => {
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    // Récupère les pdfs de l'utilisateur
    function getPdf() {
        const user_info = {
            id: decoded.userId
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
                    <p>Mes cours :</p>
                    {pdfBd && pdfBd.map(element => {
                        var src = 'data:'+element.pdf.contentType+';base64,'+arrayBufferToBase64(element.pdf.data.data);
                        return (
                            <div key={element.titre + 'rr'}>                            
                                <Link key={element.titre + 'tt'} to={{
                                    pathname: '/PrintPdf',
                                    state: {src}
                                }}>
                                    {element.titre}
                                </Link>
                            </div>

                        )
                    })}
                    <div>
                        <form onSubmit={handlePdf}>
                            <input required type="text" placeholder="Titre du pdf" value={nom} onChange={(e) => setNom(e.target.value)}/>
                            <input type="file" accept=".pdf" onChange={(e) => setPdf(e.target.files[0])}/>
                            <input type="submit" value="Ajouter"/>
                        </form>
                    </div>
                </>
            )}
            {!decoded && (
                <div></div>
            )}
        </div>
    )
}

export default ProfilCours