switch ( process.env.DB ) {
  case "MySQL":
    require('./sequelize/BDSync');
    module.exports = require("./mysql") ;
    break
  case "Redis":
    module.exports = require("./redis");
    break
  default:
    console.error( "No database selected: MySQL, Redis" );
    process.exit( 1 )
    break
}
