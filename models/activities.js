module.exports = function(sequelize, DataTypes) {
    var Activity = sequelize.define("Activity", {
        activityName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        goalId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return Activity;
};