const React = require('react');
const { renderToString } = require('react-dom/server');
const { match, RouterContext } = require('react-router');
const { routes } = require('../assets/app');

/*
* @desc Middleware, make react pre-render the matched page.
*/
const handleRoute = (req, res) => {
  match({
    routes,
    location: req.url
  }, (error, redirect, props) => {
    if (error) { res.status(500).send(err.message) }
    //React-router can manage redirect cases
    else if (redirect) { res.redirect(302, redirect.pathname + redirect.search) }
    //Successful case
    else if (props) {
      //Pre-render the react route
      const html = renderToString(RouterContext(...props));
      //Embded it in the index page
      res.status(200).render('index', { app: html });
      //done.
    } else { res.status(404).send('Not Found'); }
  });
}

module.exports = handleRoute;
