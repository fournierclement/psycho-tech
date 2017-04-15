import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Components
import { PageLayout } from './containers/PageLayout';
import { Home } from "./containers/Home";

export default (
  <Route path="/" component={ PageLayout }>
    <IndexRoute component={ Home } />
  </Route>
);

// <Route path="/session/" c{() => <Test />} />
// {/* Passing Test (session/:id) */}
// {/* Result of a test (result/:id) */}
// <Route path="/results/" render={() => <Results />} />
// {/* Admin (need oauth)*/}
// <Route path="/dashboard" render={() => <AdminHeadBar />} >
// <Route exact={true} path="/dashboard/" render={() => <SessionPicker />} />
// <Route exact={true} path="/dashboard/sessions" render={() => <SessionPicker />} />
// <Route exact={true} path="/dashboard/modos" render={() => <Moderators />} />
// <Route exact={true} path="/dashboard/me" render={() => <Profile />} />
// </Route>
// {/* universals */}
// <Route path="/login" render={() => <Login />} />
// <Route path="/logout" render={() => <Logout />} />
// <Route path="/accessing" render={() => <Login />} />
