import Express from "express";
import Redis from "promise-redis";
import parser from "body-parser";
import cookie from "cookie-session";

const api = Express.Router();
const redis = Redis().createClient();
const isAdmin = (req, res, next) => (
  req.session.isAdmin ? next() : res.sendStatus(401)
);
const ADMIN = "admin", PASSWORD = "mdp";

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
api.use("/log", (req, res) => (
  ( req.body.identifier === ADMIN )
  && ( req.body.password === PASSWORD )
  && (( req.session = { isAdmin: true }) && res.send(true).status( 200 ))
  || (( req.session.isAdmin === true ) && res.send(true).status( 200 ))
  || res.sendStatus( 401 )
));

/**
* @desc Route to modify a session
* @route POST api/sesions/:label
* @param {Object} will be merged with the current session.
*/
api.post( "/sessions/:label", (req, res) => (
  redis.get( "sessions/" + req.params.label)
  .then( session => session || Promise.reject("nop"))
  .then( JSON.parse)
  .then( session => redis.set( "sessions/:label",
    JSON.stringify( Object.assign(
      {},
      session,
      req.body,
      { label: req.params.label } //Keep at least this safe from changes.
    ))
  ))
  .then( done => res.sendStatus( 204 ))
  .catch( error => console.error( error ) || res.sendStatus( 500 ))
));

/**
* @desc Creation of a new session.
* @route POST api/sessions.
* @param {String, String} label, code.
*/
api.post("/sessions", (req, res) => {
  //errors
  const INFOMISS = "info missing";
  const EXISTS = "already exists";
  let newSession = req.body.session
  //Try insertion.
  Promise.resolve(newSession && newSession.label && newSession.code)
  .then( info => !info ? Promise.reject( INFOMISS ) : (
    //try to add the key to the session key set.
    redis.sadd( "sessionKeys", newSession.label )
  ))
  //If the label is already used, redis return 0, else 1.
  .then( added => added !== 1 ? Promise.reject( EXISTS ) : (
    redis.set( "sessions/" + newSession.label, JSON.stringify( newSession ))
  ))
  .then(done => res.sendStatus( 200 ))
  .catch(error => error === EXISTS ? res.status(403).send(error) : Promise.reject(error))
  .catch(error => error === INFOMISS ? res.status(403).send(error) : Promise.reject(error))
  .catch(error => console.error(error) || res.sendStatus(500))
});

/**
* @desc Route to get all the known sessions.
* @route Get api/sessions
* @respond { [Object] } array of sessions.
*/
api.get("/sessions", (req, res) => {
  //Init an array
  let sessions = [];
  //Get all the keys we know we have.
  redis.smembers( "sessionKeys" )
  .then( sessionKeys => (
    sessionKeys.map( sessionKey => (
      redis.get( "sessions/" + sessionKey )
      .then( JSON.parse )
      .then( session => sessions.push( session ))
    ))
  ))
  //Wait for the promises to end.
  .then( sessionPushs => Promise.all( sessionPushs ))
  .then( done => res.json( sessions ))
  .catch( error => console.error( error ) || res.sendStatus(500))
})

/**
* @desc Route to delete a sessions
* @route DELETE api/sessions/:label
*/
api.delete("/sessions/:label", (req, res) => (
  redis.srem("sessionKeys", req.params.label)
  .then(removed => removed === 1 && redis.del( "sessions/" + req.params.label))
  .then(done => res.sendStatus( 204 ))
  .catch(error => console.log( error ) || res.sendStatus( 500 ))
))

/**
* @desc create a new student.
* @route api/session/:label/student
*/



export default api;
