module.exports = (sequelize) => {
  // Create Associations
  const { models } = sequelize;
  // Closet belongs to a User
  models.closet.belongsTo(models.user, {
    foreignKey: 'user_id'
  });
  // Article belongs to a closet
  models.article.belongsTo(models.closet, {
    foreignKey: 'closet_id'
  });
  // An Article belongs to one garment type
  models.article.belongsTo(models.garment_type, {
    foreignKey: 'garment_type_id'
  });
  // An Article belongs to one dress code
  models.article.belongsTo(models.dress_code, {
    foreignKey: 'dress_code_id'
  });
  // Article has one temperature rt // NOTE : not in the sql yet
  // sequelize.article.belongsTo(...);
};
