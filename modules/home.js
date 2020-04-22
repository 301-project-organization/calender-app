
'use strict';

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

  function Holiday(JsonData) {
    this.name = JsonData.name;
    this.date = JsonData.date.iso;
    this.type = JsonData.type[0];
    this.description =JsonData.description;
  }

  function Img(JsonData2) {
    this.img = JsonData2.previewURL;
  }

  function errorHandler (err,req,res){
    res.status(500).send('SORRY AN ERROR OCCURED: '+ err);
  }
  function notFoundHandler (req,res){
    res.status(404).send('err 404: URL Not found');
  }
  

  module.exports = mainPageHandler;
