import React from "react";
import { Home } from "./Home.jsx";

export const Page = ({ pageTitle }) => {
  switch (pageTitle) {
    case "test":
      return ( <Test />)
    case "sessions":
      return ( <Sessions /> )
    case "home":
    default :
      return ( <Home /> )
  }
}
