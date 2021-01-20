module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'garmentType',
    {
      'garmentTypeId': {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      desc: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'garmentType',
      schema: 'public',
      timestamps: false,
      underscored: false
    }
  );
