'use strict';

function mainPageHandler(req, res) {
    res.render('./pages/index',{ image : HolidayData2 , holiday: HolidayData });
}