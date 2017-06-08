import React from "react";
import { Link, browserHistory } from "react-router";
import axios from "axios";

export const LogPage = () => (
  <div className="LogPage">
    <StudentLogger />
    <AdminLogger />
  </div>
)

/**
* Should create a pseudo account for the student.
*/
class StudentLogger extends React.Component {
  constructor() {
    super();
    this.state = { error: "" };
  }
  joinSession( label, code, email, callback ) {
    Promise.resolve( label && code && email || Promise.reject( "Tous les champs sont requis." ))
    .then(ok => axios.post( "/api/student/" + label + "/", { code, email }))
    .then( res => res.status === 204 ? Promise.reject( "authorized" ) : res )
    .catch( error => (
      error.response
      && error.response.status === 302 ? Promise.reject( "authorized" ) : Promise.reject( error )
    ))
    .catch( error => (
      error === "authorized" ? browserHistory.push("/session/" + label) : Promise.reject( error )
    ))
    .catch( error => (
      error.response
      && error.response.status === 404 ? callback( "Cette session n'existe pas" ) : Promise.reject( error )
    ))
    .catch( error => (
      error.response
      && error.response.status === 401 ? callback( "Code de session incorrect" ) : Promise.reject( error )
    ))
    .catch( error => (
      error.response
      && error.response.status === 403 ? callback( "Cette session est fermée" ) : Promise.reject( error )
    ))
    .catch( callback )
  }
  render() {
    let sessionLabel, sessionCode, email;
    return (
      <form className="StudentLogger">
        <label>
          <span> Label de la session </span>
          <input
            type="text"
            name="sessionLabel"

            ref={ input => sessionLabel = input }
            />
        </label>
        <label>
          <span> Code de la session </span>
          <input
            type="password"
            name="sessionCode"

            ref={ input => sessionCode = input }
            />
        </label>
        <label>
          <span> Email </span>
          <input
            type="email"
            name="email"
            ref={ input => email = input }
            />
        </label>
        <div className="Logger-error">
          <b>{ this.state.error }</b>
        </div>
        <input
          type="button"
          value="Rejoindre une session"
          onClick={ event => {
            event.preventDefault();
            this.joinSession(
              sessionLabel.value,
              sessionCode.value,
              email.value,
              (error) => this.setState({ error: error.toString() })
            );
          }}>
        </input>
      </form>
    )
  }
}

/**
* Should connect.
*/
class AdminLogger extends React.Component {
  constructor() {
    super();
    this.state = { error: "" };
  }

  logAdmin (email, password, callback) {
    axios.post("/api/log", { email, password })
    .then( res => res.data && browserHistory.push( "/admin" ))
    .catch( error => (
      error.response
      && error.response.status === 401 ? callback( "Identifiants incorrects" ) : Promise.reject( error )
    ))
    .catch(callback)
  }

  render() {
    let email, password;
    return (
      <form className="AdminLogger">
        <label>
          <span> Email </span>
          <input
            type="email"
            name="email"
            ref={ input => email = input }

            />
        </label>
        <label>
          <span> Mot de passe </span>
          <input
            type="password"
            name="password"
            ref={ input => password = input }

            />
        </label>
        <div className="Logger-error">
        <b>{ this.state.error }</b>
        </div>
        <input
          type="button"
          value="connexion admin"
          onClick={ event => {
            event.preventDefault();
            this.logAdmin(
              email.value,
              password.value,
              (error) => this.setState({ error: error.toString() })
            );
          }}>
        </input>
      </form>
    )
  }
}
