import debug, { Debugger } from 'debug';

let loggers: { debugServer: Debugger; debugRequest: Debugger; debugDatabase: Debugger; };

function init() {
  const debugServer = debug('debug:server');
  const debugRequest = debug('debug:request-error');
  const debugDatabase = debug('debug:database');

  loggers = {
    debugServer,
    debugRequest,
    debugDatabase,
  };
}

function getLogger(name: keyof typeof loggers) {
  return loggers[name];
}

function logServer(...message: string[]) {
  loggers.debugServer('', ...message);
}

function logDatabase(...message: string[]) {
  loggers.debugDatabase('', ...message);
}

function logRequest(...message: string[]) {
  loggers.debugRequest('', ...message);
}

export {
  init,
  getLogger,
  logServer,
  logDatabase,
  logRequest,
};
