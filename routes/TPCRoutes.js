'use strict';
module.exports = function(app) {
  var TPC = require('../controllers/TPCController');

  // TPC Routes
  app.route('/tp_userdata/:username')
    // Get TagPro account data by username or profile
    .get(TPC.get_tagpro_account);

  
  app.route('/leaderboard/:stat/')
    .get(TPC.showleaderboards);
  
  app.route('/users/:username')
    // Get User TPC account by username
    .get(TPC.get_tpc_account)
    // Update a TPC account by username
    .put(TPC.update_tpc_account)
    // Create a TPC account by username or profile
    .post(TPC.create_tpc_account);
};
