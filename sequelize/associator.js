module.exports = (sequelize) => {
  // Create Associations
  const { models } = sequelize;
  // Closet belongs to a User
  models.closet.belongsTo(models.user, {
    foreignKey: 'userId'
  });
  // Article belongs to a closet
  models.article.belongsTo(models.closet, {
    foreignKey: 'closetId'
  });
  // An Article belongs to one garment type
  models.article.belongsTo(models.garmentType, {
    foreignKey: 'garmentTypeId'
  });
  // An Article belongs to one dress code
  models.article.belongsTo(models.dressCode, {
    foreignKey: 'dressCodeId'
  });
  // Article has one temperature rt // NOTE : not in the sql yet
  // sequelize.article.belongsTo(...);
};
