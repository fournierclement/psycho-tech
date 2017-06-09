import Express from "express";
import parser from "body-parser";
import cookie from "cookie-session";

import DB from "../middlewares/DB";
import { hash, validate } from "../middlewares/password";
import isAdmin from "../middlewares/isAdmin";

import sessions from "./sessions";
import students from "./students";

const api = Express.Router();

api.use(
  parser.urlencoded({ extended: false }), //req.params
  parser.json(),                          //req.body
  cookie({ name: "session", keys: ["Riasec", "Polytech"], maxAge: 0 }) //req.session
)

/**
* @desc Logging route for admin
* @route POST api/log
* @param {String} identifier
* @param {String} password
* GIVE A COOKIE
*/
api.post( "/log", (req, res) => (
  Promise.resolve( req.body )
  .then(({ email, password }) => (
    DB.getAdmin( email )
    .then( logPass => (( logPass && validate( logPass, password )) ? (
      ( req.session.isAdmin = true ) && res.send( true ).status( 200 )
    ) : ( res.sendStatus( 401 ))
    ))
  ))
  .catch( error => console.error( error ) || res.sendStatus( 500 ))
));

/**
* @desc Logging route for admin
* @route GET api/log
* Check the COOKIE
*/
api.get( "/log", (req, res) => (
  Promise.resolve( req.session )
  .then( session => session.isAdmin ? res.send( true ).status( 200 ) : res.sendStatus( 401 ))
  .catch( error => console.error( error ) || res.sendStatus( 500 ))
));

/******************************************************************************/
/*************************** SESSIONS & CHARTS DATA ***************************/
/******************************************************************************/
api.use( "/sessions", sessions );
/******************************************************************************/
/********************************* STUDENTS ***********************************/
/******************************************************************************/
api.use( "/student", students );
/******************************************************************************/
/********************************* QUESTIONS **********************************/
/******************************************************************************/

api.get( "/statements/", (req, res) => (
  DB.getAllStatementSets()
  .then( statementSets => res.json( statementSets ))
  .catch( error => console.error( error ) || res.sendStatus( 500 ))
))

/**
* @desc get the desired set of affirmations.
* @route GET /api/statements/:statementSet
*/
api.get( "/statements/:statementSet", (req, res) => (
  DB.getStatementSet( req.params.statementSet )
  .then( statementSet => statementSet ? res.status( 200 ).json( statementSet ) : res.sendStatus( 404 ))
  .catch( error => console.error( error ) || res.sendStatus( 500 ))
))

/**
* @desc get the desired set of affirmations.
* @route GET /api/statements/:statementSet
*/
api.post( "/statements/:statementSet/:statement", (req, res) => (
  DB.setStatement( req.params.statementSet, req.params.statement, req.body.text )
  .then( ok => res.sendStatus( 204 ))
  .catch( error => console.error( error ) || res.sendStatus( 500 ))
))

export default api;
