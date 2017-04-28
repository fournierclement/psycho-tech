import express from 'express';
import serveStatic from 'serve-static';

import api from "./api";
import { isoMiddleware } from './middleware/iso';
import { Dir } from './config';

process.env.SERVER = true;
const app = express();

// use ejs template engine on express
app
  .set('view engine', 'ejs')
  .set('views', Dir.views);

app
  .use('/build', serveStatic(Dir.build))
  .use('/static', serveStatic(Dir.static))
  .use('/api', api)
  .use(isoMiddleware);

app
    .listen(
      "5000",
      "localhost",
(err) => console.log(err || "On air"));
