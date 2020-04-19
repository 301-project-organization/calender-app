









app.get('/searchform',searchForm);
app.post('/newsearch',searchHandler);












function searchForm(req,res){
    res.render('./pages/searchform')
  }
  
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
      console.log( 'new results' , newResults);
      let picAPI = `https://pixabay.com/api/?key=${process.env.IMG_KEY_API}&q=${newResults[0].name}`;
      superagent(picAPI).then(picResults=>{
        if (picResults.body.hits[0].webformatURL=== undefined){
          picResults.body.hits[0].webformatURL= 'http://skdajdka.com';
        }
        newResults[0].pic = picResults.body.hits[0].webformatURL;
        emptyArr.push(picResults.body.hits[0].webformatURL);
        console.log('this is sparta',newResults[0]);
        res.render('./pages/searchresults',{shownHolidayData:newResults})
      })
  
      // for (let i=0;i<newResults.length;i++){
      //   let picAPI = `https://pixabay.com/api/?key=${process.env.IMG_KEY_API}&q=${newResults[i].name}`
      //   superagent(picAPI).then(picResults=>{
      //     if (picResults.body.hits[0].webformatURL=== undefined){
      //       picResults.body.hits[0].webformatURL= 'http://skdajdka.com';
      //     }
      //     newResults[i].pic = picResults.body.hits[0].webformatURL;
      //     emptyArr.push(picResults.body.hits[0].webformatURL);
      //   })
      // }
      // return newResults;
    // }).then(finalResults=>{
    //   console.log(emptyArr);
    //   console.log('this is the final results',finalResults);
    //     // res.render('./pages/searchresults',{shownHolidayData:shownHolidayData});
  
    });
  }


function HolidayListItem(data){
    this.name = data.name;
    this.description = data.description;
    this.country = data.country.name;
    this.date = data.date.iso;
    this.type = data.type.join();
  }



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