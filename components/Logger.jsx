import React from "react";


/**
* @desc Form Module to send ids data to the connection api route.
* @type { node }
* @param { Object } ids,
* @param { String } route, api route call,
*/
export const Logger = ({ ids, route, children }) => (
  <div className="Logger">
    { children }
  </div>
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
export const SessionsLog = ({ filter, sessions }) => (<div className="SessionsLog" />)

/**
* @desc Capture a session code to log in
*/
export const SessionsCodeLog = () => (<div className="SessionsCodeLog" />)
