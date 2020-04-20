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

let emptyArr = [];

// Setting up the view engine and the pages
app.set('view engine','ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// To get the CSS and JS frontend files
app.use(express.static('./public'))

let jaja = [];
function searchHandler(req,res){
const searchCountry = req.body.country;
const searchYear = req.body.year;
const calAPI = `https://calendarific.com/api/v2/holidays?&api_key=${process.env.CAL_KEY_API}&country=${searchCountry}&year=${searchYear}`;
superagent(calAPI).
then(result=>{
let holidayList = result.body.response.holidays;
let shownHolidayData = holidayList.map((value,index)=>{
    return new HolidayListItem(value);
})
return shownHolidayData;
// res.render('./pages/searchresults',{shownHolidayData:shownHolidayData});
  }).then(newResults=>{
    // console.log( 'new results' , newResults);
    newResults.forEach((value,index)=>{
      if(index<3){
        let picAPI = `https://pixabay.com/api/?key=${process.env.IMG_KEY_API}&q=${value.name}`;
        superagent(picAPI).then(picResults=>{
          value.pic = picResults.body.hits[0].webformatURL;
          // console.log('this is sparta',value);
          jaja.push(value);
          console.log('this is jaja inside',jaja);
        })
      }
    })
    setTimeout(function(){
      return newResults;
    },5000)
  }).then(lastResults=>{
    console.log('this is the last results ',lastResults);
    res.render('./pages/searchresults',{shownHolidayData:lastResults});
  });
  console.log('this is jaja outside',jaja);
}

function HolidayListItem(data){
  this.name = data.name;
  this.description = data.description;
  this.country = data.country.name;
  this.date = data.date.iso;
  this.type = data.type.join();
}
  
  
  



function errorHandler (error,request,response){
  response.status(500).send('SORRY AN ERROR OCCURED '+ error);
}
function notFoundHandler (req,res){
  res.status(404).send('Error 404: URL Not found');
}



module.exports = searchHandler;






    /*
    let testing = [shownHolidayData[0],shownHolidayData[1],shownHolidayData[2]];
  
    let jojo = [];
    
    let jagja = testing.map((value,index)=>{
      let picAPI = `https://pixabay.com/api/?key=${process.env.IMG_KEY_API}&q=${value.name}`;
      return superagent(picAPI).then(picResults=>{
        console.log('this is the value before the pic ', value);
        console.log('this is the pic results',picResults.body.hits[0].webformatURL);
        if (picResults.body.hits[0].webformatURL=== undefined){
          picResults.body.hits[0].webformatURL= 'http://skdajdka.com';
        }
        value.pic = picResults.body.hits[0].webformatURL;
        console.log('this is the value after the pic ', value);
        emptyArr.push(value);
        console.log(emptyArr);
        return value;
      }).then(kaka=>{
        jojo.push(kaka);
        console.log('this is kaka',kaka);
        console.log('this is jojo',jojo);
        console.log( 'this is shown holiday 0', shownHolidayData[0]);
        console.log('this is empty arr ',emptyArr);
      })
  
    })
    console.log('this is empty arr outside ',emptyArr);
    // return shownHolidayData;
    console.log('this is jojo outside',jojo);
  */