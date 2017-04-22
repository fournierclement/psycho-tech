import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Components
import { PageLayout } from './containers/PageLayout';
import { LogPage } from "./containers/Logger";
import { Dashboard } from "./containers/Dashboard";
import { SessionPage, SessionStart, QuestionBox, Question, Result } from "./containers/Session";

export default (
  <Route path="/" component={ PageLayout }>
    <IndexRoute component={ LogPage } />

    <Route path="session/:sessionid" component={ SessionPage } >
      <IndexRoute component={ SessionStart } />
      <Route path="question" component={ QuestionBox }>
        <Route path=":questionid" component={ Question }/>
      </Route>
      <Route path="result" component={ Result } />
    </Route>

    <Route path="admin" component={ Dashboard } />
  </Route>
);
