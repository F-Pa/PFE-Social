import React, { useEffect, useState } from 'react'
import axios from 'axios';

const PubImage = (data) => {
    const [imagebd, setImagebd] = useState();

    // Au chargement de la page on affiche les informations contenues dans la bdd
    useEffect(() => {
        getImage(data.data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Récupère l'image de l'utilisateur au chargement de la page
    function getImage(id) {
        console.log('ici');
        const user_info3 = {
            id: id
        }
        axios.post('http://localhost:4000/app/mongo/getImg', user_info3)
        .then(res => {
            var src = 'data:'+res.data.items[0].img.contentType+";base64,"+arrayBufferToBase64(res.data.items[0].img.data.data);
            setImagebd(src);
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

    return(
        <div>
            <img alt='' className="picture-pub" src={imagebd}/>
        </div>
    )  
}

export default PubImage;