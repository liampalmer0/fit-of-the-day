module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'dress_code',
    {
      dress_code_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desc: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'dress_code',
      schema: 'public',
      timestamps: false,
      underscored: true,
    }
  );
};
