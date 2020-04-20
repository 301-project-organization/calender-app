'use strict';
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (err) => console.log(err));


function addToFavorites(req,res){
  const  {name,pic,country,description,date,type} = req.body;
  const SQL = 'INSERT INTO holidays (holidayname,picture_url,country,description,date,type) VALUES ($1,$2,$3,$4,$5,$6)';
  const values = [name,pic,country,description,date,type];
  client.query(SQL,values).then(results=>{
    res.redirect('/favorites');
  }).catch(error=>errorHandler(error,req,res));
}

function errorHandler (error,request,response){
    response.status(500).send('SORRY AN ERROR OCCURED '+ error);
}


module.exports = addToFavorites;
