import { Request, Response } from 'express'
import { controller, httpGet, httpDelete, httpPut, httpPost } from 'inversify-express-utils'
import { inject } from 'inversify'
import { Types, Events } from '../constants'
import { AuthenticationService } from '../services/authentication'
import { SocketService } from '../services/socket'
import { Logger } from '@natsuki/util'

/**
 * The user controller. Contains all endpoints for handling users and user data.
 *
 * /api/users
 * @class UserController
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
  @httpGet('/token')
  async getToken (request: Request, response: Response) {
    return this.authenticationService.getToken(request.body)
  }
}
