import { Referral } from '@nightwatch/db'
import { getRepository } from 'typeorm'
import { BaseService } from '../interfaces/BaseService'
import { injectable } from 'inversify'

/**
 * Referral service to handle referral logic
 *
 * @class ReferralService
 */
@injectable()
export class ReferralService implements BaseService<Referral> {
  private referralRepository = getRepository(Referral)

  public getAll () {
    return this.referralRepository.find()
  }

  public async findById (id: string | number) {
    return this.referralRepository.findOne(id, {
      relations: [ 'user', 'guild' ]
    })
  }

  public create (referral: Referral) {
    return this.referralRepository.save(referral)
  }

  public update (id: string | number, referral: Referral) {
    return this.referralRepository.save(referral)
  }

  public async delete (id: string | number) {
    const referral = await this.referralRepository.findOne(id)

    if (!referral) {
      return
    }

    return this.referralRepository.remove(referral)
  }
}
