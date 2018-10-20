//'use strict';

var cors = require('cors');
var fetch = require('node-fetch');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.get_tagpro_account = function(req, res) {
  if(req.params.username.search("name:") === 0){
    getTagproAccount(encodeURIComponent(req.params.username.replace("name:", "")), res);
  } else {
    fetch('http://tagpro-centra.koalabeast.com/profiles/' + encodeURIComponent(req.params.username)).then(function(data) {
      return data.json();
    }).then(function(json){
      logit(json);
      res.send(
        getTagproAccount(encodeURIComponent(json[0].reservedName))
      );
    }).catch(function(error) {
      logit(error);
    });
  }
};

exports.update_tpc_account = function(req, res) {
  if(Number(new Buffer(req.body.stats, 'base64').toString('ascii').split(",")[10]) % 13 === 0){
    var key = req.params.username.search("name:") === 0 ? {username: req.params.username.replace("name:", "")} : {profile: req.params.username};
    logit("UPDATED ACCOUNT: " + req.params.username + " => " + JSON.stringify(key) + " =>" + JSON.stringify(req.body));
    User.find(key, function(data){
      console.log(`${req.body.currentSR} - ${data.currentSR} = ${req.body.currentSR - data.currentSR}`);
      //if(req.body.currentSR - data.currentSR > 100) {
        User.findOneAndUpdate(key, req.body, {new: true}, function(err, user) {
          if (err) res.send(err);
          res.json(user);
        });
      //}
    });
    User.findOneAndUpdate(key, req.body, {new: true}, function(err, user) {
      if (err) res.send(err);
      res.json(user);
    });
  }
};

exports.showleaderboards = function(req, res) {
  switch(req.params.stat){
    case "currentSR":
      User.find({}, null, {sort: {currentSR: -1}}, function(err, users) {
        res.json(users);
      });
      break;
    case "seasonSR":
      User.find({}, null, {sort: {seasonSR: -1}}, function(err, users) {
        res.json(users);
      });
      break;
    case "careerSR":
      User.find({}, null, {sort: {careerSR: -1}}, function(err, users) {
        res.json(users);
      });
      break;
  }
};

exports.get_tpc_account = function(req, res) {
  var key = req.params.username.search("name:") === 0 ? {username: decodeURIComponent(req.params.username.replace("name:", ""))} : {profile: req.params.username};
  logit("GOT ACCOUNT: " + req.params.username + " => " + JSON.stringify(key) + " =>" + JSON.stringify(req.body));
  logit(req.params.username + " => " + JSON.stringify(key));
  User.findOne( key, function(err, user) {
    if (err) res.send(err);
    res.json(user);
  });
};

exports.create_tpc_account = function(req, res) {
  logit(new Buffer(req.body.stats, 'base64').toString('ascii').split(",")[10]);
  if(Number(new Buffer(req.body.stats, 'base64').toString('ascii').split(",")[10]) % 13 === 0){ 
    var key = req.params.username.search("name:") === 0 ? {username: req.body.username.replace("name:", "")} : {profile: req.body.profile};
    User.findOne( key, function(err, user) {
      logit("Profile: " + key.profile);
        fetch('http://tagpro-centra.koalabeast.com/profiles/' + req.body.profile).then(function(data) {
          return data.json();
        }).then(function(json){
          if (err) res.send(err);
          var account = getTagproAccount(encodeURIComponent(json[0].reservedName), false, function(json2){
            logit("Degree:" + json2.degree);
            if(user === null && json2.degree >= 60) {
              logit("CREATED ACCOUNT: " + req.params.username + " => " + JSON.stringify(key) + " =>" + JSON.stringify(req.body));
              req.body.degree = json2.degree;
              var new_user = new User(req.body);
              new_user.save(function(err, user) {
                if (err) res.send(err);
                res.json(user);
              });
            } else {
              res.send(null);
            }
          });
        }).catch(function(error) {
          logit(error);
        });
    });
  }
}


exports.delete = function(req, res){
  logit("ALL ACCOUNTS DELETED");
  User.deleteMany({}, function(err){
    if (err) res.send(err);
    res.json({message: "Successfully deleted all accounts"});
  });
}

function getTagproAccount(username, res, callback){
  fetch('https://tagpro.eu/?player=' + encodeURIComponent(username)).then(function(data) {
    return data.text();
  }).then(function(text){
    var $ = cheerio.load(text);
    var degree = $(".profile table tr td").eq(1).text().replace("stats on", "").replace("stats off", "").replace("°", "");

    logit(degree);
    if(res){
      return res.send({
        "degree": degree
      });
    } else {
      callback({
        "degree": degree
      });
    }
    
  }).catch(function(error) {
    logit(error);
  });
}

function logit(str){
  console.log(`[${new Date()}] : ${str}`);
}