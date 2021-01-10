module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'garment_type',
    {
      'garment_type_id': {
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
      tableName: 'garment_type',
      schema: 'public',
      timestamps: false,
      underscored: true
    }
  );
