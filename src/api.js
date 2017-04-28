import Express from "express";
import parser from "body-parser";
import cookie from "cookie-session";

import redis from "./middleware/redis";
import { hash, validate } from "./middleware/password";

const api = Express.Router();
const isAdmin = (req, res, next) => (
  req.session.isAdmin ? next() : res.sendStatus(401)
);

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
api.use( "/log", (req, res) => (
  Promise.resolve( req )
  .then(({ session, body }) => session.isAdmin ? Promise.reject( "connected" ) : body )
  .then(({ email, password }) => (
    redis.getAdmin( email )
    .then( logPass => (( logPass && validate( logPass, password )) ? (
      ( req.session.isAdmin = true ) && res.send( true ).status( 200 )
    ) : ( res.sendStatus( 401 ))
    ))
  ))
  .catch( error => error === "connected" ? res.send( true ).status( 200 ) : Promise.reject( error ))
  .catch( console.error )
));

/******************************************************************************/
/*************************** SESSIONS & CHARTS DATA ***************************/
/******************************************************************************/

/**
* @desc Route to modify a session
* @route POST api/sesions/:label
* @param {Object} will be merged with the current session.
*/
api.post( "/sessions/:label", isAdmin, (req, res) => (
  redis.getOneSession( req.params.label )
  .then( session => session || Promise.reject( "nop" ))
  .then( session => redis.setOneSession( req.params.label, Object.assign(
    {},
    session,
    req.body,
    { label: req.params.label } //Keep at least this safe from changes.
  )))
  .then( done => res.sendStatus( 204 ))
  .catch( error => console.error( error ) || res.sendStatus( 500 ))
));

