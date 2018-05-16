// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// ***************************************************************gi******************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // Landing page GET
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/index.html"));
  });

  //User page GET
  app.get("/users/:user", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/user.html"));
  });



};
