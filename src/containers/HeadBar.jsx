import React from "react";
import { Link } from "react-router";

/**
* @desc Bar on top of the pages
* @type { leaf }
* @param { String } id, id of the ressourced user.
* @param { String } userGrp, type of user.
*/
/**
* Use Cases :
  => Visitor : Connexion admin | Bouton passer test | Voir resultats
  => student : Show Id | Bouton passer test | quitter
  => Admin : Dashboard | Creer une sessions de test | Deconnexion
*/
export const HeadBar = ({ log }) => (
  <div className="HeadBar">
    <LeftBar log={log} />
    <CenterBar />
    <RightBar />
  </div>
)

class LeftBar extends React.Component {
  constructor(props){
    super(props);
    this.state = { active: false }
  }
  toggler(){
    this.setState({active: !this.state.active})
    return console.log(this.state.active);
  }
  render() {
    const { log } = this.props;
    return (
      <div className="HeadBar-left" >
        { log === "admin" ? (
          <Link to="dashboard"> Dashboard </Link>
        ) : (
          <div className="HeadBar-left-admin-button">
            {!this.state.active && (<button onClick={() => this.toggler() }> Connexion </button>)}
            {this.state.active && (<button onClick={() => this.toggler()}> Annuler </button>)}
            {this.state.active && (<LoggerAdmin diseable={() => this.toggler() } />)}
          </div>
        )}
      </div>
    )
  }
}

const LoggerAdmin = ({ diseable }) => (
  <div className="LoggerAdmin" onClick={ diseable } >
    Je suis le logger Admin
  </div>
)

const CenterBar = () => (
  <div className="HeadBar-center" >
    This is the Center of the navbar
  </div>
)

const RightBar = () => (
  <div className="HeadBar-right" >
    This is the right of the navbar
  </div>
)
