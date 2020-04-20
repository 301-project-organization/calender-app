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
// const mainPageHandler = require('./modules/home.js');
// const updateHandler = require('./modules/update.js');
// const showDetailsHandler = require('./modules/details.js');
// const searchHandler = require('./modules/searchHandler.js');
// const searchForm = require('./modules/searchForm.js');
// const aboutPageHandler = require('./modules/about.js');
// const addToFavorites = require('./modules/addToFavorites.js');
// const showFavorites = require('./modules/showFavorites.js');

// Routes
// app.get('/',mainPageHandler);
app.get('/searchform',searchForm);
app.post('/newsearch',searchHandler);
app.get('/details',showDetailsHandler);
// app.get('/update',updateHandler );
// app.get('/about',aboutPageHandler);

app.post('/addFavorites',addToFavorites);
app.get('/favorites',showFavorites);

// Last route for non existing pages
app.get('*',notFoundHandler);


function errorHandler (error,request,response){
  response.status(500).send('SORRY AN ERROR OCCURED '+ error);
}
function notFoundHandler (req,res){
  res.status(404).send('Error 404: URL Not found');
}



function mainPageHandler(req, res) {
  try {
      const JsonData = require('../data/calendar.json');
      const HolidayData = JsonData.response.holidays.map((data)=>{
          return new Holiday(data);
      })
      const JsonData2 = require('../data/imgs.json');
      const HolidayData2 = JsonData2.hits.map((data)=>{
          return new Img(data);
      })
      // console.log(HolidayData2);
      res.render('./pages/index',{ image : HolidayData2 , holiday: HolidayData });
}

  catch (err) {errorHandler(err, req, res);}
  }

  function showFavorites(req,res){
    const SQL = 'SELECT * FROM holidays';
    client.query(SQL).then(results=>{
      res.render('./pages/favorites',{holidayResults:results.rows});
    }).catch(error=>errorHandler(error,req,res));
}
  
  function addToFavorites(req,res){
    const  {name,pic,country,description,date,type} = req.body;
    const SQL = 'INSERT INTO holidays (holidayname,picture_url,country,description,date,type) VALUES ($1,$2,$3,$4,$5,$6)';
    const values = [name,pic,country,description,date,type];
    client.query(SQL,values).then(results=>{
      res.redirect('/favorites');
    }).catch(error=>errorHandler(error,req,res));
  }
  function showDetailsHandler(req,res){
    const SQL = 'SELECT * FROM holidays'//dynamic url 
    client.query(SQL).then(result =>{
      res.render('./pages/layout/detail',{show:result.rows})
    });
    
  }
  function searchForm(req,res){
    res.render('./pages/searchform')
  }
  function searchHandler(req,res){
    const searchCountry = req.body.country;
    const searchYear = req.body.year;
    const numberOfResults = req.body.number
    
    const calAPI = `https://calendarific.com/api/v2/holidays?&api_key=${process.env.CAL_KEY_API}&country=${searchCountry}&year=${searchYear}`;
    superagent(calAPI).
    then(result=>{
    let holidayList = result.body.response.holidays;
    let shownHolidayData = [];
    holidayList.forEach((value,index)=>{
      if (index < numberOfResults){
        let limitedData = new HolidayListItem(value);
        shownHolidayData.push(limitedData);
      }
    })
    return shownHolidayData;
      }).then(newResults => {
        let promisses = [];
        newResults.forEach((value, index) => {
          let picAPI = `https://pixabay.com/api/?key=${process.env.IMG_KEY_API}&q=${value.name}`;
          promisses.push(
            superagent(picAPI).then((picResults) => {
              if (picResults.body.hits[0]){
                value.pic = picResults.body.hits[0].webformatURL;
              }else{
                value.pic = 'http://s5.favim.com/orig/140719/beach-holiday-summer-sun-Favim.com-1927437.jpg';
              }
            }).catch(err=>{
              errorHandler(err,req,res);
            })
          );
        });
        Promise.all(promisses).then(() => {
          res.render('./pages/searchresults', { shownHolidayData: newResults });
        }).catch(error=>errorHandler(error,req,res));
      })
    }
    
    function HolidayListItem(data){
      this.name = data.name;
      this.description = data.description;
      this.country = data.country.name;
      this.date = data.date.iso;
      this.type = data.type.join();
    }  

function Holiday(JsonData) {
  this.name = JsonData.name;
  this.date = JsonData.date.iso;
  this.type = JsonData.type[0];
  this.description =JsonData.description;
}

function Img(JsonData2) {
  this.img = JsonData2.previewURL;
}



// Constructor Functions:


app.use(errorHandler);

client.connect().then(() => {
  app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));

}).catch(err=> errorHandler(err,request,response));

