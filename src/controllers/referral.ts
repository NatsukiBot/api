import { controller, httpGet, httpDelete, httpPut, httpPost, requestParam, requestBody } from 'inversify-express-utils'
import { inject } from 'inversify'
import { Types, Events } from '../constants'
import { SocketService } from '../services/socket'
import { Referral } from '@nightwatch/db'
import { ReferralService } from '../services/referral'
import { BaseController } from '../interfaces/BaseController'
import { Logger } from '@nightwatch/util'

/**
 * The referral controller. Contains all endpoints for the referral system.
 *
 * /api/referrals
 * @class ReferralController
 */
@controller('/api/referrals')
export class ReferralController implements BaseController<Referral, number> {
  constructor (
    @inject(Types.ReferralService) private referralService: ReferralService,
    @inject(Types.SocketService) private socketService: SocketService
  ) {}

  /**
   * Gets all referrals from the database, excluding most related information.
   *
   * GET /
   * @returns Promise<Referral[]>
   * @memberof ReferralController
   */
  @httpGet('/')
  async getAll () {
    return this.referralService.getAll()
  }

  /**
   * Gets a referral by its ID, including all related information.
   *
   * GET /:id
   * @param {number} id The ID of the referral.
   * @returns Promise<Referral>
   * @memberof ReferralController
   */
  @httpGet('/:id')
  async findById (@requestParam('id') id: number) {
    return this.referralService.findById(id)
  }

  /**
   * Creates a referral.
   *
   * POST /
   * @param {Request} request The request containing a `Referral` object.
   * @returns Promise<Referral>
   * @memberof ReferralController
   */
  @httpPost('/')
  async create (@requestBody() referral: Referral) {
    const referralResponse = this.referralService.create(referral)
    await referralResponse
      .then(r => {
        this.socketService.send(Events.referral.created, r)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return referralResponse
  }

  /**
   * Hard deletes a referral.
   *
   * DELETE /:id
   * @param {number} id The ID of the referral.
   * @returns Promise<Referral | undefined>
   * @memberof ReferralController
   */
  @httpDelete('/:id')
  async deleteById (@requestParam('id') id: number) {
    const deleteResponse = this.referralService.delete(id)
    await deleteResponse
      .then(() => {
        this.socketService.send(Events.referral.deleted, id)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return deleteResponse
  }

  /**
   * Updates a referral by ID.
   *
   * PUT /:id
   * @param {number} id The ID of the referral.
   * @param {Request} request The request containing a `Referral` object.
   * @returns Promise<Referral>
   * @memberof ReferralController
   */
  @httpPut('/:id')
  async updateById (@requestParam('id') id: number, @requestBody() referral: Referral) {
    const updateResponse = this.referralService.update(id, referral)
    await updateResponse
      .then(() => {
        const returnObject: Referral = referral
        returnObject.id = id
        this.socketService.send(Events.referral.updated, returnObject)
      })
      .catch((err: any) => {
        Logger.error(err)
      })

    return updateResponse
  }
}
