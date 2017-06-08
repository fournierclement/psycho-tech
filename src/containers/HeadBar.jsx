import React from "react";
import { Link } from "react-router";

/**
* @desc Bar on top of the pages
* @type { leaf }
* @param { String } id, id of the ressourced user.
* @param { String } userGrp, type of user.
*/
export const HeadBar = ({ log }) => (
  <div className="HeadBar">
    <Link to="/"> Retour à l'accueil </Link>
  </div>
)
