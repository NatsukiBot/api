import { createConnection } from 'typeorm'
import * as express from 'express'
import * as path from 'path'
import { Logger } from './utility'
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils'
import { Container } from 'inversify'
import { UserController } from './controller/user'
import { TAGS, TYPES } from './constants'
import { UserService } from './services/user'
import * as bodyParser from 'body-parser'
import { config } from './config'

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
    const container = new Container()

    container.bind<interfaces.Controller>(TYPE.Controller).to(UserController).whenTargetNamed(TAGS.UserController)
    container.bind<UserService>(TYPES.UserService).to(UserService)

    const server = new InversifyExpressServer(container)
    server.setConfig((app) => {
      app.use(bodyParser.urlencoded({
        extended: true
      }))
      app.use(bodyParser.json())

      app.use(express.static(path.join(__dirname, '../../client')))
    })

    const app = server.build()
    const port = process.env.PORT || config.port
    app.listen(port)

    console.log(`Express server listening on port ${port}`)
  }
}
