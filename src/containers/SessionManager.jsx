import React from "react";

export const SessionManager = ({ sessions, pick, unpick, createSession, openSession, closeSession, deleteSession }) => (
  <div className="SessionManager" >
  <table>
    <SessionManagerHead />
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
    </table>
  </div>
)

class SessionCreator extends React.Component {
  constructor() {
    super();
    this.state = { error: "" };
  }
  render() {
    const { create } = this.props;
    let label;
    let code;
    let date = ((new Date().getDate()) + "/" + (new Date().getMonth()+1) + "/" + (new Date().getFullYear()));
    return (
      <tr>
      <td className="SessionCreator-0"></td>
      <td className="SessionCreator-1"> Nouvelle </td>
      <td className="SessionCreator-2"> <input type="text" ref={(input) => label = input } /> </td>
      <td className="SessionCreator-3"> <input type="text" ref={(input) => code = input } /> </td>
      <td className="SessionCreator-4">
        { date }
      </td>
      <td className="SessionCreator-5"><div className="SessionCreator-error" >{ this.state.error }</div></td>
      <td className="SessionCreator-6">
        <button onClick={(event) => {
          event.preventDefault();
          create(
            label.value,
            code.value,
            ( error ) => error && this.setState({ error: error.toString() })
          );
          label.value = "";
          code.value = "";
        }} >
          Créer Session
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
      { open ? "Ouverte" : "Close" }
    </td>
    <td className="SessionPicker-2"> { label } </td>
    <td className="SessionPicker-3"> { code } </td>
    <td className="SessionPicker-4">
      { date }
    </td>
    <td className="SessionManager-body-5"> { student } </td>
    <td>
      <button onClick={function(event) {
        event.stopPropagation();
        !open ? openSession( label ) : closeSession( label );
      }} >
        { !open ? "Ouvrir" : "Clôturer" }
      </button>
      <button onClick={function(event) {
        event.stopPropagation();
        confirm(`Supprimer ${label} ?`) && deleteSession(label);
      }} >
        Suppr. Session
      </button>
    </td>
  </tr>
)

const SessionManagerHead = () => (
  <tr className="SessionManager-head">
    <th className="SessionManager-head-0"> Affichée </th>
    <th className="SessionManager-head-1"> Etat </th>
    <th className="SessionManager-head-2"> Label de la Session </th>
    <th className="SessionManager-head-3"> Code de la Session </th>
    <th className="SessionManager-head-4"> création </th>
    <th className="SessionManager-head-5"> Pop. </th>
    <th className="SessionManager-head-6"> Options </th>
  </tr>
)
