import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Permet de décoder le token dans la sessionStorage
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// TODO : BACKEND fini / STYLE A FAIRE


const ProfilPrincipalAmi = (urlid) => {
    /* ---------------------------------------------------------------------
    Variables
    ----------------------------------------------------------------------*/


    // Récupère les valeurs dans la base de données pour le profil principal
    const [villebd, setVillebd] = useState('');
    const [ecolebd, setEcolebd] = useState('');
    const [filierebd, setFilierebd] = useState('');
    const [sitebd, setSitebd] = useState('');
    const [matierebd, setMatierebd] = useState('');
    const [nombd, setNombd] = useState('');
    const [prenombd, setPrenombd] = useState('');


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
        getName();
        isFriend();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Récupère les informations contenues dans la bdd
    function getBdd() {
        // Si il y a un token
        if(decoded) {
            const user_info = {
                id: urlid.props.match.params.id
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


    // Récupère le nom et le prénom de l'utilisateur
    function getName() {
        // Si token il y a
        if(decoded) {
            const user_info2 = {
                id: urlid.props.match.params.id
            };
            axios.post('http://localhost:4000/app/profil/getName', user_info2)
            .then(function(res) {
                setNombd(res.data.data.nom);
                setPrenombd(res.data.data.prenom);
            })
            .catch(function(error) {
                console.log(error);
            })
        }
    }

    
    // Permet de savoir si la personne est déjà amie avec l'utilisateur
    function isFriend() {
        if(decoded) {
            const user_info3 = {
                idUtilisateur: decoded.userId,
                idPersonne: urlid.props.match.params.id
            }
            axios.post('http://localhost:4000/app/amis/isFriend', user_info3)
            .then(function(res) {
                if(res.data.mes) {
                    var c = document.getElementById('sub');
                    var d = document.getElementById('bb');
                    c.style.display = 'none';
                    d.style.display = 'block';
                }
            })
            .catch(function(error) {
                console.log(error);
            })
        }
    }


    // Permet d'ajouter des amis (ajoute la relation entre deux utilisateurs)
    function addFriend(e) {
        e.preventDefault();
        if(decoded) {
            const user_info4 = {
                idUtilisateur: decoded.userId,
                idPersonne: urlid.props.match.params.id
            }
            axios.post('http://localhost:4000/app/amis/addFriend', user_info4)
            .then(function(res) {
                var a = document.getElementById('sub');
                var b = document.getElementById('aa');
                a.style.display = 'none';
                b.style.display = 'block';
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
                    {/* Div centrale avec les informations à modifier */}
                    <div>
                        <div>
                            <p>Image des familles</p>
                        </div>
                        {/* Affichage normal des informations */}
                        <div id='data'>
                            <h1>Profil de : {prenombd} {nombd}</h1>
                            <p>Ville : {villebd}</p>
                            <p>Ecole : {ecolebd}</p>
                            <p>Filière : {filierebd}</p>
                            <p> Site Web : </p>
                            <a href={sitebd} target="_blank" rel="noreferrer">Mon site</a>
                            <p> Matière enseignée : {matierebd}</p>
                        </div>
                        <div>
                            <form onSubmit={addFriend}>
                                <input id='sub' type="submit" value="Ajouter"/>
                                <p id='bb' style={{display: 'none'}}>Vous êtes déjà ami</p>
                                <p id='aa' style={{display: 'none'}}>Ami ajouté</p>
                            </form>
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

export default ProfilPrincipalAmi;