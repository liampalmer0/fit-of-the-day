module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'article',
    {
      articleId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      closetId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      desc: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dirty: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      garmentTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      color: {
        type: DataTypes.INTEGER,
        defaultValue: 10936474,
        allowNull: true
      },
      dressCodeId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      tempMin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      tempMax: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 120
      },
      filepath: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'article',
      schema: 'public',
      timestamps: false,
      underscored: false
    }
  );
