import { Request } from 'express'
import { controller, httpGet, httpDelete, httpPut, httpPost, requestParam, request } from 'inversify-express-utils'
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
export class GuildController implements BaseController<Guild, string> {
  constructor (
    @inject(Types.GuildService) private guildService: GuildService,
    @inject(Types.SocketService) private socketService: SocketService
  ) {}

  /**
   * Gets all guilds from the database, excluding most guild information.
   *
   * GET /
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
   * @param {string} id The ID of the guild.
   * @returns Promise<Guild>
   * @memberof GuildController
   */
  @httpGet('/:id')
  async findById (@requestParam('id') id: string) {
    return this.guildService.findById(id)
  }

  /**
   * Creates a guild.
   *
   * POST /
   * @param {Request} request The request containing a `Guild` object.
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
   * @param {string} id The ID of the guild.
   * @returns Promise<Guild | undefined>
   * @memberof GuildController
   */
  @httpDelete('/:id')
  async deleteById (@requestParam('id') id: string) {
    const deleteResponse = this.guildService.delete(id)
    await deleteResponse
      .then(() => {
        this.socketService.send(Events.guild.deleted, id)
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
   * @param {string} id The ID of the guild.
   * @param {Request} request The request containing a `Guild` object.
   * @returns Promise<Guild>
   * @memberof GuildController
   */
  @httpPut('/:id')
  async updateById (@requestParam('id') id: string, @request() request: Request) {
    const updateResponse = this.guildService.update(id, request.body)
    await updateResponse
      .then(() => {
        const returnObject: Guild = request.body
        returnObject.id = id
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
   * @param {string} id The ID of the guild.
   * @returns Promise<GuildSuggestion[]>
   * @memberof GuildController
   */
  @httpGet('/:id/suggestions')
  async getSuggestions (@requestParam('id') id: string) {
    return this.guildService.getSuggestions(id)
  }

  /**
   * Gets a Guild suggestion by ID.
   *
   * GET /:id/suggestions/:suggestionId
   * @param {string} id The ID of the guild.
   * @param {number} suggestionId The ID of the suggestion.
   * @returns Promise<GuildSuggestion | undefined>
   * @memberof GuildController
   */
  @httpGet('/:id/suggestions/:suggestionId')
  async getSuggestionById (@requestParam('id') id: string, @requestParam('suggestionId') suggestionId: number) {
    return this.guildService.getSuggestionById(id, suggestionId)
  }

  /**
   * Creates a suggestion in a Guild
   *
   * POST /:id/suggestions
   * @param {string} id The ID of the guild.
   * @param {Request} request The request containing a `GuildSuggestion` object.
   * @returns Promise<GuildSuggestion>
   * @memberof GuildController
   */
  @httpPost('/:id/suggestions')
  async createSuggestion (@requestParam('id') id: string, @request() request: Request) {
    const postResponse = this.guildService.createSuggestion(id, request.body)
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
   * @param {string} id The ID of the guild.
   * @param {number} suggestionId The ID of the suggestion.
   * @param {Request} request The request containing a `GuildSuggestion` object.
   * @returns Promise<UpdateResult>
   * @memberof GuildController
   */
  @httpPut('/:id/suggestions/:suggestionId')
  async updateSuggestionById (
    @requestParam('id') id: string,
    @requestParam('suggestionId') suggestionId: number,
    @request() request: Request
  ) {
    const updateResponse = this.guildService.updateSuggestion(id, suggestionId, request.body)
    await updateResponse
      .then(() => {
        const returnObject: Guild = request.body
        returnObject.id = id
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
   * @param {string} id The ID of the guild.
   * @param {number} suggestionId The ID of the suggestion.
   * @returns Promise<GuildSuggestion | undefined>
   * @memberof GuildController
   */
  @httpDelete('/:id/suggestions/:suggestionId')
  async deleteSuggestionById (@requestParam('id') id: string, @requestParam('suggestionId') suggestionId: number) {
    const deleteResponse = this.guildService.deleteSuggestion(id, suggestionId)
    await deleteResponse
      .then(() => {
        this.socketService.send(Events.guild.suggestion.deleted, {
          guildId: id,
          suggestionId
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
   * @param {string} id The ID of the guild.
   * @returns Promise<GuildSupportTicket[]>
   * @memberof GuildController
   */
  @httpGet('/:id/support-tickets')
  async getSupportTickets (@requestParam('id') id: string) {
    return this.guildService.getSupportTickets(id)
  }

  /**
   * Gets a Guild support ticket by ID.
   *
   * GET /:id/support-tickets/:ticketId
   * @param {string} id The ID of the guild.
   * @param {number} ticketId The ID of the support ticket.
   * @returns Promise<GuildSupportTicket | undefined>
   * @memberof GuildController
   */
  @httpGet('/:id/support-tickets/:ticketId')
  async getSupportTicketById (@requestParam('id') id: string, @requestParam('ticketId') ticketId: number) {
    return this.guildService.getSupportTicketById(id, ticketId)
  }

  /**
   * Creates a support ticket in a Guild
   *
   * POST /:id/support-tickets
   * @param {string} id The ID of the guild.
   * @param {Request} request The request containing a `GuildSupportTicket` object.
   * @returns Promise<GuildSupportTicket>
   * @memberof GuildController
   */
  @httpPost('/:id/support-tickets')
  async createSupportTicket (@requestParam('id') id: string, request: Request) {
    const postResponse = this.guildService.createSupportTicket(id, request.body)
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
   * @param {string} id The ID of the guild.
   * @param {number} ticketId The ID of the support ticket.
   * @param {Request} request The request containing a `GuildSupportTicket` object.
   * @returns Promise<UpdateResult>
   * @memberof GuildController
   */
  @httpPut('/:id/support-tickets/:ticketId')
  async updateSupportTicketById (
    @requestParam('id') id: string,
    @requestParam('ticketId') ticketId: number,
    @request() request: Request
  ) {
    const updateResponse = this.guildService.updateSupportTicket(id, ticketId, request.body)
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
   * @param {string} id The ID of the guild.
   * @param {number} ticketId The ID of the support ticket.
   * @returns Promise<GuildSupportTicket | undefined>
   * @memberof GuildController
   */
  @httpDelete('/:id/support-tickets/:ticketId')
  async deleteSupportTicketById (@requestParam('id') id: string, @requestParam('ticketId') ticketId: number) {
    const deleteResponse = this.guildService.deleteSupportTicket(id, ticketId)
    await deleteResponse
      .then(() => {
        this.socketService.send(Events.guild.supportTicket.deleted, {
          guildId: id,
          ticketId
        })
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return deleteResponse
  }

  /**
   * Gets a Guild's settings by ID.
   *
   * GET /:id/settings
   * @param {string} id The ID of the guild.
   * @returns Promise<GuildSettings[]>
   * @memberof GuildController
   */
  @httpGet('/:id/settings')
  async getSettingsById (@requestParam('id') id: string) {
    return this.guildService.getSettings(id)
  }

  /**
   * Updates a Guild's settings by ID.
   *
   * PUT /:id/settings
   * @param {string} id The ID of the guild.
   * @param {Request} request The request containing a `GuildSettings` object.
   * @returns Promise<UpdateResult>
   * @memberof GuildController
   */
  @httpPut('/:id/settings')
  async updateSettingsById (@requestParam('id') id: string, @request() request: Request) {
    const updateResponse = this.guildService.updateSettings(id, request.body)
    await updateResponse
      .then(() => {
        const returnObject: GuildSettings = request.body
        this.socketService.send(Events.guild.settingsUpdated, returnObject)
      })
      .catch((err: any) => {
        Logger.error(err)
      })
    return updateResponse
  }

  /**
   * Gets all users in a Guild.
   *
   * GET /:id/users
   * @param {string} id The ID of the guild.
   * @returns Promise<GuildUser[]>
   * @memberof GuildController
   */
  @httpGet('/:id/users')
  async getUsers(@requestParam('id') id: string) {
    return this.guildService.getUsers(id)
  }

  /**
   * Gets a Guild user by ID.
   *
   * GET /:id/users/:userId
   * @param {string} id The ID of the guild.
   * @param {string} userId The ID of the user.
   * @returns Promise<GuildUser | undefined>
   * @memberof GuildController
   */
  @httpGet('/:id/users/:userId')
  async getUserById (@requestParam('id') id: string, @requestParam('userId') userId: string) {
    return this.guildService.getUserById(id, userId)
  }

  /**
   * Creates a user in a Guild
   *
   * POST /:id/users
   * @param {string} id The ID of the guild.
   * @param {Request} request The request containing a `GuildUser` object.
   * @returns Promise<GuildUser>
   * @memberof GuildController
   */
  @httpPost('/:id/users')
  async createUser (@requestParam('id') id: string, @request() request: Request) {
    const postResponse = this.guildService.createUser(id, request.body)
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
   * @param {string} id The ID of the guild.
   * @param {string} userId The ID of the user.
   * @param {Request} request The request containing a `GuildUser` object.
   * @returns Promise<UpdateResult>
   * @memberof GuildController
   */
  @httpPut('/:id/users/:userId')
  async updateUserById (@requestParam('id') id: string, @requestParam('userId') userId: string, @request() request: Request) {
    const updateResponse = this.guildService.updateUser(
      id,
      userId,
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
   * @param {string} id The ID of the guild.
   * @param {string} userId The ID of the user.
   * @returns Promise<GuildUser | undefined>
   * @memberof GuildController
   */
  @httpDelete('/:id/users/:userId')
  async deleteUserById (@requestParam('id') id: string, @requestParam('userId') userId: string) {
    const deleteResponse = this.guildService.deleteUser(id, userId)
    await deleteResponse
      .then(() => {
        this.socketService.send(Events.guild.user.deleted, {
          guildId: id,
          userId
        })
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return deleteResponse
  }
}
