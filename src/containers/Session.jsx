import React from 'react';
import axios from "axios";
import { Link } from "react-router";
import { RadarChart, ChartWithLegend } from "./RadarChart";

const STATEMENT_SETS = 12;
const STATEMENTS_BY_SET = 6;

/**
* @desc Session Page
*/
export class SessionPage extends React.Component {
  constructor( props ){
    super( props );
    this.state = { student: props.params.student || {}, step: props.params.student && props.params.student.closed ? 1 + STATEMENT_SETS : 0 };
  }
  componentDidMount() {
    axios.get( "/api/statements/" )
    .then( res1 => (
      axios.get( "/api/student/" + this.props.params.label + "/me" )
      .then(res2 => ({ statementSets: res1.data, student: res2.data, step: res2.data && res2.data.closed ? 1 + STATEMENT_SETS : 0  }))
    ))
    .then( update => this.setState( update ))
  }
  nextStep() { this.setState({ step: this.state.step + 1 })}
  previousStep() { this.setState({ step: this.state.step - 1 })}
  render() {
    const { params } = this.props;
    const closed = this.state.student.closed;
    let toProps = {
      params: params,
      label: params.label,
      step: this.state.step,
      statementSets: this.state.statementSets,
      nextStep: this.nextStep.bind( this ),
      previousStep: this.previousStep.bind( this )
    }
    return (
      <div className="SessionPage" >
        <div className="Session-top">
          Session { params.label }, { this.state.student.email } :
        </div>

        {/* Presents the test */}
        {( this.state.step === 0 ) && <Start { ...toProps } /> }
        {/* Show the statements sets */}
        {
          ( this.state.step > 0 ) && (this.state.step <= STATEMENT_SETS)
          && <Form { ...toProps } />
        }
        {/* Show the final result */}
        {( this.state.step > STATEMENT_SETS ) &&  <Result { ...toProps } /> }

        <div className="Session-bot">
        </div>
      </div>
    )
  }
}

const Start = ({ nextStep }) => (
  <div className="Session-start" >
    <p> Vous trouverez 12 groupes de phrases, composées chacune de 6 propositions (A, B, C, D, E, F). </p>
    <p> Dans chaque groupe de phrases, il s’agit de repérer et de classer par ordre de préférence les 3 propositions qui vous caractérisent le plus au travail. </p>
    <p> 1 est la plus importante ou véridique, 3 la moins importante ou véridique. </p>
    <p> Il n’y a pas ici ni bonnes, ni mauvaises réponses, elles seront toutes bonnes si elles expriment votre choix spontané. </p>
    <p> Votre temps n’est pas limité. </p>
    <p> Vos résulats resteront disponibles pendant un mois </p>
    <p>
      <button onClick={ nextStep } >
        Commencer
      </button>
    </p>
  </div>
)

/**
* @desc StatementBox show, submit and pass to the next statement.
* Should send to the API each subimited statement along the user.
*/
class Form extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      error: "",
      loading: false,
      score: { a:0, b:0, c:0, d:0, e:0, f:0 },
    }
  }
  componentWillReceiveProps(nextProps) { nextProps.step !== this.props.step && this.loadResponse( nextProps.step )}
  componentDidMount() { this.loadResponse( this.props.step )}
  loadResponse( step ){
    //
    axios.get( "/api/student/" + this.props.label + "/me/" + step )
    .then(({ data }) => data || { a:0, b:0, c:0, d:0, e:0, f:0 })
    .then( score => this.setState({ score: score, loading: false }))
  }
  submitAnswer( callback ) {
    let { score } = this.state;
    if (Object.keys( score ).reduce((( a, b )=> a + 1*score[ b ]), 0) < 6) {
      //if the cumulation of the key value isn't 1+2+3, send :
      callback("Vous devez selectionner 3 réponses.")
    }
    else {
      this.setState({ loading: true });
      axios.post(
        "/api/student/" + this.props.label + "/me/" + this.props.step,
        score
      )
      .then( res => res.status === 204 && this.props.nextStep() )
      .catch( callback )
    }
  }
  check( row, column ) {
    let { score } = this.state;
    Object.keys( score )
    .forEach( key => (
      // Reset the hold choice
      (( score[ key ] == column ) && ( score[ key ] = 0 ))
      // And set the new one
      || (( key == row ) && ( score[ key ] = column ))
    ))
    this.setState({ score: score })
  }
  render() {
    const { statementSets, step, previousStep } = this.props;
    return (
      <form
        className="StatementSet"
        onSubmit={ event => this.handleSubmit( event )}
        >
        <div className="StatementSet-top">
          Groupe { step } / { STATEMENT_SETS }
        </div>
        { this.state.loading || (
          <table className="StatementSet-table" >
            <thead>
              <tr>
                <th> Propositions : </th>
                <th> 1 </th>
                <th> 2 </th>
                <th> 3 </th>
              </tr>
            </thead>
            <Checker
              statementSet={ statementSets[ step - 1 ] }
              score={ this.state.score }
              onCheck={ this.check.bind( this )}
              />
          </table>
        )}
        <div className="StatementSet-bot">
          { (step > 1) && <input
            type="button"
            value="<- Précedent"
            onClick={ event => {
              event.preventDefault();
              previousStep();
            }}
            />
          }
          <div className="Checker-error">
            <b> { this.state.error } </b>
          </div>
          <input
            type="submit"
            value="Suivant ->"
            onClick={ event => {
              event.preventDefault();
              this.submitAnswer(( error ) => this.setState({ error: error.toString() }));
            }}
            />
        </div>
      </form>
    )
  }
}

/**
* @desc The checker box which shwo the statements and previous responses
*/
const Checker = ({ statementSet, score, onCheck }) => (
  <tbody className="Checker">
    { statementSet.map(({ text, value }, i) =>
      ( <tr className="statement" key={ i } >
          <td>{ value + ". " + text }</td>
          <td><label><input onClick={() => onCheck( value, 3 )} type="radio" value={ value } name="3" checked={ score[ value ] === 3 }/></label></td>
          <td><label><input onClick={() => onCheck( value, 2 )} type="radio" value={ value } name="2" checked={ score[ value ] === 2 }/></label></td>
          <td><label><input onClick={() => onCheck( value, 1 )} type="radio" value={ value } name="1" checked={ score[ value ] === 1 }/></label></td>
        </tr> )
    )}
  </tbody>
)

class Result extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      student: {},
      session: {}
    };
  }
  componentwillMount() {
  }
  componentDidMount() {
    this.refreshResults()
    setInterval( this.refreshResults.bind(this), 5000 )
  }
  refreshResults() {
    axios.get( "/api/student/" + this.props.params.label + "/me/result" )
    .then(res => this.setState({ student: res.data.student, session: res.data.session }))
  }
  render () {
    return (
      <div className="Session-result">
        <ChartWithLegend
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
