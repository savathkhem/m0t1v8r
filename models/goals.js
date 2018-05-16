module.exports = function(sequelize, DataTypes) {
    var Goal = sequelize.define("Goal", {
        goalName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return Goal;
};