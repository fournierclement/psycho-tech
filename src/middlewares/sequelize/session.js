import sequelize from "./mySequelize";
import Sequelize from "sequelize";


/**
  session = {
    open: Boolean,
    label: String // unique,
    code: String,
    date: String,
    student: int,
    data: JSON.stringify([ 0, 0, 0, 0, 0, 0]),
  }
*/

export default sequelize.define( "session", {
  open: Sequelize.BOOLEAN,
  label: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
  code: { type: Sequelize.STRING, allowNull: false },
  date: Sequelize.STRING,
  student: Sequelize.INTEGER,
  data: { type: Sequelize.STRING, defaultValue: '[0,0,0,0,0,0]'},
})
