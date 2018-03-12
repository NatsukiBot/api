import { Request, Response } from 'express'
import { controller, httpGet, httpDelete, httpPut, httpPost } from 'inversify-express-utils'
import { inject } from 'inversify'
import { TYPES } from '../constants'
import { GuildService } from '../services/guild'

/**
 * The Guild controller. Contains all endpoints for handling Guilds and Guild data.
 *
 * /api/guilds
 * @class GuildController
 */
@controller('/api/guild')
export class GuildController {
  constructor (@inject(TYPES.GuildService) private guildService: GuildService) {}
  // TODO: Replace with Guild models
}
