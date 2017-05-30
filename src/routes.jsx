import React from 'react';
import { Route, IndexRoute } from 'react-router';
import axios from "axios";

// Components
import { PageLayout } from './containers/PageLayout';
import { LogPage } from "./containers/Logger";
import { Dashboard } from "./containers/Dashboard";
import { SessionPage, SessionStart, QuestionBox, Question, Result } from "./containers/Session";


/**
* @desc onEnter, check if ths user is connected to enter the admin part.
*/
const isAdmin = (nextState, replaceState, callback) => (
  process.env.SERVER ? (
    callback()
  ) : (
    axios.get( "/api/log" )
    .then( res => res.data && callback() )
    .catch( error => (
      error.response && error.response.status === 401 ? replaceState("/") || callback() : Promise.reject(error)
    ))
    .catch( console.error )
))

/**
* @desc allow to access to the session if : The user is logged.
* If the enter succed, the student is passed on props.params
*/
const accessSession = (nextState, replaceState, callback) => (
  process.env.SERVER ? (
    callback()
  ) : (
    //check if the user is logged
    axios.get( "/api/student/" + nextState.params.label + "/me" )
    .then( res => res.status === 200 && ( nextState.params.student = res.data ) && callback())
    .catch( error => (
      error.response
      && error.response.status === 404 ? ( replaceState( "/" ) || callback() ) : Promise.reject( error )
    ))
  )
)



export default (
  <Route path="/" component={ PageLayout }>
    <IndexRoute component={ LogPage } />

    <Route path="/session/:label" component={ SessionPage } onEnter={ accessSession } />

    <Route path="/admin" component={ Dashboard } onEnter={ isAdmin }/>
  </Route>
);
