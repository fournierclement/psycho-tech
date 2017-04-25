import React from 'react';
import { Link } from "react-router";

const lang_Fr = {
  "session-top": "Session ",
  "sessionStart-text": "Choisissez et ordonnez les affirmations suivantes.",
  "sessionStart-button": "Commencer",
  "QuestionBox-top": "Questions",
  "QuestionBox-bot": "Question suivante",
  "Question-head-0": "Affirmations",
  "Question-head-1": "1",
  "Question-head-2": "2",
  "Question-head-3": "3",
}

//Bootstrap
const
  sessionName= "Ig2019",
  username = "Lonzet",
  questions = [
    [{text: "Affirmation 1", value: "1"}, {text: "Affirmation 2", value: "2"}, {text: "Affirmation 3", value: "3"}, {text: "Affirmation 4", value: "4"}, {text: "Affirmation 5", value: "5"}, {text: "Affirmation 5", value: "6"}],
    [{text: "Affirmation 1", value: "1"}, {text: "Affirmation 2", value: "2"}, {text: "Affirmation 3", value: "3"}, {text: "Affirmation 4", value: "4"}, {text: "Affirmation 5", value: "5"}, {text: "Affirmation 5", value: "6"}],
    [{text: "Affirmation 1", value: "1"}, {text: "Affirmation 2", value: "2"}, {text: "Affirmation 3", value: "3"}, {text: "Affirmation 4", value: "4"}, {text: "Affirmation 5", value: "5"}, {text: "Affirmation 5", value: "6"}],
    [{text: "Affirmation 1", value: "1"}, {text: "Affirmation 2", value: "2"}, {text: "Affirmation 3", value: "3"}, {text: "Affirmation 4", value: "4"}, {text: "Affirmation 5", value: "5"}, {text: "Affirmation 5", value: "6"}],
    [{text: "Affirmation 1", value: "1"}, {text: "Affirmation 2", value: "2"}, {text: "Affirmation 3", value: "3"}, {text: "Affirmation 4", value: "4"}, {text: "Affirmation 5", value: "5"}, {text: "Affirmation 5", value: "6"}],
    [{text: "Affirmation 1", value: "1"}, {text: "Affirmation 2", value: "2"}, {text: "Affirmation 3", value: "3"}, {text: "Affirmation 4", value: "4"}, {text: "Affirmation 5", value: "5"}, {text: "Affirmation 5", value: "6"}]
  ];


/**
* @desc Session Page, from a first box with description, to the result, with questions.
*/
export const SessionPage = ({ children, params }) => (
  <div className="SessionPage" >
    <div className="Session-top">
      { lang_Fr["session-top"] }{ sessionName }, { username } :
    </div>
    { children }
    <div className="Session-bot">
    </div>
  </div>
)

export const SessionStart = ({ children, params }) => (
  <div className="Session-start" >
    { lang_Fr["sessionStart-text"] }
    <Link to={ "/session/" + params.sessionid + "/question/1"}>
      { lang_Fr["sessionStart-button"] }
    </Link>
  </div>
)

/**
* @desc QuestionBox show, submit and pass to the next question.
* Should send to the API each subimited question along the user.
*/
export class QuestionBox extends React.Component {
  componentWillReceiveProps(nextProps){
    this.props.params.questionid === nextProps.params.questionid || this.setState({})
  }
  render() {
    const { children, params } = this.props
    return (
      <form className="QuestionBox">
        <div className="QuestionBox-top">
          { lang_Fr["QuestionBox-top"] } { params.questionid } / 12;
        </div>
          { children }
        <div className="QuestionBox-bot">
          <Link to={
            "/session/"
            + params.sessionid
            + ( questions.length == params.questionid
              ? "/result" : "/question/" + (1*params.questionid + 1)
            )}
            >
          { lang_Fr["QuestionBox-bot"] }
          </Link>
        </div>
      </form>
    )
  }
}

/**
* Should ask the API the content of the questions
*/
export const Question = ({params}) => (
  <table className="Question" >
    <thead>
      <tr>
        <th> {lang_Fr["Question-head-0"]} </th>
        <th> {lang_Fr["Question-head-1"]} </th>
        <th> {lang_Fr["Question-head-2"]} </th>
        <th> {lang_Fr["Question-head-3"]} </th>
      </tr>
    </thead>
    <tbody>
      { questions[ params.questionid - 1 ].map(({text, value}, i) =>
        ( <tr key={i} >
            <td>{text}</td>
            <td><label><input type="radio" value={value} name="1" /></label></td>
            <td><label><input type="radio" value={value} name="2" /></label></td>
            <td><label><input type="radio" value={value} name="3" /></label></td>
          </tr> )
      )}
    </tbody>
  </table>
)

export const Result = ({}) => (
  <div className="Result" >
    This is the result
  </div>
)
