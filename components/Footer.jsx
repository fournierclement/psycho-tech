import React from "react";
import ReactDom from "react-dom";

/**
* @desc Footer to place on each web page.
*/
export const Footer = ({user}) => (
  <footer id="Footer" className="ui inverted vertical footer segment">
    <div className="ui center aligned container">
      <div className="ui stackable inverted divided grid">
        <div className="seven wide column">
          <h4 className="ui inverted header"> Plan du site </h4>
          <div className="ui inverted link list">
            <a href="" className="item"> Accueil </a>
            { user && ( !user.admin ? (
              <a href="" className="item"> Questionnaire </a>
            ) : (
              <a href="" className="item"> Statistiques </a>
              <a href="" className="item"> Dashboard </a>
            ))}
            { user ? (
              <a href="" className="item"> Mon Profil </a>
              <a href="" className="item"> Déconnexion </a>
            ) : (
              <a href="" className="item"> S\'enregistrer </a>
              <a href="" className="item"> Connexion </a>
            ))}
          </div>
        </div>
        <div className="nine wide column">
          <h4 className="ui inverted header"> Création du site </h4>
          <p> Ce site a été réalisé dans le cadre d'un projet scolaire. </p>
          <p>
            Basé sur du pur MVC PHP et mise en forme par
            <a href="http://semantic-ui.com/" title="Framework CSS" target="_blank">
              Semantic-UI
            </a>
          </p>
          <p>
            Voir le dépôt officiel :
            <a href="https://github.com/kevinhassan/PiscineProjectIG3" target="_blank">
              <i className="github icon"></i>
            </a>
          </p>
        </div>
      </div>
      <div className="ui inverted section divider">
      </div>
      <img src="favicon.ico" className="ui centered mini image">
      <div className="ui horizontal inverted small divided link list">
        <a className="item" href="#"> Plan du site </a>
        <a className="item" href="#"> Nous contacter </a>
        <a className="item" href="#"> Termes & Conditions </a>
        <a className="item" href="#"> Politique de vie privée </a>
        <div className="ui inverted section">
          <p> Kévin Hassan <i className="copyright icon"></i> 2017 </p>
        </div>
      </div>
    </div>
  </footer>
)
