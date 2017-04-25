import React from "react";
import { RadarChart } from "./RadarChart";
import { SessionManager } from "./SessionManager";

/*
* should check connected?
*/

const rollData = () => [
  Math.round(Math.random()*100),
  Math.round(Math.random()*100),
  Math.round(Math.random()*100),
  Math.round(Math.random()*100),
  Math.round(Math.random()*100),
  Math.round(Math.random()*100)
];
const newSession = (label, code) => ({
  open: true,
  label: label,
  code: code,
  date: new Date(),
  student: Math.round(Math.random()*50),
  data: rollData(),
});

let APIsessions = [
  newSession("ig2017", "123"),
  newSession("ig2018", "123"),
  newSession("ig2019", "123"),
];

export class Dashboard extends React.Component {
  componentDidMount(){
    this.fetchSessions();
  }
  // Select a session to be shown on the graph.
  pickSession(session, callback) {
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
    }, callback);
  }
  // Select a session to not be shown anymore on the graph.
  unpickSession(session, callback) {
    let newPickedSessions = this.state.pickedSessions.filter(ses => ses.label !== session.label);
    let newSessions = this.state.sessions.map(ses => (
      ses.label === session.label ? (
        Object.assign({}, ses, {color: ``})
      ) : ( ses )
    ))
    return this.setState({
      pickedSessions: newPickedSessions,
      sessions: newSessions
    }, callback);
  }
  //Get Sessions from distant API
  fetchSessions( callback ) {
    //get /sessions
    return this.setState({ sessions: APIsessions }, callback);
  }
  //Create Session and send it to the distant API
  createSession( label, code, callback ) {
    let session = newSession(label, code);
    const onSuccess = (error) => {
      let newSessions = [session, ...this.state.sessions];
      return this.setState({ sessions: newSessions }, callback);
    }
    setTimeout((callback) => {
      //post /sessions
      return callback(null);
    }, 1000, onSuccess);
  }
  //Close a session with a distant API
  closeSession( label, callback ) {
    const onSuccess = (error) => {
      let newSessions = this.state.sessions.map(ses => (
        ses.label !== label ? ses : Object.assign({}, ses, {open: false})
      ));
      return this.setState({ sessions: newSessions }, callback);
    }
    setTimeout((callback) => {
      //post sessions/label/
      return callback(null);
    }, 1000, onSuccess);
  }
  //open a session with a distant API
  openSession( label, callback ) {
    const onSuccess = (error) => {
      let newSessions = this.state.sessions.map(ses => (
        ses.label !== label ? ses : Object.assign({}, ses, {open: true})
      ));
      return this.setState({ sessions: newSessions }, callback);
    }
    setTimeout((callback) => {
      //post sessions/label/
      return callback(null);
    }, 1000, onSuccess);
  }
  //delete a session with a distant api
  deleteSession( label, callback) {
    const onSuccess = (error) => {
      let newSessions = this.state.sessions.filter(ses => (ses.label !== label));
      this.unpickSession({ label });
      return this.setState({ sessions: newSessions }, callback);
    }
    setTimeout((callback) => {
      //delete sessions/label/
      return callback(null);
    }, 1000, onSuccess);
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
