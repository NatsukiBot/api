import { Giveaway } from '@natsuki/db'
import { getRepository, getConnection } from 'typeorm'
import { provide } from '../ioc/ioc'
import { Types } from '../constants'
import { Logger } from '../utilities'
import { BaseService } from '../interfaces/BaseService'

/**
 * Giveaway service that handles storing and modifying giveaway data.
 *
 * @class GiveawayService
 */
@provide(Types.GiveawayService)
export class GiveawayService implements BaseService<Giveaway> {
  private giveawayRepository = getRepository(Giveaway)

  public getAll () {
    return this.giveawayRepository
    .createQueryBuilder('giveaway')
    .innerJoinAndSelect('giveaway.items', 'items')
    .getMany()
  }

  public async findById (id: string | number) {
    return this.giveawayRepository
      .createQueryBuilder('giveaway')
      .innerJoinAndSelect('giveaway.items', 'items')
      .where('giveaway.id = :id', { id })
      .getOne()
  }

  public create (giveaway: Giveaway) {
    giveaway.dateCreated = new Date()
    return this.giveawayRepository.save(giveaway)
  }

  public updateById (id: string | number, giveaway: Giveaway) {
    return this.giveawayRepository.updateById(id, giveaway)
  }

  public deleteById (id: string | number) {
    return this.giveawayRepository.deleteById(id)
  }
}
