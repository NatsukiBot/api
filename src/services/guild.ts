// TODO: Replace with Guild models
import { User, UserLevel } from '@natsuki/db'
import { getRepository, getConnection } from 'typeorm'
import { provide } from '../ioc/ioc'
import { TYPES } from '../constants'
import { Logger } from '../utility'

/**
 * Guild service that handles storing and modifying guild data
 *
 * @class GuildService
 */
@provide(TYPES.GuildService)
export class GuildService {
  
}
