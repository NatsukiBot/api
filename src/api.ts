import { createConnection } from 'typeorm'
import * as express from 'express'
import * as path from 'path'
import { Logger } from './utility'
import { InversifyExpressServer } from 'inversify-express-utils'
import * as bodyParser from 'body-parser'
import { config } from './config'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import { container } from './ioc/ioc'
import * as cors from 'cors'
import * as compression from 'compression'
import * as expressStatusMonitor from 'express-status-monitor'
import * as errorHandler from 'errorhandler'
import * as jwt from 'express-jwt'
import './ioc/loader'
const { secret } = require('../token.json')

/**
 * The API server
 *
 * @export
 * @class Api
 */
export class Api {
  /**
   * Creates an instance of the Api.
   * @memberof Api
   */
  constructor () {
    this.init()
  }

  /**
   * Starts the API server.
   *
   * @static
   * @returns {Api}
   * @memberof Api
   */
  static start (): Api {
    return new Api()
  }

  private init () {
    createConnection().then(async () => {
      this.startServer()
    }).catch((err) => Logger.error(err))
  }

  private startServer () {
    const server = new InversifyExpressServer(container)

    server.setConfig((app) => {
      app.use(expressStatusMonitor())
      app.use(bodyParser.urlencoded({
        extended: true
      }))
      app.use(bodyParser.json())
      app.use(helmet())
      app.use(cors())
      app.use(compression())
      app.use(morgan('tiny', {
        stream: {
          write: message => Logger.info(message.trim())
        }
      }))
      app.use(jwt({
        secret,
        getToken: (req) => {
          if (req.query && req.query.token) {
            return req.query.token
          }
          return null
        }
      }))

      app.use(express.static(path.join(__dirname, '../public')))

      app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        err.status = 404
        next(err)
      })

      app.use(errorHandler())
    })

    const app = server.build()
    const port = process.env.PORT || config.port
    app.listen(port)

    console.log(`Express server listening on port ${port}`)
  }
}
