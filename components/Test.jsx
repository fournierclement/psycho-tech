import React from "react";

/**
* @desc Page of the test
*/
export const Test = ( props ) => (
  <div id="Test" className="Test">
    <HeadBar { ...props } />
    <QuestionBox />
    <Footer />
  </div>
)


/**
* @desc just show one response row.
*/
const Response = ({ text, profile }) => (
  <tr className="Response" >
    <td> { text } </td>
    <td>
      <label>
        <input type="radio" name="first" value={ profile }/>
      </label>
    </td>
    <td>
      <label>
        <input type="radio" name="second" value={ profile }/>
      </label>
    </td>
    <td>
      <label>
        <input type="radio" name="third" value={ profile }/>
      </label>
    </td>
  </tr>
)

/**
* @desc Show and manage the responses.
  Each Next Post the response points and pass to the next question.
*/
const QuestionBox = () => (
  <form className="QuestionBox" >
    <table>
      <thead>
        <tr>
          <th> Groupe 1 </th>
          <th> Choix 1 </th>
          <th> Choix 2 </th>
          <th> Choix 3 </th>
        </tr>
      </thead>
      <tbody>
        {/* Map the responses there */}
      </tbody>
    </table>
    <input type="submit" />
  </form>
)
