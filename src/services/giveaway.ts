import { Giveaway } from '@nightwatch/db'
import { getRepository } from 'typeorm'
import { BaseService } from '../interfaces/BaseService'
import { injectable } from 'inversify'

/**
 * Giveaway service that handles storing and modifying giveaway data.
 *
 * @class GiveawayService
 */
@injectable()
export class GiveawayService implements BaseService<Giveaway> {
  private giveawayRepository = getRepository(Giveaway)

  public getAll () {
    return this.giveawayRepository.find({ relations: [ 'items' ] })
  }

  public async findById (id: string | number) {
    return this.giveawayRepository.findOne(id, { relations: [ 'items' ] })
  }

  public create (giveaway: Giveaway) {
    giveaway.dateCreated = new Date()
    return this.giveawayRepository.save(giveaway)
  }

  public async update (id: string | number, giveaway: Giveaway) {
    return this.giveawayRepository.save(giveaway)
  }

  public async delete (id: string | number) {
    const giveaway = await this.giveawayRepository.findOne(id)

    if (!giveaway) {
      return
    }

    return this.giveawayRepository.remove(giveaway)
  }
}
