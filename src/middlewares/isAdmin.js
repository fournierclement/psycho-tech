module.exports =  (req, res, next) => ( req.session.isAdmin ? next() : res.sendStatus( 401 ));
