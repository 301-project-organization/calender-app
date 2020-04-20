'use strict';

const pg = require('pg');
const methodOverride = require('method-override');
const client = new pg.Client(process.env.DATABASE_URL);

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

  
function errorHandler (error,request,response){
  response.status(500).send('SORRY AN ERROR OCCURED '+ error);
}
function notFoundHandler (req,res){
  res.status(404).send('Error 404: URL Not found');
}

module.exports = editHandler;
