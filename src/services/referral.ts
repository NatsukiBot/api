import { Referral } from '@natsuki/db'
import { getRepository, getConnection } from 'typeorm'
import { provide } from '../ioc/ioc'
import { Types } from '../constants'
import { Logger } from '../utilities'
import { BaseService } from '../interfaces/BaseService'

/**
 * Referral service to handle referral logic
 *
 * @class ReferralService
 */
@provide(Types.ReferralService)
export class ReferralService implements BaseService<Referral> {
  private referralRepository = getRepository(Referral)

  public getAll () {
    return this.referralRepository.find()
  }

  public async findById (id: string | number) {
    return this.referralRepository
      .createQueryBuilder('referral')
      .innerJoinAndSelect('referral.user', 'user')
      .innerJoinAndSelect('referral.guild', 'guild')
      .where('referral.id = :id', { id })
      .getOne()
  }

  public create (referral: Referral) {
    return this.referralRepository.save(referral)
  }

  public updateById (id: string | number, referral: Referral) {
    return this.referralRepository.updateById(id, referral)
  }

  public deleteById (id: string | number) {
    return this.referralRepository.deleteById(id)
  }
}
