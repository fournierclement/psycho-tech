import React from "react";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { HeadBar } from "./HeadBar.jsx";
import { Footer } from "./Footer.jsx";
import { Home } from "./Home.jsx";

export const App = (props) => (
  <Router>
    <div className="App" >
    <HeadBar />
    <Content>
      {/* Home */}
      <Router exact={true} path="/" render={() => <Home />} />
      {/* Passing Test (session/:id) */}
      <Router path="/session/" render={() => <Test />} />
      {/* Result of a test (result/:id) */}
      <Router path="/results/" render={() => <Results />} />
      {/* Admin (need oauth)*/}
      <Router path="/dashboard/" render={() => <AdminHeadBar />} />
      <Router exact={true} path="/dashboard/" render={() => <SessionPicker />} />
      <Router exact={true} path="/dashboard/sessions" render={() => <SessionPicker />} />
      <Router exact={true} path="/dashboard/modos" render={() => <Moderators />} />
      <Router exact={true} path="/dashboard/me" render={() => <Profile />} />
      {/* universals */}
      <Router path="/login" render={() => <Login />} />
      <Router path="/logout" render={() => <Logout />} />
      <Router path="/accessing" render={() => <Login />} />
    </Content>
    <Footer />
    </div>
  </Router>
)

const Content = ({ children }) => (
  <div className="Content">
    { children }
  </div>
)
