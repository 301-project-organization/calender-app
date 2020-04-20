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
          // console.log('this is picResults.body.hits',picResults.body.hits)
          // console.log('picResults.body.hits[0].webformatURL',picResults.body.hits[0].webformatURL)
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
      console.log('yeeeeeeeeees', newResults);
      res.render('./pages/searchresults', { shownHolidayData: newResults });
    });
  })
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
