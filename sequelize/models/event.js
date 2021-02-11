module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'event',
    {
      eventId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'userId'
        }
      },
      dressCodeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        references: {
          model: 'dressCode',
          key: 'dressCodeId'
        }
      },
      dateTimeStart: {
        type: DataTypes.DATE,
        allowNull: false
      },
      dateTimeEnd: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'event',
      schema: 'public',
      timestamps: false,
      underscored: false
    }
  );
