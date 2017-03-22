import React from "react";
import ReactDom from "react-dom";
import { Page } from "./Page.jsx";

const id = "nop";
const userGrp = "Commoner";
const pageTitle = "home";

ReactDom.render(
  <Page id={ id } userGrp={ userGrp } pageTitle={ pageTitle } />,
  document.getElementById('app')
)
