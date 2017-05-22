module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Giving the user model a name of type STRING
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3,32]
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3,12]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3,12]
      }
    }
  },
    // Here we'll pass a second "classMethods" object into the define method
    // This is for any additional configuration we want to give our models
    {
      // We're saying that we want our User to have Products
      classMethods: {
        associate: function(models) {
          // Associating Userr with Products
          // When a User is deleted, also delete any associated Products
          User.hasMany(models.Product, {
            onDelete: "cascade"
          });
        }
      }
    }
  );
  return User;
};