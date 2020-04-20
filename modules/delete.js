'use strict';

const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

function deleteHandler (req,res){
    const SQL = 'DELETE FROM books WHERE id=$1';
    const values = [req.params.id];
    client
        .query(SQL, values)
        .then((results) => res.redirect('/'))
        .catch((err) => errorHandler(err, req, res))
}


function errorHandler (error,request,response){
    response.status(500).send('SORRY AN ERROR OCCURED '+ error);
  }
  function notFoundHandler (req,res){
    res.status(404).send('Error 404: URL Not found');
  }
  

  module.exports = deleteHandler;


