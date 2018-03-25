import { Request, Response } from 'express'
import { controller, httpGet, httpDelete, httpPut, httpPost } from 'inversify-express-utils'
import { inject } from 'inversify'
import { Types, Events } from '../constants'
import { SocketService } from '../services/socket'
import { Logger } from '../utilities'
import { Referral } from '@natsuki/db'
import { ReferralService } from '../services/referral'
import { BaseController } from '../interfaces/BaseController'

/**
 * The referral controller. Contains all endpoints for the referral system.
 *
 * /api/referrals
 * @class ReferralController
 */
@controller('/api/referrals')
export class ReferralController implements BaseController<Referral> {
  constructor (
    @inject(Types.ReferralService) private referralService: ReferralService,
    @inject(Types.SocketService) private socketService: SocketService
  ) {}

  /**
   * Gets all referrals from the database, excluding most related information.
   *
   * GET /
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<Referral[]>
   * @memberof ReferralController
   */
  @httpGet('/')
  async getAll (request: Request, response: Response) {
    return this.referralService.getAll()
  }

  /**
   * Gets a referral by its ID, including all related information.
   *
   * GET /:id
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<Referral>
   * @memberof ReferralController
   */
  @httpGet('/:id')
  async findById (request: Request, response: Response) {
    return this.referralService.findById(request.params.id)
  }

  /**
   * Creates a referral.
   *
   * POST /
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<Referral>
   * @memberof ReferralController
   */
  @httpPost('/')
  async create (request: Request, response: Response) {
    const referralResponse = this.referralService.create(request.body)
    await referralResponse.then(referral => {
      this.socketService.send(Events.referral.created, referral)
    }).catch((err: any) => {
      Logger.error(err)
    })

    return referralResponse
  }

  /**
   * Hard deletes a referral.
   *
   * DELETE /:id
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<void>
   * @memberof ReferralController
   */
  @httpDelete('/:id')
  async deleteById (request: Request, response: Response) {
    const deleteResponse = this.referralService.deleteById(request.params.id)
    await deleteResponse.then(() => {
      this.socketService.send(Events.referral.deleted, request.params.id)
    }).catch((err: any) => {
      Logger.error(err)
    })

    return deleteResponse
  }

  /**
   * Updates a referral by ID.
   *
   * PUT /:id
   * @param {Request} request
   * @param {Response} response
   * @returns Promise<void>
   * @memberof ReferralController
   */
  @httpPut('/:id')
  async updateById (request: Request, response: Response) {
    const updateResponse = this.referralService.updateById(request.params.id, request.body)
    await updateResponse.then(() => {
      const returnObject: Referral = request.body
      returnObject.id = request.params.id
      this.socketService.send(Events.referral.updated, returnObject)
    }).catch((err: any) => {
      Logger.error(err)
    })

    return updateResponse
  }
}
