module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'rating',
    {
      'ratingId': {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      'ratingValue': {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'rating',
      schema: 'public',
      timestamps: false,
      underscored: false
    }
  );
