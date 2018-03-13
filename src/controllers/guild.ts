import { Request, Response } from 'express'
import { controller, httpGet, httpDelete, httpPut, httpPost } from 'inversify-express-utils'
import { inject } from 'inversify'
import { Types } from '../constants'
import { GuildService } from '../services/guild'
import { SocketService } from '../services/socket'

/**
 * The Guild controller. Contains all endpoints for handling Guilds and Guild data.
 *
 * /api/guilds
 * @class GuildController
 */
@controller('/api/guild')
export class GuildController {
  constructor (
    @inject(Types.GuildService) private guildService: GuildService,
    @inject(Types.SocketService) private socketService: SocketService
  ) {}
  // TODO: Replace with Guild models
}
