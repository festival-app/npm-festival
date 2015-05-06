var elasticsearch = require('./elasticsearch');
var fireabase = require('./fireabase');

var getProvider = function (provider) {
  switch (provider) {
    case 'elasticsearch':
      return elasticsearch;
    case 'fireabase':
      return fireabase;
    default :
      throw Error('Unknown provider: ' + provider);
  }
};


module.exports = {
  getProvider: getProvider
};