module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'article',
    {
      article_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      closet_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'closet',
          key: 'closet_id',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desc: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dirty: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      garment_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'garment_type',
          key: 'garment_type_id',
        },
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dress_code_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'dress_code',
          key: 'dress_code_id',
        },
      },
      rating_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'rating',
          key: 'rating_id',
        },
      },
      filepath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'article',
      schema: 'public',
      timestamps: false,
    }
  );
};
