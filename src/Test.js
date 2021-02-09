import React from 'react';

import NavBar from './NavBar/NavBar'
import './style/publication.css'

const Test = () => {
    return(
        <div>
            <div>
                <NavBar/>
            </div>
            <div>
                <div id="page">
                    <div id="tweet">
                        <div className="tweet-container pt pb pr pl">
                            <div className="user pr">
                                <img src="https://pbs.twimg.com/profile_images/794666855457849349/c9qbCWTA_400x400.jpg"/>
                                <div className="username">
                                    <div className="name">ʀomain</div>
                                </div>
                            </div>
                            <div className="tweet-content pt">Bonjour! I've created this HTML template based on Twitter's UI. Follow me on Dribbble 
                            </div>
                            <img className="media" src="https://i.giphy.com/media/26ufp2LYURTvL5PRS/giphy.webp"/>
                            <div className="date pt pb">4:20 pm • 1 Oct 17 </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )  
}

export default Test;