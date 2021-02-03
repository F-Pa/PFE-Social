import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// TODO : BACKEND fini / STYLE A FAIRE / LIER PROFIL ET UTILISATEUR


const ProfilPrincipal = () => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère les valeurs dans la base de données pour le profil principal
    const [villebd, setVillebd] = useState('');
    const [ecolebd, setEcolebd] = useState('');
    const [filierebd, setFilierebd] = useState('');
    const [sitebd, setSitebd] = useState('');
    const [matierebd, setMatierebd] = useState('');

    // Récupère les valeurs rentrées par l'utilisateur lors de la modification
    // de son profil principal
    const [ville, setVille] = useState('');
    const [ecole, setEcole] = useState('');
    const [filiere, setFiliere] = useState('');
    const [site, setSite] = useState('');
    const [matiere, setMatiere] = useState('');


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
        getBdd();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Récupère les informations contenues dans la bdd
    function getBdd() {
        // Si il y a un token
        if(decoded) {
            const user_info = {
                id: decoded.userId,
                email: decoded.userEmail
            };
            // Appel au back 
            axios.post('http://localhost:4000/app/profil/getBdd', user_info)
            // Si l'utilisateur a déjà renseigné ses données
            .then(function(res) {
                // on vérifie que chaque champ est renseigné, si ce n'est pas le 
                // cas il est inutile de le modifier
                if(res.data.data.ville) {
                    setVillebd(res.data.data.ville);
                }
                if(res.data.data.ecole) {
                    setEcolebd(res.data.data.ecole);
                }
                if(res.data.data.filiere) {
                    setFilierebd(res.data.data.filiere);
                }
                if(res.data.data.site) {
                    setSitebd(res.data.data.site);
                }
                if(res.data.data.matiere) {
                    setMatierebd(res.data.data.matiere);
                }
            })
            .catch(function(error) {
                console.log(error);
            })
        }
    }

    // Permet de changer l'affichage lorque l'utilisateur clique sur modifier
    // mon profil
    function handleModifyProfil(e) {
        e.preventDefault();
        var a = document.getElementById('data');
        var b = document.getElementById('modify');
        a.style.display = "none";
        b.style.display = "block";
    }


    // Récupère ce que l'utilisateur a renseigné et change les données dans la 
    // bdd avant de réinitialiser l'affichage
    function handleDataProfil(e) {
        e.preventDefault();
        
        if(decoded) {          
            const user_info2 = {
                id: decoded.userId,
                ville: ville,
                ecole: ecole,
                filiere: filiere,
                site: site,
                matiere: matiere
            }
            axios.post('http://localhost:4000/app/profil/createProfil', user_info2)
            .then(function(res) {
                getBdd();
                var a = document.getElementById('data');
                var b = document.getElementById('modify');
                a.style.display = "block";
                b.style.display = "none";
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
        <>
            {/* Div centrale avec les informations à modifier */}
            <div>
                {/* Affichage normal des informations */}
                <div id='data'>
                    <h1>Bienvenue {decoded.userPrenom} {decoded.userNom}</h1>
                    <p>Ville : {villebd}</p>
                    <p>Ecole : {ecolebd}</p>
                    <p>Filière : {filierebd}</p>
                    <p> Site Web : </p>
                    <a href={sitebd} target="_blank" rel="noreferrer">Mon site</a>
                    <p> Matière enseignée : {matierebd}</p>
                    <form onSubmit={handleModifyProfil}>
                        <input
                            type= 'submit'
                            value='Modifier mes infos'
                        />
                    </form>
                </div>
                {/* On affiche cette div si l'utilisateur a souhaité modifier des informations */}
                <div id="modify" style={{display: 'none'}}>
                    <form onSubmit={handleDataProfil}>
                        <h1> Renseignez les champs suivants : </h1>
                        <label>Ville : </label>
                        <input 
                            type='text'
                            placeholder='Ville'
                            value={ville}
                            onChange={(e) => setVille(e.target.value)}
                        />
                        <label>Ecole : </label>
                        <input 
                            type='text'
                            placeholder='Ecole'
                            value={ecole}
                            onChange={(e) => setEcole(e.target.value)}
                        />
                        <label>Filière : </label>
                        <input 
                            type='text'
                            placeholder='Filière'
                            value={filiere}
                            onChange={(e) => setFiliere(e.target.value)}
                        />
                        <label>Site : </label>
                        <input 
                            type='text'
                            placeholder='Adresse du site web'
                            value={site}
                            onChange={(e) => setSite(e.target.value)}
                        />
                        <label>Matière : </label>
                        <input 
                            type='text'
                            placeholder='Matière enseignée'
                            value={matiere}
                            onChange={(e) => setMatiere(e.target.value)}
                        />
                        <input
                            type='submit'
                            value='Enregistrer'
                        />
                    </form>
                </div>
            </div>
        </>
    )
}

export default ProfilPrincipal;