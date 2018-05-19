module.exports = function(sequelize, DataTypes) {
    var Goal = sequelize.define("Goal", {
        goalName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        activity: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })
    return Goal;
};