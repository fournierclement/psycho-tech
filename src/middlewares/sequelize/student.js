import sequelize from "./mySequelize";
import Sequelize from "sequelize";

import Session from "./session";
/**
student = {
    "closed":true,
    "email":"c@c",
    "session":"autre",
    "answeri": '{"a":3,"b":0,"c":2,"d":0,"e":0,"f":1}',
    "scores": [24,18,28,7,10,14]
  }
*/
const Student = sequelize.define( "student", {
  closed: Sequelize.BOOLEAN,
  scores: Sequelize.STRING,
  timestamp: Sequelize.BIGINT,
  email: {
    type: Sequelize.STRING,
    primaryKey: true,
    unique: false,
  },
  session: {
    type: Sequelize.STRING,
    primaryKey: true,
    unique: false,
    reference: {
      model: Session,
      key: "label",
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  //Dirty az hell but nocare
  answer0: { type: Sequelize.STRING, defaultValue: '{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0}'},
  answer1: { type: Sequelize.STRING, defaultValue: '{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0}'},
  answer2: { type: Sequelize.STRING, defaultValue: '{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0}'},
  answer3: { type: Sequelize.STRING, defaultValue: '{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0}'},
  answer4: { type: Sequelize.STRING, defaultValue: '{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0}'},
  answer5: { type: Sequelize.STRING, defaultValue: '{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0}'},
  answer6: { type: Sequelize.STRING, defaultValue: '{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0}'},
  answer7: { type: Sequelize.STRING, defaultValue: '{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0}'},
  answer8: { type: Sequelize.STRING, defaultValue: '{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0}'},
  answer9: { type: Sequelize.STRING, defaultValue: '{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0}'},
  answer10: { type: Sequelize.STRING, defaultValue: '{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0}'},
  answer11: { type: Sequelize.STRING, defaultValue: '{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0}'},
})

export default Student;
