import React from "react";
import { Link } from "react-router";

/**
* @desc Bar on top of the pages
* @type { leaf }
* @param { String } id, id of the ressourced user.
* @param { String } userGrp, type of user.
*/
export const HeadBar = ({ location }) => (
  <div className="HeadBar">
    <Link to="/"> Retour à l'accueil </Link>
    { location.pathname === "/statements" && (
      <Link to="/admin"> Gestion des sessions </Link>
    )}
    { location.pathname === "/admin" && (
      <Link to="/statements"> Modifier les propositions </Link>
    )}
  </div>
)
