module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
    {
      classMethods: {
        associate: function(models) {
          Product.belongsTo(models.User, {
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );
  return Product;
};
