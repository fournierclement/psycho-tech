import { Router } from "express";

import DB from "../middlewares/DB";
import isAdmin from "../middlewares/isAdmin";

const router = Router();

/**
* @desc Creation of a new session.
* @route POST api/sessions.
* @param {String, String} label, code.
*/
router.post( "/", isAdmin, (req, res) => {
  //errors
  const INFOMISS = "info missing";
  const EXISTS = "already exists";
  let newSession = req.body.session
  //Try insertion.
  Promise.resolve( newSession && newSession.label && newSession.code)
  .then( info => !info ? Promise.reject( INFOMISS ) : (
    DB.newOneSession( newSession.label, newSession )
  ))
  .then( done => res.sendStatus( 200 ))
  .catch( error => error === EXISTS ? res.status(403).send(error) : Promise.reject(error))
  .catch( error => error === INFOMISS ? res.status(403).send(error) : Promise.reject(error))
  .catch( error => console.error(error) || res.sendStatus(500))
});

/**
* @desc Route to get all the known sessions.
* @route Get api/sessions
* @respond { [Object] } array of sessions.
*/
router.get( "/", isAdmin, (req, res) => {
  DB.getAllSession()
  .then( sessions => res.json( sessions ))
  .catch( error => console.error( error ) || res.sendStatus(500))
})

/**
* @desc Route to modify a session
* @route POST api/sessions/:label
* @param {Object} will be merged with the current session.
*/
router.post( "/:label", isAdmin, (req, res) => (
  DB.getOneSession( req.params.label )
  .then( session => session || Promise.reject( "nop" ))
  .then( session => DB.setOneSession( req.params.label, Object.assign(
    {},
    session,
    req.body,
    { label: req.params.label } //Keep at least this safe from changes.
  )))
  .then( done => res.sendStatus( 204 ))
  .catch( error => console.error( error ) || res.sendStatus( 500 ))
));

/**
* @desc Get a single session
* @route Get api/sessions/:label
* @repond { Object } the session
*/
router.get( "/:label", (req, res) => (
  DB.getOneSession( req.params.label )
  .then( session => !session ? Promise.reject( "!exists" ) : res.send( session ).status( 200 ))
  .catch( error => error === "!exists" ? res.sendStatus( 404 ) : Promise.reject( error ))
  .catch( console.error )
))

/**
* @desc Route to delete a sessions
* @route DELETE api/sessions/:label
*/
router.delete( "/:label", isAdmin, (req, res) => (
  DB.rmOneSession( req.params.label )
  .then( done => res.sendStatus( 204 ))
  .catch( error => console.log( error ) || res.sendStatus( 500 ))
))

export default router;
