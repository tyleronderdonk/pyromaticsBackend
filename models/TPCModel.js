var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  // username kekmachine
  "username": String,
  // profile cHJvZmlsZQ
  "profile": String,
  // degree levelm8
  "degree": Number,
  // currentSR Y3VycmVudFNS
  "currentSR": Number,
  // rank dalekwantslegend
  "rank": String,
  // seasonSR c2Vhc29uU1I
  "seasonSR": Number,
  // careerSR Y2FyZWVyU1I
  "careerSR": Number,
  // compWins Y29tcFdpbnM
  "compWins": Number,
  // compLoses Y29tcExvc2Vz
  "compLoses": Number,
  // compCredits Y29tcENyZWRpdHM
  "compCredits": Number,
  // banned uwotm8??
  "banned": String
});

module.exports = mongoose.model('User', UserSchema);