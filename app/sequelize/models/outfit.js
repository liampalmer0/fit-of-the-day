module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'outfit',
    {
      articleArticleId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      partnerArticleId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        default: 'savedOutfit',
        allowNull: true
      },
      favorite: {
        type: DataTypes.BOOLEAN,
        default: false,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'outfit',
      schema: 'public',
      timestamps: true,
      underscored: false
    }
  );
