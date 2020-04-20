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
const searchHandler = require('./modules/searchHandler.js');
const searchForm = require('./modules/searchForm.js');
const aboutPageHandler = require('./modules/about.js');


// Routes
app.get('/',mainPageHandler);
app.get('/searchform',searchForm);
app.post('/newsearch',searchHandler);
app.get('/about',aboutPageHandler);
app.post('/addFavorites',addToFavorites);
app.get('/favorites',showFavorites);
app.get('/details/:id',showDetailsHandler);
app.put('/update/:id',updateHandler);
app.get('/edit/:id',editHandler);
app.delete('/delete/:id', deleteHandler);

// Last route for non existing pages
app.get('*',notFoundHandler);

function deleteHandler (req,res){
  const SQL = 'DELETE FROM holidays WHERE id=$1';
  const values = [req.params.id];
  client
      .query(SQL, values)
      .then((results) => res.redirect('/'))
      .catch((err) => errorHandler(err, req, res))
}

function editHandler (req,res){
  const SQL = 'SELECT * FROM holidays WHERE id=$1;';
  const values = [req.params.id];
  client
      .query(SQL, values)
      .then((results) => {
      res.render('./pages/layout/update', { show : results.rows[0] });
      })
      .catch((err) => {
      errorHandler(err, req, res);
      });
}

function updateHandler (req,res){
  const SQL = 'UPDATE holidays SET country=$1, holidayname=$2, description=$3, date=$4, type=$5, picture_url=$6 WHERE id=$7;';
  const values =[req.body.country, req.body.holidayname ,req.body.description ,req.body.date, req.body.type,req.body.picture_url ,req.params.id];
  client
  .query(SQL,values).then((results)=> res.redirect (`/details/${req.params.id}`))
  .catch(err => errorHandler(err,req,res));
}



function showDetailsHandler(req,res){
  const SQL = 'SELECT * FROM holidays WHERE id=$1;';
  const values = [req.params.id];
  client.query(SQL, values).then(results =>{
    res.render('./pages/layout/detail',{ show : results.rows[0]});
  })
  .catch((err) => {
    errorHandler(err, req, res);
  });
  }



function addToFavorites(req,res){
  const  {name,pic,country,description,date,type} = req.body;
  const SQL = 'INSERT INTO holidays (holidayname,picture_url,country,description,date,type) VALUES ($1,$2,$3,$4,$5,$6)';
  const values = [name,pic,country,description,date,type];
  client.query(SQL,values).then(results=>{
    res.redirect('/favorites');
  }).catch(error=>errorHandler(error,req,res));
}

function showFavorites(req,res){
  const SQL = 'SELECT * FROM holidays';
  client.query(SQL).then(results=>{
    res.render('./pages/favorites',{holidayResults:results.rows});
  }).catch(error=>errorHandler(error,req,res));
}

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

