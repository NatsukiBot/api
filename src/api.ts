import { createConnection } from 'typeorm'
import * as express from 'express'
import * as path from 'path'
import { Logger } from './utility'
import { InversifyExpressServer } from 'inversify-express-utils'
import * as bodyParser from 'body-parser'
import { config } from './config'
import * as helmet from 'helmet'
import { container } from './ioc/ioc'
import * as swaggerUi from 'swagger-ui-express'
import * as cors from 'cors'
import './ioc/loader'
const swaggerDocument = require('../swagger.json')

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
      app.use(bodyParser.urlencoded({
        extended: true
      }))
      app.use(bodyParser.json())
      app.use(helmet())
      app.use(cors())
      app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
      app.use(express.static(path.join(__dirname, '../public')))
    })

    const app = server.build()
    const port = process.env.PORT || config.port
    app.listen(port)

    console.log(`Express server listening on port ${port}`)
  }
}
