module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'rating',
    {
      ratingId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'rating',
      schema: 'public',
      timestamps: true,
      underscored: false
    }
  );
