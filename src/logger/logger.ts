import pino from 'pino';

const pinoConfig = {
  base: undefined,
  timestamp: false,
  prettyPrint: {
    colorize: true,
    ignore: 'level',
    singleLine: true,
  },
};

const loggerFile = pino(
  pinoConfig,
  pino.destination({ dest: './logs/log', sync: true, append: false })
);

// const loggerConsole = pino(pinoConfig, pino.destination({ sync: true }));

const loggerCritical = pino(
  pinoConfig,
  pino.destination({ dest: './logs/critical', sync: true, append: false })
);

const loggerInfo = pino(
  pinoConfig,
  pino.destination({ dest: './logs/info', sync: true, append: false })
);

//absolute clusterfuck of a logger
// TODO: move to a simpler library more suited for this use case
export const logger = {
  log(...args) {
    loggerFile.info(args);
  },

  critical(...args) {
    loggerCritical.info(args);
  },

  info(...args) {
    loggerInfo.info(args);
    // this.log(args);
  },
};
