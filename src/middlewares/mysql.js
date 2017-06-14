import Session from "./sequelize/session";
import Student from "./sequelize/student";
import StatementSet from "./sequelize/statementSet";

//Those should be environemnts values.
const ADMIN = process.env.ADMIN_KEY, PASSWORD = process.env.ADMIN_PASS;
const getAdmin = ( id ) => Promise.resolve(id === ADMIN && PASSWORD);

/******************************************************************************/
/********************************** SESSIONS **********************************/
/******************************************************************************/

/**
* @desc Insert a new session in the db
* @params { String } label, the id of the session
* @params { Object } session = {
*   open: Boolean,
*   label: String // unique,
*   code: String,
*   date: String,
*   student: int,
*   data: JSON.stringify([ 0, 0, 0, 0, 0, 0]),
* }
*/
const newOneSession = ( label, session ) => (
  Session.create( Object.assign({}, session, { data: JSON.stringify( session.data )}))
  .catch( error => error.name === "SequelizeUniqueConstraintError" ? Promise.reject("already exists") : Promise.reject( error ))
)

/**
* @desc Delete a session of the db
* @params { String } label, the id of the session
*/
const rmOneSession = ( label ) => (
  Session.destroy({ where: { label: label }})
)

/**
* @desc Fetch one session from the db
* @params { String } label, the id of the session
* @returns { Object } session = {
*   open: Boolean,
*   label: String // unique,
*   code: String,
*   date: String,
*   student: int,
*   data: JSON.stringify([ 0, 0, 0, 0, 0, 0]),
* }
*/
const getOneSession = ( label ) => (
  Session.findById( label, { raw: true })
  .then( session => Object.assign({}, session, { data: JSON.parse( session.data )}))
)

/**
* @desc Fetch all sessions from the db
* @returns {[ Object ]} sessions = [{
*   open: Boolean,
*   label: String // unique,
*   code: String,
*   date: String,
*   student: int,
*   data: JSON.stringify([ 0, 0, 0, 0, 0, 0]),
* }, ...]
*/
const getAllSession = () => (
  Session.findAll({ raw: true })
  .then( sessions => sessions.map( session => Object.assign(
    {},
    session,
    { data: JSON.parse( session.data )}
  )))
)

/**
* @params { String } label, the id of the session
* @params { Object } session = {
*   open: Boolean,
*   label: String // unique,
*   code: String,
*   date: String,
*   student: int,
*   data: JSON.stringify([ 0, 0, 0, 0, 0, 0]),
* }
*/
const setOneSession = ( label, session ) => (
  Session.update( Object.assign({},
    session,
    { data: JSON.stringify( session.data )}),
    { where: { label: label }}
  )
)

/******************************************************************************/
/********************************** STUDENTS **********************************/
/******************************************************************************/

/**
* @desc Fetch one student from the db
* @params { String } label, the session id which the student belongs
* @params { email } email, the student email
*/
const getOneStudent = ( label, email ) => (
  Student.findOne({ where: { session: label, email: email }, raw: true })
  .then( student => student && ({
    closed: student.closed || false,
    session: student.session,
    email: student.email,
    answers: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ].map( i => JSON.parse(student[ "answer"+i ])),
    scores: JSON.parse( student.scores )
  }))
)

/**
* @desc Upsert a student in the db
* @params { String } label, the session id which the student belongs
* @params { email } email, the student email
* @params { Object } student = {
*   email: String,
*   session: String,
*   answers: [ Object ],
*   scores: [ Number ],
* }
*/
const setOneStudent = ( label, email, student ) => {
  const newStud = {
    closed: student.closed || false,
    session: label,
    email: email,
    session: label,
    scores: JSON.stringify( student.scores ),
  };
  student.answers && student.answers.forEach(( answer, i ) => (
    newStud[ "answer" + i ] = JSON.stringify( answer )
  ));
  return Student.upsert( newStud );
}

/******************************************************************************/
/********************************* STATEMENTS *********************************/
/******************************************************************************/


const setStatement = ( set, index, text ) => (
  StatementSet.findById( 1 + 1 * set, { raw: true })
  .then( statementSet => JSON.parse( statementSet[ index ] ))
  .then( statement => ( statement.text = text ) && statement )
  .then( statement => StatementSet.update({
    [ index ] : JSON.stringify( statement )
  }, {
    where: { id: 1 + 1*set }
  }))
)

const getStatementSet = ( statementSet ) => (
  StatementSet.findById( statementSet, { raw: true })
  .then( statementSet => ([
    JSON.parse( statementSet[ 0 ]),
    JSON.parse( statementSet[ 1 ]),
    JSON.parse( statementSet[ 2 ]),
    JSON.parse( statementSet[ 3 ]),
    JSON.parse( statementSet[ 4 ]),
    JSON.parse( statementSet[ 5 ])
  ]))
)

const getAllStatementSets = () => (
  StatementSet.findAll({ order: [ "id" ]})
  .then( sets => sets.map( statementSet => ([
      JSON.parse( statementSet[ 0 ]),
      JSON.parse( statementSet[ 1 ]),
      JSON.parse( statementSet[ 2 ]),
      JSON.parse( statementSet[ 3 ]),
      JSON.parse( statementSet[ 4 ]),
      JSON.parse( statementSet[ 5 ])
    ])
  ))
)

const setStatementSet = ( set, statementSet ) => {
  let statementSetObj = { id: set };
  statementSet.forEach(( statement, index ) => (
    statementSetObj[ index ] = JSON.stringify( statement )
  ))
  return StatementSet.upsert( statementSetObj );
}

module.exports = {
  getAdmin,
  newOneSession,
  rmOneSession,
  getAllSession,
  getOneSession,
  setOneSession,
  getOneStudent,
  setOneStudent,
  setStatement,
  getStatementSet,
  getAllStatementSets,
}
