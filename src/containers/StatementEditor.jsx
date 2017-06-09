import React from "react";
import axios from "axios";

export class StatementEditor extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      statementSets: [],
    }
  }
  componentDidMount() {
    axios.get( "/api/statements/" )
    .then( res => this.setState({ statementSets: res.data }))
  }
  save( set, index, text ) {
    let sets = this.state.statementSets;
    sets[ set ][ index ].text = text ;
    axios.post(`/api/statements/${ set }/${ index }`, {text: text})
    .then( res => this.setState({ statementSets: sets }))
    .catch( error => console.error( error ))
  }
  render() {
    return (
      <div className="StatementEditor">
        { this.state.statementSets.map(( statementSet, set) => (
          <div className="StatementSets" key={ set } >
            <p> Groupe { 1 + set } </p>
            <span>
              { statementSet.map(( statement, index ) => {
                let text;
                return (
                  <form
                    className="Statement"
                    key={ index }
                    >
                    <input
                      defaultValue={ statement.text }
                      ref={ input =>  text = input }
                      />
                    <input type="button" value="Sauvegarder" onClick={() => this.save( set, index, text.value )}/>
                  </form>
                )}
              )}
            </span>
          </div>
        ))}
      </div>
    )
  }
}
