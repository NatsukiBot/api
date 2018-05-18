import { Request, Response } from 'express'
import { controller, httpGet, httpDelete, httpPut, httpPost, queryParam } from 'inversify-express-utils'
import { inject } from 'inversify'
import { Types, Events } from '../constants'
import { AuthenticationService } from '../services/authentication'
import { SocketService } from '../services/socket'
import { Logger } from '@natsuki/util'

/**
 * Authentication controller for authenticating users in the web interface through Discord.
 *
 * /api/auth
 * @class AuthenticationController
 */
@controller('/api/auth')
export class AuthenticationController {
  constructor (
    @inject(Types.AuthenticationService) private authenticationService: AuthenticationService,
    @inject(Types.SocketService) private socketService: SocketService
  ) {}

  /**
   * Gets an access token from Discord.
   * @param request
   * @param response
   */
  @httpGet('/token/discord/')
  async getToken (@queryParam('code') code: string, @queryParam('redirect') redirect: string) {
    return this.authenticationService.getDiscordAccessToken(code, redirect)
  }
}
