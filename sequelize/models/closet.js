module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'closet',
    {
      'closetId': {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      'userId': {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'userId'
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
      underscored: false
    }
  );
