import React from "react";
import { Link } from "react-router";

const lang_Fr = {
  "session-name":"Nom de la session",
  "session-code":"code de la session",
  "email": "adresse email",
  "password":"Mot de passe"
}


export const LogPage = () => (
  <div className="LogPage">
    <StudentLogger />
    <AdminLogger />
  </div>
)

/**
* Should create a pseudo account for the student.
*/
const StudentLogger = () => (
  <form className="StudentLogger">
    <label>
      { lang_Fr["session-name"] }
      <input
        type="text"
        name="sessionName"
        />
    </label>
    <label>
      { lang_Fr["session-code"] }
      <input
        type="password"
        name="sessionCode"
        />
    </label>
    <label>
      { lang_Fr["email"] }
      <input
        type="email"
        name="email"
        />
    </label>
    <Link to="/session/1" > Rejoindre la session </Link>
  </form>
)

/**
* Should connect.
*/
class AdminLogger extends React.Component {
  render() {
  return (
    <form className="AdminLogger">
      <label>
        { lang_Fr["email"] }
        <input
          type="email"
          name="email"
          />
      </label>
      <label>
        { lang_Fr["password"] }
        <input
          type="password"
          name="password"
          />
      </label>
      <Link to="/admin" > connexion admin </Link>
    </form>
    )
  }
}
