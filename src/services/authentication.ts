import { getRepository, getConnection } from 'typeorm'
import { provide } from '../ioc/ioc'
import { Types } from '../constants'
import { Logger } from '@natsuki/util'
import axios from 'axios'
import btoa from 'btoa'

const { clientSecret, clientId } = require('../../api.json').bot

/**
 * User service that handles storing and modifying user data.
 *
 * @class UserService
 */
@provide(Types.UserService)
export class AuthenticationService {
  public async getToken ({ code, redirect }: {code: string, redirect: string}) {
    const creds = btoa(`${clientId}:${clientSecret}`)
    const response = await axios.post(
      `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
      null,
      { headers: { Authorization: `Basic ${creds}` } })

    return response.data
  }
}
