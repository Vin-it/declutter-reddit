const debug = require('debug');

let loggers;

function initDebug() {
  const debugServer = debug('debug:server');
  const debugRequest = debug('debug:request-error');
  const debugDatabase = debug('debug:database');

  loggers = {
    debugServer,
    debugRequest,
    debugDatabase,
  };
}

function getLogger(name) {
  return loggers[name];
}
module.exports = {
  initDebug,
  getLogger,
};
