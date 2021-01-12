module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'closet',
    {
      'closet_id': {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      'user_id': {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'user_id'
        }
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
      tableName: 'closet',
      schema: 'public',
      timestamps: false,
      underscored: true
    }
  );
