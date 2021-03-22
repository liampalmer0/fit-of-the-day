module.exports = class Outfit {
  constructor(base, partner = null, favorite = false) {
    this.base = base;
    this.partner = partner ? partner : base;
    this.favorite = favorite;
  }
};
