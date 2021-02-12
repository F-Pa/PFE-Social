import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Signup from './Login/Signup';
import Signin from './Login/Signin';
import Mdp from './Login/MdpForgot';
import Test from './Test';
import Profil from './Profil/Profil';
import AffichageAmi from './Amis/AffichageAmi';
import Amis from './Amis/Amis';
import ProfilAmi from './ProfilAmi/ProfilAmi';
import Chat from './Chat/Chat';
import NavBar from './NavBar/NavBar';
import Publication from './Publication/Publication'
import PrintPdf from './Profil/PrintPdf'

function App() {
  return (
    <Router>
    <div className="App">
      <Switch>
        <Route path="/" exact component={Signin}/>
        <Route path="/Signin" component={Signin}/>
        <Route path="/Signup" component={Signup}/>
        <Route path="/Oups" component={Mdp}/>
        <Route path="/Test" component={Test}/>
        <Route path="/Profil" component={Profil}/>
        <Route path="/MesAmis" component={AffichageAmi}/>
        <Route path="/Rencontre" component={Amis}/>
        <Route path="/Navbar" component={NavBar}/>
        <Route path="/ProfilUtilisateur/:id" component={ProfilAmi}/>
        <Route path="/Chat" component={Chat}/>
        <Route path="/Publication" component={Publication}/>
        <Route path="/PrintPdf" component={PrintPdf}/>
      </Switch>
    </div>
  </Router>
  );
}

const Home = () => (
  <div className="App">
  <header className="App-header">
    <p>
      Edit <code>src/App.js</code> and save to reload.
    </p>
    <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn React
    </a>
  </header>
</div>
);

export default App;
