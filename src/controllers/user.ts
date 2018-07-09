import { Request } from 'express'
import { controller, httpGet, httpDelete, httpPut, httpPost, request, requestParam } from 'inversify-express-utils'
import { inject } from 'inversify'
import { Types, Events } from '../constants'
import { UserService } from '../services/user'
import { SocketService } from '../services/socket'
import { Logger } from '@nightwatch/util'
import { User } from '@nightwatch/db'
import { BaseController } from '../interfaces/BaseController'

/**
 * The user controller. Contains all endpoints for handling users and user data.
 *
 * /api/users
 * @class UserController
 */
@controller('/api/users')
export class UserController implements BaseController<User, string> {
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
  async getAll () {
    return this.userService.getAll()
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
  async findById (@requestParam('id') id: string) {
    return this.userService.findById(id)
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
  async create (request: Request) {
    const userResponse = this.userService.create(request.body)
    await userResponse
      .then(user => {
        this.socketService.send(Events.user.created, user)
      })
      .catch((err: any) => {
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
  async deleteById (@requestParam('id') id: string) {
    const deleteResponse = this.userService.delete(id)
    await deleteResponse
      .then(() => {
        this.socketService.send(Events.user.deleted, id)
      })
      .catch((err: any) => {
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
   * @returns Promise<User>
   * @memberof UserController
   */
  @httpPut('/:id')
  async updateById (@requestParam('id') id: string, @request() request: Request) {
    const updateResponse = this.userService.update(id, request.body)
    await updateResponse
      .then(() => {
        const returnObject: User = request.body
        returnObject.id = id
        this.socketService.send(Events.user.updated, returnObject)
      })
      .catch((err: any) => {
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
  async updateLevel (@requestParam('id') id: string, @request() request: Request) {
    const levelResponse = this.userService.updateLevel(id, request.body)
    await levelResponse
      .then(() => {
        const returnObject: any = request.body
        returnObject.userId = id
        this.socketService.send(Events.user.levelUpdated, returnObject)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return levelResponse
  }

  /**
   * Updates a user's balance by ID.
   *
   * PUT /:id/balance
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<void>
   * @memberof UserController
   */
  @httpPut('/:id/balance')
  async updateBalance (@requestParam('id') id: string, @request() request: Request) {
    const balanceResponse = this.userService.updateBalance(id, request.body)
    await balanceResponse
      .then(() => {
        const returnObject: any = request.body
        returnObject.userId = id
        this.socketService.send(Events.user.balanceUpdated, returnObject)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return balanceResponse
  }

  /**
   * Gets the profile for a user by ID.
   * @param request
   * @param response
   */
  @httpGet('/:id/profile')
  async getProfileById (@requestParam('id') id: string) {
    return this.userService.getProfile(id)
  }

  /**
   * Updates a user's profile by ID.
   *
   * PUT /:id/profile
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<void>
   * @memberof UserController
   */
  @httpPut('/:id/profile')
  async updateProfile (@requestParam('id') id: string, @request() request: Request) {
    const profileResponse = this.userService.updateProfile(id, request.body)
    await profileResponse
      .then(() => {
        const returnObject: any = request.body
        returnObject.userId = id
        this.socketService.send(Events.user.profileUpdated, returnObject)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return profileResponse
  }

  /**
   * Gets the settings for a user.
   * @param request
   * @param response
   * @returns Promise<UserSettings>
   * @memberof UserController
   */
  @httpGet('/:id/settings')
  async getSettingsById (@requestParam('id') id: string) {
    return this.userService.getSettings(id)
  }

  /**
   * Updates a user's settings by ID.
   *
   * PUT /:id/settings
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<void>
   * @memberof UserController
   */
  @httpPut('/:id/settings')
  async updateSettings (@requestParam('id') id: string, @request() request: Request) {
    const settingsResponse = this.userService.updateSettings(id, request.body)
    await settingsResponse
      .then(() => {
        const returnObject: any = request.body
        returnObject.userId = id
        this.socketService.send(Events.user.settingsUpdated, returnObject)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return settingsResponse
  }
}
