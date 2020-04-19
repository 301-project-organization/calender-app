


function mainPageHandler(request, response) {
    try {
        const JsonData = require('../data/calendar.json');
        const HolidayData = JsonData.holidays.map((data)=>{
            return new Holiday(data)
        })
        response.status(200).json(HolidayData);
      }
    catch (error) {errorHandler(error, request, response);}
    }

  function Holiday(JsonData) {
    this.name = JsonData.name;
    this.date = JsonData.date.iso;
    this.type = JsonData.type[0];
    this.description =JsonData.description;
  }

//   function Img(JsonData) {
//     this.name = JsonData.name;
//     this.date = JsonData.date.iso;
//     this.type = JsonData.type[0];
//     this.description =JsonData.description;
//   }

  module.exports = mainPageHandler;