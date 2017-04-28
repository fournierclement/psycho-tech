import React from 'react';
import axios from "axios";
import { Link } from "react-router";
import { RadarChart } from "./RadarChart";

const lang_Fr = {
  "session-top": "Session ",
  "sessionStart-text": "Choississez 3 affirmations pour chaque lot et ordonnez les de 1 pour la plus importante à 3.",
  "sessionStart-button": "Commencer",
  "StatementBox-top": "Statements",
  "StatementBox-bot": "Statement suivante",
  "Statement-head-0": "Affirmations",
  "Statement-head-1": "1",
  "Statement-head-2": "2",
  "Statement-head-3": "3",
}

const STATEMENT_SETS = 12;
const STATEMENTS_BY_SET = 6;

/**
* @desc Session Page
*/
export class SessionPage extends React.Component {
  constructor( props ){
    super( props );
    this.state = { student: props.params.student || {}};
  }

  nextStep() {
    this.setState({
      student: Object.assign(
        {},
        this.state.student,
        { step: this.state.student.step + 1 }
      )
    })
  }

  render() {
    const { params } = this.props;
    let toProps = {
      label: params.label,
      statementSet: this.state.student.step,
      nextStep: this.nextStep.bind( this )
    }
    return (
      <div className="SessionPage" >
        <div className="Session-top">
          { lang_Fr["session-top"] }{ params.label }, { this.state.student.email } :
        </div>

        {/* Presents the test */}
        { (this.state.student.step === 0) && <Start { ...toProps } /> }
        {/* Show the statements sets */}
        {
          (this.state.student.step > 0) && (this.state.student.step <= STATEMENT_SETS)
          && <Checker { ...toProps } />
        }
        {/* Show the final result */}
        { (this.state.student.step > STATEMENT_SETS) && <Result { ...toProps } /> }

        <div className="Session-bot">
        </div>
      </div>
    )
  }
}

export const Start = ({ nextStep }) => (
  <div className="Session-start" >
    { lang_Fr["sessionStart-text"] }
    <button onClick={ nextStep } >
    { lang_Fr["sessionStart-button"] }
    </button>
  </div>
)

/**
* @desc StatementBox show, submit and pass to the next statement.
* Should send to the API each subimited statement along the user.
*/
export class Checker extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      statementSet: [],
      error: ""
    }
  }

  componentDidMount() {
    this.fetchStatementSet( this.props.statementSet )
  }

  componentWillReceiveProps(nextProps) {
    nextProps.statementSet !== this.props.statementSet && this.fetchStatementSet( nextProps.statementSet )
  }

  fetchStatementSet( statementSet ) {
    return axios.get( "/api/statements/" + statementSet )
    .then( res => this.setState({ statementSet: res.data }))
  }

  submitAnswer( radios, callback ) {
    if ( radios.length != 3 ) { callback("Vous devez selectionner 3 réponses.")}
    else {
      let scores = { a:0, b:0, c:0, d:0, e:0, f:0 };
      radios.forEach( radios => scores[ radios.value ] = 1*radios.name );
      axios.post( "/api/sessions/" + this.props.label + "/student/" + this.props.statementSet, scores )
      .then( res => res.status === 204 && this.props.nextStep() )
      .catch( callback )
    }
  }

  render() {
    const { statementSet } = this.props;
    let radios = [];
    const actualise = ({ target }) => {
      radios.forEach( input => (
        ( input.value === target.value && input.name !== target.name )
        && ( input.checked = false )
      ));
    }
    return (
      <form
        className="StatementSet"
        onSubmit={ event => this.handleSubmit( event )}
        >
        <div className="StatementSet-top">
          { lang_Fr["StatementSet-top"] } { statementSet } / { STATEMENT_SETS };
        </div>
        <table className="StatementSet-table" >
          <thead>
            <tr>
              <th> {lang_Fr["Statement-head-0"]} </th>
              <th> {lang_Fr["Statement-head-1"]} </th>
              <th> {lang_Fr["Statement-head-2"]} </th>
              <th> {lang_Fr["Statement-head-3"]} </th>
            </tr>
          </thead>
          <tbody>
            { this.state.statementSet.map(({ text, value }, i) =>
              ( <tr className="statement" key={ i } >
                  <td>{ value + ". " + text }</td>
                  <td><label><input onChange={ actualise } ref={ input => radios.push( input )} type="radio" value={ value } name="3" /></label></td>
                  <td><label><input onChange={ actualise } ref={ input => radios.push( input )} type="radio" value={ value } name="2" /></label></td>
                  <td><label><input onChange={ actualise } ref={ input => radios.push( input )} type="radio" value={ value } name="1" /></label></td>
                </tr> )
            )}
          </tbody>
        </table>
        <div className="StatementSet-bot">
          <div className="Checker-error">
            <b> { this.state.error } </b>
          </div>
          <input
            type="submit"
            value="Suivant ->"
            onClick={ event => {
              event.preventDefault();
              this.submitAnswer(
                radios.filter( radio => radio.checked ),
                ( error ) => this.setState({ error: error.toString() })
              );
            }}
            />
        </div>
      </form>
    )
  }
}


class Result extends React.Component {
  constructor() {
    super();
    this.state = {
      student: {},
      session: {}
    };
  }
  componentDidMount() {
    axios.get( "/api/sessions/" + this.props.label + "/student/result" )
    .then(res => this.setState({ student: res.data.student, session: res.data.session }))
  }
  render () {
    return (
      <div className="Session-result">
        <RadarChart
          sessions={[{
            label: this.state.session.label,
            data: this.state.session.data || [],
            fillColor: `rgba(200, 50, 50, 0.5)`,
            strokeColor: `rgb(200, 50, 50)`,
            pointColor: `rgb(200, 50, 50)`
          }, {
            label: this.state.student.email,
            data: this.state.student.scores || [],
            fillColor: `rgba(50, 200, 50, 0.5)`,
            strokeColor: `rgb(50, 200, 50)`,
            pointColor: `rgb(50, 200, 50)`
          }]}
          />
        <div className="Result-pngs">
          {
            this.state.student.scores
            && this.state.student.scores
            .map(( score, i) => ({ score: score, index: i }))
            .sort(( a, b ) => ( a.score > b.score ? ( -1 ) : ( a.score === b.score ? ( 0 ) : 1 )))
            .map(({ index }, i) => (
              <img className="png" key={i} src={"/static/" + index + ".png"} />
            ))
          }
        </div>
      </div>
    )
  }
}
