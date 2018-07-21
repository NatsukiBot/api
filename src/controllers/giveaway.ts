import { Request } from 'express'
import {
  controller,
  httpGet,
  httpDelete,
  httpPut,
  httpPost,
  requestParam,
  request,
  requestBody
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { Types, Events } from '../constants'
import { GiveawayService } from '../services/giveaway'
import { SocketService } from '../services/socket'
import { BaseController } from '../interfaces/BaseController'
import { Giveaway } from '@nightwatch/db'
import { Logger } from '@nightwatch/util'

/**
 * The Giveaway controller. Contains all endpoints for handling Giveaways.
 *
 * /api/giveaways
 * @class GiveawayController
 */
@controller('/api/giveaways')
export class GiveawayController implements BaseController<Giveaway, number> {
  constructor (
    @inject(Types.GiveawayService) private giveawayService: GiveawayService,
    @inject(Types.SocketService) private socketService: SocketService
  ) {}

  /**
   * Gets all giveaways from the database.
   *
   * GET /
   * @returns Promise<Giveaway[]>
   * @memberof GiveawayController
   */
  @httpGet('/')
  async getAll () {
    return this.giveawayService.getAll()
  }

  /**
   * Gets a giveaway by their ID.
   *
   * GET /:id
   * @param {number} id The ID of the giveaway.
   * @returns Promise<Giveaway>
   * @memberof GiveawayController
   */
  @httpGet('/:id')
  async findById (@requestParam('id') id: number) {
    return this.giveawayService.findById(id)
  }

  /**
   * Creates a giveaway.
   *
   * POST /
   * @param {Request} request The request containing a `Giveaway` object.
   * @returns Promise<Giveaway>
   * @memberof GiveawayController
   */
  @httpPost('/')
  async create (@requestBody() giveaway: Giveaway) {
    const giveawayResponse = this.giveawayService.create(giveaway)
    await giveawayResponse
      .then(g => {
        this.socketService.send(Events.giveaway.created, this.redactKey(g))
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return giveawayResponse
  }

  /**
   * Hard deletes a giveaway.
   *
   * DELETE /:id
   * @param {number} id The ID of the giveaway.
   * @returns Promise<Giveaway | undefined>
   * @memberof GiveawayController
   */
  @httpDelete('/:id')
  async deleteById (@requestParam('id') id: number) {
    const deleteResponse = this.giveawayService.delete(id)
    await deleteResponse
      .then(() => {
        this.socketService.send(Events.giveaway.deleted, id)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return deleteResponse
  }

  /**
   * Updates a giveaway by ID.
   *
   * PUT /:id
   * @param {number} id The ID of the giveaway.
   * @param {Request} request The request containing a `Giveaway` object.
   * @returns Promise<Giveaway>
   * @memberof GiveawayController
   */
  @httpPut('/:id')
  async updateById (@requestParam('id') id: number, @request() request: Request) {
    const updateResponse = this.giveawayService.update(id, request.body)
    await updateResponse
      .then(() => {
        const returnObject: Giveaway = request.body
        returnObject.id = request.params.id
        this.socketService.send(Events.giveaway.updated, this.redactKey(returnObject))
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return updateResponse
  }

  private redactKey (giveaway: Giveaway) {
    if (giveaway.items) {
      giveaway.items.forEach(item => {
        if (item.key) {
          item.key.key = ''
        }
      })
    }

    return giveaway
  }
}
