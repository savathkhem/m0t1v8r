
var db = require("../models");

module.exports = function(app) {

  // GET route for getting all of the goals
  app.get("/api/goals/:userid", function(req, res) {
    var id = req.params.userid
    console.log(req.params.userid)
    db.Goal.findAll({
      where: {userId: id},
    //   include: [db.User]
    }).then(function(goal) {
      res.json(goal);
    });
  });

  // Get route for retrieving a single goal
  app.get("/api/goals/:id", function(req, res) {

    db.Goal.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    }).then(function(goal) {
      res.json(goal);
    });
  });

  // POST route for saving a new goal
  app.post("/api/goals", function(req, res) {
    db.Goal.create(req.body).then(function(goal) {
      res.json(goal);
    });
  });

  // DELETE route for deleting posts
  app.delete("/api/goals/:id", function(req, res) {
    db.Goal.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(goal) {
      res.json(goal);
    });
  });

  // PUT route for updating goals
  app.put("/api/goals", function(req, res) {
    db.Goal.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(goal) {
      res.json(goal);
    });
  });

    // PUT route for completing goals
    app.put("/api/goals/complete", function(req, res) {
        db.Goal.update({
          completed: true,
        },{
            where: {
              id: req.body.id
            }
          }).then(function(goal) {
          res.json(goal);
        });
      });
};
