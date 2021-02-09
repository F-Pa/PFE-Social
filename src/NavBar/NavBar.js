import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../style/navbar.css';

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// FINI

const NavBar = () => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère l'image de l'utilisateur dans la bdd
    const [imagebd, setImagebd] = useState();


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
        getImage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Récupère l'image de l'utilisateur au chargement de la page
    function getImage() {
        const user_info3 = {
            id: decoded.userId
        }
        axios.post('http://localhost:4000/app/mongo/getImg', user_info3)
        .then(res => {
            setImagebd(res.data.items);
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
                    <aside className="sidebar">
                    <nav className="nav"> 
                            <div className="photo-profil">
                                {imagebd && imagebd.map(image => {
                                    var src = 'data:'+image.img.contentType+";base64,"+arrayBufferToBase64(image.img.data.data);
                                    return (
                                        <img key={src}  className="img-nav" src={src} alt="profile"/>
                                    )
                                })}
                            </div>
                            <div className="nom">
                                <h1 className="h1-nav">
                                    {decoded.userPrenom} {decoded.userNom}
                                </h1>
                            </div>
                            <hr className="hr-nav"></hr>
                            {/* Les liens vers les autres pages */}
                            <Link to="/Publication">
                                <div className="lien">
                                    <p className="text-nav">
                                        Page d'accueil
                                    </p>
                                </div>
                            </Link>
                            <Link to="/Profil">
                                <div className="lien">
                                    <p className="text-nav">
                                        Profil
                                    </p>
                                </div>
                            </Link>
                            <Link to="/Mesamis">
                                <div className="lien">
                                    <p className="text-nav">
                                        Mes amis
                                    </p>
                                </div>
                            </Link>
                            <Link to="/Rencontre">
                                <div className="lien">
                                    <p className="text-nav">
                                        Ajouter des amis
                                    </p>
                                </div>
                            </Link>
                            <Link to="/Chat">
                                <div className="lien">
                                    <p className="text-nav">
                                        Ma messagerie
                                    </p>
                                </div>
                            </Link>
                        </nav>
                    </aside>
                </>
            )}
        </div>
    )
}

export default NavBar