import { Request, Response } from 'express';
import {
  controller,
  httpGet,
  httpDelete,
  httpPut,
  httpPost
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Types, Events } from '../constants';
import { GiveawayService } from '../services/giveaway';
import { SocketService } from '../services/socket';
import { BaseController } from '../interfaces/BaseController';
import { Giveaway } from '@natsuki/db';
import { Logger } from '@natsuki/util';

/**
 * The Giveaway controller. Contains all endpoints for handling Giveaways.
 *
 * /api/giveaways
 * @class GiveawayController
 */
@controller('/api/giveaways')
export class GiveawayController implements BaseController<Giveaway> {
  constructor(
    @inject(Types.GiveawayService) private giveawayService: GiveawayService,
    @inject(Types.SocketService) private socketService: SocketService
  ) {}

  /**
   * Gets all giveaways from the database.
   *
   * GET /
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<Giveaway[]>
   * @memberof GiveawayController
   */
  @httpGet('/')
  async getAll(request: Request, response: Response) {
    return this.giveawayService.getAll();
  }

  /**
   * Gets a giveaway by their ID.
   *
   * GET /:id
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<Giveaway>
   * @memberof GiveawayController
   */
  @httpGet('/:id')
  async findById(request: Request, response: Response) {
    return this.giveawayService.findById(request.params.id);
  }

  /**
   * Creates a giveaway.
   *
   * POST /
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<Giveaway>
   * @memberof GiveawayController
   */
  @httpPost('/')
  async create(request: Request, response: Response) {
    const giveawayResponse = this.giveawayService.create(request.body);
    await giveawayResponse
      .then((giveaway) => {
        this.socketService.send(
          Events.giveaway.created,
          this.redactKey(giveaway)
        );
      })
      .catch((err: any) => {
        Logger.error(err);
      });

    return giveawayResponse;
  }

  /**
   * Hard deletes a giveaway.
   *
   * DELETE /:id
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<void>
   * @memberof GiveawayController
   */
  @httpDelete('/:id')
  async deleteById(request: Request, response: Response) {
    const deleteResponse = this.giveawayService.delete(request.params.id);
    await deleteResponse
      .then(() => {
        this.socketService.send(Events.giveaway.deleted, request.params.id);
      })
      .catch((err: any) => {
        Logger.error(err);
      });

    return deleteResponse;
  }

  /**
   * Updates a giveaway by ID.
   *
   * PUT /:id
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<void>
   * @memberof GiveawayController
   */
  @httpPut('/:id')
  async updateById(request: Request, response: Response) {
    const updateResponse = this.giveawayService.update(
      request.params.id,
      request.body
    );
    await updateResponse
      .then(() => {
        const returnObject: Giveaway = request.body;
        returnObject.id = request.params.id;
        this.socketService.send(
          Events.giveaway.updated,
          this.redactKey(returnObject)
        );
      })
      .catch((err: any) => {
        Logger.error(err);
      });

    return updateResponse;
  }

  private redactKey(giveaway: Giveaway) {
    if (giveaway.items) {
      giveaway.items.forEach((item) => {
        if (item.key) {
          item.key.key = '';
        }
      });
    }

    return giveaway;
  }
}
