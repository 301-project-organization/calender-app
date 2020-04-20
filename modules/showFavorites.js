'use strict';
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (err) => console.log(err));

function showFavorites(req,res){
    const SQL = 'SELECT * FROM holidays';
    client.query(SQL).then(results=>{
      res.render('./pages/favorites',{holidayResults:results.rows});
    }).catch(error=>errorHandler(error,req,res));
}

function errorHandler (error,request,response){
    response.status(500).send('SORRY AN ERROR OCCURED '+ error);
}


module.exports = showFavorites;