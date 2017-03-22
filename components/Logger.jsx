import React from "react";


/**
* @desc Form Module to send ids data to the connection api route.
* @type { node }
* @param { String } value, title and button text.
* @param { String } id, id of the caller.
* @param { String } route, api route call.
  Show a button, when trigger, show an hexagonal form, on load show a onLoad.
*//**
export class Logger extends React.Component {
  constructor ( props ) {
    super( props );
  }
  render () {
    const { value, children } = this.props;
    return (
      <span className="Logger">
        <a href="#"> { value } </a>
        { children }
      </span>
    )
  }
  onClick () {}
  onSubmit () {}
}
**/
export const Logger = ({ value }) => (
  <a className="Logger" href="./oki" >
    { value }
  </a>
)
/**
* @desc Email input to capture email
*/
export const EmailLog = () => (<div className="EmailLog" />)

/**
* @desc Password logger
*/
export const PassLog = () => (<div className="PassLog" />)

/**
* @desc select a session from it label
* @param { Function } filter to pick only some sessions
*/
export const SessionsLog = ({ filter }) => (<div className="SessionsLog" />)

/**
* @desc Capture a session code to log in
*/
export const SessionsCodeLog = () => (<div className="SessionsCodeLog" />)
