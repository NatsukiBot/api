import 'reflect-metadata'
import { createConnection, Connection } from 'typeorm'
import * as bodyParser from 'body-parser'
import { Request, Response, Application, NextFunction } from 'express'
// tslint:disable-next-line:no-duplicate-imports
import * as express from 'express'
import { Routes } from './routes'
import * as path from 'path'
import * as morgan from 'morgan'
import { Logger } from './services'
import * as compression from 'compression'
import * as helmet from 'helmet'
import * as cors from 'cors'
import * as methodOverride from 'method-override'
import * as errorHandler from 'errorhandler'
import * as expressStatusMonitor from 'express-status-monitor'

/**
 * The API server
 *
 * @export
 * @class Api
 */
export class Api {
  app: Application
  connection: Connection

  /**
   * Creates an instance of the Api.
   * @memberof Api
   */
  constructor () {
    this.app = express()
    this.routes()
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

  private routes () {
    createConnection().then(async connection => {
      // register express routes from defined application routes
      Routes.forEach(route => {
        (this.app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
          const result = (new (route.controller as any)())[route.action](req, res, next)
          if (result instanceof Promise) {
            result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

          } else if (result !== null && result !== undefined) {
            res.json(result)
          }
        })
      })
    }).catch((err) => Logger.error(err))
  }
}
