module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        userId: {          
            type: DataTypes.STRING,
            allowNull: false,
        },    
        // oauth_provider: {
        // },
        // oauth_uid: {
        // },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    User.associate = function(models) {
        // Associating Author with Posts
        // When an Author is deleted, also delete any associated Posts
        User.hasMany(models.Goal, {
          onDelete: "cascade"
        });
      };
    return User;
};