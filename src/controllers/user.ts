import { Request, Response } from 'express'
import { controller, httpGet, httpDelete, httpPut, httpPost } from 'inversify-express-utils'
import { inject } from 'inversify'
import { Types, Events } from '../constants'
import { UserService } from '../services/user'
import { SocketService } from '../services/socket'
import { Logger } from '../utilities'
import { UserLevel, User } from '@natsuki/db'

/**
 * The user controller. Contains all endpoints for handling users and user data.
 *
 * /api/users
 * @class UserController
 */
@controller('/api/users')
export class UserController {
  constructor (
    @inject(Types.UserService) private userService: UserService,
    @inject(Types.SocketService) private socketService: SocketService
  ) {}

  /**
   * Gets all users from the database, excluding most user information.
   *
   * GET /
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<User[]>
   * @memberof UserController
   */
  @httpGet('/')
  async find (request: Request, response: Response) {
    return this.userService.getUsers()
  }

  /**
   * Gets a user by their ID, including all user information.
   *
   * GET /:id
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<User>
   * @memberof UserController
   */
  @httpGet('/:id')
  async findById (request: Request, response: Response) {
    return this.userService.getUser(request.params.id)
  }

  /**
   * Creates a user.
   *
   * POST /
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<User>
   * @memberof UserController
   */
  @httpPost('/')
  async create (request: Request, response: Response) {
    const userResponse = this.userService.create(request.body)
    await userResponse.then(user => {
      this.socketService.send(Events.user.created, user)
    }).catch((err: any) => {
      Logger.error(err)
    })

    return userResponse
  }

  /**
   * Hard deletes a user.
   *
   * DELETE /:id
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<void>
   * @memberof UserController
   */
  @httpDelete('/:id')
  async remove (request: Request, response: Response) {
    const deleteResponse = this.userService.delete(request.params.id)
    await deleteResponse.then(() => {
      this.socketService.send(Events.user.deleted, request.params.id)
    }).catch((err: any) => {
      Logger.error(err)
    })

    return deleteResponse
  }

  /**
   * Updates a user by ID.
   *
   * PUT /:id
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<void>
   * @memberof UserController
   */
  @httpPut('/:id')
  async update (request: Request, response: Response) {
    const updateResponse = this.userService.update(request.params.id, request.body)
    await updateResponse.then(() => {
      const returnObject: User = request.body
      returnObject.id = request.params.id
      this.socketService.send(Events.user.updated, returnObject)
    }).catch((err: any) => {
      Logger.error(err)
    })

    return updateResponse
  }

  /**
   * Updates a user's level by ID.
   *
   * PUT /:id/level
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<void>
   * @memberof UserController
   */
  @httpPut('/:id/level')
  async updateLevel (request: Request, response: Response) {
    const levelResponse = this.userService.updateLevel(request.params.id, request.body)
    await levelResponse.then(() => {
      const returnObject: UserLevel = request.body
      returnObject.user.id = request.params.id
      this.socketService.send(Events.user.levelUpdated, returnObject)
    }).catch((err: any) => {
      Logger.error(err)
    })

    return levelResponse
  }
}
