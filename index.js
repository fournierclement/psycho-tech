const express = require("express");
const handleRoute = require("./mods/handle-route");

app.set('view engine', 'ejs');

const app = express();

app.use(handleRoute);

app.listen(5000, ()=> console.log("done"));
