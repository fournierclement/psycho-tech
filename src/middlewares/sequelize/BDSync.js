import session from "./session";
import statementSet from "./statementSet";
import student from "./student";
const JsonSets = require( "../statementSets.json" );

statementSet.sync()
.then( () => session.sync())
.then( () => student.sync())

// Set the statementSet if exists
.then( done => (
  statementSet.findAll({ order: ["id"]})
  .then( sets => Promise.all(
    JsonSets
    .map(( JsonSet, i ) => [...JsonSet, 1+i])
    .filter(( JsonSet, i ) => !(sets.filter( set => set.id === 1+i) != false ))
    .map( JsonSet => statementSet.create({
      "id": JsonSet[ 6 ],
      "0": JSON.stringify( JsonSet[ 0 ]),
      "1": JSON.stringify( JsonSet[ 1 ]),
      "2": JSON.stringify( JsonSet[ 2 ]),
      "3": JSON.stringify( JsonSet[ 3 ]),
      "4": JSON.stringify( JsonSet[ 4 ]),
      "5": JSON.stringify( JsonSet[ 5 ]),
    }))
  ))
))

.catch( error => console.error( error ) || process.exit( 1 ))
