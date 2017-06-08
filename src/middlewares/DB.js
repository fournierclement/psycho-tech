switch ( process.env.DB ) {
  case "MySQL":
    module.exports = require("./mysql") ;
    break
  case "Redis":
    module.exports = require("./redis");
    break
  case "FileSystem":
  default:
    module.exports = require("./fs");
    break
}
