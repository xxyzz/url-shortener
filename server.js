var express = require('express');
var mongo = require('mongodb').MongoClient;
var site_url = 'https://industrious-plow.glitch.me/';
var app = express();

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
  if (err) throw err;
  app.route('/:url').get(handleGet);
  app.get('/new/:url*', handlePost);
  
  
  function handleGet(req, res) {
    var url = site_url + req.params.url;
    if (url !== site_url + 'favicon.ico') {
       redirect(url, db, res);
    }
  }

  function handlePost(req, res) {
    var url = req.url.slice(5);
    if (validateURL(url)) {
      findSameURL(url, db, res)
    } else {
      res.send({
        "error": "Wrong url format, make sure you have a valid protocol and real site."
      });
    }
  }
  
  function redirect(link, db, res) {
    db.collection('sites').findOne({
      "short_url": link
    }, function(err, result) {
      if (err) throw err;
      if (result) {
         res.redirect(result.original_url);
      } else {
        res.send({
          "error": "This url is not in the database."
        });
      }
    });
  }
  
  function findSameURL(link, db, res) {
    db.collection('sites').findOne({
      "original_url": link
    }, function(err, result) {
      if (err) throw err;
      if (result) {
         res.send(result);
      } else {
        linkGen(link, res, db);
      }
    });
  }

  function linkGen(url, res, db) {
    var urlObj = {
      "original_url": url,
      "short_url": site_url + Math.floor(Math.random()*10000).toString()
    };
    db.collection('sites').save(urlObj, function(err, result) {
      if (err) throw err;
      res.send(urlObj);
    });
  }
  
  function validateURL(url) {
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
  }
  
  app.listen(process.env.PORT);
});