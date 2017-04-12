import React from 'react';
import { Route, IndexRoute } from 'react-router';

// import { HeadBar } from "./HeadBar.jsx";
// import { Footer } from "./Footer.jsx";
// import { Home } from "./Home.jsx";

export const routes = () => (
  <Route path="/" component={ Page }>
    {/* Home */}
    coucou
  </Route>
);

/**
*
*/
class Page extends Component {

  static fetchData() {}

  render(){
    return (
      <div className="App" >
      {/*<HeadBar />*/}
      {this.props.children}
      {/*<Footer />*/}
      </div>
    )
  }
}
