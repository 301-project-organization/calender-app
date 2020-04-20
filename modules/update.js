
'use strict';

const pg = require('pg');
const methodOverride = require('method-override');
const client = new pg.Client(process.env.DATABASE_URL);

function updateHandler (req,res){
    const SQL = 'UPDATE holidays SET country=$1, holidayname=$2, description=$3, date=$4, type=$5, picture_url=$6 WHERE id=$7;';
    const values =[req.body.country, req.body.holidayname ,req.body.description ,req.body.date, req.body.type,req.body.picture_url ,req.params.id];
    client
    .query(SQL,values).then((results)=> res.redirect (`/details/${req.params.id}`))
    .catch(err => errorHandler(err,req,res));
  }

  
function errorHandler (error,request,response){
  response.status(500).send('SORRY AN ERROR OCCURED '+ error);
}
function notFoundHandler (req,res){
  res.status(404).send('Error 404: URL Not found');
}

module.exports = updateHandler;
