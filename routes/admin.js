var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
global.__basedir = __dirname;




/* GET users listing. */
router.get('/', function (req, res, next) {
  res.sendFile(__basedir + '/views/login.html');
});


router.post('/update_timer', async function (req, res, next) {

  //----------------------------------
  var timer = req.body.timer;
  console.log("TIMER:", timer);

  var db = new sqlite3.Database(__basedir + '/Analyst_Db.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to database.');
  });

  var sql = 'SELECT Count(duration) AS duration_count FROM mailing_Interval';
  await db.all(sql, [], async (err, row) => {
    // process the row here 
    console.log("sel_result:", row[0].duration_count);
    if (row[0].duration_count == 1) {
      console.log("---------Upadte the timer--------");
      await db.run('UPDATE mailing_Interval SET duration = "' + timer + '" ');
    }
    else {
      console.log("---------Insert the timer--------");
      await db.run('INSERT INTO mailing_Interval (duration) VALUES ("' + timer + '")');
    }
  });
  if(end_request_time != null){
    var date = new Date();
    var ending_timestamp = date.setHours(date.getHours() + parseInt(timer));
    console.log("--- New Updated Ending Timestamp", ending_timestamp);
    end_request_time = ending_timestamp;
  }
  await db.close();
  res.sendFile(__basedir + '/views/admin.html');
  //-------------------------------------
});



router.post('/add_list', async function (req, res, next) {

  //----------------------------------
  var db = new sqlite3.Database(__basedir + '/Analyst_Db.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to database.');
  });

  var company_name = req.body.company;
  var sql = 'SELECT Count(NAME) AS count FROM Valid_company_name where NAME="' + company_name + '" ';
  await db.all(sql, [], async (err, row) => {
    // process the row here 
    console.log("Company name count:", row[0].count);
    if (row[0].count == 0) {
      console.log("--------Insert the Comapny name--------");
      await db.exec('INSERT INTO Valid_company_name VALUES ("' + company_name + '")');
      await db.close();
    }
  });
  //await db.exec('INSERT INTO Valid_company_name VALUES ("' + company_name + '")');
  console.log("company_name:", company_name);
  res.sendFile(__basedir + '/views/admin.html');
  //-------------------------------------
});



router.post('/show_list', async function (req, res, next) {
  //----------------------------------
  var db = new sqlite3.Database(__basedir + '/Analyst_Db.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to database.');
  });

  var sql = 'SELECT * FROM Valid_company_name';
  await db.all(sql, [], async (err, rows) => {
    // process the row here 
    res.json(rows);
  });

  await db.close();
  //-------------------------------------
});

router.post('/show_timer', async function (req, res, next) {
  //----------------------------------
  var db = new sqlite3.Database(__basedir + '/Analyst_Db.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to database.');
  });

  var sql = 'SELECT * FROM mailing_Interval LIMIT 1';
  await db.all(sql, [], async (err, rows) => {
    // process the row here 
    res.json(rows);
  });

  await db.close();
  //-------------------------------------
});


router.post('/login', async function (req, res, next) {
  //----------------------------------
  var db = new sqlite3.Database(__basedir + '/Analyst_Db.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to database.');
  });

  var user = req.body.user;
  var pass = req.body.pass;
  var sql = "SELECT count(*) as count FROM admin_login where user='" + user + "' And pass='" + pass + "' ";
  await db.all(sql, [], async (err, row) => {
    // process the row here 
    console.log("sel_result:", row[0].count);
    if (row[0].count == 1) {
      console.log("---------Allow login--------");
      res.sendFile(__basedir + '/views/admin.html');

    }
    else {
      console.log("-------- Login Failed--------");
      res.sendFile(__basedir + '/views/login.html');
    }
  });

  await db.close();
  //-------------------------------------
});


module.exports = router;
