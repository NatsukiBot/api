import { Request, Response } from 'express'
import { controller, httpGet, httpDelete, httpPut, httpPost } from 'inversify-express-utils'
import { inject } from 'inversify'
import { Types, Events } from '../constants'
import { GuildService } from '../services/guild'
import { SocketService } from '../services/socket'
import { BaseController } from '../interfaces/BaseController'
import { Guild, GuildSupportTicket, GuildSettings, GuildUser } from '@nightwatch/db'
import { Logger } from '@nightwatch/util'

/**
 * The Guild controller. Contains all endpoints for handling Guilds and Guild data.
 *
 * /api/guilds
 * @class GuildController
 */
@controller('/api/guilds')
export class GuildController implements BaseController<Guild> {
  constructor (
    @inject(Types.GuildService) private guildService: GuildService,
    @inject(Types.SocketService) private socketService: SocketService
  ) {}

  /**
   * Gets all guilds from the database, excluding most guild information.
   *
   * GET /
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<Guild[]>
   * @memberof GuildController
   */
  @httpGet('/')
  async getAll () {
    return this.guildService.getAll()
  }

  /**
   * Gets a guild by their ID, including all guild information.
   *
   * GET /:id
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<Guild>
   * @memberof GuildController
   */
  @httpGet('/:id')
  async findById (request: Request) {
    return this.guildService.findById(request.params.id)
  }

