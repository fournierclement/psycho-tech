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

const setAdmin = ( id, pwd ) => redis.set( ADMINLOGS + id, pwd );
const getAdmin = ( id ) => redis.get( ADMINLOGS + id );

const newOneSession = ( label, session ) => (
  redis.sadd( SESSIONKEYS, label )
  .then( added => added === 1 || Promise.reject("already exists"))
  .then( added => redis.set(
    SESSIONS + label,
    JSON.stringify( session )
  ))
)

const rmOneSession = ( label ) => (
  redis.srem( SESSIONKEYS, label)
  .then( removed => removed === 1 && redis.del( SESSIONS + label ))
  .then( deleted => redis.keys( SESSIONS + label + STUDENTS + "*" ))
  .then( studentKeys => Promise.all(
    studentKeys.map( studentkey => redis.del( studentkey ))
  ))
)

const getOneSession = ( label ) => (
  redis.get( SESSIONS + label)
  .then( JSON.parse )
)

const getAllSession = () => {
  let sessions = [];
  //Get all the keys we know we have.
  return redis.smembers( "sessionKeys" )
  .then( sessionKeys => Promise.all(
    sessionKeys.map( sessionKey => (
      redis.get( SESSIONS + sessionKey )
      .then( session => sessions.push( JSON.parse( session )))
    ))
  ))
  //Wait for the promises to end.
  .then( done => sessions )
}


const setOneSession = ( label, session ) => (
  redis.set(
    SESSIONS + label,
    JSON.stringify( session )
  )
)

/******************************************************************************/
/********************************** STUDENTS **********************************/
/******************************************************************************/

const getOneStudent = ( label, email ) => (
  redis.get( SESSIONS + label + STUDENTS + email )
  .then( JSON.parse )
)

const setOneStudent = ( label, email, student ) => (
  redis.set( SESSIONS + label + STUDENTS + email, JSON.stringify( student ))
  .then( student => (
    redis.expire( SESSIONS + label + STUDENTS + email, 30 * 24 * 60 * 60 * 1000)
    && student
  ))
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
