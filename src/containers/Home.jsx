import React from "react";

export const Home = ( props ) => (
  <div id="Home">
    Ceci est un home
    <Wiki />
    <Explanation>
      <Spoiler />
    </Explanation>
  </div>
)

/**
* @desc Wiki to show wiki point
* @type { node }
*/
const Wiki = ({ children }) => (
  <div className="Wiki">
  Ceci est un wiki dans l'home
    { children }
  </div>
)

/**
* @desc breive Explanation of the test mecanics
* @type { node }
*/
const Explanation = ({ children }) => (
  <div className="Explanation">
    Ceci est une explication dans home
    { children }
  </div>
)

/**
* @desc show/hide a panel
* @type { node }
*/
const Spoiler = ({ children }) => (
  <div className="Spoiler">
    Ceci est un spoiler dans un Explanation dans home
    { children }
  </div>
)
