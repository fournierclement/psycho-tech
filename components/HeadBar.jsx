import React from "react";
import { Logger, EmailLog, PassLog, SessionsLog, SessionsCodeLog } from "./Logger.jsx";

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
        <Logger value="Admin connection">
          <EmailLog />
          <PassLog />
        </Logger>
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
        <Logger value="Ouvrir une Sessions">
          <SessionsLog />
          <SessionsCodeLog />
          <PassLog />
        </Logger>
      ) : (
        <Logger value="Passer le test"> </Logger>
      )}
    </div>
    <div className="HeadBar-rightOption">
      { userGrp === "Admin" ? (
        <Logout> Déconnexion </Logout>
      ) : (
        <Logger value="Revoir les résultats d'une session">
          <SessionsLog />
          <SessionsCodeLog />
          <PassLog />
        </Logger>
      )}
    </div>
  </div>
)

const Redirect = ({ children }) => (<a href="#"> { children } </a>)
const Logout = ({ children }) => (<a href="#"> { children } </a>)