/**
* @desc Creation of a new session.
* @route POST api/sessions.
* @param {String, String} label, code.
*/
api.post( "/sessions", isAdmin, (req, res) => {
  //errors
  const INFOMISS = "info missing";
  const EXISTS = "already exists";
  let newSession = req.body.session
  //Try insertion.
  Promise.resolve( newSession && newSession.label && newSession.code)
  .then( info => !info ? Promise.reject( INFOMISS ) : (
    redis.newOneSession( newSession.label, newSession )
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
api.get( "/sessions", isAdmin, (req, res) => {
  redis.getAllSession()
  .then( sessions => res.json( sessions ))
  .catch( error => console.error( error ) || res.sendStatus(500))
})

/**
* @desc Get a single session
* @route Get api/sessions/:label
* @repond { Object } the session
*/
api.get( "/sessions/:label", (req, res) => (
  redis.getOneSession( req.params.label )
  .then( session => !session ? Promise.reject( "!exists" ) : res.send( session ).status( 200 ))
  .catch( error => error === "!exists" ? res.sendStatus( 404 ) : Promise.reject( error ))
  .catch( console.error )
))

/**
* @desc Route to delete a sessions
* @route DELETE api/sessions/:label
*/
api.delete( "/sessions/:label", isAdmin, (req, res) => (
  redis.rmOneSession( req.params.label )
  .then( done => res.sendStatus( 204 ))
  .catch( error => console.log( error ) || res.sendStatus( 500 ))
))

/******************************************************************************/
/**************************** SESSIONS & STUDENTS *****************************/
/******************************************************************************/

/**
* @desc create a new student.
* @route POST api/sessions/:label/student
* @param url {String} label, the id of the session the student belong to.
* @param body {String} code, the code of the session.
* @param body {String} email, the id of the student.
*/
api.post( "/sessions/:label/student", (req, res) => (
  redis.getOneSession( req.params.label )
  .then( session => session ? session : Promise.reject( "noSession" ))
  .then( session => session.code === req.body.code ? session : Promise.reject( "wrongCode" ))
  .then( session => ( redis.getOneStudent( req.params.label, req.body.email )
    // Session is close but the user exists and can watch his scores.
    .then( student => student ? (
      ( req.session.student = req.body.email ) && Promise.reject( "exists" )
    ) : (
      session.open || Promise.reject( "closed" )
    ))
  ))
  // Create a student if not, connect else.
  .then( truth =>  createStudent( req.body.email , req.params.label ))
  // Store the student to sessions/label/student
  .then( student => (
    redis.setOneStudent( req.params.label, req.body.email, student )
    .then( isOk => isOk ? student : Promise.reject( Error( "Redis returned " + isOk )))
  ))
  .then( student => (req.session.student = student.id) && res.sendStatus( 204 ))
  .catch( error => error === "closed" ? res.sendStatus( 403 ) : Promise.reject( error ))
  .catch( error => error === "noSession" ? res.sendStatus( 404 ) : Promise.reject( error ))
  .catch( error => error === "exists" ? res.sendStatus( 302 ) : Promise.reject( error ))
  .catch( error => error === "wrongCode" ? res.sendStatus( 401 ) : Promise.reject( error ))
  .catch( console.error )
))

/**
* @desc get the student and his progression
* @route GET api/sessions/:label/student
*/
api.get( "/sessions/:label/student", (req, res) => {
  const student = req.session.student || req.params.student || req.body.student;
  redis.getOneStudent( req.params.label, student )
  .then( student => student ? res.send( student ).status( 200 ) : res.sendStatus( 404 ))
  .catch( console.error )
})

/**
* @desc send the answer of a question to the api
* @route api/sessions/:label/student
*/
api.post( "/sessions/:label/student/:statement_set", (req, res) => {
  // get the student
  redis.getOneStudent( req.params.label, req.session.student )
  // if exists, check if the student is still open and that the question isn't done yet
  .then( student => student || Promise.reject( "closed" ))
  .then( student => (
    ( !student.closed ) ? (
      // Add the new answer
      updateStudentAnswers( student, req.params.statement_set, req.body )
    ) : ( Promise.reject( "closed" ))
  ))
  .then( student => redis.setOneStudent( req.params.label, req.session.student, student ))
  // store and ok
  .then( isOk => res.sendStatus( 204 ))
  .catch( error => error === "closed" ? res.sendStatus( 403 ) : Promise.reject( error ))
  .catch( console.error )
})

/**
* @desc complite and get the student
* @route GET api/sessions/:label/student/result
*/
api.get( "/sessions/:label/student/result", (req, res) => {
  const studentMail = req.session.student || req.params.student || req.body.student;
  let theStudent;
  redis.getOneStudent( req.params.label, studentMail )
  .then( student => theStudent = student )
  .then( student => student.closed ? Promise.reject("alreadyDone") : student )
  .then( student => (
    redis.getAllStatementSets()
    .then( statementSets => compileStudentAnswers( student, statementSets ))
    .then( scores => theStudent = Object.assign( {}, student, { closed: true, scores, step: student.step +1 }))
  ))
  .then( student => redis.setOneStudent( req.params.label, studentMail, student ))
  .then( settled => redis.getOneSession( req.params.label ))
  .then( session => session.open ? addStudentToSession( theStudent, session ) : Promise.reject( "closed" ))
  .then( session => (
    redis.setOneSession( req.params.label, session )
    .then( done => res.json({ session, student: theStudent }))
  ))
  .catch( error => error !== "alreadyDone" ? Promise.reject( error ) : (
    redis.getOneSession( req.params.label )
    .then( session => res.json({ session, student: theStudent }))
  ))
  .catch( error => error === "closed" ? res.sendStatus( 403 ) : Promise.reject( error ))
  .catch( error => error === "Student did not finished" ? res.sendStatus( 403 ) : Promise.reject( error ))
  .catch( console.error );
});

const createStudent = ( email, session ) => ({
  closed: false,
  email,
  session,
  answers: [],
  step: 0,
});

const updateStudentAnswers = ( student, set, answer ) => {
  student.answers[ set - 1 ] = answer;
  student.step = set;
  return student;
}

/**
* @desc turn the students answers into final score relatively to the RIASEC test
* @param {Object} student
* @param {[Object]} answers, the answer of the RIASEC test.
*//**
Shema:
student.answers = [{ "a": 0, "b": 1} ...]
statementSets =[ [{ "value": "a", "text": "...", "profile", "index": 0 }, {b}, c, d]]
*/
const compileStudentAnswers = ({ answers }, statementSets ) => {
  let scores = [ 0, 0, 0, 0, 0, 0 ] ;
  return Promise.resolve( answers.length === statementSets.length )
  .then( isOk => !isOk ? Promise.reject("Student did not finished") : Promise.resolve(
    statementSets.forEach(( statementSet, i) => (
      statementSet.forEach(({ value, index }, i) => (
        scores[ index ] += answers[ i ][ value ]
      ))
    ))
  ))
  .then( done => scores.map( score => Math.round( score / 72 * 100 )))
}

/**
* @desc add the student score to the session he belong
* @param {Object} student
* @param {Object} session
*/
const addStudentToSession = ( student, session ) => {
  session.data = session.data.map(( data, index ) => (
    (( data * session.student ) + student.scores[ index ] ) / ( session.student + 1 )
  ))
  session.student = session.student + 1 ;
  return session ;
}

/******************************************************************************/
/********************************* QUESTIONS **********************************/
/******************************************************************************/

/**
* @desc get the desired set of affirmations.
* @route GET /api/questions/:questionid
*/
api.get( "/statements/:statementSet", (req, res) => (
  redis.getStatementSet( req.params.statementSet )
  .then( statementSet => statementSet ? res.send( statementSet ).status( 200 ) : res.sendStatus( 404 ))
))

export default api;
