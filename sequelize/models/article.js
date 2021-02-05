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
        allowNull: true,
        references: {
          model: 'closet',
          key: 'closetId'
        }
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
        allowNull: true,
        references: {
          model: 'garmentType',
          key: 'garmentTypeId'
        }
      },
      color: {
        type: DataTypes.INTEGER,
        defaultValue: 10936474,
        allowNull: true
      },
      dressCodeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'dressCode',
          key: 'dressCodeId'
        }
      },
      // 'ratingId': {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: 'rating',
      //     key: 'ratingId'
      //   }
      // },
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
