import React from "react";
import { RadarChart } from "./RadarChart";
import { SessionManager } from "./SessionManager";
import axios from "axios";

/**
* @desc initialise a session object.
* @param {String} label, name and id of the session.
* @param {String} code, the password to enter the session.
*/
const newSession = (label, code) => ({
  open: true,
  label: label,
  code: code,
  date: ((new Date().getDate()) + "/" + (new Date().getMonth()+1) + "/" + (new Date().getFullYear())),
  student: 0,
  data: [0,0,0,0,0,0],
});

export class Dashboard extends React.Component {
  componentDidMount(){
    //First
    this.fetchSessions();
    //Then every 30 seconds
    //this.actualizeSessions();
  }

/**
* @desc Get all Sessions from distant API
*/
  fetchSessions( callback ) {
    axios.get( "/api/sessions" )
    .then( res => res.status !== 200 ? Promise.reject("error server") : (
      this.setState({ sessions: res.data }, callback )
    ))
    .catch( error => console.error( error ) || callback(error, null))
  }

/**
* @desc Select a session to be shown on the graph.
* @param {Object} session, a single session picked.
*/
  pickSession( session ) {
    //Add new session to the pack;
    let newPickedSessions = [...this.state.pickedSessions];
    //get a Color
    let r = Math.round(Math.random()*255),
      g = Math.round(Math.random()*255),
      b = Math.round(Math.random()*255);
    //Create a dataset valid object
    newPickedSessions.push({
      label: session.label,
      fillColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
      strokeColor: `rgb(${r}, ${g}, ${b})`,
      pointColor: `rgb(${r}, ${g}, ${b})`,
      data: session.data,
    });
    let newSessions = this.state.sessions.map(ses => (
      ses.label === session.label ? (
        Object.assign({}, ses, {color: `rgb(${r}, ${g}, ${b})`})
      ) : ( ses )
    ))
    //Add it to the set.
    return this.setState({
      pickedSessions: newPickedSessions,
      sessions: newSessions
    });
  }

/**
* @desc Un-select a session.
* @param {Object} session, a single session unpicked
*/
  unpickSession(session) {
    let newPickedSessions = this.state.pickedSessions.filter(ses => ses.label !== session.label);
    let newSessions = this.state.sessions.map(ses => (
      ses.label === session.label ? (
        Object.assign({}, ses, {color: ``})
      ) : ( ses )
    ))
    return this.setState({
      pickedSessions: newPickedSessions,
      sessions: newSessions
    });
  }

/**
* @desc Create a new session, send it to the Api and add it if it's ok
* @param {String} label, name and id of the session.
* @param {String} code, the password to enter the session.
* @param {Function} callback, classic callback function(error).
*/
  createSession( label, code, callback ) {
    if ( !label || !code ) { callback("label/code invalides") }
    else {
      let session = newSession(label, code);
      axios.post( "/api/sessions/", { session })
      .then( res => this.setState({ sessions: [session, ...this.state.sessions] }, callback))
      .catch( error => (
        error
        && error.response
        && error.response.status == 403 ? Promise.reject( "Label déjà utilisé" ) : Promise.reject( error )))
      .catch( error => console.error( error ) || callback(error))
    }
  }

/**
* @desc Close a session which become un-joinable for students.
* @param {String} label, the name and id of the closed session.
*/
  closeSession( label ) {
    const onSuccess = () => {
      let newSessions = this.state.sessions.map(ses => (
        ses.label !== label ? ses : Object.assign({}, ses, {open: false})
      ));
      return this.setState({ sessions: newSessions });
    }
    axios.post("/api/sessions/" + label, { open: false })
    .then( onSuccess )
    .catch( error => console.error( error ))
  }

/**
* @desc open a session which become re-joinable for students.
* @param {String} label, the name and id of the opened session.
*/
  openSession( label ) {
    const onSuccess = (error) => {
      let newSessions = this.state.sessions.map(ses => (
        ses.label !== label ? ses : Object.assign({}, ses, {open: true})
      ));
      return this.setState({ sessions: newSessions });
    }
    axios.post("/api/sessions/" + label, { open: true })
    .then( onSuccess )
    .catch( error => console.error( error ))
  }

/**
* @desc Delete a session on the api.
* @param {String} label, the name and id of the deleted session.
*/
  deleteSession( label ) {
    const onSuccess = () => {
      let newSessions = this.state.sessions.filter(ses => (ses.label !== label));
      this.unpickSession({ label });
      return this.setState({ sessions: newSessions });
    }
    axios.delete( "/api/sessions/" + label )
    .then( onSuccess )
    .catch( error => console.error( error ))
  }

  constructor(){
    super();
    this.state = { sessions: [], pickedSessions: [] };
  }

  render() {
    return (
      <div className="Dashboard">
        <RadarChart sessions={ this.state.pickedSessions }/>
        <SessionManager
          sessions = { this.state.sessions }
          pick = { this.pickSession.bind(this) }
          unpick = { this.unpickSession.bind(this) }
          createSession = { this.createSession.bind(this) }
          deleteSession = { this.deleteSession.bind(this) }
          closeSession = { this.closeSession.bind(this) }
          openSession = { this.openSession.bind(this) }
          />
      </div>
    )
  }
}
