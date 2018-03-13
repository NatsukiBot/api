// TODO: Replace with Guild models
import { User, UserLevel } from '@natsuki/db'
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
}
