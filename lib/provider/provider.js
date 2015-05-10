var config = require('config');

var provider = null;

var getProvider = function getProvider() {

  if (!provider) {
    switch (config.provider.selected) {
      case 'elasticsearch':
        var client = require('../elasticsearch/client').connect();
        var es = require('../elasticsearch/es').es(client);
        provider = require('./elasticsearchProvider').provider(es);
        break;
      case 'fireabase':
        var Firebase = require('firebase');
        var client = new Firebase(config.provider.firebase.url);
        provider = require('./fireabaseProvider').provider(client);
        break;
      default :
        throw Error('Unknown provider: ' + config.provider.selected);
    }
  }

  return provider;
};

module.exports = {
  getProvider: getProvider
};