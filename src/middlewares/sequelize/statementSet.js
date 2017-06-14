import sequelize from "./mySequelize";
import Sequelize from "sequelize";
/**
[
  {"value":"a","profile":"Realiste","index":"0","text":"Vous aimez avoir des activités à l’extérieur, travailler en plein air"},
  {"value":"b","profile":"Investigatif","index":"1","text":"Vous aimez élargir vos connaissances par l’étude, pouvoir approfondir un sujet"},
  {"value":"c","profile":"Artistique","index":"2","text":"Vous aimez travailler de façon indépendante, sans méthode ni objectif structurés"},
  {"value":"d","profile":"Social","index":"3","text":"Vous aimez travailler avec d’autres personnes pour les informer"},
  {"value":"e","profile":"Entrepreneur","index":"4","text":"Vous admirez les personnes qui ont du pouvoir ou gagnent beaucoup d’argent"},
  {"value":"f","profile":"Conventionnel","index":"5","text":"Vous aimez travailler avec des chiffres"}
]
*/
export default sequelize.define( 'statementSet', {
  id: { type: Sequelize.INTEGER, primaryKey: true },
  "0": Sequelize.STRING,
  "1": Sequelize.STRING,
  "2": Sequelize.STRING,
  "3": Sequelize.STRING,
  "4": Sequelize.STRING,
  "5": Sequelize.STRING,
})
