import React from 'react';
import { Link } from 'react-router-dom';
import '../style/navbar.css';

import logo from './test.jpg';

// FINI

const NavBar = () => {
    return (
       <aside className="sidebar">
        <nav className="nav"> 
                <div className="photo-profil">
                    <img alt='' className="img-nav" src={logo}/>
                </div>
                <div className="nom">
                    <h1 className="h1-nav">
                        John Smith
                    </h1>
                </div>
                <hr className="hr-nav"></hr>
                {/* Les liens vers les autres pages */}
                <Link to="/">
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
                <Link to="/">
                    <div className="lien">
                        <p className="text-nav">
                            Etc ...
                        </p>
                    </div>
                </Link>
            </nav>
        </aside>
    )
}

export default NavBar