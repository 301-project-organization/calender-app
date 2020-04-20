'use strict';
// Load Environment Variables from the .env file
require('dotenv').config();

// Setting up dependencies
const express = require('express');
const superagent = require('superagent');
const PORT = process.env.PORT || 4000;
const app = express();
const pg = require('pg'); // To load the PostgreSQL client of node JS.
const methodOverride = require('method-override'); // To be able to use update and delete methods with POST

// make a connection to the psql using the provided link
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (err) => console.log(err));



// Setting up the view engine and the pages
app.set('view engine','ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// To get the CSS and JS frontend files
app.use(express.static('./public'))


// Functions handlers 
const mainPageHandler = require('./modules/home.js');
const updateHandler = require('./modules/update.js');
const showDetailsHandler = require('./modules/details.js');
const searchHandler = require('./modules/searchHandler.js');
const searchForm = require('./modules/searchForm.js');
const aboutPageHandler = require('./modules/about.js');


// Routes
app.get('/',mainPageHandler);
app.get('/searchform',searchForm);
app.post('/newsearch',searchHandler);
app.get('/details',showDetailsHandler);
app.get('/update',updateHandler );
app.get('/about',aboutPageHandler);

// Last route for non existing pages
app.get('*',notFoundHandler);


function errorHandler (error,request,response){
  response.status(500).send('SORRY AN ERROR OCCURED '+ error);
}
function notFoundHandler (req,res){
  res.status(404).send('Error 404: URL Not found');
}

// Constructor Functions:


app.use(errorHandler);

client.connect().then(() => {
  app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));

}).catch(err=> errorHandler(err,request,response));

