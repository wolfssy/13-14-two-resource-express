'use strict';

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const app = express();
let isOn = false;
let http = null;


app.use(cors({ origin: process.env.ORIGIN_URL })); // browser request support
app.use(morgan('dev')); // logger middleware


app.use(require('../route/book-router.js'));

app.all('*', (req, res) => res.sendStatus(404));

app.use(require('./error-middleware.js'));

module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if(isOn)
        return reject(new Error('__SERVER_ERROR_ server is allready on'));
      http = app.listen(process.env.PORT, () => {
        isOn = true;
        console.log('__SERVER_ON__', process.env.PORT);
        resolve();
      });
    })
      .then(() => {
        return mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
      });
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if(!isOn)
        return reject(new Error('__SERVER_ERROR_ server is allready off'));
      if(!http)
        return reject(new Error('__SERVER_ERROR_ server does not exist'));
      http.close(() => {
        isOn = false;
        http = null;
        console.log('__SERVER_OFF__');
        resolve();
      });
    })
      .then(() => mongoose.disconnect());
  },
};
