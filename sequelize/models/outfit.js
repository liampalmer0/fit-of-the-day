module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'outfit',
    {
      'articleArticleId': {
        type: DataTypes.INTEGER,  
        references: {
          model: 'article',
          key: 'articleId'
        },
        primaryKey: true
      },
      'partnerArticleId': {
        type: DataTypes.INTEGER,  
        references: {
          model: 'article',
          key: 'articleId'
        },
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        default: 'savedOutfit',
        allowNull: false
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
