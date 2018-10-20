'use strict';
module.exports = function(app) {
  let PM = require('../controllers/PMController');

  // PM Routes
  app.route('/ping')
    .get(PM.get_ping);
};
