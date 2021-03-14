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

function logServer(...message) {
  loggers.debugServer(...message);
}

function logDatabase(...message) {
  loggers.debugDatabase(...message);
}

function logRequest(...message) {
  loggers.debugRequest(...message);
}

module.exports = {
  initDebug,
  getLogger,
  logServer,
  logDatabase,
  logRequest,
};
