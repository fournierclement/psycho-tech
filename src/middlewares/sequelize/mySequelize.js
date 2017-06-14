import Sequelize from "sequelize";

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER_DB,
  process.env.PWD_DB, {
  host: 'localhost',
  dialect: 'mysql',
  define: {
      timestamps: false,
    },
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

sequelize.authenticate()
.then(() => console.log("db connected"))
.catch( error => console.error( "db connection error :" + error ))

export default sequelize;
