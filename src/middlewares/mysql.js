import Redis from "promise-redis";
import { hash } from "./password";
const statementSets = require( "./statementSets.json" );
const redis = Redis( process.env.REDIS_URL ).createClient();

const SESSIONKEYS = "sessionKeys";
const SESSIONS = "sessions/";
const STUDENTS = "/students/";
const STATEMENTS = "statements/";
const ADMINLOGS = "admin/log/";

//Those should be environemnts values.
const ADMIN = process.env.ADMIN_KEY, PASSWORD = process.env.ADMIN_PASS;
redis.set( ADMINLOGS + ADMIN, hash( PASSWORD ));

/******************************************************************************/
/********************************** SESSIONS **********************************/
/******************************************************************************/

/**
  session = {
    open: Boolean,
    label: String // unique,
    code: String,
    date: String,
    student: int,
    data: JSON.stringify([ 0, 0, 0, 0, 0, 0]),
  }
*/
const setAdmin = ( id, pwd ) => redis.set( ADMINLOGS + id, pwd );
const getAdmin = ( id ) => redis.get( ADMINLOGS + id );

const newOneSession = ( label, session ) => (
  // Does the label exist ?
  // Yes ? so don't and reject "already exists"
  // Else add it
)

const rmOneSession = ( label ) => (
  // Remove the session
  // Remove the belonged students
)

const getOneSession = ( label ) => (
  // Get a session
)

const getAllSession = () => {
  //Get all the keys we know we have.
}


const setOneSession = ( label, session ) => (
  // Update a session
)

/******************************************************************************/
/********************************** STUDENTS **********************************/
/******************************************************************************/

const getOneStudent = ( label, email ) => (
  // Get a student
)

const setOneStudent = ( label, email, student ) => (
  // Create a student
)

const setStatementSet = ( statementSet, statement ) => (
  redis.set( STATEMENTS + statementSet, JSON.stringify( statement ))
)

const getStatementSet = ( statementSet ) => (
  redis.get( STATEMENTS + statementSet )
  .then( JSON.parse )
)

const getAllStatementSets = () => {
  let statementSets = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
  return (
    Promise.all( statementSets.map(( key, i) => (
        redis.get( STATEMENTS + key )
        .then( statementSet => statementSets[ i ] = JSON.parse( statementSet ))
      ))
    ).then( done => statementSets )
  );
}

statementSets.forEach(( statementSet, i ) => (
  redis.set( STATEMENTS + (1 + 1*i), JSON.stringify( statementSet ))
))

module.exports = {
  setAdmin,
  getAdmin,
  newOneSession,
  rmOneSession,
  getAllSession,
  getOneSession,
  setOneSession,
  getOneStudent,
  setOneStudent,
  setStatementSet,
  getStatementSet,
  getAllStatementSets,
}
