module.exports = (sequelize) => {
  // Create Associations
  const { models } = sequelize;
  models.user.hasOne(models.closet, {
    foreignKey: 'userId'
  });
  // Closet belongs to a User
  models.closet.belongsTo(models.user, {
    foreignKey: 'userId'
  });
  models.closet.hasMany(models.article, {
    foreignKey: 'closetId'
  });
  // Article belongs to a closet
  models.article.belongsTo(models.closet, {
    foreignKey: 'closetId'
  });
  // Articles can be linked to another through outfits
  models.article.belongsToMany(models.article, {
    as: 'partner',
    through: 'outfit'
  });
  // An Article belongs to one garment type
  models.article.belongsTo(models.garmentType, {
    foreignKey: 'garmentTypeId'
  });
  // An Article belongs to one dress code
  models.article.belongsTo(models.dressCode, {
    foreignKey: 'dressCodeId'
  });
  // A user has many events
  models.user.hasMany(models.event, {
    foreignKey: 'userId'
  });
  // An event belongs to a User
  models.event.belongsTo(models.user, {
    foreignKey: 'userId'
  });
  // Article has one temperature rt // NOTE : not in the sql yet
  // sequelize.article.belongsTo(...);
};
