import React from 'react';

const NavBar = () => {
    return (
        //  TODO Div à gauche avec photo de profil, amis et centre d'intérêts (SIDEBAR)
        <div>
            <p>Photo de profil TMTC</p>
            <p>Nom Prénom</p>
            {/* Les liens vers les autres pages */}
            <div>
                <p>Page d'accueil</p>
                <p>Profil</p>
                <p>Mes amis</p>
                <p>Ajouter des connaissances</p>
                <p>Messagerie</p>
                <p>Etc ...</p>
            </div>
        </div>
    )
}

export default NavBar