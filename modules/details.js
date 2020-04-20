<<<<<<< HEAD
'use strict'
app.get('/details',showDetailsHandler);
app.get('/update',updateHandler )



function updateHandler (req,res){
    let {country, holidayname, description, date, type, picture_url }=req.body;
    let SQL = 'UPDATE holidays SET country = $1, holidayname= $2, description = $3, date=$4, type=$5, picture_url= $6 WHERE id=$7;';
    let savedValues = [
      country,
      holidayname,
      description,
      date,
      type,
      picture_url,
      // req.params. waiting for id
    ];
    //client.query(SQL,savedValues).then(var1=> res.redirect (`file${req.params}`) );
    client.query(SQL,savedValues).then(var1=> res.redirect (`pages/layout/update`))
    .catch(err => errorHandler(err,req,res));
  }

=======
'use strict';

>>>>>>> 50434cb65b024f3d05449054d61ac35f55041557
  function showDetailsHandler(req,res){
    const SQL = 'SELECT * FROM holidays'//dynamic url 
    client.query(SQL).then(result =>{
      res.render('./pages/layout/detail',{show:result.rows})
    });
    
  }
  module.exports = showDetailsHandler;

  