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
    var url = site_url + req.req.params.url;
    if (url != site_url + 'favicon.ico') {
       findURL(url, db, res);
    }
  }

  function handlePost(req, res) {
    var url = req.url.slice(5);
    var urlObj = {};
    if (validateURL(url)) {
       linkGen(url, res, db, save);
    } else {
      res.send({
        "error": "Wrong url format, make sure you have a valid protocol and real site."
      });
    }
  }
  
  function findURL() {
    
  }
  
  function linkGen() {
    
  }
  
  function validateURL() {
    
  }
  
  function save() {
    
  }
  
  app.listen(process.env.PORT);
});