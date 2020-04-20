'use strict';

  function showDetailsHandler(req,res){
    const SQL = 'SELECT * FROM holidays'//this sould be a dynamic url 
    client.query(SQL).then(result =>{
      res.render('./pages/layout/detail',{show:result.rows})
    });
    
  }
  module.exports = showDetailsHandler;

  