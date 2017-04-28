import React from "react";
import { Link } from "react-router";

/**
* @desc Bar on top of the pages
* @type { leaf }
* @param { String } id, id of the ressourced user.
* @param { String } userGrp, type of user.
*/
/**
* Use Cases :
  => Visitor : Connexion admin | Bouton passer test | Voir resultats
  => student : Show Id | Bouton passer test | quitter
  => Admin : Dashboard | Creer une sessions de test | Deconnexion
*/
export const HeadBar = ({ log }) => (
  <div className="HeadBar">
    <Link to="/"> Retour à l'accueil </Link>
  </div>
)