  /**
   * Creates a guild.
   *
   * POST /
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<Guild>
   * @memberof GuildController
   */
  @httpPost('/')
  async create (request: Request) {
    const guildResponse = this.guildService.create(request.body)
    await guildResponse
      .then(guild => {
        this.socketService.send(Events.guild.created, guild)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return guildResponse
  }

  /**
   * Hard deletes a guild.
   *
   * DELETE /:id
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<void>
   * @memberof GuildController
   */
  @httpDelete('/:id')
  async deleteById (request: Request) {
    const deleteResponse = this.guildService.delete(request.params.id)
    await deleteResponse
      .then(() => {
        this.socketService.send(Events.guild.deleted, request.params.id)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return deleteResponse
  }

  /**
   * Updates a guild by ID.
   *
   * PUT /:id
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<void>
   * @memberof GuildController
   */
  @httpPut('/:id')
  async updateById (request: Request) {
    const updateResponse = this.guildService.update(request.params.id, request.body)
    await updateResponse
      .then(() => {
        const returnObject: Guild = request.body
        returnObject.id = request.params.id
        this.socketService.send(Events.guild.updated, returnObject)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return updateResponse
  }

  /**
   * Gets all suggestions in a Guild
   *
   * GET /:id/suggestions
   * @param request
   * @param response
   */
  @httpGet('/:id/suggestions')
  async getSuggestions (request: Request) {
    return this.guildService.getSuggestions(request.params.id)
  }

  /**
   * Gets a Guild suggestion by ID.
   *
   * GET /:id/suggestions/:suggestionId
   * @param request
   * @param response
   */
  @httpGet('/:id/suggestions/:suggestionId')
  async getSuggestionById (request: Request) {
    return this.guildService.getSuggestionById(request.params.id, request.body)
  }

  /**
   * Creates a suggestion in a Guild
   *
   * POST /:id/suggestions
   * @param request
   * @param response
   */
  @httpPost('/:id/suggestions')
  async createSuggestion (request: Request) {
    const postResponse = this.guildService.createSuggestion(request.params.id, request.body)
    await postResponse
      .then(item => {
        this.socketService.send(Events.guild.suggestion.created, item)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return postResponse
  }

  /**
   * Updates a Guild suggestion by ID.
   *
   * PUT /:id/suggestions/:suggestionId
   * @param request
   * @param response
   */
  @httpPut('/:id/suggestions/:suggestionId')
  async updateSuggestionById (request: Request) {
    const updateResponse = this.guildService.updateSuggestion(
      request.params.id,
      request.params.suggestionId,
      request.body
    )
    await updateResponse
      .then(() => {
        const returnObject: Guild = request.body
        returnObject.id = request.params.id
        this.socketService.send(Events.guild.suggestion.updated, returnObject)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return updateResponse
  }

  /**
   * Deletes a Guild suggestion by ID.
   *
   * DELETE /:id/suggestions/:suggestionId
   * @param request
   * @param response
   */
  @httpDelete('/:id/suggestions/:suggestionId')
  async deleteSuggestionById (request: Request) {
    const deleteResponse = this.guildService.deleteSuggestion(request.params.id, request.body)
    await deleteResponse
      .then(() => {
        this.socketService.send(Events.guild.suggestion.deleted, {
          guildId: request.params.id,
          suggestionId: request.body
        })
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return deleteResponse
  }

  /**
   * Gets all support tickets in a Guild
   *
   * GET /:id/support-tickets
   * @param request
   * @param response
   */
  @httpGet('/:id/support-tickets')
  async getSupportTickets (request: Request) {
    return this.guildService.getSupportTickets(request.params.id)
  }

  /**
   * Gets a Guild support ticket by ID.
   *
   * GET /:id/support-tickets/:ticketId
   * @param request
   * @param response
   */
  @httpGet('/:id/support-tickets/:ticketId')
  async getSupportTicketById (request: Request) {
    return this.guildService.getSupportTicketById(request.params.id, request.body)
  }

  /**
   * Creates a support ticket in a Guild
   *
   * POST /:id/support-tickets
   * @param request
   * @param response
   */
  @httpPost('/:id/support-tickets')
  async createSupportTicket (request: Request) {
    const postResponse = this.guildService.createSupportTicket(request.params.id, request.body)
    await postResponse
      .then(item => {
        this.socketService.send(Events.guild.supportTicket.created, item)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return postResponse
  }

  /**
   * Updates a Guild support ticket by ID.
   *
   * PUT /:id/support-tickets/:ticketId
   * @param request
   * @param response
   */
  @httpPut('/:id/support-tickets/:ticketId')
  async updateSupportTicketById (request: Request) {
    const updateResponse = this.guildService.updateSupportTicket(
      request.params.id,
      request.params.ticketId,
      request.body
    )
    await updateResponse
      .then(() => {
        const returnObject: GuildSupportTicket = request.body
        this.socketService.send(Events.guild.supportTicket.updated, returnObject)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return updateResponse
  }

  /**
   * Deletes a Guild support ticket by ID.
   *
   * DELETE /:id/support-tickets/:ticketId
   * @param request
   * @param response
   */
  @httpDelete('/:id/support-tickets/:ticketId')
  async deleteSupportTicketById (request: Request) {
    const deleteResponse = this.guildService.deleteSupportTicket(request.params.id, request.body)
    await deleteResponse
      .then(() => {
        this.socketService.send(Events.guild.supportTicket.deleted, {
          guildId: request.params.id,
          ticketId: request.body
        })
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return deleteResponse
  }

  @httpGet('/:id/settings')
  async getSettingsById (request: Request) {
    return this.guildService.getSettings(request.params.id)
  }

  /**
   * Updates a Guild's settings by ID.
   *
   * PUT /:id/settings
   * @param request
   * @param response
   */
  @httpPut('/:id/settings')
  async updateSettingsById (request: Request) {
    const updateResponse = this.guildService.updateSettings(request.params.id, request.body)
    await updateResponse
      .then(() => {
        const returnObject: GuildSettings = request.body
        this.socketService.send(Events.guild.settingsUpdated, returnObject)
      })
      .catch((err: any) => {
        Logger.error(err)
      })
  }

  /**
   * Gets all users in a Guild.
   *
   * GET /:id/users
   * @param request
   * @param response
   */
  @httpGet('/:id/users')
  async getUsers(request: Request, response: Response) {
    return this.guildService.getUsers(request.params.id)
  }

  /**
   * Gets a Guild user by ID.
   *
   * GET /:id/users/:userId
   * @param request
   * @param response
   */
  @httpGet('/:id/support-tickets/:userId')
  async getUserById (request: Request, response: Response) {
    return this.guildService.getUserById(request.params.id, request.params.userId)
  }

  /**
   * Creates a user in a Guild
   *
   * POST /:id/users
   * @param request
   * @param response
   */
  @httpPost('/:id/users')
  async createUser (request: Request, response: Response) {
    const postResponse = this.guildService.createUser(request.params.id, request.body)
    await postResponse
      .then(item => {
        this.socketService.send(Events.guild.user.created, item)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return postResponse
  }

  /**
   * Updates a Guild user by ID.
   *
   * PUT /:id/users/:userId
   * @param request
   * @param response
   */
  @httpPut('/:id/users/:userId')
  async updateUserById (request: Request, response: Response) {
    const updateResponse = this.guildService.updateUser(
      request.params.id,
      request.params.userId,
      request.body
    )
    await updateResponse
      .then(() => {
        const returnObject: GuildUser = request.body
        this.socketService.send(Events.guild.user.updated, returnObject)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return updateResponse
  }

  /**
   * Deletes a Guild user by ID.
   *
   * DELETE /:id/users/:userId
   * @param request
   * @param response
   */
  @httpDelete('/:id/users/:userId')
  async deleteUserById (request: Request, response: Response) {
    const deleteResponse = this.guildService.deleteUser(request.params.id, request.params.userId)
    await deleteResponse
      .then(() => {
        this.socketService.send(Events.guild.user.deleted, {
          guildId: request.params.id,
          userId: request.body
        })
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return deleteResponse
  }
}
