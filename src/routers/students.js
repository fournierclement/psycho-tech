import { Router } from "express";

import DB from "../middlewares/DB";

const router = Router();

/*********************************** ROUTES ***********************************/

/**
* @desc create a new student.
* @route POST api/student/:session
* @param url {String} session, the id of the session the student belong to.
* @param body {String} code, the code of the session.
* @param body {String} email, the id of the student.
*/
router.post( "/:session", (req, res) => (
  DB.getOneSession( req.params.session )
  .then( session => session ? session : Promise.reject( "noSession" ))
  .then( session => session.code === req.body.code ? session : Promise.reject( "wrongCode" ))
  .then( session => ( DB.getOneStudent( req.params.session, req.body.email )
    // Session is close but the user exists and can watch his scores.
    .then( student => student ? (
      ( req.session.student = req.body.email ) && Promise.reject( "exists" )
    ) : (
      session.open || Promise.reject( "closed" )
    ))
  ))
  // Create a student if not, connect else.
  .then( truth => createStudent( req.body.email , req.params.session ))
  // Store the student to session/label/student
  .then( student => (
    DB.setOneStudent( req.params.session, req.body.email, student )
    .then( isOk => isOk ? student : Promise.reject( Error( "DB returned " + isOk )))
  ))
  .then( student => (req.session.student = student.email) && res.sendStatus( 204 ))
  .catch( error => error === "closed" ? res.sendStatus( 403 ) : Promise.reject( error ))
  .catch( error => error === "noSession" ? res.sendStatus( 404 ) : Promise.reject( error ))
  .catch( error => error === "exists" ? res.sendStatus( 302 ) : Promise.reject( error ))
  .catch( error => error === "wrongCode" ? res.sendStatus( 401 ) : Promise.reject( error ))
  .catch( error => console.error( error ) || res.sendStatus( 500 ))
))

/**
* @desc get the student and his progression
* @route GET api/students/:session/:student
*/
router.get( "/:session/:student", (req, res) => {
  const student = req.session.student || req.params.student || req.body.student;
  DB.getOneStudent( req.params.session, student )
  .then( student => student ? res.send( student ).status( 200 ) : res.sendStatus( 404 ))
  .catch( error => console.error( error ) || res.sendStatus( 500 ))
})

/**
* @desc send the answer of a question to the api
* @route api/student/:session/:student/:statement_set
*/
router.post( "/:session/:student/:statement_set", (req, res) => {
  const studentMail = req.session.student || req.params.student || req.body.student;
  DB.getOneStudent( req.params.session, studentMail )
  // if exists, check if the student is still open and that the question isn't done yet
  .then( student => student || Promise.reject( "closed" ))
  .then( student => (
    ( !student.closed ) ? (
      // Add the new answer
      updateStudentAnswers( student, req.params.statement_set, req.body )
    ) : ( Promise.reject( "closed" ))
  ))
  .then( student => DB.setOneStudent( req.params.session, studentMail, student ))
  // store and ok
  .then( isOk => res.sendStatus( 204 ))
  .catch( error => error === "closed" ? res.sendStatus( 403 ) : Promise.reject( error ))
  .catch( error => console.error( error ) || res.sendStatus( 500 ))
});

/**
* @desc get the response of the student for the given statement_set
* @route api/student/:session/:student/:statement_set
*/
router.get( "/:session/:student/:statment_set", (req, res, next) => (
  req.params.statment_set === "result" ? next() : (
  // get the student
  DB.getOneStudent( req.params.session, req.session.student || req.params.student || req.body.student )
  .then( student => student || Promise.reject( "doesntExist" ))
  .then( student => getStudentAnswer( student, req.params.statment_set ))
  .then( answer => res.json( answer ))
  .catch( error => error === "doesntExist" ? res.sendStatus( 404 ) : Promise.reject( error ))
  .catch( error => console.error( error ) || res.sendStatus( 500 ))
)));

/**
* @desc compile and get the student
* @route GET api/student/:session/:student/result
*/
router.get( "/:session/:student/result", (req, res) => {
  // get the student
  const studentMail = req.session.student || req.params.student || req.body.student;
  let theStudent;
  DB.getOneStudent( req.params.session, studentMail )
  // does the student is closed or must it be compiled ?
  .then( student => theStudent = student )
  .then( student => student ? student : Promise.reject("NotFound"))
  .then( student => student.closed ? Promise.reject("alreadyDone") : student )
  .then( student => (
    DB.getAllStatementSets()
    .then( statementSets => compileStudentAnswers( student, statementSets ))
    .then( scores => theStudent = Object.assign( {}, student, { closed: true, scores }))
  ))
  .then( student => DB.setOneStudent( req.params.session, studentMail, student ))
  .then( settled => DB.getOneSession( req.params.session ))
  .then( session => session.open ? addStudentToSession( theStudent, session ) : Promise.reject( "closed" ))
  .then( session => (
    DB.setOneSession( req.params.session, session )
    .then( done => res.json({ session, student: theStudent }))
  ))
  .catch( error => error !== "alreadyDone" ? Promise.reject( error ) : (
    DB.getOneSession( req.params.session )
    .then( session => res.json({ session, student: theStudent }))
  ))
  .catch( error => error === "closed" ? res.sendStatus( 403 ) : Promise.reject( error ))
  .catch( error => error === "NotFound" ? res.sendStatus( 404 ) : Promise.reject( error ))
  .catch( error => error === "Student did not finished" ? res.sendStatus( 403 ) : Promise.reject( error ))
  .catch( error => console.error( error ) || res.sendStatus( 500 ))
});

/********************************* FUNCTIONS **********************************/

const createStudent = ( email, session ) => ({
  closed: false,
  email,
  session,
  answers: [],
});

const getStudentAnswer = ( student, set) => student.answers[ set - 1 ] ;

const updateStudentAnswers = ( student, set, answer ) => {
  student.answers[ set - 1 ] = answer;
  return student;
}

/**
* @desc turn the students answers into final score relatively to the RIASEC test
* @param {Object} student
* @param {[Object]} answers, the answer of the RIASEC test.
*/
const compileStudentAnswers = ({ answers }, statementSets ) => {
  let scores = [ 0, 0, 0, 0, 0, 0 ];
  return Promise.resolve( answers.length === statementSets.length )
  .then( isOk => !isOk ? Promise.reject("Student did not finished") : Promise.resolve(
    //For each statement set
    statementSets.forEach(( statementSet, i) => (
      statementSet.forEach(({ value, index }, j) => (
        // and statemnt we must compare the value (a-f)
        // to the value (a-f) of the answer of the same id
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

export default router;
