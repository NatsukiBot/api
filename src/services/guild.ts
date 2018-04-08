// TODO: Replace with Guild models
import { Guild } from '@natsuki/db'
import { getRepository, getConnection } from 'typeorm'
import { provide } from '../ioc/ioc'
import { Types } from '../constants'
import { Logger } from '../utilities'

/**
 * Guild service that handles storing and modifying guild data
 *
 * @class GuildService
 */
@provide(Types.GuildService)
export class GuildService {
  private guildRepository = getRepository(Guild)

  public getGuilds () {
    return this.guildRepository.find()
  }
}
