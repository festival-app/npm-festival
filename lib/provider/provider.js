var fireabase = require('./fireabase');
var elasticsearch = require('./elasticsearch');

var getProvider = function getProvider() {
  switch (config.provider.selected) {
    case 'elasticsearch':
      return elasticsearch;
    case 'fireabase':
      return fireabase;
    default :
      throw Error('Unknown provider: ' + config.provider.selected);
  }
};


module.exports = {
  getProvider: getProvider
};