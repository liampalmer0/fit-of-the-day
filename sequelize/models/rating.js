module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'rating',
    {
      rating_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      rating_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'rating',
      schema: 'public',
      timestamps: false,
    }
  );
};
