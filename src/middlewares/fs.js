import fs from "fs-extra";
import { hash } from "./password";
const statementSets = require( "./statementSets.json" );

const JsonPath = Process.env.JsonDB || "./JsonDB.json";

/**
* Using File system is dirty... and insecure
*/

fs.readJson( JsonPath )
.then( db => db || Promise.reject() )
.catch( error => fs.writeJson({
  [ SESSIONKEYS ]: [],
  [ SESSIONS ]: {},
  [ STATEMENTS ]: statementSets,
}))
.catch( error => console.error( error ))

const SESSIONKEYS = "sessionKeys";
const SESSIONS = "sessions";
const STUDENTS = "students";
const STATEMENTS = "statements";

//Those should be environemnts values.
const ADMIN = process.env.ADMIN_KEY, PASSWORD = process.env.ADMIN_PASS;

/******************************************************************************/
/********************************** SESSIONS **********************************/
/******************************************************************************/

const setAdmin = ( id, pwd ) => redis.set( ADMINLOGS + id, pwd );
const getAdmin = ( id ) => id === ADMIN && PASSWORD ;

const newOneSession = ( label, session ) => (
  fs.readJson( JsonPath )
  .then( db => (
    db[ SESSIONKEYS ].includes( label ) ?
    Promise.reject( "already exists" ) :
    ( db[ SESSIONKEYS ].push( label ) && db )
  ))
  .then( db => db[ SESSIONS ][ label ] = session )
  .then( db => fs.writeJson( JsonPath, db ))
)

const rmOneSession = ( label ) => (
  // redis.srem( SESSIONKEYS, label)
  // .then( removed => removed === 1 && redis.del( SESSIONS + label ))
  // .then( deleted => redis.keys( SESSIONS + label + STUDENTS + "*" ))
  // .then( studentKeys => Promise.all(
  //   studentKeys.map( studentkey => redis.del( studentkey ))
  // ))
)

const getOneSession = ( label ) => (
  // redis.get( SESSIONS + label)
  // .then( JSON.parse )
)

const getAllSession = () => {
  // let sessions = [];
  // //Get all the keys we know we have.
  // return redis.smembers( "sessionKeys" )
  // .then( sessionKeys => Promise.all(
  //   sessionKeys.map( sessionKey => (
  //     redis.get( SESSIONS + sessionKey )
  //     .then( session => sessions.push( JSON.parse( session )))
  //   ))
  // ))
  // //Wait for the promises to end.
  // .then( done => sessions )
}


const setOneSession = ( label, session ) => (
  // redis.set(
  //   SESSIONS + label,
  //   JSON.stringify( session )
  // )
)

/******************************************************************************/
/********************************** STUDENTS **********************************/
/******************************************************************************/

const getOneStudent = ( label, email ) => (
  // redis.get( SESSIONS + label + STUDENTS + email )
  // .then( JSON.parse )
)

const setOneStudent = ( label, email, student ) => (
  // redis.set( SESSIONS + label + STUDENTS + email, JSON.stringify( student ))
  // .then( student => (
  //   redis.expire( SESSIONS + label + STUDENTS + email, 30 * 24 * 60 * 60 * 1000)
  //   && student
  // ))
)

const setStatementSet = ( statementSet, statement ) => (
  // redis.set( STATEMENTS + statementSet, JSON.stringify( statement ))
)

const getStatementSet = ( statementSet ) => (
  // redis.get( STATEMENTS + statementSet )
  // .then( JSON.parse )
)

const getAllStatementSets = () => {
  // let statementSets = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
  // return (
  //   Promise.all( statementSets.map(( key, i) => (
  //       redis.get( STATEMENTS + key )
  //       .then( statementSet => statementSets[ i ] = JSON.parse( statementSet ))
  //     ))
  //   ).then( done => statementSets )
  // );
}

statementSets.forEach(( statementSet, i ) => (
  // redis.set( STATEMENTS + (1 + 1*i), JSON.stringify( statementSet ))
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
