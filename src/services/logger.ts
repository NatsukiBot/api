import * as fs from 'fs'
import * as Winston from 'winston'
require('winston-daily-rotate-file')
const logDir = __dirname + '/../../logs/'

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

export const ChatLog = new Winston.Logger({
  transports: [
    new Winston.transports.DailyRotateFile({
      handleExceptions: false,
      name: 'file:chat',
      filename: __dirname + '/../../logs/chat',
      datePattern: '-dd-MM-yyyy.log',
      formatter: (args) => args.message,
      level: 'info',
      json: false
    })
  ]
})

export const Logger = new Winston.Logger({
  colors: {
    verbose: 'orange',
    debug: 'blue',
    info: 'green',
    warn: 'yellow',
    error: 'red'
  },
  transports: [
    new Winston.transports.DailyRotateFile({
      humanReadableUnhandledException: true,
      handleExceptions: true,
      name: 'file:exceptions',
      filename: __dirname + '/../../logs/exceptions',
      datePattern: '-dd-MM-yyyy.log',
      level: 'exception',
      json: false
    }),
    new Winston.transports.DailyRotateFile({
      handleExceptions: false,
      name: 'file:error',
      filename: __dirname + '/../../logs/errors',
      datePattern: '-dd-MM-yyyy.log',
      level: 'error',
      json: false
    }),
    new Winston.transports.DailyRotateFile({
      handleExceptions: false,
      name: 'file:console',
      filename: __dirname + '/../../logs/console',
      datePattern: '-dd-MM-yyyy.log',
      level: 'debug',
      json: false
    }),
    new Winston.transports.Console({
      handleExceptions: true,
      level: 'verbose',
      colorize: true,
      json: false
    })
  ],
  exitOnError: false
})
