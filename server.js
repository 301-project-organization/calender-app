'use strict';

// Application Setup:

require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const PORT = process.env.PORT || 4000;
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (err) => console.log(err));


client.connect().then(() => {
    app.listen(PORT, () => console.log(`my server is up and running on port ${PORT}`));
  });