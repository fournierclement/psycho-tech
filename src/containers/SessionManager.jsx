import React from "react";

const lang_Fr = {
  "SessionManager-head-0": "Ajouter",
  "SessionManager-head-1": "Etat",
  "SessionPicker-1-close": "Fermée",
  "SessionPicker-1-open": "Ouverte",
  "SessionManager-head-2": "Label de la session",
  "SessionManager-head-3": "Code de la session",
  "SessionManager-head-4": "Date de creation",
  "SessionManager-head-5": "Participants",
  "createSession": "Creer une session",
  "closeSession": "Fermer la session",
  "openSession": "Ouvrir la session",
  "deleteSession": "Supprimer la session",
  "new": "Nouvelle",
}

export const SessionManager = ({ sessions, pick, unpick, createSession, openSession, closeSession, deleteSession }) => (
  <table className="SessionManager" >
    <SessionManagerHead />
    <tbody className="SessionManager-body">
      <SessionCreator create = { createSession } />
      {[
        ...sessions.filter( ses => ses.open && ses.color ),
        ...sessions.filter( ses => !ses.open && ses.color ),
        ...sessions.filter( ses => ses.open && !ses.color ),
        ...sessions.filter( ses => !ses.open && !ses.color )
      ].map((session, i) => (
        <Session
          key = {i}
          click = { () => (session.color ? unpick(session) : pick(session)) }
          {...session}
          openSession = { openSession }
          closeSession = { closeSession }
          deleteSession = { deleteSession }
          />
      ))}
    </tbody>
  </table>
)

class SessionCreator extends React.Component {
  render() {
    const { create } = this.props;
    let label;
    let code;
    let date = new Date();
    return (
      <tr>
        <td></td>
        <td> { lang_Fr["new"] }</td>
        <td> <input type="text" ref={(input) => label = input } /> </td>
        <td> <input type="text" ref={(input) => code = input } /> </td>
        <td>
          { date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() }
        </td>
        <td></td>
        <td>
          <button onClick={function(event) {
            event.preventDefault();
            create(label.value, code.value);
            label.value = "";
            code.value = "";
          }} >
            { lang_Fr["createSession"] }
          </button>
        </td>
      </tr>
    )
  }
}

const Session = ({ open, label, code, date, student, color, click, closeSession, openSession, deleteSession }) => (
  <tr className="SessionPicker" onClick = { click }>
    <td className="SessionPicker-0" style = {({"backgroundColor": color})} >
      <input type = "checkbox" checked = { !!color } />
    </td>
    <td className="SessionPicker-1">
      { open ? lang_Fr["SessionPicker-1-open"] : lang_Fr["SessionPicker-1-close"] }
    </td>
    <td className="SessionPicker-2"> { label } </td>
    <td className="SessionPicker-3"> { code } </td>
    <td className="SessionPicker-4">
      { date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() }
    </td>
    <td className="SessionManager-body-5"> { student } </td>
    <td>
      <button onClick={function(event) {
        event.stopPropagation();
        !open ? openSession( label ) : closeSession( label );
      }} >
        { !open ? lang_Fr["openSession"] : lang_Fr["closeSession"] }
      </button>
      <button onClick={function(event) {
        event.stopPropagation();
        deleteSession(label);
      }} >
        { lang_Fr["deleteSession"] }
      </button>
    </td>
  </tr>
)

const SessionManagerHead = () => (
  <thead className="SessionManagerHead">
    <tr className="SessionManager-head-row">
      <th className="SessionManager-head-0"> { lang_Fr["SessionManager-head-0"] } </th>
      <th className="SessionManager-head-1"> { lang_Fr["SessionManager-head-1"] } </th>
      <th className="SessionManager-head-2"> { lang_Fr["SessionManager-head-2"] } </th>
      <th className="SessionManager-head-3"> { lang_Fr["SessionManager-head-3"] } </th>
      <th className="SessionManager-head-4"> { lang_Fr["SessionManager-head-4"] } </th>
      <th className="SessionManager-head-5"> { lang_Fr["SessionManager-head-5"] } </th>
    </tr>
  </thead>
)
