import React from "react";
import Logger from "Logger.jsx"

/**
* @desc Bar on top of the pages
* @type { leaf }
* @param { String } id, id of the ressourced user.
* @param { String } userGrp, type of user.
*/
export const HeadBar = ({ id, userGrp }) => (
  <div className="HeadBar">
    <div className="HeadBar-leftOption">
      { userGrp === "Commoner" && (
        <Logger value="Admin connection"> </Logger>
      )}
      { userGrp === "Admin" && (
        <Redirect> Dashboard </Redirect>
      )}
      { userGrp === "Student" && (
        <Redirect> resultat </Redirect>
      )}
    </div>
    <div className="HeadBar-centralOption">
      { userGrp === "Admin" ? (
        <Logger value="Ouvrir une Sessions"> </Logger>
      ) : (
        <Logger> Passer le test </Logger>
      )}
    </div>
    <div className="HeadBar-rightOption">
      { userGrp === "Admin" ? (
        <Logout> Déconnexion </Logout>
      ) : (
        <Logger value="Revoir les résultats d'une session"> </Logger>
      )}
    </div>
  </div>
)
