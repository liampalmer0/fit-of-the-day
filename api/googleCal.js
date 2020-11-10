function getEvents() {
  return new Promise((resolve) => {
    return setTimeout(resolve({ msg: 'No Events Today', count: 0 }), 100);
  });
}
module.exports = {
  getEvents: getEvents,
};
