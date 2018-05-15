module.exports = function(sequelize, DataTypes) {
    var Goal = sequelize.define("Goal", {
        goal: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        activity: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    })
    return Goal;
};