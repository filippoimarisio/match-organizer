const authResolver = require('./auth');
const matchesResolver = require('./matches');
const bookingResolver = require('./booking');

const rootResolver = {
  ...authResolver,
  ...matchesResolver,
  ...bookingResolver
};

module.exports = rootResolver;