const bcrypt = require('bcryptjs');
const { Model } = require('sequelize');
class user extends Model {
  static async create(values) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(values.password, salt);
    return super.create({
      email: values.email,
      username: values.username,
      password: hash,
    });
  }
}
module.exports = (sequelize, DataTypes) => {
  return user.init(
    {
      user_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'user',
      freezeTableName: true,
      schema: 'public',
      timestamps: false,
      underscored: true,
    }
  );
};
