//Path dependency will help with creating paths...duh
var path = require('path')

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/html/index.html"))
    })

};