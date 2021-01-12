function getEvents() {
  return new Promise((resolve) =>
    setTimeout(resolve({ msg: 'No Events Today', count: 0 }), 100)
  );
}
module.exports = {
  getEvents
};
