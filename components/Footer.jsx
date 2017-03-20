import React from "react";

/**
* @desc Footer to place on each web page.
* @type Stateless Component
*/
export const Footer = ({ user }) => {
  return (
    <footer id="Footer" className="ui inverted vertical footer segment">
      <div className="ui center aligned container">
        <div className="ui stackable inverted divided grid">
        <Options />
        <ShortWord />
        </div>
        <div className="ui inverted section divider">
        </div>
        <img src="favicon.ico" className="ui centered mini image" />
        <InfoLegal />
      </div>
    </footer>
  )
}

const Options = ({ modo }) => (
  <div id="Options" className="seven wide column">
    <h4 className="ui inverted header"> WIP </h4>
    <div className="ui inverted link list">
      { modo ? (
        <a href="" className="item"> Déconnexion </a>
      ) : (
        <a href="" className="item"> Connexion </a>
      )}
    </div>
  </div>
)

const ShortWord = () => {
  return (
    <div id="ShortWord" className="nine wide column">
    <h4 className="ui inverted header"> WIP </h4>
    <p> coucou </p>
    </div>
  )
}

const InfoLegal = () => {
  return (
    <div id="InfoLegal" className="ui horizontal inverted small divided link list">
      <div className="ui inverted section">
        <p> WIP </p>
      </div>
    </div>
  )
}
