import React from "react";
import { Footer } from "./Footer.jsx";
import { HeadBar } from "./HeadBar.jsx";

export const Home = ( props ) => (
  <div id="Home">
    <HeadBar { ...props } />
    <Content>
      <Wiki />
      <Explanation>
        <Spoiler />
      </Explanation>
    </Content>
    <Footer />
  </div>
)

/**
* @desc content div meants for display text
* @type { node }
*/
const Content = ({ children }) => (
  <div className="Content">
    { children }
  </div>
)

/**
* @desc Wiki to show wiki point
* @type { node }
*/
const Wiki = ({ children }) => (
  <div className="Wiki">
    { children }
  </div>
)

/**
* @desc breive Explanation of the test mecanics
* @type { node }
*/
const Explanation = ({ children }) => (
  <div className="Explanation">
    { children }
  </div>
)

/**
* @desc show/hide a panel
* @type { node }
*/
const Spoiler = ({ children }) => (
  <div className="Spoiler">
    { children }
  </div>
)
