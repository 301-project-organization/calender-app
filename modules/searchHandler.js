'use strict';


const superagent = require('superagent');


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
