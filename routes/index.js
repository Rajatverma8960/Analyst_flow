var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(__basedir + '/views/index.html');
});


router.post('/check_timer', async function (req, res, next) {
  if (fist_request_time == null && end_request_time == null) {
    console.log("No timer had been Started till now.");
    // connecting to the database
    var db = new sqlite3.Database(__basedir + '/Analyst_Db.db', (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to database.');
    });
    //getting the current datetime stamp
    var date = new Date();
    var current_timestamp = date.getTime();
    console.log("Current timestap", current_timestamp);
    fist_request_time = current_timestamp;
    // select the mailing interval hour from database
    var sql = 'SELECT * FROM mailing_Interval LIMIT 1';
    await db.all(sql, [], async (err, rows) => {
      // process the row here 
      var db_hour = rows[0].duration;
      console.log("Mailing Interval", db_hour);
      var ending_timestamp = date.setHours(date.getHours() + db_hour);
      console.log("Ending Timestamp", ending_timestamp);
      end_request_time = ending_timestamp;
      await db.close();
      res.json({ "Response": "Wait", "Hours": db_hour });
    });

    // closing the database

  }
  else {
    console.log("start and ending already exit in API.");
    console.log("end_request_time", end_request_time);
    var date = new Date();
    var current_timestamp = date.getTime();
    var difference = end_request_time - current_timestamp;
    console.log("difference", difference);
    var minutesDifference = Math.floor(difference / 1000 / 60);
    console.log("difference In Minutes:", minutesDifference);
    if (difference <= 0) {
      console.log("\n------Time Difference is 0, You can publish your mail now------");
      fist_request_time = null;
      end_request_time = null;
      res.json({ "Response": "Success" });
    }
    else {
      // connecting to the database
      var db = new sqlite3.Database(__basedir + '/Analyst_Db.db', (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to database.');
      });
      var sql = 'SELECT * FROM mailing_Interval LIMIT 1';
      await db.all(sql, [], async (err, rows) => {
        // process the row here 
        var db_hour = rows[0].duration;
        console.log("Mailing Interval", db_hour);
        await db.close();
        console.log("\n-----Wait because, Time difference is still greater than 0. ----");
        res.json({ "Response": "Wait", "Hours": db_hour });
      });
    }
  }
});



module.exports = router;
