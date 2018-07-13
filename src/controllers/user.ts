import { Request, Response } from 'express'
import {
  controller,
  httpGet,
  httpDelete,
  httpPut,
  httpPost,
  request,
  requestParam,
  response,
  queryParam
} from 'inversify-express-utils'
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
   * @param {string} id The ID of the user.
   * @returns Promise<User | undefined>
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
   * @param {Request} request The request contained a `User` object.
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
   * @param {string} id The ID of the user.
   * @returns Promise<User | undefined>
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
   * @param {string} id The ID of the user.
   * @param {Request} request The request containing a `User` object.
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
   * @param {string} id The ID of the user.
   * @param {Request} request The request containing a `UserLevelBalance` object.
   * @returns Promise<User | undefined>
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
   * @param {string} id The ID of the user.
   * @param {Request} request The request containing a `UserBalance` object.
   * @returns Promise<UpdateResult>
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
   * Transfers a certain amount of a user's credits to another user.
   *
   * PUT /:id/balance/transfer/:receiverId
   * @param {string} id The ID of the user losing credits.
   * @param {string} receiverId The ID of the user gaining credits.
   * @param {Request} request The request to the server.
   * @param {Response} response The response to the client.
   * @returns Promise<{transferFromResponse: UpdateResult, transferToResponse: UpdateResult} | undefined>
   * @memberof UserController
   */
  @httpPut('/:id/balance/transfer/:receiverId')
  async transferBalance (
    @requestParam('id') id: string,
    @requestParam('receiverId') receiverId: string,
    @request() request: Request,
    @response() response: Response
  ) {
    const amount = request.body.amount

    const fromUser = await this.userService.findById(id)
    const toUser = await this.userService.findById(receiverId)

    if (!fromUser || !toUser) {
      response.status(400).send('User not found')
      return
    }

    if (fromUser === toUser) {
      response.status(400).send('Sender and receiver are the same')
      return
    }

    if (amount < 1) {
      response.status(400).send('Amount must be greater than 0')
    }

    if (fromUser.balance.balance < amount) {
      response.status(400).send('Insufficient credits')
      return
    }

    fromUser.balance.balance -= amount
    fromUser.balance.netWorth -= amount
    toUser.balance.balance += amount
    toUser.balance.netWorth += amount

    const transferFromResponse = await this.userService.updateBalance(id, fromUser.balance)
    const transferToResponse = await this.userService.updateBalance(receiverId, toUser.balance)

    return {
      transferFromResponse,
      transferToResponse
    }
  }

  /**
   * Gets the profile for a user by ID.
   * @param {string} id The ID of the user.
   * @returns Promise<UserProfile[]>
   * @memberof UserController
   */
  @httpGet('/:id/profile')
  async getProfileById (@requestParam('id') id: string) {
    return this.userService.getProfile(id)
  }

  /**
   * Updates a user's profile by ID.
   *
   * PUT /:id/profile
   * @param {string} id The ID of the user.
   * @param {Request} request The request containing a `UserProfile` object.
   * @returns Promise<UpdateResult>
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
   * @param {string} id The ID of the user.
   * @returns Promise<UserSettings[]>
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
   * @param {string} id The ID of the user.
   * @param {Request} request The request containing a `UserSettings` object.
   * @returns Promise<UpdateResult>
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

  /**
   * Gets all friend requests for a user.
   *
   * GET /:id/friends/requests
   * @param {string} id
   * @param {('incoming' | 'outgoing')} [type] Optional filter to only get incoming or outgoing friend requests.
   * @returns Map of incoming and outgoing friend requests.
   * @memberof UserController
   */
  @httpGet('/:id/friends/requests')
  async getFriendRequests (@requestParam('id') id: string, @queryParam('type') type?: 'incoming' | 'outgoing') {
    return this.userService.getFriendRequests(id, type)
  }

  /**
   * Gets a paginated list of friend requests.
   *
   * GET /:id/friends/requests/search
   * @param {string} id
   * @param {number} [skip]
   * @param {number} [take]
   * @returns Promise<UserFriendRequest[]>
   * @memberof UserController
   */
  @httpGet('/:id/friends/requests/search')
  async searchFriendRequests (
    @requestParam('id') id: string,
    @queryParam('skip') skip?: number,
    @queryParam('take') take?: number,
    @queryParam('userId') userId?: string
    @queryParam('name') name?: string
  ) {
    return this.userService.searchFriendRequests(id, skip, take, userId, name)
  }

  /**
   * Creates a friend request.
   *
   * POST /:id/friends/requests
   * @param {string} id
   * @param {Request} request
   * @returns Promise<UserFriendRequest | undefined>
   * @memberof UserController
   */
  @httpPost('/:id/friends/requests')
  async createFriendRequest (@requestParam('id') id: string, @request() request: Request) {
    const response = this.userService.createFriendRequest(id, request.body)
    await response
      .then(() => {
        this.socketService.send(Events.user.friend.request.created, request.body)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return response
  }

  /**
   * Deletes a friend request.
   *
   * DELETE /:id/friends/requests/:requestId
   * @param {string} id
   * @param {number} requestId
   * @returns Promise<UserFriendRequest | undefined>
   * @memberof UserController
   */
  @httpDelete('/:id/friends/requests/:requestId')
  async deleteFriendRequest (@requestParam('id') id: string, @requestParam('requestId') requestId: number) {
    const response = this.userService.deleteFriendRequest(id, requestId)
    await response
      .then(() => {
        this.socketService.send(Events.user.friend.request.deleted, {
          userId: id,
          requestId
        })
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return response
  }

  /**
   * Gets all friends for a user.
   *
   * GET /:id/friends
   * @param {string} id
   * @returns Promise<UserFriend[]>
   * @memberof UserController
   */
  @httpGet('/:id/friends')
  async getFriends (@requestParam('id') id: string) {
    return this.userService.getFriends(id)
  }

  /**
   * Gets a paginated list of friends for a user.
   *
   * GET /:id/friends/search
   * @param {string} id
   * @param {number} [skip]
   * @param {number} [take]
   * @returns Promise<UserFriend[]>
   * @memberof UserController
   */
  @httpGet('/:id/friends/search')
  async searchFriends (
    @requestParam('id') id: string,
    @queryParam('skip') skip?: number,
    @queryParam('take') take?: number
  ) {
    return this.userService.searchFriends(id, skip, take)
  }

  /**
   * Gets a user's friend by a database object ID.
   *
   * GET /:id/friends/:friendId
   * @param {string} id
   * @param {number} friendId
   * @returns Promise<UserFriend | undefined>
   * @memberof UserController
   */
  @httpGet('/:id/friends/:friendId')
  async getFriendById (@requestParam('id') id: string, @requestParam('friendId') friendId: number) {
    return this.userService.getFriendById(id, friendId)
  }

  /**
   * Creates a friend and deletes the related friend request.
   *
   * POST /:id/friends
   * @param {string} id
   * @param {Request} request
   * @returns Promise<UserFriend | undefined>
   * @memberof UserController
   */
  @httpPost('/:id/friends')
  async addFriend (@requestParam('id') id: string, @request() request: Request) {
    const response = this.userService.addFriend(id, request.body)
    await response
      .then(() => {
        this.socketService.send(Events.user.friend.created, request.body)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return response
  }

  /**
   * Deletes a friend.
   *
   * DELETE /:id/friends/:friendId
   * @param {string} id
   * @param {number} friendId
   * @returns Promise<UserFriend | undefined>
   * @memberof UserController
   */
  @httpDelete('/:id/friends/:friendId')
  async removeFriend (@requestParam('id') id: string, @requestParam('friendId') friendId: number) {
    const response = this.userService.deleteFriend(id, friendId)
    await response
      .then(() => {
        this.socketService.send(Events.user.friend.deleted, {
          userId: id,
          friendId
        })
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return response
  }
}
